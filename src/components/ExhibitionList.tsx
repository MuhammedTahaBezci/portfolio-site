import Link from 'next/link';
import Image from 'next/image';
import { Exhibition } from '@/types/exhibition';
import { formatDate } from '@/lib/utils';

interface ExhibitionListProps {
  exhibitions: Exhibition[];
}

export default function ExhibitionList({ exhibitions }: ExhibitionListProps) {
  return (
    <div className="space-y-8">
      {exhibitions.map((exhibition) => (
        <div key={exhibition.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
          <div className="relative h-64 w-full md:w-1/3">
            <Image
              src={exhibition.imageUrl}
              alt={exhibition.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="p-6 md:w-2/3">
            <h3 className="text-xl font-semibold mb-2">{exhibition.title}</h3>
            <div className="mb-3 flex items-center text-sm text-gray-500">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span>{formatDate(exhibition.startDate)} - {formatDate(exhibition.endDate)}</span>
            </div>

            <div className="mb-3 flex items-center text-sm text-gray-500">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span>{exhibition.location}</span>
            </div>

            <p className="text-gray-600 mb-4 line-clamp-3">{exhibition.description}</p>
            
            {exhibition.galleryUrl && (
              <a 
                href={exhibition.galleryUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center text-yellow-600 hover:text-yellow-700"
              >
                <span>{exhibition.galleryName}</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}