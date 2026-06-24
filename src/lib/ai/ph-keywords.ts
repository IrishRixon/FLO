// Filipino / PH-specific brand & keyword → category mapping
// This runs BEFORE any AI/embedding logic.
// Keep indicators short and high-signal (brands, utilities, apps).
//
// IMPORTANT: All category names MUST match exactly with the `categories` table in the database.
// Current DB categories: Food, Transport, Utilities, Shopping, Health, Housing, Entertainment,
//                       Travel, Savings, Loan, Business, Transfer, Gifts, Investments,
//                       Salary, Freelance

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

  // ───────────── UTILITIES ─────────────
  'meralco': 'Utilities',
  'maynilad': 'Utilities',
  'manila water': 'Utilities',
  'primewater': 'Utilities',
  'veco': 'Utilities',
  'dlpc': 'Utilities',
  'electric': 'Utilities',
  'electricity': 'Utilities',
  'water bill': 'Utilities',
  'internet bill': 'Utilities',
  'phone bill': 'Utilities',

  // Telcos
  'pldt': 'Utilities',
  'smart': 'Utilities',
  'globe': 'Utilities',
  'tm': 'Utilities',
  'dito': 'Utilities',
  'sun cellular': 'Utilities',
  'converge': 'Utilities',

  // Streaming / subscriptions
  'netflix': 'Utilities',
  'spotify': 'Utilities',
  'youtube premium': 'Utilities',
  'disney+': 'Utilities',
  'hbo': 'Utilities',
  'hbo go': 'Utilities',
  'apple music': 'Utilities',
  'amazon prime': 'Utilities',
  'canva': 'Utilities',
  'google one': 'Utilities',
  'icloud': 'Utilities',
  'microsoft 365': 'Utilities',

  // ───────────── LOAN ─────────────
  'loan payment': 'Loan',
  'car loan': 'Loan',
  'home loan': 'Loan',
  'personal loan': 'Loan',
  'auto loan': 'Loan',
  'housing loan': 'Loan',
  'bank loan': 'Loan',
  'debt payment': 'Loan',
  'mortgage': 'Loan',

  // Banks (lending-related keywords)
  'bdo loan': 'Loan',
  'bpi loan': 'Loan',
  'metrobank loan': 'Loan',

  // ───────────── BUSINESS ─────────────
  'business expense': 'Business',
  'business supplies': 'Business',
  'office supplies': 'Business',
  'printing': 'Business',
  'inventory': 'Business',
  'wholesale': 'Business',
  'supplier': 'Business',
  'business permit': 'Business',
  'business tax': 'Business',
  'biz': 'Business',
  'entrepreneur': 'Business',

  // ───────────── TRANSFER ─────────────
  'transfer': 'Transfer',
  'bank transfer': 'Transfer',
  'fund transfer': 'Transfer',
  'money transfer': 'Transfer',
  'instapay': 'Transfer',
  'pesonet': 'Transfer',
  'balance transfer': 'Transfer',

  // ───────────── SHOPPING ─────────────
  'shopee': 'Shopping',
  'lazada': 'Shopping',
  'zalora': 'Shopping',
  'shein': 'Shopping',
  'temu': 'Shopping',
  'department store': 'Shopping',
  "s&r": 'Shopping',
  'snr': 'Shopping',
  'sm store': 'Shopping',
  'unicorn': 'Shopping',
  'uniqlo': 'Shopping',
  'h&m': 'Shopping',
  'bench': 'Shopping',
  'penshoppe': 'Shopping',
  'folded & hung': 'Shopping',

  // Personal care → Shopping (closest match among existing categories)
  'salon': 'Shopping',
  'barber': 'Shopping',
  'barbershop': 'Shopping',
  'haircut': 'Shopping',
  'hair color': 'Shopping',
  'nail salon': 'Shopping',
  'nail spa': 'Shopping',
  'nail polish': 'Shopping',
  'spa': 'Shopping',
  'massage': 'Shopping',
  'skincare': 'Shopping',
  'cosmetics': 'Shopping',
  'makeup': 'Shopping',
  'perfume': 'Shopping',
  'fragrance': 'Shopping',
  'clothing': 'Shopping',
  'apparel': 'Shopping',
  'footwear': 'Shopping',
  'accessories': 'Shopping',
  'jewelry': 'Shopping',
  'watch': 'Shopping',
  'bag': 'Shopping',
  'handbag': 'Shopping',

  // ───────────── HEALTH ─────────────
  'mercury drug': 'Health',
  'watsons': 'Health',
  'southstar drug': 'Health',
  'rose pharmacy': 'Health',
  'pharmacy': 'Health',
  'drugstore': 'Health',
  'hospital': 'Health',
  'clinic': 'Health',
  'checkup': 'Health',
  'check-up': 'Health',
  'check up': 'Health',
  'medical': 'Health',
  'medicine': 'Health',
  'medication': 'Health',
  'prescription': 'Health',
  'vaccine': 'Health',
  'dentist': 'Health',
  'dental': 'Health',
  'eye check': 'Health',
  'eyeglasses': 'Health',
  'contact lens': 'Health',
  'laboratory': 'Health',
  'x-ray': 'Health',
  'gym': 'Health',
  'fitness': 'Health',

  // Pets → Health (closest match)
  'vet': 'Health',
  'veterinary': 'Health',
  'pet shop': 'Health',
  'pet supply': 'Health',
  'pet food': 'Health',
  'dog food': 'Health',
  'cat food': 'Health',
  'dog grooming': 'Health',
  'vaccination pet': 'Health',

  // ───────────── HOUSING ─────────────
  'rent': 'Housing',
  'landlord': 'Housing',
  'apartment': 'Housing',
  'condo': 'Housing',
  'condominium': 'Housing',
  'association dues': 'Housing',
  'home repair': 'Housing',
  'home maintenance': 'Housing',
  'repair': 'Housing',
  'plumber': 'Housing',
  'electrician': 'Housing',
  'furniture': 'Housing',
  'appliance': 'Housing',
  'home improvement': 'Housing',
  'cleaning service': 'Housing',
  'laundry': 'Housing',
  'water refill': 'Housing',

  // ───────────── ENTERTAINMENT ─────────────
  'movie': 'Entertainment',
  'cinema': 'Entertainment',
  'sm cinema': 'Entertainment',
  'concert': 'Entertainment',
  'game': 'Entertainment',
  'steam': 'Entertainment',
  'playstation': 'Entertainment',
  'xbox': 'Entertainment',
  'nintendo': 'Entertainment',
  'mobile legend': 'Entertainment',
  'mlbb': 'Entertainment',
  'valorant': 'Entertainment',
  'gaming': 'Entertainment',
  'billiard': 'Entertainment',
  'bowling': 'Entertainment',
  'arcade': 'Entertainment',
  'karaoke': 'Entertainment',
  'videoke': 'Entertainment',
  'netflix sub': 'Entertainment',

  // ───────────── TRAVEL ─────────────
  'cebupac': 'Travel',
  'cebu pacific': 'Travel',
  'pal': 'Travel',
  'philippine airlines': 'Travel',
  'airasia': 'Travel',
  'cebpac': 'Travel',
  'pAL express': 'Travel',
  'airline': 'Travel',
  'flight': 'Travel',
  'hotel': 'Travel',
  'airbnb': 'Travel',
  'booking.com': 'Travel',
  'agoda': 'Travel',
  'resort': 'Travel',
  'tour': 'Travel',
  'excursion': 'Travel',
  'tourist spot': 'Travel',
  'travel tour': 'Travel',
  'ferry': 'Travel',
  'boat': 'Travel',
  'ship': 'Travel',
  'bus terminal': 'Travel',
  'bus fare': 'Travel',
  'toll fee': 'Travel',
  'car rental': 'Travel',
  'parking': 'Travel',
  'commute': 'Travel',

  // ───────────── GIFTS ─────────────
  'donation': 'Gifts',
  'charity': 'Gifts',
  'tithe': 'Gifts',
  'church': 'Gifts',
  'offering': 'Gifts',
  'gift': 'Gifts',
  'present': 'Gifts',
  'wedding gift': 'Gifts',
  'christmas gift': 'Gifts',
  'birthday gift': 'Gifts',
  'almusal': 'Gifts',
  'sponsor': 'Gifts',

  // ───────────── SAVINGS ─────────────
  'savings': 'Savings',
  'save': 'Savings',
  'emergency fund': 'Savings',
  'time deposit': 'Savings',
  'bank deposit': 'Savings',
  'passbook': 'Savings',
  'coin bank': 'Savings',
  'mp2': 'Savings',

  // Government contributions
  'sss': 'Savings',
  'social security': 'Savings',
  'pag-ibig': 'Savings',
  'pagibig': 'Savings',
  'hdmf': 'Savings',
  'philhealth': 'Savings',

  // ───────────── INVESTMENTS ─────────────
  'investment': 'Investments',
  'invest': 'Investments',
  'stocks': 'Investments',
  'stock market': 'Investments',
  'mutual fund': 'Investments',
  'uitf': 'Investments',
  'crypto': 'Investments',
  'bitcoin': 'Investments',
  'ethereum': 'Investments',
  'gcash invest': 'Investments',
  'g invest': 'Investments',
  'col financial': 'Investments',
  'col': 'Investments',
  'first metro': 'Investments',
  'bonds': 'Investments',
  'treasury': 'Investments',
  'real estate': 'Investments',

  // ───────────── SALARY ─────────────
  'salary': 'Salary',
  'payroll': 'Salary',
  'wage': 'Salary',
  'bonus': 'Salary',
  'thirteenth month': 'Salary',
  '13th month': 'Salary',
  'allowance': 'Salary',
  'government salary': 'Salary',
  'remittance': 'Salary',

  // ───────────── FREELANCE ─────────────
  'freelance': 'Freelance',
  'freelance income': 'Freelance',
  'upwork': 'Freelance',
  'fiverr': 'Freelance',
  'online jobs': 'Freelance',
  'online job': 'Freelance',
  'virtual assistant': 'Freelance',
  'va': 'Freelance',
  'outsource': 'Freelance',

  // ───────────── GENERAL INCOME (cashback/refund) ─────────────
  // Mapped to Salary as the default income catch-all
  'refund': 'Salary',
  'cashback': 'Salary',
  'reimbursement': 'Salary',

  // ───────────── DIGITAL WALLETS / FINTECH ─────────────
  'gcash': 'Transfer',
  'maya': 'Transfer',
  'paymaya': 'Transfer',
  'coins.ph': 'Transfer',
  'coinsph': 'Transfer',
  'grabpay': 'Transfer',
  'shopeepay': 'Transfer',

  // ───────────── BANKS (non-loan context → Transfer) ─────────────
  'bdo': 'Transfer',
  'bpi': 'Transfer',
  'metrobank': 'Transfer',
  'landbank': 'Transfer',
  'unionbank': 'Transfer',
  'union bank': 'Transfer',
  'security bank': 'Transfer',
  'rcbc': 'Transfer',
  'chinabank': 'Transfer',
  'eastwest': 'Transfer',
  'psbank': 'Transfer',
  'pNB': 'Transfer',

  // ───────────── EDUCATION (suggested: consider adding 'Education' to DB) ─────────────
  // Currently mapped to Savings as closest fit for future-oriented spending.
  // If you add 'Education' to the DB, change these to 'Education'.
  'tuition': 'Savings',
  'school fee': 'Savings',
  'enrollment': 'Savings',
  'textbook': 'Savings',
  'school supply': 'Savings',
  'review center': 'Savings',
  'review class': 'Savings',
  'training': 'Savings',
  'seminar': 'Savings',
  'workshop': 'Savings',
  'udemy': 'Savings',
  'coursera': 'Savings',
  'online course': 'Savings',
  'exam fee': 'Savings',
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

  // First pass: try exact match or word-boundary match for multi-word keys
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