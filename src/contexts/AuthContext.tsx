// contexts/AuthContext.tsx
"use client"; // Bu satır, Next.js'te bu dosyanın istemci tarafında çalışacağını belirtir.

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth'; // Firebase User tipini içe aktarıyoruz
import { onAuthStateChange, isAdmin } from '@/lib/auth'; // auth.ts dosyasından fonksiyonları içe aktarıyoruz

// AuthContext'in sağlayacağı veri yapısını tanımlıyoruz
interface AuthContextType {
  user: User | null;         // Firebase'den gelen kullanıcı objesi veya null
  isAuthenticated: boolean;  // Kullanıcının giriş yapıp yapmadığı (true/false)
  isAdminUser: boolean;      // Kullanıcının yönetici olup olmadığı (true/false)
  loading: boolean;          // Kimlik doğrulama durumunun yüklenip yüklenmediği (true/false)
}

// AuthContext'i varsayılan değerlerle oluşturuyoruz
// Başlangıçta loading true, diğerleri false olarak ayarlanır
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAdminUser: false,
  loading: true,
});

// AuthProvider bileşeni, uygulamanın tamamına kimlik doğrulama bağlamını sağlar
export function AuthProvider({ children }: { children: ReactNode }) {
  // Kullanıcı objesi için state
  const [user, setUser] = useState<User | null>(null);
  // Yüklenme durumu için state
  const [loading, setLoading] = useState(true);

  // Bu useEffect, bileşen yüklendiğinde Firebase kimlik doğrulama durumunu dinler
  // ve durum her değiştiğinde (giriş/çıkış) tetiklenir.
  useEffect(() => {
    // Dinleyici başlatıldığında bir log
    console.log('[AuthContext] onAuthStateChange dinleyicisi başlatılıyor...');

    // Firebase'in onAuthStateChanged fonksiyonunu dinleyici olarak kullanıyoruz
    const unsubscribe = onAuthStateChange({
      callback: (firebaseUser) => {
        // Dinleyici tetiklendiğinde her zaman bu logu görmelisiniz
        console.log('[AuthContext] onAuthStateChange tetiklendi!');

        if (firebaseUser) {
          // Eğer bir kullanıcı varsa (giriş yapmışsa)
          console.log('[AuthContext] Gelen user (giriş yapmış):', firebaseUser.email);
          // Kullanıcının admin olup olmadığını kontrol edip logluyoruz
          console.log('[AuthContext] isAdmin(user) sonucu:', isAdmin(firebaseUser));
        } else {
          // Eğer kullanıcı yoksa (giriş yapmamışsa veya çıkış yapmışsa)
          console.log('[AuthContext] Gelen user (giriş yapmamış): null');
        }

        // Kullanıcı state'ini güncelliyoruz
        setUser(firebaseUser);
        // Yüklenme durumunu false yapıyoruz, çünkü durumu kontrol ettik
        setLoading(false);

        // Auth durumunun güncellenmiş halini logluyoruz
        console.log('[AuthContext] Auth durumu güncellendi: loading:', false, 'isAuthenticated:', !!firebaseUser, 'isAdminUser:', isAdmin(firebaseUser));
      }
    });

    // useEffect'ten çıkıldığında (bileşen kaldırıldığında) dinleyiciyi temizle
    // Bu, bellek sızıntılarını önler ve gereksiz dinlemeyi durdurur.
    return () => {
      console.log('[AuthContext] onAuthStateChange dinleyicisi temizleniyor.');
      unsubscribe(); // Firebase dinleyicisini kapatıyoruz
    };
  }, []); // Boş bağımlılık dizisi, useEffect'in yalnızca bir kez, bileşen yüklendiğinde çalışmasını sağlar.

  // AuthContext'e sağlanacak değerleri oluşturuyoruz
  const value = {
    user,
    isAuthenticated: !!user, // user null değilse true, null ise false
    isAdminUser: isAdmin(user), // isAdmin fonksiyonuyla yönetici olup olmadığını kontrol et
    loading,
  };

  // AuthContext.Provider ile tüm alt bileşenlere 'value' değerini sağlıyoruz
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// useAuth hook'u, AuthContext'i diğer bileşenlerde kolayca kullanmak için
export const useAuth = () => {
  const context = useContext(AuthContext);
  // Eğer hook AuthProvider dışında kullanılırsa hata fırlatırız
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context; // Context değerini döndürürüz
};