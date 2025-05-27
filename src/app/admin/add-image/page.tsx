// app/admin/add-image/page.tsx
"use client";

import { useState } from "react";
import { storage, db } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Image from "next/image";
import Sidebar from "@/components/Sidebar"; // Sidebar'ı import etmeyi unutmayın

const AddImagePage = () => { // Bileşenin adını sayfa olduğunu belirtmek için değiştirdim
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [medium, setMedium] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setUploadStatus('idle');
      setProgress(0);
    }
  };

  const handleUpload = async () => {
    if (!image || !title || !year || !medium || !dimensions || !description || !category) {
      setUploadStatus('error');
      return;
    }

    setUploadStatus('uploading');
    setProgress(0);

    const imagePath = `paintings/${image.name}`;
    const storageRef = ref(storage, imagePath);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const currentProgress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(currentProgress);
      },
      (error) => {
        console.error("Yükleme hatası:", error);
        setUploadStatus('error');
        setTimeout(() => setUploadStatus('idle'), 3000);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          await addDoc(collection(db, "painting"), {
            title,
            year,
            medium,
            dimensions,
            description,
            category,
            imageUrl: downloadURL,
            createdAt: serverTimestamp(),
          });

          setUploadStatus('success');
          // Form sıfırlama
          setImage(null);
          setPreview(null);
          setTitle("");
          setYear("");
          setMedium("");
          setDimensions("");
          setDescription("");
          setCategory("");
          setProgress(0);
          setTimeout(() => setUploadStatus('idle'), 3000);
        } catch (error) {
          console.error("Firestore'a kayıt hatası:", error);
          setUploadStatus('error');
          setTimeout(() => setUploadStatus('idle'), 3000);
        }
      }
    );
  };

  return (
    <div className="flex min-h-screen"> {/* Sidebar'ın yanına yerleşmesi için ana div */}
      <Sidebar /> {/* Sidebar bileşeni burada */}

      <div className="flex-1 p-6 md:p-8 bg-gray-100"> {/* Ana içerik alanı */}
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Yeni Resim Ekle</h1>

        <div className="p-6 bg-white shadow-lg rounded-lg max-w-md mx-auto space-y-4"> {/* Mevcut içerik bu div içinde */}
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Resim Detayları</h2> {/* Başlığı güncelledim */}

          {/* Başarı Mesajı UI */}
          {uploadStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 flex items-start animate-fade-in-down">
              <div className="flex-shrink-0 mt-0.5">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">Resim ve bilgiler başarıyla yüklendi!</p>
              </div>
            </div>
          )}

          {/* Hata Mesajı UI */}
          {uploadStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-start animate-fade-in-down">
              <div className="flex-shrink-0 mt-0.5">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">Resim yüklenirken bir hata oluştu. Lütfen tüm alanları doldurduğunuzdan emin olun ve tekrar deneyin.</p>
              </div>
            </div>
          )}

          {/* Resim Yükleme Alanı ve Stil */}
          <label htmlFor="imageUpload" className="block text-sm font-medium text-gray-700 mb-1">Resim Seç</label>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          />

          {/* Önizleme Alanı */}
          {preview && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Resim Önizlemesi:</p>
              <div className="relative w-40 h-40 rounded-lg overflow-hidden border border-gray-300 shadow-sm">
                <Image src={preview} alt="Önizleme" layout="fill" objectFit="cover" className="rounded-lg" />
              </div>
            </div>
          )}

          {/* Giriş Alanları */}
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Resmin Adı</label>
          <input
            type="text"
            id="title"
            placeholder="Resmin Adı"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />

          <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1 mt-3">Yıl</label>
          <input
            type="text"
            id="year"
            placeholder="Yıl (örnek: 2023)"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />

          <label htmlFor="medium" className="block text-sm font-medium text-gray-700 mb-1 mt-3">Teknik</label>
          <input
            type="text"
            id="medium"
            placeholder="Teknik (örneğin: Yağlı boya)"
            value={medium}
            onChange={(e) => setMedium(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />

          <label htmlFor="dimensions" className="block text-sm font-medium text-gray-700 mb-1 mt-3">Boyut</label>
          <input
            type="text"
            id="dimensions"
            placeholder="Boyut (örneğin: 50x70 cm)"
            value={dimensions}
            onChange={(e) => setDimensions(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />

          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 mt-3">Ressamın Açıklaması</label>
          <textarea
            id="description"
            placeholder="Ressamın Açıklaması"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />

          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1 mt-3">Kategori</label>
          <input
            type="text"
            id="category"
            placeholder="Kategori (örneğin: Portre)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />

          {/* Yükle Butonu ve Yükleme Animasyonu */}
          <button
            onClick={handleUpload}
            disabled={uploadStatus === 'uploading'}
            className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {uploadStatus === 'uploading' ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Yükleniyor... ({Math.round(progress)}%)
              </span>
            ) : (
              'Resmi Yükle'
            )}
          </button>

          {/* Yüklenen Resim URL'si (Opsiyonel: Geliştirme için) */}
          {/* {imageUrl && (
            <p className="text-sm text-gray-500 break-words mt-4">Yüklenen URL: <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{imageUrl}</a></p>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default AddImagePage;