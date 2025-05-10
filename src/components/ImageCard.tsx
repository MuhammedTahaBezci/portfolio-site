import Image from 'next/image';
import { Painting } from '@/types/painting';

interface ImageCardProps {
  painting: Painting;
  onClick?: () => void;
}

export default function ImageCard({ painting, onClick }: ImageCardProps) {
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-64 w-full">
        <Image
          src={painting.imageUrl}
          alt={painting.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">{painting.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{painting.year}, {painting.medium}</p>
        <p className="text-sm text-gray-500">{painting.dimensions}</p>
        {painting.sold ? (
          <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">
            Satıldı
          </span>
        ) : painting.price ? (
          <p className="mt-2 text-sm font-medium text-green-600">
            {painting.price.toLocaleString('tr-TR')} TL
          </p>
        ) : (
          <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
            Fiyat Sorunuz
          </span>
        )}
      </div>
    </div>
  );
}