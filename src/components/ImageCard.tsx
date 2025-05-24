"use client";

import Image from 'next/image';
import { useState } from 'react';
import { Painting } from '@/types/painting';

interface ImageCardProps {
  painting: Painting;
  onClick: () => void;
}

export default function ImageCard({ painting, onClick }: ImageCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative cursor-pointer overflow-hidden rounded-lg shadow-md transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-64 w-full">
        <Image
          src={painting.imageUrl}
          alt={painting.title}
          fill
          className={`object-cover transition-all duration-300 ${isHovered ? 'blur-sm scale-105' : ''}`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/30 backdrop-blur-sm transition-opacity duration-300">
            <span className="text-neutral-50 text-lg font-semibold text-center px-4">
              {painting.title}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}