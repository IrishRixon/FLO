import type { Metadata } from 'next';
import '@/styles/index.css';
import { geist, geistMono } from '@/lib/fonts';
import { Layout } from '@/app/components/Layout';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Flo — AI Finance Tracker',
  description:
    'A minimalist, modern money management tool built for young professionals in Southeast Asia.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${geist.variable} ${geistMono.variable}`}
    >
      <body>
        <Layout>{children}</Layout>
        <Toaster position="top-center" theme='dark' richColors/>
      </body>
    </html>
  );
}