// app/admin/page.tsx
"use client";
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminDashboard() {
  const { isAuthenticated, isAdminUser, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdminUser)) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isAdminUser, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdminUser) {
    return null; // Redirecting, so nothing to render here
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto text-center">
        <h2 className="text-3xl font-extrabold text-gray-900">
          Admin Paneline Hoş Geldiniz!
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Burada yönetici araçlarına erişebilirsiniz.
        </p>
      </div>
      {/* Diğer admin paneli bileşenleri buraya eklenebilir */}
    </div>
  );
}