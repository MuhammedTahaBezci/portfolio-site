"use client";

import { useState, useEffect, ChangeEvent } from "react";
import Image from "next/image";
import {
  collection,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import Sidebar from "@/components/Sidebar";
import { saveExhibitionData, deleteExhibition, removeGalleryImage, updateExhibitionImages, revalidateExhibitions } from "@/app/admin/exhibitions/action";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "@/lib/firebase";
import { v4 as uuidv4 } from "uuid";

interface ExhibitionData {
  id?: string;
  title: string;
  startDate: Date | Timestamp;
  endDate: Date | Timestamp;
  location: string;
  description: string;
  imageUrl?: string;
  images?: string[];
  galleryName?: string;
  galleryUrl?: string;
}

function formatDateInput(date: Date | Timestamp | null | undefined): string {
  try {
    if (!date) return "";
    const d = date instanceof Timestamp ? date.toDate() : date as Date;
    return d.toISOString().split("T")[0];
  } catch (error) {
    console.error("Tarih formatlama hatası:", error);
    return "";
  }
}

// File'ı Firebase Storage'e yükleyen helper functions
const uploadCoverImage = async (docId: string, file: File): Promise<string | null> => {
  try {
    const imageRef = ref(storage, `exhibition_covers/${docId}/${uuidv4()}-${file.name}`);
    const snapshot = await uploadBytes(imageRef, file);
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.error("Kapak resmi yüklenirken hata:", error);
    return null;
  }
};

const uploadGalleryImages = async (docId: string, files: FileList): Promise<string[]> => {
  const urls: string[] = [];

  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageRef = ref(storage, `exhibition_galleries/${docId}/${uuidv4()}-${file.name}`);
      const snapshot = await uploadBytes(imageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      urls.push(url);
    }
  } catch (error) {
    console.error("Galeri resimleri yüklenirken hata:", error);
  }

  return urls;
};

export default function AdminExhibitionsPage() {
  const [exhibitions, setExhibitions] = useState<ExhibitionData[]>([]);
  const [selected, setSelected] = useState<ExhibitionData | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExhibitions();
  }, []);

  const fetchExhibitions = async () => {
    try {
      const snapshot = await getDocs(collection(db, "exhibitions"));
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ExhibitionData[];
      setExhibitions(items);
    } catch (error) {
      console.error("Sergiler yüklenirken hata:", error);
      alert("Sergiler yüklenirken hata oluştu.");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === "startDate" || name === "endDate") {
      setSelected(prev => prev ? { ...prev, [name]: new Date(value) } : null);
    } else {
      setSelected(prev => prev ? { ...prev, [name]: value } : null);
    }
  };

  const handleSave = async () => {
    if (!selected?.title?.trim()) {
      alert("Sergi adı zorunludur.");
      return;
    }

    if (!selected?.startDate || !selected?.endDate) {
      alert("Başlangıç ve bitiş tarihleri zorunludur.");
      return;
    }

    setLoading(true);

    try {
      // İlk olarak temel exhibition verilerini kaydet
      const exhibitionData = {
        id: selected.id,
        title: selected.title,
        startDate: (selected.startDate instanceof Timestamp 
          ? selected.startDate.toDate() 
          : new Date(selected.startDate)
        ).toISOString(),
        endDate: (selected.endDate instanceof Timestamp 
          ? selected.endDate.toDate() 
          : new Date(selected.endDate)
        ).toISOString(),
        location: selected.location || "",
        description: selected.description || "",
        galleryName: selected.galleryName || "",
        galleryUrl: selected.galleryUrl || "",
      };

      // Server Action ile temel veriyi kaydet
      const result = await saveExhibitionData(exhibitionData);

      if (!result.success) {
        alert(result.message);
        return;
      }

      const docId = result.docId || selected.id!;

      // Resimleri client-side upload et
      let coverImageUrl: string | undefined;
      let newGalleryUrls: string[] = [];

      if (coverImage) {
        const uploadedCover = await uploadCoverImage(docId, coverImage);
        coverImageUrl = uploadedCover === null ? undefined : uploadedCover;
      }

      if (galleryImages && galleryImages.length > 0) {
        newGalleryUrls = await uploadGalleryImages(docId, galleryImages);
      }

      // Eğer resim varsa, resimleri güncelle
      if (coverImageUrl || newGalleryUrls.length > 0) {
        const existingImages = selected.images || [];
        const allImages = newGalleryUrls.length > 0 
          ? [...existingImages, ...newGalleryUrls] 
          : existingImages;

        await updateExhibitionImages(
          docId, 
          coverImageUrl, 
          newGalleryUrls.length > 0 ? allImages : undefined
        );
      }

      // Son olarak cache'i invalidate et
      await revalidateExhibitions();

      alert(result.message);
      await fetchExhibitions();
      handleReset();

    } catch (error) {
      console.error("Sergi kaydedilirken hata:", error);
      alert("Sergi kaydedilirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (exhibitionId: string) => {
    if (!confirm("Bu sergiyi silmek istediğinizden emin misiniz?")) return;

    try {
      const result = await deleteExhibition(exhibitionId);
      
      if (result.success) {
        alert(result.message);
        await fetchExhibitions();
        if (selected?.id === exhibitionId) {
          handleReset();
        }
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Sergi silinirken hata:", error);
      alert("Sergi silinirken hata oluştu.");
    }
  };

  const handleRemoveGalleryImage = async (imageUrl: string) => {
    if (!selected?.id || !selected?.images) return;

    try {
      const remainingImages = selected.images.filter(img => img !== imageUrl);
      const result = await removeGalleryImage(selected.id, imageUrl, remainingImages);
      
      if (result.success) {
        setSelected({ ...selected, images: remainingImages });
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Resim kaldırılırken hata:", error);
      alert("Resim kaldırılırken hata oluştu.");
    }
  };

  const handleReset = () => {
    setSelected(null);
    setCoverImage(null);
    setGalleryImages(null);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Sergi Yönetimi</h1>
          <button
            onClick={() => setSelected({
              title: "",
              startDate: new Date(),
              endDate: new Date(),
              location: "",
              description: "",
              galleryName: "",
              galleryUrl: ""
            })}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            + Yeni Sergi
          </button>
        </div>

        {/* Sergi Listesi */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {exhibitions.map((exh) => (
            <div
              key={exh.id}
              className={`cursor-pointer border rounded-lg p-3 transition-all ${
                selected?.id === exh.id 
                  ? "ring-2 ring-blue-500 bg-blue-50" 
                  : "hover:shadow-md"
              }`}
            >
              <div onClick={() => setSelected(exh)}>
                {exh.imageUrl ? (
                  <div className="relative h-32 w-full mb-2">
                    <Image
                      src={exh.imageUrl}
                      alt={exh.title}
                      layout="fill"
                      objectFit="cover"
                      className="rounded"
                    />
                  </div>
                ) : (
                  <div className="h-32 w-full bg-gray-200 rounded mb-2 flex items-center justify-center text-gray-500">
                    Resim Yok
                  </div>
                )}
                <h3 className="font-semibold text-sm mb-1 truncate">{exh.title}</h3>
                <p className="text-xs text-gray-600">{exh.location}</p>
              </div>
              
              <button
                onClick={() => handleDelete(exh.id!)}
                className="mt-2 w-full text-xs bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 transition-colors"
              >
                Sil
              </button>
            </div>
          ))}
        </div>

        {/* Sergi Formu */}
        {selected && (
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {selected.id ? "Sergi Düzenle" : "Yeni Sergi"}
              </h2>
              <button
                onClick={handleReset}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Sergi Adı *</label>
                  <input
                    name="title"
                    value={selected.title || ""}
                    onChange={handleChange}
                    placeholder="Sergi Adı"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Başlangıç Tarihi *</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formatDateInput(selected.startDate)}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Bitiş Tarihi *</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formatDateInput(selected.endDate)}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Konum</label>
                  <input
                    name="location"
                    value={selected.location || ""}
                    onChange={handleChange}
                    placeholder="Şehir, Galeri Adı"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Galeri Adı</label>
                  <input
                    name="galleryName"
                    value={selected.galleryName || ""}
                    onChange={handleChange}
                    placeholder="Galeri Adı"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Galeri Web Sitesi</label>
                  <input
                    name="galleryUrl"
                    value={selected.galleryUrl || ""}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Açıklama</label>
                  <textarea
                    name="description"
                    value={selected.description || ""}
                    onChange={handleChange}
                    placeholder="Sergi hakkında detaylar..."
                    rows={4}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Kapak Resmi</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Galeri Fotoğrafları</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setGalleryImages(e.target.files)}
                    className="w-full"
                  />
                </div>

                {/* Galeri görselleri listeleme ve silme */}
                {selected.images && selected.images.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Yüklenmiş Galeri Fotoğrafları</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
                      {selected.images.map((url, index) => (
                        <div key={index} className="relative">
                          <Image 
                            src={url} 
                            alt={`Galeri Resim ${index + 1}`} 
                            width={200} 
                            height={150} 
                            className="rounded object-cover" 
                          />
                          <button
                            onClick={() => handleRemoveGalleryImage(url)}
                            className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 rounded"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                onClick={handleSave}
                disabled={loading}
                className={`flex-1 py-2 px-4 rounded text-white transition-colors ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "Kaydediliyor..." : (selected.id ? "Güncelle" : "Kaydet")}
              </button>
              
              <button
                onClick={handleReset}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}