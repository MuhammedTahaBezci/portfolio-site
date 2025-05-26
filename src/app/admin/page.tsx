// admin/page.tsx
'use client'; // Bu bir istemci bileşeni olmalı

import Sidebar from "@/components/Sidebar";
import { useAuth } from '@/contexts/AuthContext'; // AuthContext'i import et
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminDashboard() {
  const { user, loading, isAdmin, logout } = useAuth(); // AuthContext'ten bilgileri al
  const router = useRouter();

  // Bu useEffect, kullanıcının yönetici olduğundan emin olmak içindir.
  // AuthProvider zaten ilk yönlendirmeleri yapıyor, bu ek bir güvenlik katmanı.
  useEffect(() => {
    if (!loading) { // Yükleme bittiğinde
      if (!user) { // Kullanıcı giriş yapmamışsa
        router.push('/admin/login'); // Giriş sayfasına yönlendir
      } else if (!isAdmin) {
        // Kullanıcı giriş yapmış ama yönetici değilse (e-postası beyaz listede yoksa)
        logout(); // Oturumunu kapatmaya zorla
        router.push('/admin/login?error=unauthorized'); // Yetkisiz hatasıyla giriş sayfasına yönlendir
      }
    }
  }, [user, loading, isAdmin, router, logout]); // Bağımlılıklar

  // Yükleme sırasında veya yetkisiz kullanıcılar için bir yükleniyor/boş ekranı göster
  if (loading || (!user && !loading) || (!isAdmin && user)) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Yükleniyor...</p>
      </div>
    );
  }

  // Sadece kullanıcı kimliği doğrulanmış ve yönetici ise paneli render et
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold">Yönetici Paneli</h1>
        <p>Hoş geldiniz! Sol menüden işlemlerinizi seçebilirsiniz.</p>
        <button
          onClick={logout} // Çıkış yap butonu
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Çıkış Yap
        </button>
      </div>
    </div>
  );
}