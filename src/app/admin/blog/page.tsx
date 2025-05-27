"use client";

import { useEffect, useState, useRef } from "react";
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, QueryDocumentSnapshot } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import Sidebar from "@/components/Sidebar";
import { BlogPost } from "@/types/blog";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selected, setSelected] = useState<Partial<BlogPost> | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
  try {
    const snapshot = await getDocs(collection(db, "blogPosts"));
    const data = snapshot.docs
      .map((doc: QueryDocumentSnapshot) => {
        const raw = doc.data();
        if (!raw.title || !raw.publishDate || !raw.content) return null;

        return {
          id: doc.id,
          ...raw,
        } as BlogPost;
      })
      .filter(Boolean) as BlogPost[];

    data.sort((a: BlogPost, b: BlogPost) => {
      return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
    });

    setPosts(data);
  } catch (error) {
    console.error("Yazılar alınamadı:", error);
    alert("Yazılar yüklenirken hata oluştu.");
  }
};

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!selected) return;
    const { name, value } = e.target;
    setSelected({ ...selected, [name]: value });
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    const fileName = `blog-images/${Date.now()}-${file.name}`;
    const storageRef = ref(storage, fileName);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  };

  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selected) return;

    setUploading(true);
    try {
      const imageUrl = await handleImageUpload(file);
      setSelected({ ...selected, imageUrl });
    } catch (error) {
      console.error("Resim yüklenemedi:", error);
      alert("Resim yüklenirken hata oluştu.");
    } finally {
      setUploading(false);
    }
  };

  const insertImageToContent = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selected) return;

    setUploading(true);
    try {
      const imageUrl = await handleImageUpload(file);
      const textarea = contentInputRef.current;
      
      if (textarea) {
        const cursorPosition = textarea.selectionStart;
        const textBefore = selected.content?.substring(0, cursorPosition) || '';
        const textAfter = selected.content?.substring(cursorPosition) || '';
        const imageMarkdown = `\n\n![Resim açıklaması](${imageUrl})\n\n`;
        
        const newContent = textBefore + imageMarkdown + textAfter;
        setSelected({ ...selected, content: newContent });
        
        // Cursor pozisyonunu güncelle
        setTimeout(() => {
          textarea.focus();
          const newPosition = cursorPosition + imageMarkdown.length;
          textarea.setSelectionRange(newPosition, newPosition);
        }, 100);
      }
    } catch (error) {
      console.error("Resim yüklenemedi:", error);
      alert("Resim yüklenirken hata oluştu.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = generateSlug(title);
    setSelected({ 
      ...selected, 
      title, 
      slug: selected?.slug || slug // Sadece yeni yazılarda otomatik slug oluştur
    });
  };

  const handleSave = async () => {
    if (!selected || !selected.title || !selected.content) {
      alert("Başlık ve içerik alanları zorunludur.");
      return;
    }

    setSaving(true);
    const isUpdate = !!selected.id;

    const payload: Omit<BlogPost, "id"> = {
      slug: selected.slug || generateSlug(selected.title),
      title: selected.title,
      excerpt: selected.excerpt || selected.content.substring(0, 150) + "...",
      content: selected.content,
      imageUrl: selected.imageUrl || "",
      author: selected.author || "Admin",
      publishDate: selected.publishDate || new Date().toISOString().split('T')[0],
      tags: selected.tags || [],
    };

    try {
      if (isUpdate) {
        await updateDoc(doc(db, "blogPosts", selected.id!), payload);
        alert("Yazı güncellendi.");
      } else {
        await addDoc(collection(db, "blogPosts"), payload);
        alert("Yeni yazı eklendi.");
      }
      
      await fetchPosts();
      setSelected(null);
    } catch (err) {
      console.error("Hata:", err);
      alert("Bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu yazıyı silmek istediğinizden emin misiniz?")) return;

    try {
      await deleteDoc(doc(db, "blogPosts", id));
      alert("Yazı silindi.");
      await fetchPosts();
      if (selected?.id === id) {
        setSelected(null);
      }
    } catch (error) {
      console.error("Silme hatası:", error);
      alert("Yazı silinirken hata oluştu.");
    }
  };

  const insertTextFormat = (format: string) => {
    const textarea = contentInputRef.current;
    if (!textarea || !selected) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = selected.content?.substring(start, end) || '';
    const textBefore = selected.content?.substring(0, start) || '';
    const textAfter = selected.content?.substring(end) || '';

    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'h1':
        formattedText = `# ${selectedText}`;
        break;
      case 'h2':
        formattedText = `## ${selectedText}`;
        break;
      case 'h3':
        formattedText = `### ${selectedText}`;
        break;
      case 'quote':
        formattedText = `> ${selectedText}`;
        break;
      case 'link':
        formattedText = `[${selectedText}](url)`;
        break;
      default:
        formattedText = selectedText;
    }

    const newContent = textBefore + formattedText + textAfter;
    setSelected({ ...selected, content: newContent });

    setTimeout(() => {
      textarea.focus();
      const newPosition = start + formattedText.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 100);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-900">Blog Yönetimi</h1>

          {/* Posts Grid */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Mevcut Yazılar</h2>
              <button
                onClick={() => setSelected({
                  publishDate: new Date().toISOString().split('T')[0],
                  author: "Admin",
                  tags: []
                })}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                + Yeni Yazı
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all duration-200 ${
                    selected?.id === post.id 
                      ? "border-blue-500 shadow-lg" 
                      : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                  }`}
                >
                  <div onClick={() => setSelected(post)}>
                    {post.imageUrl && (
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="h-32 w-full object-cover"
                      />
                    )}
                    <div className="p-3">
                      <p className="font-medium text-sm line-clamp-2 mb-1">{post.title}</p>
                      <p className="text-xs text-gray-500">{post.publishDate}</p>
                    </div>
                  </div>
                  <div className="px-3 pb-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(post.id);
                      }}
                      className="text-xs text-red-600 hover:text-red-800 transition-colors duration-200"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Editor */}
          {selected && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">
                {selected.id ? "Yazıyı Düzenle" : "Yeni Yazı Oluştur"}
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Basic Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Başlık *
                    </label>
                    <input
                      name="title"
                      value={selected.title || ""}
                      onChange={handleTitleChange}
                      placeholder="Yazı başlığı"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slug
                    </label>
                    <input
                      name="slug"
                      value={selected.slug || ""}
                      onChange={handleChange}
                      placeholder="url-slug"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Özet
                    </label>
                    <textarea
                      name="excerpt"
                      value={selected.excerpt || ""}
                      onChange={handleChange}
                      placeholder="Yazının kısa özeti"
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yazar
                    </label>
                    <input
                      name="author"
                      value={selected.author || ""}
                      onChange={handleChange}
                      placeholder="Yazar adı"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yayın Tarihi
                    </label>
                    <input
                      type="date"
                      name="publishDate"
                      value={selected.publishDate || ""}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Etiketler
                    </label>
                    <input
                      name="tags"
                      value={(selected.tags || []).join(", ")}
                      onChange={(e) =>
                        setSelected({
                          ...selected,
                          tags: e.target.value.split(",").map((tag) => tag.trim()).filter(tag => tag),
                        })
                      }
                      placeholder="sanat, resim, deneme (virgülle ayırın)"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Cover Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kapak Resmi
                    </label>
                    <div className="space-y-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverImageUpload}
                        className="w-full p-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      {selected.imageUrl && (
                        <div className="relative">
                          <img
                            src={selected.imageUrl}
                            alt="Kapak resmi"
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => setSelected({ ...selected, imageUrl: "" })}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column - Content Editor */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      İçerik *
                    </label>
                    
                    {/* Formatting Toolbar */}
                    <div className="border border-gray-300 rounded-t-lg bg-gray-50 p-2 flex flex-wrap gap-1">
                      <button
                        type="button"
                        onClick={() => insertTextFormat('bold')}
                        className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 font-bold"
                        title="Kalın"
                      >
                        B
                      </button>
                      <button
                        type="button"
                        onClick={() => insertTextFormat('italic')}
                        className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 italic"
                        title="İtalik"
                      >
                        I
                      </button>
                      <button
                        type="button"
                        onClick={() => insertTextFormat('h1')}
                        className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                        title="Başlık 1"
                      >
                        H1
                      </button>
                      <button
                        type="button"
                        onClick={() => insertTextFormat('h2')}
                        className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                        title="Başlık 2"
                      >
                        H2
                      </button>
                      <button
                        type="button"
                        onClick={() => insertTextFormat('h3')}
                        className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                        title="Başlık 3"
                      >
                        H3
                      </button>
                      <button
                        type="button"
                        onClick={() => insertTextFormat('quote')}
                        className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                        title="Alıntı"
                      >
                        Quote
                      </button>
                      <button
                        type="button"
                        onClick={() => insertTextFormat('link')}
                        className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                        title="Link"
                      >
                        Link
                      </button>
                      
                      {/* Image Upload for Content */}
                      <div className="relative">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={insertImageToContent}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <button
                          type="button"
                          className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                          title="Resim Ekle"
                        >
                          📷 Resim
                        </button>
                      </div>
                    </div>

                    <textarea
                      ref={contentInputRef}
                      name="content"
                      value={selected.content || ""}
                      onChange={handleChange}
                      placeholder="Yazı içeriğini buraya yazın. Markdown formatını kullanabilirsiniz.

Örnek formatlar:
# Büyük Başlık
## Orta Başlık
### Küçük Başlık

**Kalın metin**
*İtalik metin*

> Bu bir alıntıdır

[Link metni](http://example.com)

![Resim açıklaması](resim-url)"
                      rows={20}
                      className="w-full p-4 border-l border-r border-b border-gray-300 rounded-b-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm leading-relaxed resize-none"
                      style={{ minHeight: '500px' }}
                    />
                  </div>

                  {/* Preview Button */}
                  <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                    <strong>Markdown İpuçları:</strong>
                    <ul className="mt-2 space-y-1 text-xs">
                      <li>• **kalın metin** veya *italik metin*</li>
                      <li>• # Başlık 1, ## Başlık 2, ### Başlık 3</li>
                      <li>• {">"} Alıntı bloğu</li>
                      <li>• [Link metni](URL)</li>
                      <li>• ![Resim](URL) - Resim eklemek için</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setSelected(null)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  İptal
                </button>
                
                <div className="flex space-x-3">
                  {selected.id && (
                    <button
                      onClick={() => handleDelete(selected.id!)}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                    >
                      Sil
                    </button>
                  )}
                  
                  <button
                    onClick={handleSave}
                    disabled={saving || uploading}
                    className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
                  >
                    {saving && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    )}
                    <span>{saving ? "Kaydediliyor..." : "Kaydet"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Loading States */}
          {uploading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span>Resim yükleniyor...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}