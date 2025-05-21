"use client";

import { useState } from "react";
import { storage, db } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Image from "next/image";

const AddImage = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState<string>("");

  const [title, setTitle] = useState("");        // Resmin adı
  const [year, setYear] = useState("");          // Tarih (yıl)
  const [medium, setMedium] = useState("");      // Teknik
  const [dimensions, setDimensions] = useState(""); // Boyut
  const [description, setDescription] = useState(""); // Açıklama
  const [category, setCategory] = useState("");   // Kategori

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!image || !title || !year || !medium || !dimensions || !description || !category) {
      alert("Lütfen tüm alanları doldurun ve bir resim seçin.");
      return;
    }

    const imagePath = `paintings/${image.name}`;
    const storageRef = ref(storage, imagePath);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        console.error("Yükleme hatası:", error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setImageUrl(downloadURL);

          // Firestore'a kayıt
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

          alert("Resim ve bilgiler başarıyla yüklendi!");
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
        } catch (error) {
          console.error("Firestore'a kayıt hatası:", error);
        }
      }
    );
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-semibold">Resim Ekle</h2>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="block"
      />

      {preview && (
        <div>
          <p>Önizleme:</p>
          <img src={preview} alt="Önizleme" className="w-32 h-32 object-cover" />
        </div>
      )}

      <input
        type="text"
        placeholder="Resmin Adı"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <input
        type="text"
        placeholder="Yıl (örnek: 2023)"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <input
        type="text"
        placeholder="Teknik (örneğin: Yağlı boya)"
        value={medium}
        onChange={(e) => setMedium(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <input
        type="text"
        placeholder="Boyut (örneğin: 50x70 cm)"
        value={dimensions}
        onChange={(e) => setDimensions(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <textarea
        placeholder="Ressamın Açıklaması"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <input
        type="text"
        placeholder="Kategori (örneğin: Portre)"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <button
        onClick={handleUpload}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Yükle
      </button>

      {progress > 0 && <div>Yükleme Durumu: %{Math.round(progress)}</div>}

      {imageUrl && (
        <div>
          <p>Yüklenen Resim:</p>
          <Image
            src={imageUrl}
            alt="Yüklenen Resim"
            className="w-32 h-32 object-cover"
            width={800}
            height={600}
            priority
          />
        </div>
      )}
    </div>
  );
};

export default AddImage;
