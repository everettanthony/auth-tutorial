import type { Metadata } from 'next';
import { auth } from '@/auth';
import { Toaster } from '@/components/ui/sonner';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NextAuth",
  description: "NextAuth playground app.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
      <html lang="en">
        <body className={inter.className}>
          {children}
          <Toaster />
        </body>
      </html>
  );
}
