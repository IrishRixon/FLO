'use client'

import { useEffect, useRef, useState } from 'react'
import { Category, TransactionType } from '@/types'

interface UseAICategoryOptions {
  debounceMs?: number
  minLength?: number
  confidenceThreshold?: number
  typeConfidenceThreshold?: number
}

interface UseAICategoryReturn {
  suggestion: Category | null
  confidence: number
  suggestedType: TransactionType | null
  typeConfidence: number
  confidencePercent: string
  typeConfidencePercent: string
  isModelLoading: boolean
  isClassifying: boolean
  isReady: boolean
}

export function useAICategory(
  description: string,
  categories: Category[],
  options: UseAICategoryOptions = {}
): UseAICategoryReturn {
  const {
    debounceMs = 600,
    minLength = 4,
    confidenceThreshold = 0.10,
    typeConfidenceThreshold = 0.25,
  } = options

  const [suggestion, setSuggestion] = useState<Category | null>(null)
  const [confidence, setConfidence] = useState(0)
  const [suggestedType, setSuggestedType] = useState<TransactionType | null>(null)
  const [typeConfidence, setTypeConfidence] = useState(0)
  const [isModelLoading, setIsModelLoading] = useState(false)
  const [isClassifying, setIsClassifying] = useState(false)
  const [isReady, setIsReady] = useState(false)

  const workerRef = useRef<Worker | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Use a ref for categories to avoid stale closure in worker onmessage
  const categoriesRef = useRef<Category[]>(categories)
  categoriesRef.current = categories

  // Create worker once on mount, terminate on unmount
  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../lib/ai/category-worker.ts', import.meta.url)
    )

    workerRef.current.onmessage = (event) => {
      const { type, category, typeResult, message } = event.data

      console.log(typeResult, "type result");
      
      if (type === 'loading') {
        setIsModelLoading(true)
        setIsClassifying(false)
      } else if (type === 'result') {
        setIsModelLoading(false)
        setIsClassifying(false)
        setIsReady(true)

        // Handle category classification
        if (category?.label) {
          const matchedCategory = categoriesRef.current.find(
            (c) => c.name.toLowerCase() === category.label.toLowerCase()
          ) ?? null

          if (category.score >= confidenceThreshold) {
            setSuggestion(matchedCategory)
            setConfidence(category.score)
          } else {
            setSuggestion(null)
            setConfidence(0)
          }
        }

        // Handle type classification (expense / income)
        if (typeResult?.label) {
          const normalizedType = typeResult.label.toLowerCase() as TransactionType
          if (normalizedType === 'expense' || normalizedType === 'income') {
            if (typeResult.score >= typeConfidenceThreshold) {
              setSuggestedType(normalizedType)
              setTypeConfidence(typeResult.score)
            } else {
              setSuggestedType(null)
              setTypeConfidence(0)
            }
          }
        } else {
          setSuggestedType(null)
          setTypeConfidence(0)
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

  // Debounce and classify when description changes
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (!description || description.length < minLength) {
      setSuggestion(null)
      setConfidence(0)
      setSuggestedType(null)
      setTypeConfidence(0)
      setIsClassifying(false)
      return
    }

    debounceRef.current = setTimeout(() => {
      if (workerRef.current && categories.length > 0) {
        setIsClassifying(true)
        workerRef.current.postMessage({
          type: 'classify',
          text: description,
          categoryLabels: categories.map((c) => c.name),
          typeLabels: ['expense', 'income'],
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
  const typeConfidencePercent = `${Math.round(typeConfidence * 100)}%`

  return {
    suggestion,
    confidence,
    suggestedType,
    typeConfidence,
    confidencePercent,
    typeConfidencePercent,
    isModelLoading,
    isClassifying,
    isReady,
  }
}