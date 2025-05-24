// app/contact/page.tsx
'use client'; // Bu sayfanın client side'da çalışmasını sağlar

import ContactForm from '@/components/ContactForm'; // Doğru yolu belirttiğinizden emin olun

// Page bileşeniniz
export default function ContactPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      {/* ContactForm bileşenini doğrudan çağırıyoruz */}
      <ContactForm />
    </div>
  );
}