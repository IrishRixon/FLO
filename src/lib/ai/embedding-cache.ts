import { Category } from '@/types';
import { categoryExamples } from './category-examples';
import { getEmbeddingCache, setEmbeddingCache } from '../offline/idb';

const CACHE_KEY_PREFIX = 'category-embeddings-';

/**
 * Get example phrases for a category.
 * If the category has hand-written examples in categoryExamples, use those.
 * Otherwise (custom category), generate fallback examples from the name.
 */
export function getExamplesForCategory(category: Category): string[] {
  if (categoryExamples[category.name]) {
    return categoryExamples[category.name];
  }

  // Fallback for custom/user-created categories
  return [
    category.name,
    `${category.name} expense`,
    `${category.name} purchase`,
  ];
}

/**
 * Build a deterministic hash from a list of categories.
 * Purpose: detect when categories changed so cache invalidates automatically.
 */
export function hashCategorySet(categories: Category[]): string {
  // Create a deterministic string from category id + name + example count
  const parts = categories
    .slice()
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((c) => `${c.id}:${c.name}:${getExamplesForCategory(c).length}`);

  const input = parts.join('|');

  // Simple string hash (djb2)
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) + hash + input.charCodeAt(i)) & 0xffffffff;
  }

  return Math.abs(hash).toString(36);
}

/**
 * L2-normalize a vector in-place.
 */
function normalize(vec: number[]): void {
  let sumSq = 0;
  for (let i = 0; i < vec.length; i++) {
    sumSq += vec[i] * vec[i];
  }
  const norm = Math.sqrt(sumSq);
  if (norm > 0) {
    for (let i = 0; i < vec.length; i++) {
      vec[i] /= norm;
    }
  }
}

/**
 * Compute a centroid embedding from a list of example phrases.
 *
 * @param examples - Array of text strings to embed
 * @param embedFn - Function that embeds a single text string into a vector
 * @returns A single L2-normalized centroid vector
 */
export async function computeCategoryCentroid(
  examples: string[],
  embedFn: (text: string) => Promise<number[]>
): Promise<number[]> {
  const embeddings = await Promise.all(examples.map((ex) => embedFn(ex)));

  const dim = embeddings[0]?.length ?? 0;
  if (dim === 0) return [];

  // Element-wise average
  const centroid = new Array(dim).fill(0);
  for (const emb of embeddings) {
    for (let i = 0; i < dim; i++) {
      centroid[i] += emb[i];
    }
  }
  for (let i = 0; i < dim; i++) {
    centroid[i] /= embeddings.length;
  }

  // L2-normalize so cosine similarity = dot product
  normalize(centroid);

  return centroid;
}

/**
 * Try to get cached centroids from IndexedDB.
 *
 * @param categories - The current list of categories
 * @returns Cached centroids if valid, null otherwise
 */
export async function getCachedCentroids(
  categories: Category[]
): Promise<Record<string, number[]> | null> {
  const currentHash = hashCategorySet(categories);
  const cacheKey = `${CACHE_KEY_PREFIX}${currentHash}`;

  const cached = await getEmbeddingCache(cacheKey);
  if (cached && cached.hash === currentHash && cached.centroids) {
    return cached.centroids;
  }

  return null;
}

/**
 * Save centroids to IndexedDB cache.
 *
 * @param categories - The category list (used to compute the key)
 * @param centroids - The computed centroid vectors
 */
export async function saveCentroids(
  categories: Category[],
  centroids: Record<string, number[]>
): Promise<void> {
  const currentHash = hashCategorySet(categories);
  const cacheKey = `${CACHE_KEY_PREFIX}${currentHash}`;

  await setEmbeddingCache(cacheKey, {
    hash: currentHash,
    centroids,
    updatedAt: Date.now(),
  });
}

/**
 * Compute centroids for all categories, using cache if available.
 *
 * @param categories - Full list of categories
 * @param embedFn - Embedding function (text -> vector)
 * @returns Record of category name -> centroid vector
 */
export async function getOrComputeCentroids(
  categories: Category[],
  embedFn: (text: string) => Promise<number[]>
): Promise<Record<string, number[]>> {
  // Try cache first
  const cached = await getCachedCentroids(categories);
  if (cached) {
    return cached;
  }

  // Compute all centroids
  const centroids: Record<string, number[]> = {};

  for (const category of categories) {
    const examples = getExamplesForCategory(category);
    if (examples.length === 0) continue;

    centroids[category.name] = await computeCategoryCentroid(examples, embedFn);
  }

  // Save to cache
  await saveCentroids(categories, centroids);

  return centroids;
}