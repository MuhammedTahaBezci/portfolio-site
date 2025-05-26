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
    now.setHours(0, 0, 0, 0);
    
    const endDate = new Date(exhibition.endDate);
    endDate.setHours(23, 59, 59, 999);
    
    return endDate >= now;
  } catch (error) {
    console.error('Tarih karşılaştırma hatası:', error);
    return false;
  }
}

export function getExhibitionStatus(exhibition: Exhibition): 'upcoming' | 'current' | 'past' {
  try {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    const startDate = new Date(exhibition.startDate);
    const endDate = new Date(exhibition.endDate);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    
    if (startDate > now) {
      return 'upcoming';
    } else if (startDate <= now && endDate >= now) {
      return 'current';
    } else {
      return 'past';
    }
  } catch (error) {
    console.error('Sergi durumu hesaplama hatası:', error);
    return 'past';
  }
}