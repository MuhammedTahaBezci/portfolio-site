
// app/admin/layout.tsx
"use client";
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signOutAdmin } from '@/lib/auth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isAdminUser, loading, user } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  console.log('*** AdminLayout Render *** Mevcut Kimlik Doğrulama Durumu:', { loading, isAuthenticated, isAdminUser, userEmail: user?.email });

useEffect(() => {
  console.log('[AdminLayout] loading:', loading, 'isAuthenticated:', isAuthenticated, 'isAdminUser:', isAdminUser);
  if (!loading && (!isAuthenticated || !isAdminUser)) {
    console.log('[AdminLayout] Yönlendiriliyor: /admin/login');
    router.push('/admin/login');
  }
}, [isAuthenticated, isAdminUser, loading, router]);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    try {
      const success = await signOutAdmin();
      if (success) {
        router.push('/admin/login');
      } else {
        alert('Çıkış yaparken bir hata oluştu');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('Çıkış yaparken bir hata oluştu');
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (loading) {
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
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Yönetici Paneli
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Sanat Galerisi Yönetim Sistemi
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.displayName || 'Admin'}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email}
                </p>
              </div>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
              >
                {isLoggingOut ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Çıkış yapılıyor...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Çıkış Yap
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Ana İçerik */}
      <main>
        {children}
      </main>
    </div>
  );
}