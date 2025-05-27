// app/admin/login/page.tsx
'use client';

import { useState, FormEvent, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth'; // Giriş yapmak için gerekli fonksiyon
import { auth } from '@/lib/firebase'; // Firebase auth objesi
import { useRouter, useSearchParams } from 'next/navigation'; // Yönlendirme ve URL parametreleri için
import { useAuth } from '@/contexts/AuthContext'; // AuthContext'ten bilgileri almak için
import { FirebaseError } from 'firebase/app';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams(); // URL'deki query parametrelerini almak için (örneğin ?error=unauthorized)
  const authContext = useAuth(); // AuthContext'i kullanıyoruz

  useEffect(() => {
    // Eğer kullanıcı zaten giriş yapmış ve YÖNETİCİ ise, admin paneline yönlendir
    if (!authContext.loading && authContext.user && authContext.isAdmin) {
      router.push('/admin');
    }

    // URL'de bir hata parametresi varsa göster
    const authError = searchParams.get('error');
    if (authError === 'unauthorized') {
      setError('Erişim yetkiniz yok. Lütfen doğru hesapla giriş yapın.');
    }
  }, [authContext.loading, authContext.user, authContext.isAdmin, router, searchParams]);


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // Sayfanın yenilenmesini engelle
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Ortam değişkeninden yönetici e-postalarını al
      const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',').map(email => email.trim()) || [];

      if (user.email && adminEmails.includes(user.email)) {
        // Başarılı giriş ve yetkili bir yönetici e-postası ise
        router.push('/admin'); // Admin paneline yönlendir
      } else {
        // Kullanıcı giriş yaptı ama e-postası yönetici listesinde değil
        await auth.signOut(); // Hemen oturumunu kapat
        setError('Bu hesap yönetici paneline erişim yetkisine sahip değil.');
      }
    } catch (err) {
      if (err instanceof FirebaseError) {
      console.error('Giriş hatası:', err.code, err.message);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('E-posta veya şifre yanlış.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Geçersiz e-posta formatı.');
      } else {
        setError('Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } else {
      setError('Bilinmeyen bir hata oluştu.');
    }
  } finally {
    setLoading(false);
  }
  };

  // AuthContext yüklenirken veya kullanıcı zaten admin ise boş/yükleniyor göster
  if (authContext.loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Yükleniyor...</p>
      </div>
    );
  }

  // Kullanıcı giriş yapmış ve yönetici ise, bu sayfa görünmemeli, yönlendirme zaten yapılacak
  if (authContext.user && authContext.isAdmin) {
    return null; // Yönlendirme gerçekleşene kadar boş göster
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Yönetici Girişi</h1>
        {error && ( // Hata varsa göster
          <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Hata!</strong>
            <span className="block sm:inline"> {error}</span>
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-posta
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Şifre
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={loading} // Yükleniyorken butonu pasif yap
          >
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  );
}