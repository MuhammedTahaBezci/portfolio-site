import { StaticImport } from "next/dist/shared/lib/get-img-props";

export interface Exhibition {
  id: string;
  title: string;
  startDate: string | number | Date;
  endDate: string | number | Date;
  date: string;
  imageUrl: string | StaticImport;
  location: string;
  description?: string;
  galleryUrl?: string;
  galleryName?: string;
}

export function formatDate(date: string | number | Date) {
  return new Intl.DateTimeFormat('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}
