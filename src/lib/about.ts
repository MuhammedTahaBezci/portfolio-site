// lib/about.ts - Düzeltilmiş versiyon
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import { AboutData, AboutDataFromFirestore } from '@/types/about';

// Hakkımda bilgilerini getir
export async function getAboutData(): Promise<AboutData | null> {
  try {
    const aboutDoc = await getDoc(doc(db, 'siteSettings', 'about'));

    if (!aboutDoc.exists()) {
      await createDefaultAboutData();
      return await getAboutData();
    }

    const data = aboutDoc.data() as AboutDataFromFirestore;

    const aboutData: AboutData = {
      id: aboutDoc.id, // Burada id her zaman string olacak
      title: data?.title || 'Hakkımda Sayfası',
      description: data?.description || 'Sanatsal yolculuğum, eserlerim ve felsefem.',
      artistName: data?.artistName || 'Sanatçı Adı',
      artistPortrait: data?.artistPortrait || '/images/artist-portrait.jpg',
      biography: data?.biography || 'Sanatçı biyografisi buraya gelecek...',
      artisticJourney: data?.artisticJourney || 'Sanatsal yolculuk hikayesi buraya gelecek...',
      artPhilosophy: data?.artPhilosophy || 'Sanat felsefesi buraya gelecek...',
      education: Array.isArray(data?.education) ? data.education : [],
      skills: Array.isArray(data?.skills) ? data.skills : [],
      contactMessage: data?.contactMessage || 'Sergiler, sanatsal projeler ve iş birlikleri için benimle iletişime geçebilirsiniz.',
      contactButtonText: 'İletişime Geç',
      updatedAt: data?.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(),
      createdAt: data?.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
    };

    return aboutData;
  } catch (error) {
    console.error('Hakkımda verileri alınamadı:', error);
    return null;
  }
}

// Varsayılan hakkımda verisini oluştur
async function createDefaultAboutData(): Promise<void> {
  const defaultData = {
    title: 'Hakkımda Sayfası',
    description: 'Sanatsal yolculuğum, eserlerim ve felsefem hakkında.',
    artistName: 'Sanatçı Adı',
    artistPortrait: '/images/artist-portrait.jpg',
    biography: 'Sanatçı biyografisi buraya gelecek. Burada sanatçının kişisel hikayesi, sanatsal geçmişi ve eserlerini etkileyen faktörler yer alabilir.',
    artisticJourney: 'Sanatsal yolculuğum çocukluktan itibaren başladı. İlk fırça darbesinden günümüze kadar olan süreçte yaşadığım deneyimler ve gelişim hikayem.',
    artPhilosophy: 'Sanat, benim için hayatın anlamını keşfetme ve paylaşma aracıdır. Her eserimde bir parça ruhumu ve dünya görüşümü aktarmaya çalışırım.',
    education: [
      {
        id: '1',
        startYear: '2010',
        endYear: '2014',
        degree: 'Güzel Sanatlar Fakültesi, Resim Bölümü',
        institution: 'İstanbul Üniversitesi',
        order: 1
      },
    ],
    skills: [
      'Yağlı Boya Tekniği',
    ],
    contactMessage: 'Sergiler, sanatsal projeler ve iş birlikleri için benimle iletişime geçebilirsiniz.',
    contactButtonText: 'İletişime Geç',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  await setDoc(doc(db, 'siteSettings', 'about'), defaultData);
}

// Hakkımda bilgilerini güncelle
export async function updateAboutData(data: Partial<AboutData>, imageFile?: File): Promise<boolean> {
  try {
    const aboutRef = doc(db, 'siteSettings', 'about');
    let imageUrl = data.artistPortrait;

    if (imageFile) {
      const storageRef = ref(storage, `about/${imageFile.name}`);
      const snapshot = await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(snapshot.ref);
    }

    const dataToUpdate: Partial<AboutData> = {
      title: data.title,
      description: data.description,
      artistName: data.artistName,
      biography: data.biography,
      artisticJourney: data.artisticJourney,
      artPhilosophy: data.artPhilosophy,
      education: data.education,
      skills: data.skills,
      contactMessage: data.contactMessage,
      ...(imageUrl && { artistPortrait: imageUrl }),
      updatedAt: serverTimestamp()
    };

    await updateDoc(aboutRef, dataToUpdate);
    return true;
  } catch (error) {
    console.error('Hakkımda verileri güncellenemedi:', error);
    return false;
  }
}