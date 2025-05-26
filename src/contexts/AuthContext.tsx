// context/AuthContext.tsx
'use client'; // Bu bir istemci (client) bileşeni olmalı

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Firebase yapılandırmanızın yolunu kontrol edin
import { useRouter, usePathname } from 'next/navigation'; // Next.js 13+ App Router için gerekli

interface AuthContextType {
  user: User | null; // Giriş yapmış kullanıcı bilgisi
  loading: boolean; // Kimlik doğrulama durumunun yüklenip yüklenmediği
  logout: () => Promise<void>; // Çıkış yapma fonksiyonu
  isAdmin: boolean; // Kullanıcının yönetici olup olmadığı
}

// Bağlamı oluşturuyoruz
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Bağlam sağlayıcısı (Provider) bileşeni
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter(); // Yönlendirme için
  const pathname = usePathname(); // Mevcut sayfa yolunu almak için

  // Ortam değişkeninden yönetici e-postalarını alıyoruz
  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',').map(email => email.trim()) || [];

  useEffect(() => {
    // Firebase'in oturum açma durumu değiştiğinde çalışacak listener
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser); // Kullanıcıyı set et
      if (currentUser && currentUser.email) {
        setIsAdmin(adminEmails.includes(currentUser.email)); // E-postası yönetici listesinde mi kontrol et
      } else {
        setIsAdmin(false);
      }
      setLoading(false); // Yükleme bitti

      // Admin yolları için yönlendirme mantığı
      if (!loading) { // Yükleme durumu çözüldükten sonra yönlendirme yap
        if (pathname.startsWith('/admin')) { // Eğer mevcut yol /admin ile başlıyorsa
          if (!currentUser) { // Kullanıcı giriş yapmamışsa
            router.push('/admin/login'); // Giriş sayfasına yönlendir
          } else if (currentUser && currentUser.email && !adminEmails.includes(currentUser.email)) {
            // Kullanıcı giriş yapmış ama yönetici değilse
            await firebaseSignOut(auth); // Oturumunu kapat
            router.push('/admin/login?error=unauthorized'); // Yetkisiz hatasıyla giriş sayfasına yönlendir
          }
        }
      }
    });

    return () => unsubscribe(); // Bileşen ayrıldığında listener'ı temizle
  }, [router, pathname, loading, adminEmails]); // Bağımlılıklar

  // Çıkış yapma fonksiyonu
  const logout = async () => {
    await firebaseSignOut(auth); // Firebase'den çıkış yap
    setUser(null);
    setIsAdmin(false);
    router.push('/admin/login'); // Giriş sayfasına yönlendir
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

// Bağlamı kolayca kullanmak için custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth, bir AuthProvider içinde kullanılmalıdır');
  }
  return context;
};