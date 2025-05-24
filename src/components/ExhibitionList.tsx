"use client";

import { useState } from "react";
import { Exhibition, getExhibitionStatus } from "@/types/exhibition";
import ExhibitionModal from "./ExhibitionModal"; 

interface ExhibitionListProps {
  exhibitions: Exhibition[];
}

export default function ExhibitionList({ exhibitions }: ExhibitionListProps) {
  const [selectedExhibition, setSelectedExhibition] = useState<Exhibition | null>(null);

  const openModal = (exhibition: Exhibition) => {
    setSelectedExhibition(exhibition);
    document.body.style.overflow = "hidden"; // Modal açıldığında kaydırmayı engelle
  };

  const closeModal = () => {
    setSelectedExhibition(null);
    document.body.style.overflow = "auto"; // Modal kapandığında kaydırmayı etkinleştir
  };

  const formatDate = (date: string | number | Date) => {
    return new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  const getStatusInfo = (exhibition: Exhibition) => {
    const status = getExhibitionStatus(exhibition);
    
    switch (status) {
      case 'upcoming':
        return { text: 'Yaklaşan', bgColor: 'bg-blue-100', textColor: 'text-blue-800' };
      case 'current':
        return { text: 'Devam Ediyor', bgColor: 'bg-green-100', textColor: 'text-green-800' };
      case 'past':
        return { text: 'Sona Ermiş', bgColor: 'bg-gray-100', textColor: 'text-gray-600' };
      default:
        return { text: 'Belirsiz', bgColor: 'bg-gray-100', textColor: 'text-gray-600' };
    }
  };

  if (exhibitions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500 text-lg">Henüz sergi bulunmamaktadır.</p>
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
            <div className="relative overflow-hidden rounded-lg bg-neutral-background shadow-md hover:shadow-lg transition-shadow duration-300">
              {/* Status Badge */}
              <div className="absolute top-3 left-3 z-10">
                {(() => {
                  const statusInfo = getStatusInfo(exhibition);
                  return (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.bgColor} ${statusInfo.textColor}`}>
                      {statusInfo.text}
                    </span>
                  );
                })()}
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
                  <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
                    <span className="text-neutral-400 text-4xl">🎨</span>
                  </div>
                )}
              </div>

              {/* Exhibition Info */}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 line-clamp-2 text-neutral-900">
                  {exhibition.title}
                </h3>
                
                <div className="space-y-1 text-sm text-neutral-600">
                  <p className="flex items-center">
                    <span className="mr-2 text-neutral-500">📅</span> 
                    {formatDate(exhibition.startDate)} - {formatDate(exhibition.endDate)}
                  </p>
                  
                  {exhibition.location && (
                    <p className="flex items-center">
                      <span className="mr-2 text-neutral-500">📍</span>
                      {exhibition.location}
                    </p>
                  )}
                  
                  {exhibition.galleryName && (
                    <p className="flex items-center">
                      <span className="mr-2 text-neutral-500">🏛️</span> 
                      {exhibition.galleryName}
                    </p>
                  )}
                </div>

                {exhibition.description && (
                  <p className="text-neutral-600 text-sm mt-3 line-clamp-2">
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