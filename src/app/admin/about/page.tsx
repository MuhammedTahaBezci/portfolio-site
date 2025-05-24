// app/admin/about/page.tsx
"use client"; // Client Component olarak işaretlemek önemli

import { useEffect, useState } from 'react';
import { getAboutData, updateAboutData } from '@/lib/about';
import { AboutData, EducationItem } from '@/types/about'; // Arayüzlerin doğru yoldan import edildiğinden emin olun
import Image from 'next/image';
import Sidebar from "@/components/Sidebar"; // Sidebar'ı import etmeyi unutmayın

export default function AdminAboutPage() {
  // useAuth gibi bir hook ile kullanıcı yetkilendirmesini kontrol edebilirsiniz.
  // const { user, loading: authLoading } = useAuth();
  // if (authLoading) return <p>Yükleniyor...</p>;
  // if (!user) return <p>Giriş yapmanız gerekiyor.</p>;

  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const data = await getAboutData();
      if (data) {
        setAboutData(data);
        setPreviewImage(data.artistPortrait); // Mevcut resmi önizlemeye ayarla
      } else {
        setError('Hakkımda verileri yüklenemedi.');
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAboutData(prevData => prevData ? { ...prevData, [name]: value } : null);
  };

  // Eğitim öğeleri için özel değişiklik işleyicisi
  const handleEducationChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (aboutData) {
      const newEducation = [...aboutData.education];
      newEducation[index] = { ...newEducation[index], [name]: value };
      setAboutData({ ...aboutData, education: newEducation });
    }
  };

  // Eğitim öğesi ekle
  const addEducationItem = () => {
    if (aboutData) {
      const newEducation = [...aboutData.education, {
        id: Date.now().toString(), // Basit bir ID
        startYear: '',
        endYear: '',
        degree: '',
        institution: '',
        order: aboutData.education.length + 1 // Sonraya ekle
      }];
      setAboutData({ ...aboutData, education: newEducation });
    }
  };

  // Eğitim öğesi sil
  const removeEducationItem = (id: string) => {
    if (aboutData) {
      const newEducation = aboutData.education.filter(item => item.id !== id);
      setAboutData({ ...aboutData, education: newEducation });
    }
  };

  // Beceriler için değişiklik işleyicisi (örneğin virgülle ayrılmış metin)
  const handleSkillsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    if (aboutData) {
      setAboutData({ ...aboutData, skills: value.split(',').map(s => s.trim()).filter(s => s !== '') });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file)); // Yeni resmi önizle
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aboutData) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    // contactButtonText'i göndermiyoruz, çünkü o sabit kalacak.
    const dataToSave: Partial<AboutData> = { ...aboutData };
    // contactButtonText: 'İletişime Geç' // Gerekirse sabit değeri burada belirtilebilir, ama update fonksiyonunda zaten ignore ediyoruz.

    const success = await updateAboutData(dataToSave, selectedImage || undefined);

    if (success) {
      setSuccess('Hakkımda bilgileri başarıyla güncellendi!');
      setSelectedImage(null); // Yüklenen resmi temizle
      // Verileri tekrar çekmek isterseniz:
      // const updatedData = await getAboutData();
      // if (updatedData) setAboutData(updatedData);
    } else {
      setError('Hakkımda bilgileri güncellenirken bir hata oluştu.');
    }
    setSaving(false);
    setTimeout(() => { setSuccess(null); setError(null); }, 3000); // Mesajları 3 saniye sonra gizle
  };

  if (loading) {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-6 md:p-8 flex items-center justify-center">
                <p className="text-gray-700">Yükleniyor...</p>
            </div>
        </div>
    );
  }

  if (error && !aboutData) {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-6 md:p-8 flex items-center justify-center">
                <p className="text-red-600">{error}</p>
            </div>
        </div>
    );
  }

  if (!aboutData) {
      return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-6 md:p-8 flex items-center justify-center">
                <p className="text-gray-700">Veri bulunamadı.</p>
            </div>
        </div>
      );
  }

  return (
    // En dıştaki div: Flexbox kullanarak Sidebar ve içeriği yan yana dizer
    // min-h-screen: Sayfanın en az ekran yüksekliği kadar olmasını sağlar
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar bileşeni */}
      <Sidebar />

      {/* Ana içerik alanı */}
      {/* flex-1: Kalan tüm boş alanı kaplamasını sağlar */}
      {/* p-6 md:p-8: Responsive padding ayarları */}
      <div className="flex-1 p-6 md:p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Hakkımda Bilgilerini Yönet</h1>

        <div className="max-w-4xl mx-auto"> {/* İçerik formu için max-width ve margin-auto */}
          {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">{success}</div>}
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
            {/* Başlık */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Sayfa Başlığı</label>
              <input
                type="text"
                id="title"
                name="title"
                value={aboutData.title}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            {/* Açıklama */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Sayfa Açıklaması</label>
              <textarea
                id="description"
                name="description"
                value={aboutData.description}
                onChange={handleChange}
                rows={2}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-yellow-500 focus:border-yellow-500"
              ></textarea>
            </div>

            {/* Sanatçı Adı */}
            <div>
              <label htmlFor="artistName" className="block text-sm font-medium text-gray-700 mb-1">Sanatçı Adı</label>
              <input
                type="text"
                id="artistName"
                name="artistName"
                value={aboutData.artistName}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            {/* Sanatçı Portresi Yükleme */}
            <div>
              <label htmlFor="artistPortrait" className="block text-sm font-medium text-gray-700 mb-1">Sanatçı Portresi</label>
              <input
                type="file"
                id="artistPortrait"
                name="artistPortrait"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
              />
              {previewImage && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Mevcut / Yeni Önizleme:</p>
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border border-gray-300">
                    <Image
                      src={previewImage}
                      alt="Profil Önizleme"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Biyografi */}
            <div>
              <label htmlFor="biography" className="block text-sm font-medium text-gray-700 mb-1">Biyografi</label>
              <textarea
                id="biography"
                name="biography"
                value={aboutData.biography}
                onChange={handleChange}
                rows={5}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-yellow-500 focus:border-yellow-500"
              ></textarea>
            </div>

            {/* Sanatsal Yolculuk */}
            <div>
              <label htmlFor="artisticJourney" className="block text-sm font-medium text-gray-700 mb-1">Sanatsal Yolculuk</label>
              <textarea
                id="artisticJourney"
                name="artisticJourney"
                value={aboutData.artisticJourney}
                onChange={handleChange}
                rows={5}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-yellow-500 focus:border-yellow-500"
              ></textarea>
            </div>

            {/* Sanat Felsefesi */}
            <div>
              <label htmlFor="artPhilosophy" className="block text-sm font-medium text-gray-700 mb-1">Sanat Felsefesi</label>
              <textarea
                id="artPhilosophy"
                name="artPhilosophy"
                value={aboutData.artPhilosophy}
                onChange={handleChange}
                rows={5}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-yellow-500 focus:border-yellow-500"
              ></textarea>
            </div>

            {/* Eğitim Bilgileri */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Eğitim Bilgileri</h3>
              {aboutData.education.map((edu, index) => (
                <div key={edu.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-md mb-3">
                  <input
                    type="text"
                    name="startYear"
                    placeholder="Başlangıç Yılı"
                    value={edu.startYear}
                    onChange={(e) => handleEducationChange(index, e)}
                    className="col-span-1 mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-yellow-500 focus:border-yellow-500"
                  />
                  <input
                    type="text"
                    name="endYear"
                    placeholder="Bitiş Yılı"
                    value={edu.endYear}
                    onChange={(e) => handleEducationChange(index, e)}
                    className="col-span-1 mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-yellow-500 focus:border-yellow-500"
                  />
                  <input
                    type="text"
                    name="degree"
                    placeholder="Derece"
                    value={edu.degree}
                    onChange={(e) => handleEducationChange(index, e)}
                    className="col-span-2 mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-yellow-500 focus:border-yellow-500"
                  />
                  <input
                    type="text"
                    name="institution"
                    placeholder="Kurum"
                    value={edu.institution}
                    onChange={(e) => handleEducationChange(index, e)}
                    className="col-span-3 mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-yellow-500 focus:border-yellow-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeEducationItem(edu.id)}
                    className="col-span-1 md:col-span-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md self-end"
                  >
                    Sil
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addEducationItem}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md mt-2"
              >
                Eğitim Ekle
              </button>
            </div>

            {/* Beceriler */}
            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">Beceriler (Virgülle Ayırın)</label>
              <textarea
                id="skills"
                name="skills"
                value={aboutData.skills.join(', ')} // Diziyi metne çevir
                onChange={handleSkillsChange}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-yellow-500 focus:border-yellow-500"
              ></textarea>
            </div>

            {/* İletişim Mesajı */}
            <div>
              <label htmlFor="contactMessage" className="block text-sm font-medium text-gray-700 mb-1">İletişim Mesajı</label>
              <textarea
                id="contactMessage"
                name="contactMessage"
                value={aboutData.contactMessage}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-yellow-500 focus:border-yellow-500"
              ></textarea>
            </div>

            {/* İletişime Geç Buton Metni (Değiştirilemez) */}
            <div>
              <label htmlFor="contactButtonText" className="block text-sm font-medium text-gray-700 mb-1">İletişime Geç Buton Metni</label>
              <input
                type="text"
                id="contactButtonText"
                name="contactButtonText"
                value={aboutData.contactButtonText}
                disabled // Değiştirilemez hale getir
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 cursor-not-allowed"
              />
              <p className="mt-1 text-sm text-gray-500">Bu alan sabit kalacaktır.</p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 px-4 rounded-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}