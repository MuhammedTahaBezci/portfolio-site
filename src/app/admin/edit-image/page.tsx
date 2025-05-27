// app/admin/edit-image/page.tsx
"use client";

import { useEffect, useState } from "react";
import { storage, db } from "@/lib/firebase";
import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { Painting } from "@/types/painting";
import Image from "next/image"; // Next.js Image bileşeni için import
import Sidebar from "@/components/Sidebar"; // Sidebar'ı import etmeyi unutmayın

type PaintingWithId = Painting & { id: string };

export default function EditImagePage() {
  const [paintings, setPaintings] = useState<PaintingWithId[]>([]);
  const [selected, setSelected] = useState<PaintingWithId | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [savingInfo, setSavingInfo] = useState(false);
  const [savingImage, setSavingImage] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Firestore verilerini çek
  useEffect(() => {
    const fetchPaintings = async () => {
      setLoading(true);
      setErrorMessage(null); // Yeni yüklemede hata mesajını sıfırla
      try {
        const snapshot = await getDocs(collection(db, "painting"));
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as PaintingWithId[];
        setPaintings(items);
        if (items.length > 0) {
          setSelected(items[0]); // İlk resmi varsayılan olarak seç
        }
      } catch (error) {
        console.error("Resimler yüklenirken hata oluştu:", error);
        setErrorMessage("Resimler yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchPaintings();
  }, []);

  // Seçilen resim değiştiğinde önizlemeyi sıfırla ve yükleme durumlarını temizle
  useEffect(() => {
    setNewImage(null);
    setNewImagePreview(null);
    setUploadProgress(0);
    setSuccessMessage(null); // Seçim değişince mesajları sıfırla
    setErrorMessage(null);   // Seçim değişince mesajları sıfırla
  }, [selected]);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!selected) return;
    const { name, value } = e.target;
    setSelected({ ...selected, [name]: value });
  };

  const handleUpdate = async () => {
    if (!selected) return;

    setSavingInfo(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const refDoc = doc(db, "painting", selected.id);
      await updateDoc(refDoc, {
        title: selected.title,
        year: selected.year,
        medium: selected.medium,
        dimensions: selected.dimensions,
        category: selected.category,
        description: selected.description,
      });
      setSuccessMessage("Resim bilgileri başarıyla güncellendi!");
    } catch (error) {
      console.error("Bilgi güncelleme hatası:", error);
      setErrorMessage("Bilgiler güncellenirken bir hata oluştu.");
    } finally {
      setSavingInfo(false);
      setTimeout(() => { setSuccessMessage(null); setErrorMessage(null); }, 3000);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
      setNewImagePreview(URL.createObjectURL(file)); // Yeni resmi önizle
      setUploadProgress(0); // Yeni resim seçildiğinde ilerlemeyi sıfırla
    }
  };

  const handleUpdateImage = async () => {
    if (!selected || !newImage) {
      setErrorMessage("Güncellenecek bir resim seçili değil veya yeni resim seçmediniz.");
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    setSavingImage(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      // Yeni resmi yükle
      const newRef = ref(storage, `paintings/${newImage.name}`); // `paintings` klasörüne yüklüyoruz
      const uploadTask = uploadBytesResumable(newRef, newImage);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Yükleme hatası:", error);
          setErrorMessage("Yeni resim yüklenirken bir hata oluştu.");
          setSavingImage(false);
          setTimeout(() => setErrorMessage(null), 3000);
        },
        async () => {
          const downloadURL = await getDownloadURL(newRef);
          const refDoc = doc(db, "painting", selected.id);
          await updateDoc(refDoc, { imageUrl: downloadURL });

          // Local state güncelle
          setPaintings(prev => prev.map(p => p.id === selected.id ? { ...p, imageUrl: downloadURL } : p));
          setSelected(prev => prev ? { ...prev, imageUrl: downloadURL } : null);
          
          setNewImage(null);
          setNewImagePreview(null);
          setUploadProgress(0);
          setSuccessMessage("Resim başarıyla güncellendi!");
          setSavingImage(false);
          setTimeout(() => setSuccessMessage(null), 3000);
        }
      );
    } catch (error) {
      console.error("Resim güncelleme hatası:", error);
      setErrorMessage("Resim güncellenirken bir hata oluştu.");
      setSavingImage(false);
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  return (
    <div className="flex min-h-screen"> {/* Sidebar'ın yanına yerleşmesi için ana div */}
      <Sidebar /> {/* Sidebar bileşeni burada */}

      <div className="flex-1 p-6 md:p-8 bg-gray-100"> {/* Ana içerik alanı */}
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Resimleri Düzenle</h1>

        {/* Başarı Mesajı UI */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 flex items-start animate-fade-in-down">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{successMessage}</p>
            </div>
          </div>
        )}
        {/* Hata Mesajı UI */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-start animate-fade-in-down">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{errorMessage}</p>
            </div>
          </div>
        )}

        {loading ? (
          <p className="text-gray-700">Resimler yükleniyor...</p>
        ) : (
          <div className="mb-8 p-4 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">Mevcut Resimler</h2>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              {paintings.length === 0 ? (
                <p className="text-gray-600">Henüz hiç resim eklenmemiş.</p>
              ) : (
                paintings.map((painting) => (
                  <div
                    key={painting.id}
                    onClick={() => setSelected(painting)}
                    className={`relative border-2 rounded-lg p-1 cursor-pointer w-28 h-28 sm:w-32 sm:h-32 overflow-hidden transition-all duration-200 ${
                      selected?.id === painting.id ? "ring-2 ring-blue-500 border-blue-500 shadow-md" : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <Image
                      src={painting.imageUrl}
                      alt={painting.title}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                      <span className="text-white text-xs font-semibold text-center p-1">{painting.title}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {selected && (
          <div className="mt-6 p-6 border rounded-lg bg-white shadow-md space-y-4 max-w-xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-800">Seçili Resmi Düzenle</h2>

            {/* Mevcut Resim Önizlemesi */}
            <div className="flex justify-center mb-4">
                <div className="relative w-48 h-48 rounded-lg overflow-hidden border border-gray-300 shadow-sm">
                    <Image
                        src={selected.imageUrl}
                        alt={selected.title}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                    />
                </div>
            </div>

            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Resmin Adı</label>
            <input
              type="text"
              id="title"
              name="title"
              value={selected.title}
              onChange={handleChange}
              placeholder="Resmin Adı"
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1 mt-3">Yıl</label>
            <input
              type="text"
              id="year"
              name="year"
              value={selected.year}
              onChange={handleChange}
              placeholder="Yıl"
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />

            <label htmlFor="medium" className="block text-sm font-medium text-gray-700 mb-1 mt-3">Teknik</label>
            <input
              type="text"
              id="medium"
              name="medium"
              value={selected.medium}
              onChange={handleChange}
              placeholder="Teknik"
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />

            <label htmlFor="dimensions" className="block text-sm font-medium text-gray-700 mb-1 mt-3">Boyut</label>
            <input
              type="text"
              id="dimensions"
              name="dimensions"
              value={selected.dimensions}
              onChange={handleChange}
              placeholder="Boyut"
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />

            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1 mt-3">Kategori</label>
            <input
              type="text"
              id="category"
              name="category"
              value={selected.category}
              onChange={handleChange}
              placeholder="Kategori"
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />

            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 mt-3">Açıklama</label>
            <textarea
              id="description"
              name="description"
              value={selected.description}
              onChange={handleChange}
              placeholder="Açıklama"
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />

            <button
              onClick={handleUpdate}
              disabled={savingInfo}
              className="w-full py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-6"
            >
              {savingInfo ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Bilgiler Kaydediliyor...
                </span>
              ) : (
                'Bilgileri Güncelle'
              )}
            </button>

            <hr className="my-6 border-gray-200" />

            {/* Resim Güncelleme Kısmı */}
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Resmi Değiştir</h3>
            <label htmlFor="newImage" className="block text-sm font-medium text-gray-700 mb-1">Yeni Resim Seç</label>
            <input
              type="file"
              id="newImage"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
            />
            
            {newImagePreview && (
                <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Yeni Resim Önizlemesi:</p>
                    <div className="relative w-40 h-40 rounded-lg overflow-hidden border border-gray-300 shadow-sm">
                        <Image src={newImagePreview} alt="Yeni Resim Önizleme" layout="fill" objectFit="cover" className="rounded-lg" />
                    </div>
                </div>
            )}

            <button
              onClick={handleUpdateImage}
              disabled={!newImage || savingImage}
              className="w-full py-3 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-4"
            >
              {savingImage ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Resim Yükleniyor... ({Math.round(uploadProgress)}%)
                </span>
              ) : (
                'Resmi Güncelle'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}