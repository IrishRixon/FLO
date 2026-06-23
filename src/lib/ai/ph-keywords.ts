// Filipino / PH-specific brand & keyword → category mapping
// This runs BEFORE any AI/embedding logic.
// Keep indicators short and high-signal (brands, utilities, apps).

export type KeywordCategoryMap = Record<string, string>;

export const PH_KEYWORD_MAP: KeywordCategoryMap = {
  // ───────────── FOOD ─────────────
  'jollibee': 'Food',
  'mang inasal': 'Food',
  'chowking': 'Food',
  'greenwich': 'Food',
  'kfc': 'Food',
  'mcdo': 'Food',
  'mcdonald': 'Food',
  'burger king': 'Food',
  'bonchon': 'Food',
  'army navy': 'Food',
  "max's": 'Food',
  'yellow cab': 'Food',
  "shakey's": 'Food',
  'pizza hut': 'Food',
  'starbucks': 'Food',
  'coffee bean': 'Food',
  'cbtl': 'Food',
  'dunkin': 'Food',
  'krispy kreme': 'Food',
  'foodpanda': 'Food',
  'grabfood': 'Food',
  'grab food': 'Food',

  // ───────────── TRANSPORT ─────────────
  'grab': 'Transport',
  'grabfare': 'Transport',
  'grab fare': 'Transport',
  'angkas': 'Transport',
  'joyride': 'Transport',
  'move it': 'Transport',
  'moveit': 'Transport',
  'uber': 'Transport',
  'taxi': 'Transport',
  'jeep': 'Transport',
  'jeepney': 'Transport',
  'bus': 'Transport',
  'lrt': 'Transport',
  'mrt': 'Transport',
  'tricycle': 'Transport',
  'pedicab': 'Transport',
  'fuel': 'Transport',
  'gas': 'Transport',
  'gasoline': 'Transport',

  // ───────────── BILLS / UTILITIES ─────────────
  'meralco': 'Bills',
  'maynilad': 'Bills',
  'manila water': 'Bills',
  'primewater': 'Bills',
  'veco': 'Bills',
  'dlpc': 'Bills',
  'electric': 'Bills',
  'electricity': 'Bills',
  'water bill': 'Bills',
  'internet bill': 'Bills',
  'phone bill': 'Bills',

  // Telcos
  'pldt': 'Bills',
  'smart': 'Bills',
  'globe': 'Bills',
  'tm': 'Bills',
  'dito': 'Bills',
  'sun cellular': 'Bills',
  'converge': 'Bills',

  // Streaming / subscriptions (still Bills)
  'netflix': 'Bills',
  'spotify': 'Bills',
  'youtube premium': 'Bills',
  'disney+': 'Bills',
  'hbo': 'Bills',

  // ───────────── DIGITAL WALLETS / FINTECH ─────────────
  'gcash': 'Bills',
  'maya': 'Bills',
  'paymaya': 'Bills',
  'coins.ph': 'Bills',
  'coinsph': 'Bills',
  'grabpay': 'Bills',
  'shopeepay': 'Bills',

  // ───────────── BANKS ─────────────
  'bdo': 'Bills',
  'bpi': 'Bills',
  'metrobank': 'Bills',
  'landbank': 'Bills',
  'unionbank': 'Bills',
  'security bank': 'Bills',
  'rcbc': 'Bills',
  'chinabank': 'Bills',

  // ───────────── GOVERNMENT CONTRIBUTIONS ─────────────
  'sss': 'Bills',
  'social security': 'Bills',
  'pag-ibig': 'Bills',
  'pagibig': 'Bills',
  'hdmf': 'Bills',
  'philhealth': 'Bills',

  // ───────────── SHOPPING ─────────────
  'shopee': 'Shopping',
  'lazada': 'Shopping',
  'zalora': 'Shopping',
  'shein': 'Shopping',
  'department store': 'Shopping',
  "s&r": 'Shopping',
  'snr': 'Shopping',
  'sm store': 'Shopping',
  'uniqlo': 'Shopping',
  'h&m': 'Shopping',
  'bench': 'Shopping',
  'penshoppe': 'Shopping',

  // ───────────── HEALTH ─────────────
  'mercury drug': 'Health',
  'watsons': 'Health',
  'southstar drug': 'Health',
  'pharmacy': 'Health',
  'hospital': 'Health',
  'clinic': 'Health',
  'checkup': 'Health',
  'gym': 'Health',
  'fitness': 'Health',

  // ───────────── HOUSING ─────────────
  'rent': 'Housing',
  'landlord': 'Housing',
  'apartment': 'Housing',
  'condo': 'Housing',
  'association dues': 'Housing',
  'home repair': 'Housing',

  // ───────────── EDUCATION ─────────────
  'tuition': 'Education',
  'school fee': 'Education',
  'enrollment': 'Education',
  'textbook': 'Education',
  'review center': 'Education',
  'udemy': 'Education',
  'coursera': 'Education',

  // ───────────── ENTERTAINMENT ─────────────
  'movie': 'Entertainment',
  'cinema': 'Entertainment',
  'sm cinema': 'Entertainment',
  'concert': 'Entertainment',
  'game': 'Entertainment',
  'steam': 'Entertainment',
  'playstation': 'Entertainment',

  // ───────────── TRAVEL ─────────────
  'cebupac': 'Travel',
  'cebu pacific': 'Travel',
  'pal': 'Travel',
  'philippine airlines': 'Travel',
  'airasia': 'Travel',
  'hotel': 'Travel',
  'airbnb': 'Travel',
  'booking.com': 'Travel',
  'agoda': 'Travel',

  // ───────────── PETS ─────────────
  'vet': 'Pets',
  'veterinary': 'Pets',
  'pet shop': 'Pets',
  'dog food': 'Pets',
  'cat food': 'Pets',

  // ───────────── PERSONAL CARE ─────────────
  'salon': 'Personal Care',
  'barber': 'Personal Care',
  'haircut': 'Personal Care',
  'spa': 'Personal Care',
  'skincare': 'Personal Care',

  // ───────────── GIVING / DONATIONS ─────────────
  'donation': 'Giving',
  'charity': 'Giving',
  'tithe': 'Giving',
  'church': 'Giving',

  // ───────────── INCOME ─────────────
  'salary': 'Income',
  'payroll': 'Income',
  'bonus': 'Income',
  'refund': 'Income',
  'cashback': 'Income',

  // ───────────── SAVINGS / INVESTMENT ─────────────
  'savings': 'Savings',
  'emergency fund': 'Savings',
  'investment': 'Investment',
  'stocks': 'Investment',
  'crypto': 'Investment',
  'bitcoin': 'Investment',
  'gcash invest': 'Investment',
};

/**
 * Check if a description matches any keyword in the map.
 * Uses case-insensitive matching.
 * Returns the matched category name, or null if no match.
 */
export function matchKeyword(description: string): string | null {
  if (!description) return null;

  const lower = description.toLowerCase().trim();
  const entries = Object.entries(PH_KEYWORD_MAP);

  // First pass: try exact match or starts-with for multi-word keys
  for (const [keyword, category] of entries) {
    if (lower === keyword || lower.startsWith(keyword + ' ') || lower.endsWith(' ' + keyword) || lower.includes(' ' + keyword + ' ')) {
      return category;
    }
  }

  // Second pass: substring match (catches "jollibee delivery" as Food)
  for (const [keyword, category] of entries) {
    if (lower.includes(keyword)) {
      return category;
    }
  }

  return null;
}