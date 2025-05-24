// app/contact/page.tsx
'use client';

import ContactForm from '@/components/ContactForm';

export default function ContactPage() {
  return (
    // bg-gray-50 yerine bg-background kullanıldı
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <ContactForm />
    </div>
  );
}