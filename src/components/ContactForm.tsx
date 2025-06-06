'use client';

import { useState, FormEvent } from 'react';
import { sendContactMessage } from '@/lib/contact';
import Card from '@/components/Card';
// Button Component
const Button = ({
  children,
  className = "",
  type = "button",
  disabled = false,
  ...props
}: React.PropsWithChildren<{
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}>) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`
        px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold tracking-wide 
        hover:bg-primary-700 transition duration-300 ease-in-out 
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};



export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim() || !message.trim()) {
      // Daha iyi bir hata mesajı veya görsel geri bildirim eklenebilir
      alert('Lütfen gerekli tüm alanları doldurun.');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus('idle'); 
    
    try {
      const success = await sendContactMessage(name.trim(), email.trim(), message.trim(), subject.trim());
      
      if (success) {
        setSubmitStatus('success');
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        setSubmitStatus('error');
      }
      
      // Başarı/Hata mesajını 5 saniye sonra gizle
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } catch (error) {
      console.error('Mesaj gönderme hatası:', error);
      setSubmitStatus('error');
      
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-10 px-4"> {/* Merkezi konumlandırma ve dolgu */}
      <Card>
        <h2 className="text-4xl font-extrabold text-neutral-900 mb-4 text-center">Bize Ulaşın</h2>
        <p className="text-neutral-500 text-center mb-10 text-lg">
          Sorularınız, projeleriniz ve iş birliği teklifleriniz için bizimle iletişime geçin.
        </p>

        {submitStatus === 'success' && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">Mesajınız başarıyla gönderildi!</p>
              <p className="text-sm mt-1 opacity-90">En kısa sürede size geri dönüş yapacağız.</p>
            </div>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">Mesajınız gönderilemedi!</p>
              <p className="text-sm mt-1 opacity-90">Lütfen daha sonra tekrar deneyin veya doğrudan e-posta ile iletişime geçin.</p>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
                Ad Soyad <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent 
                           transition duration-200 placeholder-neutral-400 text-neutral-800"
                placeholder="Adınızı ve soyadınızı girin"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                E-posta <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent 
                           transition duration-200 placeholder-neutral-400 text-neutral-800"
                placeholder="E-posta adresinizi girin"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-2">
              Konu
            </label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent 
                         transition duration-200 placeholder-neutral-400 text-neutral-800"
              placeholder="Mesajınızın konusu (isteğe bağlı)"
            />
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-2">
              Mesaj <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent 
                         transition duration-200 resize-y placeholder-neutral-400 text-neutral-800"
              placeholder="Mesajınızı buraya yazın..."
              required
            ></textarea>
          </div>
          
          <div className="text-center">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto min-w-[200px]"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Gönderiliyor...
                </span>
              ) : (
                'Mesajı Gönder'
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}