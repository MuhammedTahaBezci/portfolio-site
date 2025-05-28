// app/admin/about/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { getAboutData } from '@/lib/about';
import { updateAboutDataAction } from './actions'; // Server Action'ı import et
import { AboutData } from '@/types/about';
import Image from 'next/image';
import Sidebar from "@/components/Sidebar";

export default function AdminAboutPage() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  // Beceriler için ayrı bir state - ham metin olarak
  const [skillsText, setSkillsText] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const data = await getAboutData();
      if (data) {
        setAboutData(data);
        setPreviewImage(data.artistPortrait);
        // Becerileri metin olarak ayarla
        setSkillsText(data.skills.join(', '));
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

  const handleEducationChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (aboutData) {
      const newEducation = [...aboutData.education];
      newEducation[index] = { ...newEducation[index], [name]: value };
      setAboutData({ ...aboutData, education: newEducation });
    }
  };

  const addEducationItem = () => {
    if (aboutData) {
      const newEducation = [...aboutData.education, {
        id: Date.now().toString(),
        startYear: '',
        endYear: '',
        degree: '',
        institution: '',
        order: aboutData.education.length + 1
      }];
      setAboutData({ ...aboutData, education: newEducation });
    }
  };

  const removeEducationItem = (id: string) => {
    if (aboutData) {
      const newEducation = aboutData.education.filter(item => item.id !== id);
      setAboutData({ ...aboutData, education: newEducation });
    }
  };

  // Beceriler için güncellenmiş fonksiyon - sadece metin state'ini günceller
  const handleSkillsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setSkillsText(value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Form Action kullanarak Server Action'ı çağır
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aboutData) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // FormData oluştur
      const formData = new FormData();
      
      // Becerileri işle - metinden diziye çevir
      const processedSkills = skillsText
        .split(',')
        .map(s => s.trim())
        .filter(s => s !== '');
      
      // Tüm verileri FormData'ya ekle
      formData.append('title', aboutData.title);
      formData.append('description', aboutData.description);
      formData.append('artistName', aboutData.artistName);
      formData.append('biography', aboutData.biography);
      formData.append('artisticJourney', aboutData.artisticJourney);
      formData.append('artPhilosophy', aboutData.artPhilosophy);
      formData.append('contactMessage', aboutData.contactMessage);
      formData.append('skills', JSON.stringify(processedSkills));
      formData.append('education', JSON.stringify(aboutData.education));
      
      // Resim dosyasını ekle
      if (selectedImage) {
        formData.append('artistPortrait', selectedImage);
      }
      
      // Server Action'ı çağır
      const result = await updateAboutDataAction(formData);
      
      if (result.success) {
        setSuccess(result.message);
        setSelectedImage(null);
        
        // Verileri yeniden yükle
        const updatedData = await getAboutData();
        if (updatedData) {
          setAboutData(updatedData);
          setPreviewImage(updatedData.artistPortrait);
          setSkillsText(updatedData.skills.join(', '));
        }
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setError('Beklenmeyen bir hata oluştu.');
    }

    setSaving(false);
    setTimeout(() => { setSuccess(null); setError(null); }, 3000);
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
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 md:p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Hakkımda Bilgilerini Yönet</h1>

        <div className="max-w-4xl mx-auto">
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
              {success}
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
            {/* Başlık */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Sayfa Başlığı
              </label>
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
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Sayfa Açıklaması
              </label>
              <textarea
                id="description"
                name="description"
                value={aboutData.description}
                onChange={handleChange}
                rows={2}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            {/* Sanatçı Adı */}
            <div>
              <label htmlFor="artistName" className="block text-sm font-medium text-gray-700 mb-1">
                Sanatçı Adı
              </label>
              <input
                type="text"
                id="artistName"
                name="artistName"
                value={aboutData.artistName}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            {/* Sanatçı Portresi */}
            <div>
              <label htmlFor="artistPortrait" className="block text-sm font-medium text-gray-700 mb-1">
                Sanatçı Portresi
              </label>
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
              <label htmlFor="biography" className="block text-sm font-medium text-gray-700 mb-1">
                Biyografi
              </label>
              <textarea
                id="biography"
                name="biography"
                value={aboutData.biography}
                onChange={handleChange}
                rows={5}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            {/* Sanatsal Yolculuk */}
            <div>
              <label htmlFor="artisticJourney" className="block text-sm font-medium text-gray-700 mb-1">
                Sanatsal Yolculuk
              </label>
              <textarea
                id="artisticJourney"
                name="artisticJourney"
                value={aboutData.artisticJourney}
                onChange={handleChange}
                rows={5}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            {/* Sanat Felsefesi */}
            <div>
              <label htmlFor="artPhilosophy" className="block text-sm font-medium text-gray-700 mb-1">
                Sanat Felsefesi
              </label>
              <textarea
                id="artPhilosophy"
                name="artPhilosophy"
                value={aboutData.artPhilosophy}
                onChange={handleChange}
                rows={5}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-yellow-500 focus:border-yellow-500"
              />
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

            {/* Beceriler - Güncellenmiş */}
            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                Beceriler (Virgülle Ayırın)
              </label>
              <textarea
                id="skills"
                name="skills"
                value={skillsText}
                onChange={handleSkillsChange}
                rows={3}
                placeholder="React, JavaScript, TypeScript, Node.js, Python"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-yellow-500 focus:border-yellow-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Her beceriyi virgülle ayırarak yazın. Örnek: React, JavaScript, TypeScript
              </p>
              {/* Önizleme */}
              {skillsText && (
                <div className="mt-2 p-2 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-600 font-medium mb-1">Önizleme:</p>
                  <div className="flex flex-wrap gap-2">
                    {skillsText.split(',').map((skill, index) => (
                      skill.trim() && (
                        <span 
                          key={index} 
                          className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs"
                        >
                          {skill.trim()}
                        </span>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* İletişim Mesajı */}
            <div>
              <label htmlFor="contactMessage" className="block text-sm font-medium text-gray-700 mb-1">
                İletişim Mesajı
              </label>
              <textarea
                id="contactMessage"
                name="contactMessage"
                value={aboutData.contactMessage}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            {/* İletişime Geç Buton Metni */}
            <div>
              <label htmlFor="contactButtonText" className="block text-sm font-medium text-gray-700 mb-1">
                İletişime Geç Buton Metni
              </label>
              <input
                type="text"
                id="contactButtonText"
                name="contactButtonText"
                value={aboutData.contactButtonText}
                disabled
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