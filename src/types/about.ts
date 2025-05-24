// types/about.ts - Ana tip tanımlamaları
import { FieldValue } from 'firebase/firestore';

export interface EducationItem {
  id: string;
  startYear: string;
  endYear: string;
  degree: string;
  institution: string;
  order: number;
}

export interface AboutData {
  id: string; // Burayı string olarak değiştirdik (optional kaldırdık)
  title: string;
  description: string;
  artistName: string;
  artistPortrait: string;
  biography: string;
  artisticJourney: string;
  artPhilosophy: string;
  education: EducationItem[];
  skills: string[];
  contactMessage: string;
  contactButtonText: string;
  createdAt: Date | string | FieldValue;
  updatedAt: Date | string | FieldValue;
}

// Firebase'den dönen ham veri için ayrı interface
export interface AboutDataFromFirestore {
  id?: string;
  title?: string;
  description?: string;
  artistName?: string;
  artistPortrait?: string;
  biography?: string;
  artisticJourney?: string;
  artPhilosophy?: string;
  education?: EducationItem[];
  skills?: string[];
  contactMessage?: string;
  contactButtonText?: string;
  createdAt?: any; // Firestore timestamp
  updatedAt?: any; // Firestore timestamp
}