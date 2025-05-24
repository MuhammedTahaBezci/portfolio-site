"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { BlogPost } from "@/types/blog";
import BlogPostCard from "@/components/BlogPostCard";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "blogPosts"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as BlogPost[];
        
        data.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
        
        setPosts(data);
      } catch (error) {
        console.error("Blog yazıları alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-neutral-900">
          Blog
        </h1>
        <p className="text-neutral-600 max-w-2xl mx-auto">
          Sanat dünyasından hikayeler, teknikler ve ilham verici yazılar
        </p>
      </div>

      {/* Blog Posts */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              Henüz blog yazısı yok
            </h3>
            <p className="text-neutral-600">
              Yakında yeni içeriklerle burada olacağız.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-10 px-4 md:px-6 lg:px-8 py-10">
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}