// lib/auth.ts
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from './firebase';

// Admin e-posta adreslerini .env'den al
const ADMIN_EMAILS = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',').map(email => email.trim()) || [];
console.log('Yüklenen YÖNETİCİ E-POSTALARI:', ADMIN_EMAILS); 

export async function signInAdmin(email: string, password: string): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('[signInAdmin] Firebase giriş başarılı:', userCredential.user);
        console.log('[signInAdmin] Giriş yapılan kullanıcının e-postası:', userCredential.user.email);

    if (!ADMIN_EMAILS.includes(userCredential.user.email || '')) {
      console.warn('[signInAdmin] Bu kullanıcı admin değil (e-posta listede yok):', userCredential.user.email); // Bu uyarıyı değiştirin
      await signOut(auth);
      throw new Error('Bu hesap yönetici yetkisine sahip değil');
    }

    return userCredential.user;
  } catch (error: any) {
    console.error('Giriş hatası:', error);

    if (error.code === 'auth/user-not-found') {
      throw new Error('Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı');
    } else if (error.code === 'auth/wrong-password') {
      throw new Error('Yanlış parola');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Geçersiz e-posta adresi');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Çok fazla başarısız giriş denemesi. Lütfen daha sonra tekrar deneyin');
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error('Giriş yapılamadı. Lütfen tekrar deneyin');
    }
  }
}

export async function signOutAdmin(): Promise<boolean> {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error('Çıkış hatası:', error);
    return false;
  }
}

export function onAuthStateChange({ callback }: { callback: (user: User | null) => void; }) {
  return onAuthStateChanged(auth, (user) => {
    console.log('[onAuthStateChange] Kullanıcı değişti:', user);
    callback(user);
  });
}

export function isAdmin(user: User | null): boolean {
  const isUserAdmin = !!user?.email && ADMIN_EMAILS.includes(user.email); // Değişken adını değiştirdim
  console.log('[isAdmin] Kontrol edilen kullanıcı e-postası:', user?.email, 'Yönetici E-postaları:', ADMIN_EMAILS, 'Yönetici mi:', isUserAdmin); // Gelişmiş log
  return isUserAdmin;
}
