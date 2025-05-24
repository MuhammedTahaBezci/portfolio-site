'use client';

import { useState } from 'react';
import Image from 'next/image';

type Props = {
  paintings: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    category?: string;
  }[];
  categories: string[];
};

export default function ClientGallery({ paintings, categories }: Props) {
  const [selectedCategory, setSelectedCategory] = useState('Tümü');

  const filteredPaintings =
    selectedCategory === 'Tümü'
      ? paintings
      : paintings.filter((p) => p.category === selectedCategory);

  return (
    <>
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        <button
          className={`px-4 py-2 rounded ${
            selectedCategory === 'Tümü' 
              ? 'bg-primary-600 text-neutral-50' 
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
          } transition-colors duration-200`}
          onClick={() => setSelectedCategory('Tümü')}
        >
          Tümü
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded ${
              selectedCategory === category 
                ? 'bg-primary-600 text-neutral-50' 
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            } transition-colors duration-200`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredPaintings.map((painting) => (
          <div key={painting.id} className="bg-neutral-background rounded shadow p-4">
            <div className="relative w-full h-60">
              <Image
                src={painting.imageUrl}
                alt={painting.title}
                fill
                className="object-cover rounded-md"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <h3 className="text-lg font-medium mt-2 text-neutral-900">{painting.title}</h3>
            <p className="text-sm text-neutral-600">{painting.description}</p>
          </div>
        ))}
      </div>

      {filteredPaintings.length === 0 && (
        <p className="text-center text-neutral-500 mt-6">Bu kategoride henüz eser bulunmamaktadır.</p>
      )}
    </>
  );
}