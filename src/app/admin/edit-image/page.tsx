"use client";

import { useEffect, useState } from "react";
import { storage, db } from "@/lib/firebase";
import {
  ref,
  listAll,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { Painting } from "@/types/painting";
import Sidebar from "@/components/Sidebar";

type PaintingWithId = Painting & { id: string };

export default function EditImagePage() {
  const [paintings, setPaintings] = useState<PaintingWithId[]>([]);
  const [selected, setSelected] = useState<PaintingWithId | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Firestore verilerini çek
  useEffect(() => {
    const fetchPaintings = async () => {
      const snapshot = await getDocs(collection(db, "painting"));
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PaintingWithId[];
      setPaintings(items);
      setLoading(false);
    };

    fetchPaintings();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!selected) return;
    const { name, value } = e.target;
    setSelected({ ...selected, [name]: value });
  };

  const handleUpdate = async () => {
    if (!selected) return;

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
      alert("Bilgiler güncellendi!");
    } catch (error) {
      console.error("Güncelleme hatası:", error);
      alert("Bir hata oluştu.");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
    }
  };

  const handleUpdateImage = async () => {
    if (!selected || !newImage) return;

    try {
      // Eski resmi sil
      const oldRef = ref(storage, selected.imageUrl);
      await deleteObject(oldRef);

      // Yeni resmi yükle
      const newRef = ref(storage, `images/${newImage.name}`);
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
        },
        async () => {
          const downloadURL = await getDownloadURL(newRef);
          const refDoc = doc(db, "painting", selected.id);
          await updateDoc(refDoc, { imageUrl: downloadURL });

          // Local state güncelle
          setSelected({ ...selected, imageUrl: downloadURL });
          setNewImage(null);
          setUploadProgress(0);
          alert("Resim güncellendi!");
        }
      );
    } catch (error) {
      console.error("Resim güncelleme hatası:", error);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Resimleri Düzenle</h1>

        {loading ? (
          <p>Yükleniyor...</p>
        ) : (
          <div className="flex flex-wrap gap-4">
            {paintings.map((painting) => (
              <div
                key={painting.id}
                onClick={() => setSelected(painting)}
                className={`border rounded-lg p-2 cursor-pointer w-32 h-32 overflow-hidden ${
                  selected?.id === painting.id ? "ring-2 ring-blue-500" : ""
                }`}
              >
                <img
                  src={painting.imageUrl}
                  alt={painting.title}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        )}

        {selected && (
          <div className="mt-6 p-6 border rounded-lg bg-white shadow-md space-y-4 max-w-xl">
            <h2 className="text-xl font-semibold">Resmi Düzenle</h2>

            <input
              type="text"
              name="title"
              value={selected.title}
              onChange={handleChange}
              placeholder="Resmin Adı"
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="year"
              value={selected.year}
              onChange={handleChange}
              placeholder="Yıl"
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="medium"
              value={selected.medium}
              onChange={handleChange}
              placeholder="Teknik"
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="dimensions"
              value={selected.dimensions}
              onChange={handleChange}
              placeholder="Boyut"
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="category"
              value={selected.category}
              onChange={handleChange}
              placeholder="Kategori"
              className="w-full p-2 border rounded"
            />
            <textarea
              name="description"
              value={selected.description}
              onChange={handleChange}
              placeholder="Açıklama"
              className="w-full p-2 border rounded"
            />

            <div className="mb-4">
              <label className="block mb-2 font-medium">Yeni Resim:</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {uploadProgress > 0 && (
                <div className="mt-2 text-sm text-gray-700">
                  Yükleniyor: %{Math.round(uploadProgress)}
                </div>
              )}
              <button
                onClick={handleUpdateImage}
                className="mt-2 w-full py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Resmi Güncelle
              </button>
            </div>

            <button
              onClick={handleUpdate}
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Bilgileri Güncelle
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
