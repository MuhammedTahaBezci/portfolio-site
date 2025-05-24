// app/about/page.tsx

import { getAboutData } from '@/lib/about';
import { Metadata } from 'next';
import AboutContent from '@/components/AboutContent';
import { AboutData } from '@/types/about';

// Next.js'in Metadata API'si ile sayfa başlığını ve açıklamasını dinamik olarak ayarlar.
export async function generateMetadata(): Promise<Metadata> {
  const aboutData = await getAboutData(); // Firebase'den hakkımda verilerini çeker

  return {
    title: aboutData?.title ? `${aboutData.title} | Sanat Portfolyom` : 'Hakkımda | Sanat Portfolyom',
    description: aboutData?.description || 'Sanatçı biyografisi ve çalışma felsefem.',
    // Ek meta etiketleri buraya eklenebilir, örn:
    // keywords: ['sanatçı', 'biyografi', 'sanat', 'portfolyo'],
    // openGraph: {
    //   title: aboutData?.title || 'Hakkımda',
    //   description: aboutData?.description || 'Sanatçı biyografisi ve çalışma felsefem.',
    //   images: aboutData?.artistPortrait ? [{ url: aboutData.artistPortrait }] : [],
    // },
  };
}

// "Hakkımda" sayfasının ana bileşeni
export default async function AboutPage() {
  const aboutData = await getAboutData(); // Firebase'den hakkımda verilerini çeker

  // Eğer veri yüklenemezse veya bulunamazsa bir hata mesajı göster
  if (!aboutData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-2xl font-bold text-neutral-900 mb-4">Hakkımda</h1>
        <p className="text-neutral-600">Hakkımda bilgileri yüklenemedi. Lütfen daha sonra tekrar deneyin veya yöneticinizle iletişime geçin.</p>
      </div>
    );
  }

  // Başarılı bir şekilde veri çekildiyse, AboutContent bileşenini render et
  return <AboutContent aboutData={aboutData} />;
}