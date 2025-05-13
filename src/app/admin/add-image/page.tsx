"use client";

import { useState } from "react";
import { storage } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const AddImage = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      console.log("Seçilen dosya:", file);
    }
  };

  const handleUpload = async () => {
    if (!image) {
      console.warn("Lütfen bir resim seçin.");
      return;
    }

    console.log("Yükleme işlemi başladı:", image);

    try {
      const storageRef = ref(storage, `images/${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
          console.log(`Yükleme durumu: %${Math.round(progress)}`);
        },
        (error) => {
          console.error("Yükleme hatası:", error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setImageUrl(downloadURL);
            console.log("Dosya başarıyla yüklendi:", downloadURL);
          } catch (error) {
            console.error("Download URL alma hatası:", error);
          }
        }
      );
    } catch (error) {
      console.error("Yükleme işlemi sırasında bir hata oluştu:", error);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Resim Ekle</h2>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="mb-4"
      />

      {preview && (
        <div className="mb-4">
          <p>Önizleme:</p>
          <img
            src={preview}
            alt="Önizleme"
            className="w-32 h-32 object-cover"
          />
        </div>
      )}

      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Yükle
      </button>

      {progress > 0 && (
        <div className="mt-2">Yükleme Durumu: %{Math.round(progress)}</div>
      )}

      {imageUrl && (
        <div className="mt-4">
          <p>Yüklenen Resim:</p>
          <img
            src={imageUrl}
            alt="Yüklenen Resim"
            className="w-32 h-32 object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default AddImage;
