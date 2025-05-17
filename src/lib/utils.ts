import { collection, getDocs, query, where, Query, DocumentData } from 'firebase/firestore';
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
    //let paintingsQuery: Query<DocumentData> = collection(db, 'painting');

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
      const imageUrl = await getImageUrl(data.imagePath); // ✅ imagePath'ten URL al
      paintings.push({
        id: doc.id,
        ...data,
        imageUrl, // 🔁 imageUrl’i ekliyoruz
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

// Sergileri getir
export async function getExhibitions() {
  try {
    const snapshot = await getDocs(collection(db, 'exhibitions'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Exhibition));
  } catch (error) {
    console.error('Error fetching exhibitions:', error);
    return [];
  }
}

// Blog yazılarını getir
export async function getBlogPosts() {
  try {
    const snapshot = await getDocs(collection(db, 'blogPosts'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
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
export function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString('tr-TR', options);
}