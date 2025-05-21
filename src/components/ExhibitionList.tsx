"use client";

import { useState } from "react";
import { Exhibition } from "@/types/exhibition";
import ExhibitionModal from "@/components/ExhibitionModal";

interface ExhibitionListProps {
  exhibitions: Exhibition[];
}

export default function ExhibitionList({ exhibitions }: ExhibitionListProps) {
  const [selectedExhibition, setSelectedExhibition] = useState<Exhibition | null>(null);

  const openModal = (exhibition: Exhibition) => {
    setSelectedExhibition(exhibition);
  };

  const closeModal = () => {
    setSelectedExhibition(null);
  };

  const formatDate = (date: string | number | Date) => {
    return new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  const isUpcoming = (exhibition: Exhibition) => {
    const now = new Date();
    const endDate = new Date(exhibition.endDate);
    return endDate >= now;
  };

  if (exhibitions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Henüz sergi bulunmamaktadır.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exhibitions.map((exhibition) => (
          <div
            key={exhibition.id}
            className="cursor-pointer group"
            onClick={() => openModal(exhibition)}
          >
            <div className="relative overflow-hidden rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
              {/* Upcoming/Past Badge */}
              <div className="absolute top-3 left-3 z-10">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    isUpcoming(exhibition)
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {isUpcoming(exhibition) ? "Yaklaşan" : "Geçmiş"}
                </span>
              </div>

              {/* Exhibition Image */}
              <div className="aspect-[4/3] overflow-hidden">
                {exhibition.imageUrl ? (
                  <img
                    src={typeof exhibition.imageUrl === 'string' ? exhibition.imageUrl : exhibition.imageUrl}
                    alt={exhibition.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-4xl">🎨</span>
                  </div>
                )}
              </div>

              {/* Exhibition Info */}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 line-clamp-2">
                  {exhibition.title}
                </h3>
                
                <div className="space-y-1 text-sm text-gray-600">
                  <p className="flex items-center">
                    <span className="mr-2">📅</span>
                    {formatDate(exhibition.startDate)} - {formatDate(exhibition.endDate)}
                  </p>
                  
                  {exhibition.location && (
                    <p className="flex items-center">
                      <span className="mr-2">📍</span>
                      {exhibition.location}
                    </p>
                  )}
                  
                  {exhibition.galleryName && (
                    <p className="flex items-center">
                      <span className="mr-2">🏛️</span>
                      {exhibition.galleryName}
                    </p>
                  )}
                </div>

                {exhibition.description && (
                  <p className="text-gray-600 text-sm mt-3 line-clamp-2">
                    {exhibition.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedExhibition && (
        <ExhibitionModal
          exhibition={selectedExhibition}
          onClose={closeModal}
        />
      )}
    </>
  );
}