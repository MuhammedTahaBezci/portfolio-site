// lib/contact.ts - Firebase işlemleri
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { ContactMessage, ContactMessageFromFirestore } from '@/types/contact';

// Yeni mesaj gönder
export async function sendContactMessage(
  name: string, 
  email: string, 
  message: string, 
  subject?: string
): Promise<boolean> {
  try {
    await addDoc(collection(db, 'contactMessages'), {
      name,
      email,
      subject: subject || '',
      message,
      isRead: false,
      isArchived: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Mesaj gönderilemedi:', error);
    return false;
  }
}

// Tüm mesajları getir (admin için)
export async function getContactMessages(includeArchived: boolean = false): Promise<ContactMessage[]> {
  try {
    let q = query(
      collection(db, 'contactMessages'),
      orderBy('createdAt', 'desc')
    );

    if (!includeArchived) {
      q = query(
        collection(db, 'contactMessages'),
        where('isArchived', '==', false),
        orderBy('createdAt', 'desc')
      );
    }

    const querySnapshot = await getDocs(q);
    const messages: ContactMessage[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data() as ContactMessageFromFirestore;
      messages.push({
        id: doc.id,
        name: data.name || '',
        email: data.email || '',
        subject: data.subject || '',
        message: data.message || '',
        isRead: data.isRead || false,
        isArchived: data.isArchived || false,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      });
    });

    return messages;
  } catch (error) {
    console.error('Mesajlar getirilemedi:', error);
    return [];
  }
}

// Mesajı okundu olarak işaretle
export async function markMessageAsRead(messageId: string): Promise<boolean> {
  try {
    const messageRef = doc(db, 'contactMessages', messageId);
    await updateDoc(messageRef, {
      isRead: true,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Mesaj güncellenemedi:', error);
    return false;
  }
}

// Mesajı arşivle
export async function archiveMessage(messageId: string): Promise<boolean> {
  try {
    const messageRef = doc(db, 'contactMessages', messageId);
    await updateDoc(messageRef, {
      isArchived: true,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Mesaj arşivlenemedi:', error);
    return false;
  }
}

// Mesajı sil
export async function deleteMessage(messageId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'contactMessages', messageId));
    return true;
  } catch (error) {
    console.error('Mesaj silinemedi:', error);
    return false;
  }
}

// Okunmamış mesaj sayısını getir
export async function getUnreadMessageCount(): Promise<number> {
  try {
    const q = query(
      collection(db, 'contactMessages'),
      where('isRead', '==', false),
      where('isArchived', '==', false)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error('Okunmamış mesaj sayısı getirilemedi:', error);
    return 0;
  }
}