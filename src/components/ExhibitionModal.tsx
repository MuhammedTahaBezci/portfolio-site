"use client";

import { useEffect, useState } from "react";
import { Exhibition } from "@/types/exhibition";

interface ExhibitionModalProps {
  exhibition: Exhibition;
  onClose: () => void;
}

export default function ExhibitionModal({ exhibition, onClose }: ExhibitionModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Modal açılırken body scroll'unu engelle
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // ESC tuşu ile modal kapatma
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const formatDate = (date: string | number | Date) => {
    return new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  const allImages = [
    ...(exhibition.imageUrl ? [typeof exhibition.imageUrl === 'string' ? exhibition.imageUrl : exhibition.imageUrl] : []),
    ...(exhibition.images || [])
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70 transition-colors"
          >
            ✕
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            {/* Image Gallery */}
            <div className="relative bg-gray-100">
              {allImages.length > 0 ? (
                <>
                  <img
                    src={allImages[currentImageIndex]}
                    alt={exhibition.title}
                    className="w-full h-full object-cover"
                    style={{ maxHeight: '60vh', minHeight: '300px' }}
                  />
                  
                  {allImages.length > 1 && (
                    <>
                      {/* Previous Button */}
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70 transition-colors"
                      >
                        ‹
                      </button>
                      
                      {/* Next Button */}
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70 transition-colors"
                      >
                        ›
                      </button>
                      
                      {/* Image Counter */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {allImages.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-6xl">
                  🎨
                </div>
              )}
            </div>

            {/* Exhibition Details */}
            <div className="p-6 overflow-y-auto" style={{ maxHeight: '60vh' }}>
              <div className="space-y-4">
                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-900">
                  {exhibition.title}
                </h2>

                {/* Date */}
                <div className="flex items-center space-x-2 text-gray-600">
                  <span className="text-lg">📅</span>
                  <span className="font-medium">
                    {formatDate(exhibition.startDate)} - {formatDate(exhibition.endDate)}
                  </span>
                </div>

                {/* Location */}
                {exhibition.location && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <span className="text-lg">📍</span>
                    <span>{exhibition.location}</span>
                  </div>
                )}

                {/* Gallery */}
                {exhibition.galleryName && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <span className="text-lg">🏛️</span>
                    <div>
                      {exhibition.galleryUrl ? (
                        <a
                          href={exhibition.galleryUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {exhibition.galleryName}
                        </a>
                      ) : (
                        <span>{exhibition.galleryName}</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Status */}
                <div className="inline-block">
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${
                      new Date(exhibition.endDate) >= new Date()
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {new Date(exhibition.endDate) >= new Date() ? "Devam Ediyor" : "Sona Erdi"}
                  </span>
                </div>

                {/* Description */}
                {exhibition.description && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Sergi Hakkında</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {exhibition.description}
                    </p>
                  </div>
                )}

                {/* Image Thumbnails */}
                {allImages.length > 1 && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Galeri ({allImages.length})</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {allImages.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`aspect-square rounded overflow-hidden border-2 transition-colors ${
                            currentImageIndex === index
                              ? "border-blue-500"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <img
                            src={image}
                            alt={`${exhibition.title} - ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}