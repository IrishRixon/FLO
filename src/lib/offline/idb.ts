import { openDB, DBSchema, IDBPDatabase } from 'idb';

const DB_NAME = 'flo-cache';
const DB_VERSION = 1;

interface FloDBSchema extends DBSchema {
  'embeddings': {
    key: string;
    value: {
      hash: string;
      centroids: Record<string, number[]>;
      updatedAt: number;
    };
  };
  'kv': {
    key: string;
    value: unknown;
  };
}

let dbPromise: Promise<IDBPDatabase<FloDBSchema>> | null = null;

function getDB(): Promise<IDBPDatabase<FloDBSchema>> {
  if (!dbPromise) {
    dbPromise = openDB<FloDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('embeddings')) {
          db.createObjectStore('embeddings');
        }
        if (!db.objectStoreNames.contains('kv')) {
          db.createObjectStore('kv');
        }
      },
    });
  }
  return dbPromise;
}

/**
 * Get a value from the embeddings store by key.
 */
export async function getEmbeddingCache(key: string): Promise<{
  hash: string;
  centroids: Record<string, number[]>;
  updatedAt: number;
} | null> {
  try {
    const db = await getDB();
    const result = await db.get('embeddings', key);
    return result ?? null;
  } catch (error) {
    console.error('idb getEmbeddingCache error:', error);
    return null;
  }
}

/**
 * Set a value in the embeddings store.
 */
export async function setEmbeddingCache(
  key: string,
  value: { hash: string; centroids: Record<string, number[]>; updatedAt: number }
): Promise<void> {
  try {
    const db = await getDB();
    await db.put('embeddings', value, key);
  } catch (error) {
    console.error('idb setEmbeddingCache error:', error);
  }
}

/**
 * Delete a key from the embeddings store.
 */
export async function deleteEmbeddingCache(key: string): Promise<void> {
  try {
    const db = await getDB();
    await db.delete('embeddings', key);
  } catch (error) {
    console.error('idb deleteEmbeddingCache error:', error);
  }
}

/**
 * Get a value from the generic kv store.
 */
export async function getKV<T = unknown>(key: string): Promise<T | null> {
  try {
    const db = await getDB();
    const result = await db.get('kv', key);
    return (result as T) ?? null;
  } catch (error) {
    console.error('idb getKV error:', error);
    return null;
  }
}

/**
 * Set a value in the generic kv store.
 */
export async function setKV<T = unknown>(key: string, value: T): Promise<void> {
  try {
    const db = await getDB();
    await db.put('kv', value, key);
  } catch (error) {
    console.error('idb setKV error:', error);
  }
}