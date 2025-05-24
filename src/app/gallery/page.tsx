"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { Painting } from "@/types/painting";
import ImageCard from "@/components/ImageCard";
import ImageModal from "@/components/ImageModal";

const Gallery = () => {
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Tümü");
  const [selectedPainting, setSelectedPainting] = useState<Painting | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaintings = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, "painting"),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const paintingData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Painting[];
        
        setPaintings(paintingData);
        
        // Kategorileri topla
        const uniqueCategories = Array.from(
          new Set(paintingData.map((p) => p.category).filter(Boolean))
        ) as string[];
        
        setCategories(uniqueCategories);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching paintings: ", error);
        setLoading(false);
      }
    };

    fetchPaintings();
  }, []);

  const filteredPaintings = selectedCategory === "Tümü"
    ? paintings
    : paintings.filter((p) => p.category === selectedCategory);

  const openModal = (painting: Painting) => {
    setSelectedPainting(painting);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedPainting(null);
    document.body.style.overflow = "auto";
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Galeri</h1>
      
      {/* Kategori Filtreleme */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        <button
          className={`px-4 py-2 rounded-full transition-colors duration-200 ${
            selectedCategory === "Tümü"
              ? "bg-primary-600 text-neutral-50"
              : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
          }`}
          onClick={() => setSelectedCategory("Tümü")}
        >
          Tümü
        </button>
        
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full transition-colors duration-200 ${
              selectedCategory === category
                ? "bg-primary-600 text-neutral-50"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <>
          {filteredPaintings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPaintings.map((painting) => (
                <ImageCard
                  key={painting.id}
                  painting={painting}
                  onClick={() => openModal(painting)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-neutral-500">Bu kategoride henüz eser bulunmamaktadır.</p>
            </div>
          )}
        </>
      )}

      {selectedPainting && (
        <ImageModal
          painting={selectedPainting}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default Gallery;