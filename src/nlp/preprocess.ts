// Text preprocessing for the Nandha Assistant NLP engine
// Steps: lowercase, normalize Tanglish, remove stopwords, simple stemming

// English stopwords (common words that don't carry intent meaning)
const STOPWORDS_EN = new Set([
  'a', 'an', 'the', 'is', 'are', 'am', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
  'may', 'might', 'must', 'can', 'shall', 'to', 'of', 'in', 'on', 'at', 'for',
  'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before',
  'after', 'above', 'below', 'and', 'or', 'not', 'no', 'nor', 'so', 'than',
  'too', 'very', 'just', 'but', 'if', 'then', 'that', 'this', 'these', 'those',
  'i', 'me', 'my', 'we', 'us', 'our', 'you', 'your', 'he', 'him', 'his', 'she',
  'her', 'it', 'its', 'they', 'them', 'their', 'what', 'which', 'who', 'whom',
  'whose', 'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both',
  'few', 'more', 'most', 'other', 'some', 'such', 'only', 'own', 'same',
  'tell', 'give', 'want', 'know', 'need', 'like', 'get', 'got', 'please',
  'sir', 'madam', 'there', 'here', 'now', 'also', 'as', 'at',
]);

// Tamil stopwords (common Tamil/Tanglish words)
const STOPWORDS_TA = new Set([
  'ஒரு', 'என்', 'நீ', 'அவன்', 'அவள்', 'அது', 'அவர்கள்', 'இது', 'அந்த', 'இந்த',
  'என்ன', 'எப்படி', 'ஏன்', 'எப்போது', 'எங்கே', 'யார்', 'எல்லாம்', 'உம்', 'தான்',
  'என்று', 'என்', 'வந்து', 'சொல்லு', 'தரு', 'வேணும்', 'இருக்கு', 'இருக்கா',
]);

// Tanglish to English/normalized mappings
const TANGLISH_MAP: Record<string, string> = {
  'fees': 'fee',
  'feesum': 'fee',
  'evlo': 'how much',
  'evvalavu': 'how much',
  'enna': 'what',
  'ethu': 'which',
  'irukka': 'available',
  'irukku': 'available',
  'irukeengala': 'available',
  'enna fees': 'what fee',
  'fees evlo': 'how much fee',
  'hostel irukka': 'hostel available',
  'bus irukka': 'bus available',
  'bus evlo mani ku': 'bus what time',
  'admission epdi': 'how to admission',
  'epdi': 'how',
  'padikka': 'study',
  'course enna': 'what course',
  'eligibility enna': 'what eligibility',
  'bca eligibility enna': 'bca what eligibility',
  'selavu': 'fee',
  'vendi': 'want',
  'vendum': 'want',
  'kodu': 'give',
  'solli': 'tell',
  'engayam': 'where',
  'engu': 'where',
  'maniku': 'time',
  'mani': 'time',
  'vili': 'call',
  'thagaval': 'information',
  'arivu': 'knowledge',
  'kalvi': 'education',
  'college enna': 'what college',
  'nandha college': 'nandha college',
};

// Simple stemmer — strips common suffixes
function stem(word: string): string {
  if (word.length <= 3) return word;
  const suffixes = ['ing', 'edly', 'ed', 'ly', 'es', 's', 'er', 'ers', 'est', 'ment', 'tion', 'ness'];
  for (const suffix of suffixes) {
    if (word.endsWith(suffix) && word.length > suffix.length + 2) {
      return word.slice(0, -suffix.length);
    }
  }
  return word;
}

/**
 * Preprocess a user query for NLP matching.
 * 1. Lowercase
 * 2. Normalize Tanglish words
 * 3. Remove punctuation
 * 4. Remove stopwords (English + Tamil)
 * 5. Apply simple stemming
 */
export function preprocess(text: string): string[] {
  if (!text) return [];

  // 1. Lowercase
  let result = text.toLowerCase().trim();

  // 2. Normalize Tanglish — replace known Tanglish phrases
  for (const [tanglish, english] of Object.entries(TANGLISH_MAP)) {
    result = result.replace(new RegExp(tanglish, 'g'), english);
  }

  // 3. Remove punctuation, keep alphanumeric
  result = result.replace(/[^\w\s]/g, ' ');

  // 4. Tokenize
  let tokens = result.split(/\s+/).filter((t) => t.length > 0);

  // 5. Remove stopwords
  tokens = tokens.filter(
    (t) => !STOPWORDS_EN.has(t) && !STOPWORDS_TA.has(t)
  );

  // 6. Stem
  tokens = tokens.map((t) => stem(t));

  // Remove duplicates while preserving order
  const seen = new Set<string>();
  tokens = tokens.filter((t) => {
    if (seen.has(t)) return false;
    seen.add(t);
    return true;
  });

  return tokens;
}

/**
 * Preprocess without stemming — used for fuzzy matching (Fuse.js)
 * where preserving the original word form gives better fuzzy results.
 */
export function preprocessLight(text: string): string {
  if (!text) return '';
  let result = text.toLowerCase().trim();

  for (const [tanglish, english] of Object.entries(TANGLISH_MAP)) {
    result = result.replace(new RegExp(tanglish, 'g'), english);
  }

  result = result.replace(/[^\w\s]/g, ' ');
  const tokens = result
    .split(/\s+/)
    .filter((t) => t.length > 0 && !STOPWORDS_EN.has(t) && !STOPWORDS_TA.has(t));

  return tokens.join(' ');
}
