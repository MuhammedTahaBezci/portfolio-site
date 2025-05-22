'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { getBlogPostBySlug } from '@/lib/utils' // <-- Düzeltildi

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getBlogPostBySlug(params.slug);
      if (!data) {
        router.push('/404');
        return;
      }
      setPost(data);
    };

    fetchData();
  }, [params.slug, router]);

  if (!post) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-gray-500 text-sm mb-4">{post.publishDate}</p>
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-64 object-cover rounded mb-6"
        />
      )}
      <article className="prose prose-lg max-w-none">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </article>
    </div>
  );
}