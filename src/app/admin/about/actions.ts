'use server';

import { revalidatePath } from 'next/cache';
import { updateAboutData as updateAboutDataLib } from '@/lib/about';
import { AboutData } from '@/types/about';

export async function updateAboutDataAction(formData: FormData): Promise<{ success: boolean; message: string }> {
  try {
    // FormData'dan veriyi çıkar
    const aboutData: Partial<AboutData> = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      artistName: formData.get('artistName') as string,
      biography: formData.get('biography') as string,
      artisticJourney: formData.get('artisticJourney') as string,
      artPhilosophy: formData.get('artPhilosophy') as string,
      contactMessage: formData.get('contactMessage') as string,
      skills: JSON.parse(formData.get('skills') as string || '[]'),
      education: JSON.parse(formData.get('education') as string || '[]'),
    };

    // Resim dosyasını al
    const imageFile = formData.get('artistPortrait') as File | null;
    const finalImageFile = imageFile && imageFile.size > 0 ? imageFile : undefined;

    // Firebase'e veri güncelleme
    const success = await updateAboutDataLib(aboutData, finalImageFile);
    
    if (success) {
      // Cache'i temizle - hem admin hem de public sayfalar için
      revalidatePath('/about');
      revalidatePath('/admin/about');
      
      return {
        success: true,
        message: 'Hakkımda bilgileri başarıyla güncellendi!'
      };
    } else {
      return {
        success: false,
        message: 'Hakkımda bilgileri güncellenirken bir hata oluştu.'
      };
    }
  } catch (error) {
    console.error('About data update error:', error);
    return {
      success: false,
      message: 'Beklenmeyen bir hata oluştu: ' + (error as Error).message
    };
  }
}