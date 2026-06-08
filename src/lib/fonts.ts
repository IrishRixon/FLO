import { Geist, Geist_Mono } from 'next/font/google';

/**
 * Geist — the primary display font for headings and UI text.
 * Variable weight, loaded via next/font/google for zero-layout-shift optimization.
 */
export const geist = Geist({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

/**
 * Geist Mono — monospaced font for financial figures and data.
 * Variable weight, used everywhere amounts are shown.
 */
export const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});