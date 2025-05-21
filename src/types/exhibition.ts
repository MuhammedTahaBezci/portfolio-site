import { StaticImport } from "next/dist/shared/lib/get-img-props";

export interface Exhibition {
  id: string;
  title: string;
  startDate: string | number | Date;
  endDate: string | number | Date;
  date: string;
  imageUrl: string; // Kapak resmi
  images?: string[]; // Galeri resimleri
  location: string;
  description?: string;
  galleryUrl?: string;
  galleryName?: string;
}

export function formatDate(date: string | number | Date): string {
  try {
    return new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  } catch (error) {
    console.error('Tarih formatlama hatası:', error);
    return 'Geçersiz tarih';
  }
}

export function isUpcomingExhibition(exhibition: Exhibition): boolean {
  try {
    const now = new Date();
    const endDate = new Date(exhibition.endDate);
    return endDate >= now;
  } catch (error) {
    console.error('Tarih karşılaştırma hatası:', error);
    return false;
  }
}