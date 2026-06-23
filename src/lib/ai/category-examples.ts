// Category example phrases used to compute embedding centroids.
// These are NOT shown to the user — only used internally to build
// representative category embeddings.
//
// Each category has 5-10 example phrases covering different ways
// users might describe a transaction in that category.
//
// Keep in sync with the categories table. If a user has custom
// categories, embedding-cache.ts handles them via fallback.

export const categoryExamples: Record<string, string[]> = {
  'Food': [
    'restaurant meal',
    'groceries',
    'dining out',
    'lunch',
    'dinner',
    'snacks',
    'fast food',
    'coffee shop',
    'food delivery',
    'breakfast',
  ],
  'Transport': [
    'taxi ride',
    'ride share',
    'bus fare',
    'train ticket',
    'gas refill',
    'parking fee',
    'toll fee',
    'motorcycle fuel',
    'flight ticket',
    'car maintenance',
  ],
  'Housing': [
    'monthly rent',
    'mortgage payment',
    'furniture purchase',
    'home repair',
    'apartment deposit',
    'home appliance',
    'moving cost',
  ],
  'Bills': [
    'electricity bill',
    'water bill',
    'internet bill',
    'phone bill',
    'subscription fee',
    'insurance payment',
    'utility payment',
  ],
  'Health': [
    'doctor visit',
    'medicine purchase',
    'pharmacy',
    'gym membership',
    'health checkup',
    'dental visit',
    'vitamins and supplements',
    'hospital bill',
  ],
  'Shopping': [
    'clothing purchase',
    'online shopping',
    'electronics purchase',
    'accessories',
    'department store',
    'shoe purchase',
  ],
  'Entertainment': [
    'movie ticket',
    'streaming subscription',
    'video game',
    'concert ticket',
    'sports event',
    'hobby purchase',
    'book purchase',
  ],
  'Education': [
    'tuition fee',
    'school supplies',
    'online course',
    'textbook purchase',
    'training fee',
    'certification exam',
  ],
  'Travel': [
    'hotel booking',
    'vacation expense',
    'flight booking',
    'travel insurance',
    'tourist activity',
    'luggage purchase',
  ],
  'Pets': [
    'pet food',
    'veterinary visit',
    'pet grooming',
    'pet supplies',
    'pet toy',
  ],
  'Personal Care': [
    'haircut',
    'skincare product',
    'salon visit',
    'spa treatment',
    'personal hygiene product',
    'cosmetics',
  ],
  'Savings': [
    'savings deposit',
    'emergency fund transfer',
    'money set aside',
  ],
  'Investment': [
    'stock purchase',
    'mutual fund',
    'cryptocurrency purchase',
    'investment deposit',
  ],
  'Family': [
    'childcare expense',
    'family outing',
    'gift for family member',
    'allowance given',
  ],
  'Giving': [
    'donation',
    'charity contribution',
    'tithe',
    'gift given to someone',
  ],
  'Income': [
    'salary received',
    'freelance payment',
    'bonus received',
    'refund received',
    'cashback',
    'allowance received',
  ],
  'Other': [
    'miscellaneous expense',
    'uncategorized purchase',
    'unknown transaction',
  ],
};