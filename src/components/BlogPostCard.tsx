import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/types/blog';
import { formatDate } from '@/lib/utils';

interface BlogPostCardProps {
  post: BlogPost;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="relative h-48 w-full">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-4">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span>{formatDate(post.publishDate)}</span>
            <span className="mx-2">•</span>
            <span>{post.author}</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-3">{post.excerpt}</p>
          <div className="mt-3 flex flex-wrap gap-1">
            {post.tags.map((tag, index) => (
              <span 
                key={index} 
                className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}