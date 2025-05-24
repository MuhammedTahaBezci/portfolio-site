// app/admin/messages/page.tsx - Admin mesaj yönetimi
'use client';

import { useEffect, useState } from 'react';
import { 
  getContactMessages, 
  markMessageAsRead, 
  archiveMessage, 
  deleteMessage,
  getUnreadMessageCount 
} from '@/lib/contact';
import { ContactMessage } from '@/types/contact';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    fetchMessages();
    fetchUnreadCount();
  }, [showArchived]);

  const fetchMessages = async () => {
    setLoading(true);
    const fetchedMessages = await getContactMessages(showArchived);
    setMessages(fetchedMessages);
    setLoading(false);
  };

  const fetchUnreadCount = async () => {
    const count = await getUnreadMessageCount();
    setUnreadCount(count);
  };

  const handleMarkAsRead = async (messageId: string) => {
    const success = await markMessageAsRead(messageId);
    if (success) {
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, isRead: true } : msg
      ));
      fetchUnreadCount();
    }
  };

  const handleArchive = async (messageId: string) => {
    const success = await archiveMessage(messageId);
    if (success) {
      fetchMessages();
      fetchUnreadCount();
      setSelectedMessage(null);
    }
  };

  const handleDelete = async (messageId: string) => {
    if (confirm('Bu mesajı kalıcı olarak silmek istediğinizden emin misiniz?')) {
      const success = await deleteMessage(messageId);
      if (success) {
        fetchMessages();
        fetchUnreadCount();
        setSelectedMessage(null);
      }
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">Mesajlar yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">İletişim Mesajları</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {unreadCount} okunmamış mesaj
            </p>
          )}
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowArchived(!showArchived)}
            className={`px-4 py-2 rounded-lg transition ${
              showArchived 
                ? 'bg-gray-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {showArchived ? 'Aktif Mesajlar' : 'Arşivlenmiş Mesajlar'}
          </button>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {showArchived ? 'Arşivlenmiş mesaj bulunmuyor.' : 'Henüz mesaj bulunmuyor.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mesaj Listesi */}
          <div className="lg:col-span-1 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                onClick={() => {
                  setSelectedMessage(message);
                  if (!message.isRead) {
                    handleMarkAsRead(message.id);
                  }
                }}
                className={`p-4 border rounded-lg cursor-pointer transition hover:shadow-md ${
                  selectedMessage?.id === message.id
                    ? 'border-yellow-500 bg-yellow-50'
                    : message.isRead
                    ? 'border-gray-200 bg-white'
                    : 'border-blue-200 bg-blue-50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900 truncate">
                    {message.name}
                  </h3>
                  {!message.isRead && (
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {message.subject || 'Konu belirtilmemiş'}
                </p>
                <p className="text-sm text-gray-500 truncate mb-2">
                  {message.message}
                </p>
                <p className="text-xs text-gray-400">
                  {formatDate(message.createdAt)}
                </p>
              </div>
            ))}
          </div>

          {/* Mesaj Detayları */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="bg-white border rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedMessage.name}
                    </h2>
                    <p className="text-gray-600">{selectedMessage.email}</p>
                    {selectedMessage.subject && (
                      <p className="text-sm text-gray-500 mt-1">
                        Konu: {selectedMessage.subject}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleArchive(selectedMessage.id)}
                      className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                    >
                      Arşivle
                    </button>
                    <button
                      onClick={() => handleDelete(selectedMessage.id)}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Sil
                    </button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-500">
                    {formatDate(selectedMessage.createdAt)}
                  </p>
                </div>
                
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-800">
                    {selectedMessage.message}
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'İletişim Mesajınız'}`}
                    className="inline-block px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
                  >
                    E-posta ile Yanıtla
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <p className="text-gray-500">
                  Detaylarını görmek için bir mesaj seçin
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
