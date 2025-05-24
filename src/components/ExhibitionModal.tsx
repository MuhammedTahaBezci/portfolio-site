// src/components/ExhibitionModal.tsx
"use client"; // Bu direktif, Next.js 14+ (App Router) için çok önemlidir, çünkü client-side Hook'lar kullanıyoruz.

import { useEffect, useState } from "react";
import { Exhibition } from "@/types/exhibition"; 
// Eğer next/image kullanmak isterseniz: import Image from 'next/image';

interface ExhibitionModalProps {
  exhibition: Exhibition;
  onClose: () => void;
}

export default function ExhibitionModal({ exhibition, onClose }: ExhibitionModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Modal açıldığında body'nin scroll'unu kapat
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset'; // Modal kapandığında geri aç
    };
  }, []);

  // Escape tuşu ile kapatma özelliği
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Tarih formatlama fonksiyonu
  const formatDate = (date: string | number | Date) => {
    return new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  // Tüm görselleri topla (ana görsel + ek görseller)
  const allImages = [
    // exhibition.imageUrl bir string veya string dizisi olabilir, her iki durumu da ele alıyoruz.
    ...(exhibition.imageUrl 
        ? (Array.isArray(exhibition.imageUrl) 
            ? exhibition.imageUrl 
            : [exhibition.imageUrl]) 
        : []),
    ...(exhibition.images || [])
  ].filter(Boolean); // undefined veya null değerleri filtrele

  // Sonraki görsel
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  // Önceki görsel
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Arka plan karartması */}
      <div 
        className="fixed inset-0 bg-neutral-900/75 transition-opacity"
        onClick={onClose} // Arka plana tıklayınca kapatma
      />
      
      {/* Modal Kutusu */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-background rounded-lg shadow-2xl 
                        max-w-5xl w-full            {/* Yatayda maksimum 4xl genişlik (768px) */}
                        max-h-[95vh]                {/* Dikeyde ekranın %95'ini kapla */}
                        overflow-hidden">
          
          {/* Kapat Butonu */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-neutral-900/50 text-neutral-50 rounded-full 
                       w-8 h-8 flex items-center justify-center hover:bg-neutral-900/70 transition-colors"
          >
            ✕
          </button>

          {/* İçerik: Görsel ve Detaylar (Large ekranlarda 2 sütun) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            
            {/* Görsel Galeri Bölümü */}
            <div className="relative bg-neutral-100 flex items-center justify-center"> {/* Resmin dikeyde ortalanması için eklemeler */}
              {allImages.length > 0 ? (
                <>
                  {/* Ana Görsel */}
                  {/* next/image yerine direkt img etiketi kullanıldı, ihtiyaca göre Image bileşenine çevrilebilir. */}
                  <img
                    src={allImages[currentImageIndex]}
                    alt={exhibition.title}
                    className="w-full h-auto object-contain" 
                    style={{ maxHeight: '80vh' }} 
                  />
                  
                  {allImages.length > 1 && (
                    <>
                      {/* Önceki ve Sonraki Butonları */}
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-neutral-900/50 text-neutral-50 rounded-full 
                                   w-10 h-10 flex items-center justify-center hover:bg-neutral-900/70 transition-colors"
                      >
                        ‹
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-neutral-900/50 text-neutral-50 rounded-full 
                                   w-10 h-10 flex items-center justify-center hover:bg-neutral-900/70 transition-colors"
                      >
                        ›
                      </button>
                      
                      {/* Görsel Sayacı */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-neutral-900/50 text-neutral-50 px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {allImages.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                // Görsel yoksa gösterilecek yer tutucu
                <div className="w-full h-full flex items-center justify-center bg-neutral-200 text-neutral-400 text-6xl min-h-[300px]">
                  🎨 {/* min-h ekleyerek boş resim alanının da bir yüksekliği olmasını sağladık */}
                </div>
              )}
            </div>

            {/* Sergi Detayları Bölümü */}
            <div className="p-6 overflow-y-auto" style={{ maxHeight: '80vh' }}> {/* Detay bölümünün maksimum dikey yüksekliği */}
              <div className="space-y-4">
                {/* Başlık */}
                <h2 className="text-2xl font-bold text-neutral-900">
                  {exhibition.title}
                </h2>

                {/* Tarih */}
                <div className="flex items-center space-x-2 text-neutral-800">
                  <span className="text-lg text-neutral-500">📅</span>
                  <span className="font-medium">
                    {formatDate(exhibition.startDate)} - {formatDate(exhibition.endDate)}
                  </span>
                </div>

                {/* Konum */}
                {exhibition.location && (
                  <div className="flex items-center space-x-2 text-neutral-800">
                    <span className="text-lg text-neutral-500">📍</span>
                    <span>{exhibition.location}</span>
                  </div>
                )}

                {/* Galeri Adı/Link */}
                {exhibition.galleryName && (
                  <div className="flex items-center space-x-2 text-neutral-800">
                    <span className="text-lg text-neutral-500">🏛️</span>
                    <div>
                      {exhibition.galleryUrl ? (
                        <a
                          href={exhibition.galleryUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-800 hover:underline"
                        >
                          {exhibition.galleryName}
                        </a>
                      ) : (
                        <span>{exhibition.galleryName}</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Durum Etiketi */}
                <div className="inline-block">
                  {(() => {
                    const now = new Date();
                    now.setHours(0, 0, 0, 0); // Saat bilgisi olmadan sadece tarih karşılaştırması için

                    const startDate = new Date(exhibition.startDate);
                    const endDate = new Date(exhibition.endDate);
                    startDate.setHours(0, 0, 0, 0); // Başlangıç gününün başlangıcı
                    endDate.setHours(23, 59, 59, 999); // Bitiş gününün sonu

                    if (startDate > now) {
                      return (
                        <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                          Yaklaşan Sergi
                        </span>
                      );
                    } else if (startDate <= now && endDate >= now) {
                      return (
                        <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                          Devam Ediyor
                        </span>
                      );
                    } else {
                      return (
                        <span className="px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-600">
                          Sona Ermiş
                        </span>
                      );
                    }
                  })()}
                </div>

                {/* Açıklama */}
                {exhibition.description && (
                  <div className="border-t border-neutral-200 pt-4">
                    <h3 className="font-semibold text-neutral-900 mb-2">Sergi Hakkında</h3>
                    <p className="text-neutral-700 leading-relaxed whitespace-pre-line">
                      {exhibition.description}
                    </p>
                  </div>
                )}

                {/* Görsel Küçük Resimleri (Thumbnail) */}
                {allImages.length > 1 && (
                  <div className="border-t border-neutral-200 pt-4">
                    <h3 className="font-semibold text-neutral-900 mb-2">Galeri ({allImages.length})</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {allImages.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`aspect-square rounded overflow-hidden border-2 transition-colors ${
                            currentImageIndex === index
                              ? "border-primary-500" 
                              : "border-neutral-200 hover:border-neutral-300" 
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