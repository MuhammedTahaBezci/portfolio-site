import { collection, getDocs, query, where, Query, DocumentData, doc, getDoc } from 'firebase/firestore';
import { db, storage } from './firebase';
import { BlogPost } from '@/types/blog';
import { Exhibition } from '@/types/exhibition';
import { Category, Painting } from '@/types/painting';
import { getDownloadURL, ref } from 'firebase/storage';

// Storage URL'yi al
export async function getImageUrl(imagePath: string): Promise<string> {
  try {
    const imageRef = ref(storage, imagePath);
    return await getDownloadURL(imageRef);
  } catch (error) {
    console.error("Resim URL alınamadı:", error);
    return ""; // veya default image
  }
}

// Resim koleksiyonunu getir
export async function getPaintings(categorySlug?: string) {
  try {
    let paintingsQuery: Query<DocumentData> = collection(db, 'paintings');

    if (categorySlug) {
      const categoryDoc = await getCategoryBySlug(categorySlug);
      if (categoryDoc) {
        paintingsQuery = query(paintingsQuery, where('category', '==', categoryDoc.id));
      }
    }

    const snapshot = await getDocs(paintingsQuery);
    const paintings: Painting[] = [];

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const imageUrl = await getImageUrl(data.imagePath);
      paintings.push({
        id: doc.id,
        ...data,
        imageUrl,
      } as Painting);
    }

    return paintings;
  } catch (error) {
    console.error('Error fetching paintings:', error);
    return [];
  }
}

// Kategorileri getir
export async function getCategories() {
  try {
    const snapshot = await getDocs(collection(db, 'categories'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Slug ile kategori getir
export async function getCategoryBySlug(slug: string) {
  try {
    const categoriesQuery = query(collection(db, 'categories'), where('slug', '==', slug));
    const snapshot = await getDocs(categoriesQuery);
    
    if (snapshot.empty) {
      return null;
    }
    
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Category;
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    return null;
  }
}

// Sergileri getir - tarih sıralamasıyla
export async function getExhibitions(): Promise<Exhibition[]> {
  try {
    const snapshot = await getDocs(collection(db, 'exhibitions'));
    const exhibitions: Exhibition[] = [];
    
    for (const docSnapshot of snapshot.docs) {
      const data = docSnapshot.data();
      
      // Firestore Timestamp'ları JavaScript Date objelerine çevirme
      let startDate: Date;
      let endDate: Date;
      
      try {
        startDate = data.startDate?.toDate ? data.startDate.toDate() : new Date(data.startDate);
        endDate = data.endDate?.toDate ? data.endDate.toDate() : new Date(data.endDate);
      } catch (dateError) {
        console.warn(`Tarih dönüştürme hatası (${docSnapshot.id}):`, dateError);
        startDate = new Date();
        endDate = new Date();
      }
      
      const exhibition: Exhibition = {
        id: docSnapshot.id,
        title: data.title || 'Başlıksız Sergi',
        startDate,
        endDate,
        date: `${formatDate(startDate)} - ${formatDate(endDate)}`,
        location: data.location || '',
        description: data.description || '',
        imageUrl: data.imageUrl || '',
        images: Array.isArray(data.images) ? data.images : [],
        galleryName: data.galleryName || '',
        galleryUrl: data.galleryUrl || '',
      };
      
      exhibitions.push(exhibition);
    }
    
    // Şu anki tarih
    const now = new Date();
    
    // Sergileri kategorilere ayır
    const upcoming = exhibitions.filter(ex => new Date(ex.endDate) >= now);
    const past = exhibitions.filter(ex => new Date(ex.endDate) < now);
    
    // Yaklaşan sergileri başlama tarihine göre sırala (en yakından uzağa) 
    upcoming.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    
    // Geçmiş sergileri başlama tarihine göre sırala (en yeni en önce)
    past.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    
    // Önce yaklaşan, sonra geçmiş sergiler
    return [...upcoming, ...past];
  } catch (error) {
    console.error('Error fetching exhibitions:', error);
    return [];
  }
}

// ID ile sergi detayını getir
export async function getExhibitionById(id: string): Promise<Exhibition | null> {
  try {
    const exhibitionDoc = await getDoc(doc(db, 'exhibitions', id));
    
    if (!exhibitionDoc.exists()) {
      return null;
    }
    
    const data = exhibitionDoc.data();
    
    let startDate: Date;
    let endDate: Date;
    
    try {
      startDate = data.startDate?.toDate ? data.startDate.toDate() : new Date(data.startDate);
      endDate = data.endDate?.toDate ? data.endDate.toDate() : new Date(data.endDate);
    } catch (dateError) {
      console.warn(`Tarih dönüştürme hatası (${id}):`, dateError);
      startDate = new Date();
      endDate = new Date();
    }
    
    return {
      id: exhibitionDoc.id,
      title: data.title || 'Başlıksız Sergi',
      startDate,
      endDate,
      date: `${formatDate(startDate)} - ${formatDate(endDate)}`,
      location: data.location || '',
      description: data.description || '',
      imageUrl: data.imageUrl || '',
      images: Array.isArray(data.images) ? data.images : [],
      galleryName: data.galleryName || '',
      galleryUrl: data.galleryUrl || '',
    };
  } catch (error) {
    console.error('Error fetching exhibition by ID:', error);
    return null;
  }
}

// Blog yazılarını getir - tarih sıralamasıyla  
export async function getBlogPosts() {
  try {
    const snapshot = await getDocs(collection(db, 'blogPosts'));
    const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
    
    // Yayın tarihine göre sırala (en yeni en önce)
    posts.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
    
    return posts;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

// Slug ile blog yazısı getir
export async function getBlogPostBySlug(slug: string) {
  try {
    const postsQuery = query(collection(db, 'blogPosts'), where('slug', '==', slug));
    const snapshot = await getDocs(postsQuery);
    
    if (snapshot.empty) {
      return null;
    }
    
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as BlogPost;
  } catch (error) {
    console.error('Error fetching blog post by slug:', error);
    return null;
  }
}

// Tarih formatını düzenle
export function formatDate(dateString: string | number | Date): string {
  try {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  } catch (error) {
    console.error('Tarih formatlama hatası:', error);
    return 'Geçersiz tarih';
  }
}