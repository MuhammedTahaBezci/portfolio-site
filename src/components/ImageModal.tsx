"use client";

import Image from "next/image";
import { Painting } from "@/types/painting";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface Props {
  painting: Painting | null;
  onClose: () => void;
}

export default function ImageModal({ painting, onClose }: Props) {
  if (!painting) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-6xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Kapatma Butonu */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
          onClick={onClose}
          aria-label="Kapat"
        >
          <XMarkIcon className="h-7 w-7" />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Sol: Resim */}
          <div className="md:w-2/3 relative h-96 md:h-[600px] bg-black">
            <Image
              src={painting.imageUrl}
              alt={painting.title}
              fill
              className="object-contain transition duration-300"
              sizes="(max-width: 768px) 100vw, 66vw"
            />
          </div>

          {/* Sağ: Bilgiler */}
          <div className="md:w-1/3 p-6 bg-gray-50 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-3">{painting.title}</h2>

              {painting.year && (
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Yıl:</span> {painting.year}
                </p>
              )}
              {painting.medium && (
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Teknik:</span> {painting.medium}
                </p>
              )}
              {painting.dimensions && (
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Boyut:</span> {painting.dimensions}
                </p>
              )}
              {painting.category && (
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Kategori:</span> {painting.category}
                </p>
              )}

              {painting.description && (
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-700 mb-2">Açıklama</h3>
                  <p className="text-gray-600 text-sm">{painting.description}</p>
                </div>
              )}
            </div>

            {painting.sold && (
              <div className="mt-6 inline-block px-3 py-2 bg-red-100 text-red-800 font-semibold rounded-full text-sm">
                Satıldı
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
