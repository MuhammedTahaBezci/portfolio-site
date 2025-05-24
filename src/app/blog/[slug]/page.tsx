'use client'

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { getBlogPostBySlug } from '@/lib/utils';
import Image from 'next/image';

export default function BlogDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      const data = await getBlogPostBySlug(slug);
      if (!data) {
        router.push('/404');
        return;
      }
      setPost(data);
    };

    fetchData();
  }, [slug, router]);

  if (!post) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-neutral-500 text-lg">Yükleniyor...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-4 text-neutral-900">{post.title}</h1>
      <div className="flex items-center text-sm text-neutral-500 mb-6">
        <span>{new Date(post.publishDate).toLocaleDateString('tr-TR')}</span>
        <span className="mx-2">•</span>
        <span>{post.author || 'Yazar Bilinmiyor'}</span>
      </div>

      {post.imageUrl && (
        <div className="relative w-full h-96 mb-8 rounded-xl overflow-hidden shadow-md">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
      )}

      <article className="prose prose-lg prose-neutral max-w-none dark:prose-invert">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </article>
    </div>
  );
}