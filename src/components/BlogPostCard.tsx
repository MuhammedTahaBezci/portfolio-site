import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/types/blog';
import { formatDate } from '@/lib/utils';

interface BlogPostCardProps {
  post: BlogPost;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <article className="w-full max-w-7xl mx-auto rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200/70 backdrop-blur-md">
      <Link href={`/blog/${post.slug}`} className="flex flex-col md:flex-row w-full group">

        {/* Görsel */}
        <div className="relative w-full md:w-[450px] h-[280px] md:h-auto">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        </div>

        {/* İçerik */}
        <div className="p-8 flex flex-col justify-between w-full">
          {/* Tarih ve yazar */}
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <time dateTime={post.publishDate}>{formatDate(post.publishDate)}</time>
            <span className="mx-2">•</span>
            <span className="text-gray-700 font-semibold">{post.author}</span>
          </div>

          {/* Başlık */}
          <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight group-hover:text-blue-600 transition-colors duration-300">
            {post.title}
          </h2>

          {/* Özet */}
          <p className="text-gray-800 text-lg leading-relaxed line-clamp-3 mb-5">
            {post.excerpt}
          </p>

          {/* Etiketler */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700"
                >
                  #{tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                  +{post.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Devamını oku */}
          <div className="text-blue-600 font-medium text-base hover:text-blue-700 flex items-center transition-all duration-300">
            <span>Devamını oku</span>
            <svg
              className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </article>
  );
}
