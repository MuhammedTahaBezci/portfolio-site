"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import Image from "next/image";

const Gallery = () => {
  const [paintings, setPaintings] = useState<any[]>([]);

  useEffect(() => {
    const fetchPaintings = async () => {
      try {
        const q = query(
          collection(db, "painting"),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const paintingData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPaintings(paintingData);
      } catch (error) {
        console.error("Error fetching paintings: ", error);
      }
    };

    fetchPaintings();
  }, []);

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Galeri</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {paintings.length > 0 ? (
          paintings.map((painting) => {
            const isValidSrc = typeof painting.imageUrl === "string" && painting.imageUrl.trim() !== "";

            return (
              <div key={painting.id} className="bg-gray-100 p-4 rounded-lg">
                {isValidSrc && (
                  <Image
                    src={painting.imageUrl}
                    alt={painting.title || "Resim"}
                    width={800}
                    height={600}
                    className="w-full h-auto object-cover rounded"
                  />
                )}
                <h3 className="text-lg font-medium mt-2">{painting.title}</h3>
                <p className="text-sm text-gray-600">{painting.description}</p>
                <p className="text-sm text-gray-400">{painting.category}</p>
                <p className="text-sm text-gray-400">{painting.date}</p>
              </div>
            );
          })
        ) : (
          <p>Henüz yüklenmiş resim yok.</p>
        )}
      </div>
    </div>
  );
};

export default Gallery;
