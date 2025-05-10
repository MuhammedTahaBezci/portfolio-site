import { getPaintings } from '@/lib/utils';
import Image from 'next/image';

export const metadata = {
  title: 'Galeri | Sanat Portfolyom',
  description: 'Eserlerimin bulunduğu tüm kategoriler',
};

export default async function GalleryPage() {
  const paintings = await getPaintings(); // ✅ tüm resimleri çekiyoruz

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Sanat Galerim</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Çalışmalarımı farklı kategorilerde keşfedin. Her bir kategori, sanatsal yolculuğumun farklı bir yönünü yansıtmaktadır.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {paintings.map((painting) => (
          <div key={painting.id} className="bg-white rounded shadow p-4">
            <div className="relative aspect-w-4 aspect-h-3">
              <Image
                src={painting.imageUrl}
                alt={painting.title}
                width={500}
                height={375}
                className="object-cover rounded-md"
              />
            </div>
            <h3 className="text-lg font-medium mt-2">{painting.title}</h3>
            <p className="text-sm text-gray-600">{painting.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
