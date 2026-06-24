'use client'

import { useEffect, useRef, useState } from 'react'
import { Category } from '@/types'

interface UseAICategoryOptions {
  debounceMs?: number
  minLength?: number
  /** Minimum cosine similarity score to accept a suggestion */
  minScore?: number
  /** Minimum margin between top and second-best score */
  minMargin?: number
}

interface UseAICategoryReturn {
  suggestion: Category | null
  confidence: number
  confidencePercent: string
  isModelLoading: boolean
  isClassifying: boolean
  isReady: boolean
  /** True when classification ran but wasn't confident enough */
  canAskAI: boolean
}

export function useAICategory(
  description: string,
  categories: Category[],
  options: UseAICategoryOptions = {}
): UseAICategoryReturn {
  const {
    debounceMs = 600,
    minLength = 4,
    minScore = 0.42,
    minMargin = 0.04,
  } = options

  const [suggestion, setSuggestion] = useState<Category | null>(null)
  const [confidence, setConfidence] = useState(0)
  const [isModelLoading, setIsModelLoading] = useState(false)
  const [isClassifying, setIsClassifying] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [canAskAI, setCanAskAI] = useState(false)

  const workerRef = useRef<Worker | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Use a ref for categories to avoid stale closure in worker onmessage
  const categoriesRef = useRef<Category[]>(categories)
  categoriesRef.current = categories

  // Track whether init has been sent (so we don't re-send on categories change)
  const initSentRef = useRef(false)

  // Create worker once on mount, terminate on unmount
  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../lib/ai/category-worker.ts', import.meta.url)
    )

    workerRef.current.onmessage = (event) => {
      const { type, label, score, source, margin, message } = event.data

      if (type === 'loading') {
        setIsModelLoading(true)
        setIsClassifying(false)
      } else if (type === 'ready') {
        setIsModelLoading(false)
        setIsReady(true)
      } else if (type === 'result') {
        setIsModelLoading(false)
        setIsClassifying(false)
        setIsReady(true)
        setCanAskAI(false)

        if (!label) {
          // No label returned (e.g., no centroids)
          setSuggestion(null)
          setConfidence(0)
          return
        }

        const matchedCategory = categoriesRef.current.find(
          (c) => c.name.toLowerCase() === (label as string).toLowerCase()
        ) ?? null

        if (source === 'keyword') {
          // Keyword matches are always accepted (score is 1.0)
          setSuggestion(matchedCategory)
          setConfidence(score as number)
        } else if (source === 'embedding') {
          // Apply confidence thresholds
          const rawScore = score as number
          const rawMargin = margin as number

          if (rawScore >= minScore && rawMargin >= minMargin) {
            setSuggestion(matchedCategory)
            setConfidence(rawScore)
          } else {
            // Not confident enough — show no suggestion
            setSuggestion(null)
            setConfidence(0)
            setCanAskAI(true) // Offer cloud fallback
          }
        }
      } else if (type === 'error') {
        console.error('AI Classification error:', message)
        setIsModelLoading(false)
        setIsClassifying(false)
      }
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate()
        workerRef.current = null
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Send init to worker when categories are loaded
  useEffect(() => {
    if (workerRef.current && categories.length > 0 && !initSentRef.current) {
      initSentRef.current = true
      workerRef.current.postMessage({
        type: 'init',
        categories,
      })
    }
  }, [categories])

  // Debounce and classify when description changes
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (!description || description.length < minLength) {
      setSuggestion(null)
      setConfidence(0)
      setIsClassifying(false)
      setCanAskAI(false)
      return
    }

    debounceRef.current = setTimeout(() => {
      if (workerRef.current && categories.length > 0) {
        setIsClassifying(true)
        setCanAskAI(false)
        workerRef.current.postMessage({
          type: 'classify',
          text: description,
        })
      }
    }, debounceMs)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [description, categories, debounceMs, minLength])

  const confidencePercent = `${Math.round(confidence * 100)}%`

  return {
    suggestion,
    confidence,
    confidencePercent,
    isModelLoading,
    isClassifying,
    isReady,
    canAskAI,
  }
}