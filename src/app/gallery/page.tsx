// app/gallery/page.tsx (SERVER COMPONENT)

import { getPaintings } from '@/lib/utils';
import ClientGallery from './ClientGallery';

export const metadata = {
  title: 'Galeri | Sanat Portfolyom',
  description: 'Eserlerimin bulunduğu tüm kategoriler',
};

export default async function GalleryPage() {
  const paintings = await getPaintings();

  const uniqueCategories = Array.from(new Set(paintings.map(p => p.category))).filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Sanat Galerim</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Çalışmalarımı farklı kategorilerde keşfedin. Her bir kategori, sanatsal yolculuğumun farklı bir yönünü yansıtır.
        </p>
      </div>

      <ClientGallery paintings={paintings} categories={uniqueCategories} />
    </div>
  );
}
