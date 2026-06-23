import { pipeline } from '@xenova/transformers'
import { matchKeyword } from './ph-keywords'
import { getOrComputeCentroids } from './embedding-cache'

/**
 * Label engineering: descriptive phrases that help the embedding model
 * better understand category semantics. These are NOT shown to the user.
 * They are folded into the embedding computation via computeCategoryCentroid
 * in embedding-cache.ts, which already uses category-examples.ts.
 */

/**
 * Input enrichment: prepend context to the user's raw description
 * so the embedding model gets more signal from short input.
 */
const ENRICHMENT_PREFIX = 'Transaction: '

let extractor: any = null
let centroids: Record<string, number[]> = {}
let categoryNames: string[] = []

/**
 * Embed a single text string into a normalized vector using the model.
 */
async function embedText(text: string): Promise<number[]> {
  if (!extractor) {
    throw new Error('Model not loaded')
  }

  const output = await extractor(text, {
    pooling: 'mean',
    normalize: true,
  })

  // Extract the embedding array from the output tensor
  const embedding: number[] = Array.from(output.data)
  return embedding
}

/**
 * Cosine similarity between two L2-normalized vectors (simple dot product).
 */
function cosineSimilarity(a: number[], b: number[]): number {
  let sum = 0
  for (let i = 0; i < a.length; i++) {
    sum += a[i] * b[i]
  }
  return sum
}

self.onmessage = async (event: MessageEvent) => {
  const { type } = event.data

  if (type === 'init') {
    try {
      const { categories } = event.data

      if (!categories || categories.length === 0) {
        self.postMessage({ type: 'error', message: 'No categories provided' })
        return
      }

      // Load model
      self.postMessage({ type: 'loading' })
      extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')

      // Get or compute centroids (will use IndexedDB cache if available)
      centroids = await getOrComputeCentroids(categories, embedText)
      categoryNames = Object.keys(centroids)

      self.postMessage({ type: 'ready' })
    } catch (error) {
      self.postMessage({
        type: 'error',
        message: error instanceof Error ? error.message : 'Worker init failed',
      })
    }
  } else if (type === 'classify') {
    try {
      const { text } = event.data

      if (!text || typeof text !== 'string') {
        self.postMessage({ type: 'error', message: 'Invalid text' })
        return
      }

      // ── Step 1: Keyword check (instant, no AI) ──
      const keywordMatch = matchKeyword(text)
      if (keywordMatch) {
        self.postMessage({
          type: 'result',
          label: keywordMatch,
          score: 1.0,
          source: 'keyword',
          margin: 1.0,
        })
        return
      }

      // ── Step 2: Embedding similarity ──
      if (!extractor || categoryNames.length === 0) {
        self.postMessage({
          type: 'error',
          message: 'Worker not initialized',
        })
        return
      }

      // Enrich input: add context prefix to help short descriptions
      const enrichedText = `${ENRICHMENT_PREFIX}${text}`
      const embedding = await embedText(enrichedText)

      // Compute similarity against every category centroid
      const similarities: Array<{ name: string; score: number }> = []
      for (const name of categoryNames) {
        const centroid = centroids[name]
        if (centroid) {
          similarities.push({
            name,
            score: cosineSimilarity(embedding, centroid),
          })
        }
      }

      // Sort descending by score
      similarities.sort((a, b) => b.score - a.score)

      if (similarities.length === 0) {
        self.postMessage({
          type: 'result',
          label: null,
          score: 0,
          source: 'embedding',
          margin: 0,
        })
        return
      }

      const top = similarities[0]
      const second = similarities[1]
      const margin = second ? top.score - second.score : 1.0

      self.postMessage({
        type: 'result',
        label: top.name,
        score: top.score,
        source: 'embedding',
        margin,
      })
    } catch (error) {
      self.postMessage({
        type: 'error',
        message: error instanceof Error ? error.message : 'Classification failed',
      })
    }
  }
}