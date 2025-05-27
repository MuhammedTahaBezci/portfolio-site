'use client';

import Sidebar from "@/components/Sidebar";
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminDashboard() {
  const { user, loading, isAdmin, logout } = useAuth(); 
  const router = useRouter();

  // Bu useEffect, kullanıcının yönetici olduğundan emin olmak içindir.
  // AuthProvider zaten ilk yönlendirmeleri yapıyor, bu ek bir güvenlik katmanı.
  useEffect(() => {
    if (!loading) { 
      if (!user) { 
        router.push('/admin/login'); 
      } else if (!isAdmin) {
        logout(); 
        router.push('/admin/login?error=unauthorized'); 
      }
    }
  }, [user, loading, isAdmin, router, logout]);

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
          onClick={logout}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Çıkış Yap
        </button>
      </div>
    </div>
  );
}