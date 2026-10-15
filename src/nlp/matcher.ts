// Intent matcher combining TF-IDF cosine similarity with Fuse.js fuzzy backup.
// Also maintains context memory (last mentioned course/topic) for follow-up queries.

import Fuse from 'fuse.js';
import { preprocess, preprocessLight } from './preprocess';
import { TFIDFModel } from './tfidf';
import type { Intent } from '@/lib/supabase';

export type MatchResult = {
  intent: Intent | null;
  confidence: number;
  method: 'tfidf' | 'fuzzy' | 'none';
};

export type MatcherContext = {
  lastIntent: string | null;
  lastCourse: string | null;
  lastTopic: string | null;
};

// Course name keywords for context detection
const COURSE_KEYWORDS: Record<string, string> = {
  'bca': 'bca', 'mca': 'mca', 'b com': 'bcom', 'bcom': 'bcom', 'm com': 'mcom',
  'bba': 'bba', 'mba': 'mba',
  'computer science': 'bsc_cs', 'b sc cs': 'bsc_cs', 'bsc cs': 'bsc_cs',
  'biotech': 'bsc_biotech', 'bio tech': 'bsc_biotech',
  'ai ds': 'bsc_aids', 'aids': 'bsc_aids', 'data science': 'bsc_aids',
  'ai ml': 'bsc_aiml', 'aiml': 'bsc_aiml', 'machine learning': 'bsc_aiml',
  'math': 'bsc_math', 'maths': 'bsc_math', 'mathematics': 'bsc_math',
  'english': 'ba_english', 'tamil': 'ba_tamil',
  'fashion': 'bsc_cdf', 'costume': 'bsc_cdf', 'cdf': 'bsc_cdf',
  'computer technology': 'bsc_ct',
};

/**
 * Detect a course from the user query for context tracking.
 */
function detectCourse(text: string): string | null {
  const lower = text.toLowerCase();
  for (const [keyword, intentName] of Object.entries(COURSE_KEYWORDS)) {
    if (lower.includes(keyword)) {
      return intentName;
    }
  }
  return null;
}

/**
 * Context-aware follow-up: if the user asks a general question (fees, hostel, etc.)
 * but has a course in context, redirect to the course-specific intent.
 */
function applyContext(
  query: string,
  context: MatcherContext
): string {
  // If query mentions fees/hostel/eligibility but no specific course,
  // and we have a course in context, inject the course name
  const lower = query.toLowerCase();
  const hasCourse = Object.keys(COURSE_KEYWORDS).some((k) => lower.includes(k));
  const isFollowUp =
    lower.includes('fees') ||
    lower.includes('fee') ||
    lower.includes('hostel') ||
    lower.includes('eligib') ||
    lower.includes('duration') ||
    lower.includes('subjects') ||
    lower.includes('career') ||
    lower.includes('detail') ||
    lower.includes('about it') ||
    lower.includes('about that');

  if (!hasCourse && isFollowUp && context.lastCourse) {
    // Map intent names back to readable course names for the query
    const courseNames: Record<string, string> = {
      bca: 'bca', mca: 'mca', bcom: 'b com', bba: 'bba', mba: 'mba',
      bsc_cs: 'computer science', bsc_biotech: 'biotechnology',
      bsc_aids: 'ai data science', bsc_aiml: 'ai machine learning',
      bsc_math: 'mathematics', ba_english: 'english', ba_tamil: 'tamil',
      bsc_cdf: 'costume design fashion',
    };
    const courseName = courseNames[context.lastCourse] || context.lastCourse;
    return `${query} ${courseName}`;
  }

  return query;
}

/**
 * Main matcher class. Initialize with intents loaded from the database.
 */
export class IntentMatcher {
  private tfidfModel: TFIDFModel;
  private fuse: Fuse<{ pattern: string; intent: Intent }>;
  private intents: Intent[];
  private threshold: number;
  private context: MatcherContext;

  constructor(intents: Intent[], threshold = 0.35) {
    this.intents = intents;
    this.threshold = threshold;
    this.context = { lastIntent: null, lastCourse: null, lastTopic: null };

    // Build TF-IDF model from intent patterns
    const documents: { label: string; tokens: string[] }[] = [];
    for (const intent of intents) {
      for (const pattern of intent.patterns) {
        const tokens = preprocess(pattern);
        if (tokens.length > 0) {
          documents.push({ label: intent.intent_name, tokens });
        }
      }
    }
    this.tfidfModel = new TFIDFModel(documents);

    // Build Fuse.js index on raw patterns for fuzzy fallback
    const fuseData: { pattern: string; intent: Intent }[] = [];
    for (const intent of intents) {
      for (const pattern of intent.patterns) {
        fuseData.push({ pattern, intent });
      }
    }
    this.fuse = new Fuse(fuseData, {
      keys: ['pattern'],
      includeScore: true,
      threshold: 0.4,
      minMatchCharLength: 2,
    });
  }

  /**
   * Match a user query to an intent.
   * Returns the best match with confidence and method used.
   */
  match(query: string): MatchResult {
    // Apply context to handle follow-up queries
    const contextQuery = applyContext(query, this.context);
    const tokens = preprocess(contextQuery);
    const lightQuery = preprocessLight(contextQuery);

    // Track course context
    const detectedCourse = detectCourse(query);
    if (detectedCourse) {
      this.context.lastCourse = detectedCourse;
    }

    // Try TF-IDF first
    if (tokens.length > 0) {
      const tfidfResult = this.tfidfModel.match(tokens);
      if (tfidfResult.confidence >= this.threshold && tfidfResult.label) {
        const intent = this.intents.find(
          (i) => i.intent_name === tfidfResult.label
        );
        if (intent) {
          this.context.lastIntent = intent.intent_name;
          this.context.lastTopic = intent.category;
          return {
            intent,
            confidence: tfidfResult.confidence,
            method: 'tfidf',
          };
        }
      }
    }

    // Fuzzy fallback with Fuse.js
    const fuseResults = this.fuse.search(lightQuery);
    if (fuseResults.length > 0) {
      const best = fuseResults[0];
      // Fuse.js score is distance (lower = better), convert to confidence
      const fuzzyConfidence = best.score !== undefined ? 1 - best.score : 0;
      if (fuzzyConfidence >= this.threshold) {
        this.context.lastIntent = best.item.intent.intent_name;
        this.context.lastTopic = best.item.intent.category;
        if (detectedCourse) {
          this.context.lastCourse = detectedCourse;
        }
        return {
          intent: best.item.intent,
          confidence: fuzzyConfidence,
          method: 'fuzzy',
        };
      }
    }

    // No match found
    return { intent: null, confidence: 0, method: 'none' };
  }

  /**
   * Get current context (for debugging or display).
   */
  getContext(): MatcherContext {
    return { ...this.context };
  }

  /**
   * Update the intent list (used when admin edits intents).
   */
  updateIntents(intents: Intent[]) {
    this.intents = intents;
    const documents: { label: string; tokens: string[] }[] = [];
    for (const intent of intents) {
      for (const pattern of intent.patterns) {
        const tokens = preprocess(pattern);
        if (tokens.length > 0) {
          documents.push({ label: intent.intent_name, tokens });
        }
      }
    }
    this.tfidfModel = new TFIDFModel(documents);

    const fuseData: { pattern: string; intent: Intent }[] = [];
    for (const intent of intents) {
      for (const pattern of intent.patterns) {
        fuseData.push({ pattern, intent });
      }
    }
    this.fuse = new Fuse(fuseData, {
      keys: ['pattern'],
      includeScore: true,
      threshold: 0.4,
      minMatchCharLength: 2,
    });
  }
}

/**
 * Detect the language of a query (English, Tamil, or Tanglish).
 */
export function detectLanguage(text: string): 'en' | 'ta' | 'tanglish' {
  const tamilUnicodeRegex = /[\u0B80-\u0BFF]/;
  if (tamilUnicodeRegex.test(text)) return 'ta';

  // Check for common Tanglish words
  const tanglishWords = ['evlo', 'enna', 'irukka', 'irukku', 'epdi', 'vendi', 'kodu', 'solli', 'engayam', 'maniku', 'selavu'];
  const lower = text.toLowerCase();
  for (const word of tanglishWords) {
    if (lower.includes(word)) return 'tanglish';
  }

  return 'en';
}
