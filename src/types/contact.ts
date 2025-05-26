import { Timestamp } from 'firebase/firestore';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  isRead: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactMessageFromFirestore {
  id?: string;
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  isRead?: boolean;
  isArchived?: boolean;
  createdAt?: Timestamp; 
  updatedAt?: Timestamp; 
}