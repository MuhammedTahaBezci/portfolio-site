'use server'

import { revalidatePath } from 'next/cache'
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  Timestamp 
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface ExhibitionActionData {
  id?: string
  title: string
  startDate: string // ISO string format
  endDate: string   // ISO string format
  location: string
  description: string
  galleryName?: string
  galleryUrl?: string
  imageUrl?: string
  images?: string[]
}

// Sadece Firestore işlemi + revalidation yapan hafif action
export async function saveExhibitionData(exhibitionData: ExhibitionActionData) {
  try {
    // Form verilerini Firebase formatına çevir
    const firestoreData = {
      title: exhibitionData.title.trim(),
      startDate: Timestamp.fromDate(new Date(exhibitionData.startDate)),
      endDate: Timestamp.fromDate(new Date(exhibitionData.endDate)),
      location: exhibitionData.location?.trim() || '',
      description: exhibitionData.description?.trim() || '',
      galleryName: exhibitionData.galleryName?.trim() || '',
      galleryUrl: exhibitionData.galleryUrl?.trim() || '',
      ...(exhibitionData.imageUrl && { imageUrl: exhibitionData.imageUrl }),
      ...(exhibitionData.images && { images: exhibitionData.images }),
    }

    let docId: string

    if (exhibitionData.id) {
      // Güncelleme
      docId = exhibitionData.id
      const docRef = doc(db, 'exhibitions', docId)
      await updateDoc(docRef, firestoreData)
    } else {
      // Yeni ekleme
      const docRef = await addDoc(collection(db, 'exhibitions'), firestoreData)
      docId = docRef.id
    }

    // Cache'i invalidate et
    revalidatePath('/exhibitions')
    revalidatePath('/admin/exhibitions')
    revalidatePath('/')

    return { 
      success: true, 
      docId,
      message: exhibitionData.id ? 'Sergi başarıyla güncellendi.' : 'Yeni sergi başarıyla eklendi.' 
    }

  } catch (error) {
    console.error('Exhibition save error:', error)
    return { 
      success: false, 
      message: 'Sergi kaydedilirken hata oluştu: ' + (error as Error).message 
    }
  }
}

// Sadece revalidation için lightweight action
export async function revalidateExhibitions() {
  revalidatePath('/exhibitions')
  revalidatePath('/admin/exhibitions')
  revalidatePath('/')
}

export async function deleteExhibition(exhibitionId: string) {
  try {
    await deleteDoc(doc(db, 'exhibitions', exhibitionId))
    
    // Cache'i invalidate et
    revalidatePath('/exhibitions')
    revalidatePath('/admin/exhibitions')
    revalidatePath('/')

    return { 
      success: true, 
      message: 'Sergi başarıyla silindi.' 
    }
  } catch (error) {
    console.error('Exhibition delete error:', error)
    return { 
      success: false, 
      message: 'Sergi silinirken hata oluştu: ' + (error as Error).message 
    }
  }
}

export async function removeGalleryImage(exhibitionId: string, imageUrl: string, remainingImages: string[]) {
  try {
    await updateDoc(doc(db, 'exhibitions', exhibitionId), { 
      images: remainingImages 
    })

    // Cache'i invalidate et
    revalidatePath('/exhibitions')
    revalidatePath('/admin/exhibitions')

    return { 
      success: true, 
      message: 'Resim başarıyla kaldırıldı.' 
    }
  } catch (error) {
    console.error('Gallery image remove error:', error)
    return { 
      success: false, 
      message: 'Resim kaldırılırken hata oluştu: ' + (error as Error).message 
    }
  }
}

export async function updateExhibitionImages(exhibitionId: string, imageUrl?: string, images?: string[]) {
  try {
    const updateData: { imageUrl?: string; images?: string[] } = {}
    if (imageUrl) updateData.imageUrl = imageUrl
    if (images) updateData.images = images

    await updateDoc(doc(db, 'exhibitions', exhibitionId), updateData)
    
    // Cache'i invalidate et
    revalidatePath('/exhibitions')
    revalidatePath('/admin/exhibitions')

    return { success: true }
  } catch (error) {
    console.error('Exhibition images update error:', error)
    return { success: false, message: 'Resimler güncellenirken hata oluştu.' }
  }
}