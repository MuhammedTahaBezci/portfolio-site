// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext'; // 1. Bu satırı ekleyin

// Inter fontunu yüklüyor ve CSS değişkeni olarak tanımlıyoruz.
// 'variable' özelliği sayesinde Tailwind'de --font-inter-sans olarak kullanabileceğiz.
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter-sans'
});

export const metadata: Metadata = {
  title: 'Sanat Portfolyom',
  description: 'Eserlerim, sergilerim ve sanat hakkındaki düşüncelerim',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${inter.variable}`}>
      <body
        className={`min-h-screen flex flex-col bg-neutral-50 font-sans`}
      >
        {/* 2. AuthProvider'ı buraya ekleyin ve Navbar, main, Footer'ı içine alın */}
        <AuthProvider>
          <Navbar />
          <main className="flex-grow py-6 md:py-10">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}