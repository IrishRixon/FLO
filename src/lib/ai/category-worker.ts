import { pipeline, env } from '@xenova/transformers'

// Allow model to be cached in browser
env.allowLocalModels = false
env.useBrowserCache = true

let classifier: any = null

self.onmessage = async (event: MessageEvent) => {
  const { type, text, categoryLabels, typeLabels } = event.data

  if (type === 'classify') {
    try {
      // Load model if not already loaded
      if (!classifier) {
        self.postMessage({ type: 'loading' })
        classifier = await pipeline('zero-shot-classification', 'Xenova/mobilebert-uncased-mnli')
      }

      // Combine both category and type labels into a single inference
      const allLabels = [...categoryLabels, ...typeLabels]
      const result = await classifier(text, allLabels, { multi_label: false })

      // Find the best category label (only among categoryLabels)
      let bestCategoryLabel: string | null = null
      let bestCategoryScore = 0
      let bestTypeLabel: string | null = null
      let bestTypeScore = 0

      for (let i = 0; i < result.labels.length; i++) {
        const label = result.labels[i]
        const score = result.scores[i]

        if (categoryLabels.includes(label)) {
          if (score > bestCategoryScore) {
            bestCategoryScore = score
            bestCategoryLabel = label
          }
        }

        if (typeLabels.includes(label)) {
          if (score > bestTypeScore) {
            bestTypeScore = score
            bestTypeLabel = label
          }
        }
      }

      self.postMessage({
        type: 'result',
        category: {
          label: bestCategoryLabel,
          score: bestCategoryScore,
        },
        typeResult: {
          label: bestTypeLabel,
          score: bestTypeScore,
        },
      })
    } catch (error) {
      self.postMessage({
        type: 'error',
        message: error instanceof Error ? error.message : 'Classification failed',
      })
    }
  }
}