// TF-IDF vectorizer for intent matching
// Builds document vectors from intent patterns, then uses cosine similarity
// to find the best matching intent for a user query.

/**
 * Compute term frequency for a list of tokens.
 * Returns a map of token -> tf value.
 */
export function computeTF(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  const total = tokens.length;
  if (total === 0) return tf;

  for (const token of tokens) {
    tf.set(token, (tf.get(token) || 0) + 1);
  }

  // Normalize by total tokens
  for (const [key, value] of tf) {
    tf.set(key, value / total);
  }

  return tf;
}

/**
 * Compute inverse document frequency for all documents.
 * idf(term) = log(N / df(term))  where N = total documents, df = docs containing term
 */
export function computeIDF(documents: string[][]): Map<string, number> {
  const N = documents.length;
  if (N === 0) return new Map();

  const docFreq = new Map<string, number>();

  for (const doc of documents) {
    const seen = new Set<string>();
    for (const token of doc) {
      if (!seen.has(token)) {
        seen.add(token);
        docFreq.set(token, (docFreq.get(token) || 0) + 1);
      }
    }
  }

  const idf = new Map<string, number>();
  for (const [term, freq] of docFreq) {
    // Add 1 to numerator to avoid division by zero and smooth
    idf.set(term, Math.log((N + 1) / (freq + 1)) + 1);
  }

  return idf;
}

/**
 * Compute TF-IDF vector for a document given precomputed IDF.
 */
export function computeTFIDF(
  tf: Map<string, number>,
  idf: Map<string, number>
): Map<string, number> {
  const tfidf = new Map<string, number>();
  for (const [term, tfValue] of tf) {
    const idfValue = idf.get(term) || 0;
    tfidf.set(term, tfValue * idfValue);
  }
  return tfidf;
}

/**
 * Compute cosine similarity between two TF-IDF vectors.
 * cos(a, b) = (a . b) / (||a|| * ||b||)
 */
export function cosineSimilarity(
  vecA: Map<string, number>,
  vecB: Map<string, number>
): number {
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  // Iterate over the smaller vector for efficiency
  const [smaller, larger] =
    vecA.size <= vecB.size ? [vecA, vecB] : [vecB, vecA];

  for (const [term, valueA] of smaller) {
    const valueB = larger.get(term) || 0;
    dotProduct += valueA * valueB;
    magnitudeA += valueA * valueA;
  }

  for (const [, valueB] of larger) {
    magnitudeB += valueB * valueB;
  }

  if (magnitudeA === 0 || magnitudeB === 0) return 0;

  return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
}

/**
 * TF-IDF model that holds precomputed IDF and document vectors.
 * Build it once from all intent patterns, then query it repeatedly.
 */
export class TFIDFModel {
  private idf: Map<string, number>;
  private docVectors: Map<string, Map<string, number>>;
  private docLabels: string[];

  constructor(documents: { label: string; tokens: string[] }[]) {
    this.docLabels = documents.map((d) => d.label);
    const allTokens = documents.map((d) => d.tokens);
    this.idf = computeIDF(allTokens);

    this.docVectors = new Map();
    for (const doc of documents) {
      const tf = computeTF(doc.tokens);
      const tfidf = computeTFIDF(tf, this.idf);
      this.docVectors.set(doc.label, tfidf);
    }
  }

  /**
   * Find the best matching document label for a query.
   * Returns { label, confidence } where confidence is cosine similarity (0 to 1).
   */
  match(queryTokens: string[]): { label: string; confidence: number } {
    const queryTF = computeTF(queryTokens);
    const queryVec = computeTFIDF(queryTF, this.idf);

    let bestLabel = '';
    let bestScore = 0;

    for (const label of this.docLabels) {
      const docVec = this.docVectors.get(label);
      if (!docVec) continue;
      const score = cosineSimilarity(queryVec, docVec);
      if (score > bestScore) {
        bestScore = score;
        bestLabel = label;
      }
    }

    return { label: bestLabel, confidence: bestScore };
  }
}
