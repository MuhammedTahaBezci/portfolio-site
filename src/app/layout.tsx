import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

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
    // html etiketine Inter fontunun değişkenini uyguluyoruz.
    // Bu değişken, global.css'deki @theme inline kısmında --font-sans olarak referans gösterilecek.
    <html lang="tr" className={`${inter.variable}`}>
      <body 
        // min-h-screen: Sayfanın en az ekran yüksekliği kadar olmasını sağlar.
        // flex flex-col: İçeriğin dikey olarak düzenlenmesini sağlar.
        // bg-neutral-50: Yeni tanımladığımız nötr arka plan rengi.
        // font-sans: global.css'de tanımladığımız --font-sans değişkenini kullanarak
        // tüm metinlerde Inter fontunu otomatik olarak kullanır.
        className={`min-h-screen flex flex-col bg-neutral-50 font-sans`}
      >
        <Navbar />
        {/* main etiketi flex-grow ile içeriğin kalan alanı kaplamasını sağlar,
            Navbar ve Footer'ın sabit kalmasını sağlarken içeriğin kaymasını mümkün kılar. */}
        <main className="flex-grow py-6 md:py-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}