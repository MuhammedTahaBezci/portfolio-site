
// components/AboutContent.tsx - Düzeltilmiş versiyon
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AboutData, EducationItem } from '@/types/about';

interface AboutContentProps {
  aboutData: AboutData;
}

export default function AboutContent({ aboutData }: AboutContentProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Sanatçı Portresi ve Başlık/Açıklama Bölümü */}
      <div className="flex flex-col md:flex-row items-center md:items-center gap-8 mb-10">
        {/* Sanatçı Portresi */}
        {aboutData.artistPortrait && (
          <div className="relative w-56 h-56 sm:w-72 sm:h-72 flex-shrink-0 rounded-full overflow-hidden shadow-lg border-4 border-yellow-500">
            <Image
              src={aboutData.artistPortrait}
              alt={aboutData.artistName || "Sanatçı Portresi"}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 33vw"
              priority
            />
          </div>
        )}

        {/* Başlık ve Açıklama */}
        <div className="text-center md:text-left flex-grow">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{aboutData.title}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto md:mx-0">
            {aboutData.description}
          </p>
        </div>
      </div>

      {/* Sanatsal Yolculuk Bölümü */}
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-10">
        <h2 className="text-2xl font-bold mb-4">Sanatsal Yolculuğum</h2>
        <div
          className="prose max-w-none text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: aboutData.artisticJourney }}
        />
      </div>

      {/* Eğitim ve Beceriler Bölümü */}
      <div className="grid md:grid-cols-2 gap-8 mb-10">
        {/* Eğitim Kutusu */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Eğitim</h2>
          <ul className="space-y-4">
            {aboutData.education
              ?.sort((a, b) => a.order - b.order)
              .map((edu) => (
                <li key={edu.id}>
                  <div className="text-gray-500 text-sm mb-1">{edu.startYear} - {edu.endYear}</div>
                  <div className="font-medium">{edu.degree}</div>
                  <div className="text-gray-600">{edu.institution}</div>
                </li>
              ))}
          </ul>
        </div>

        {/* Beceriler ve Teknikler Kutusu */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Beceriler ve Teknikler</h2>
          <ul className="space-y-2">
            {aboutData.skills?.map((skill, index) => (
              <li key={index} className="flex items-center">
                <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
                <span>{skill}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sanat Felsefesi Bölümü */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-10">
        <h2 className="text-xl font-bold mb-4">Sanat Felsefem</h2>
        <div
          className="prose max-w-none text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: aboutData.artPhilosophy }}
        />
      </div>

      {/* İletişim CTA */}
      <div className="bg-yellow-100 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">{aboutData.contactMessage}</h2>
        <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
          Sergiler, sanatsal projeler veya özel siparişler için benimle iletişime geçebilirsiniz.
        </p>
        <Link
          href="/contact"
          className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 px-6 rounded-md transition duration-300"
        >
          {aboutData.contactButtonText}
        </Link>
      </div>
    </div>
  );
}