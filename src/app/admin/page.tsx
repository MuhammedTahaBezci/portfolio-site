"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Painting } from "@/types/painting";
import Sidebar from "@/components/Sidebar";

export default function EditImagePage() {
  const [paintings, setPaintings] = useState<PaintingWithId[]>([]);
  const [selected, setSelected] = useState<PaintingWithId | null>(null);
  const [loading, setLoading] = useState(true);

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

  const handleUpdate = async () => {
    if (!selected) return;

    try {
      const ref = doc(db, "painting", selected.id);
      await updateDoc(ref, {
        title: selected.title,
        year: selected.year,
        medium: selected.medium,
        dimensions: selected.dimensions,
        description: selected.description,
        category: selected.category,
      });
      alert("Bilgiler güncellendi!");
    } catch (error) {
      console.error("Güncelleme hatası:", error);
      alert("Bir hata oluştu.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!selected) return;

    const { name, value } = e.target;
    setSelected({ ...selected, [name]: value });
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

            <button
              onClick={handleUpdate}
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Güncelle
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

type PaintingWithId = Painting & { id: string };
