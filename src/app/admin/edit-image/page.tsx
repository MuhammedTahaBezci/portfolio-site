"use client";

import { useEffect, useState } from "react";
import { storage } from "@/lib/firebase";
import {
  ref,
  listAll,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";

const EditImage = () => {
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Resimleri Listeleme
  useEffect(() => {
    const fetchImages = async () => {
      const storageRef = ref(storage, "images");
      try {
        const res = await listAll(storageRef);
        const urls = await Promise.all(
          res.items.map((item) => getDownloadURL(item))
        );
        setImages(urls);
      } catch (error) {
        console.error("Resimler alınamadı:", error);
      }
    };

    fetchImages();
  }, []);

  // Yeni Resim Seçme
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
    }
  };

  // Resmi Güncelleme
  const handleUpdateImage = async () => {
    if (!selectedImage || !newImage) {
      console.warn(
        "Lütfen bir resim seçin ve yüklemek istediğiniz resmi seçin."
      );
      return;
    }

    try {
      console.log("Yükleme işlemi başladı...");

      // Eski resmi silme
      const imageRef = ref(storage, selectedImage);
      await deleteObject(imageRef);
      console.log("Eski resim silindi:", selectedImage);

      // Yeni resmi yükleme
      const newImageRef = ref(storage, `images/${newImage.name}`);
      const uploadTask = uploadBytesResumable(newImageRef, newImage);

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
          try {
            const downloadURL = await getDownloadURL(newImageRef);
            console.log("Yeni resim yüklendi:", downloadURL);
            setSelectedImage(null);
            setNewImage(null);
            setUploadProgress(0);

            // Resim listesini güncelle
            const storageRef = ref(storage, "images");
            const res = await listAll(storageRef);
            const urls = await Promise.all(
              res.items.map((item) => getDownloadURL(item))
            );
            setImages(urls);
          } catch (error) {
            console.error("Download URL alma hatası:", error);
          }
        }
      );
    } catch (error) {
      console.error("Güncelleme hatası:", error);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Resim Güncelle</h2>

      <div className="mb-4">
        <label className="block mb-2">Mevcut Resimler:</label>
        <div className="flex flex-wrap gap-4">
          {images.map((url) => (
            <div
              key={url}
              className={`border p-2 cursor-pointer ${
                selectedImage === url ? "border-blue-500" : "border-gray-300"
              }`}
              onClick={() => setSelectedImage(url)}
            >
              <img src={url} alt="Resim" className="w-32 h-32 object-cover" />
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2">Yeni Resim Yükle:</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>

      {uploadProgress > 0 && (
        <div className="mb-4">
          Yükleme Durumu: %{Math.round(uploadProgress)}
        </div>
      )}

      <button
        onClick={handleUpdateImage}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Güncelle
      </button>
    </div>
  );
};

export default EditImage;
