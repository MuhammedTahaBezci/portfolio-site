import Link from 'next/link';
import Image from 'next/image';
import { getPaintings, getExhibitions, getBlogPosts } from '@/lib/utils';
import BlogPostCard from '@/components/BlogPostCard';

export default async function Home() {
  
  const allExhibitions = await getExhibitions();
  // getExhibitions artık sıralı geliyor, en öncelikli sergiyi al
  const featuredExhibition = allExhibitions[0]; 
  
  const allBlogPosts = await getBlogPosts();
  // getBlogPosts artık sıralı geliyor, en yeni yazıyı al
  const featuredBlogPosts = allBlogPosts.slice(0, 1); 
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Bölümü */}
      <section className="relative h-96 rounded-lg overflow-hidden mb-16">
        <Image
          src="/images/hero-image.jpg"
          alt="Sanat Portfolyom"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Sanat Portfolyom</h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-8">
              Sanat dünyasına hoş geldiniz. Burada eserlerimi keşfedebilir, sergilerim hakkında bilgi alabilir ve sanat yolculuğumu takip edebilirsiniz.
            </p>
            <Link 
              href="/gallery" 
              className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-md transition duration-300"
            >
              Galeriye Göz At
            </Link>
          </div>
        </div>
      </section>
      
      {/* Güncel/Yaklaşan Sergi */}
      {featuredExhibition && (
        <section className="mb-16 bg-neutral-background rounded-lg shadow-md overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="relative h-64 md:h-auto">
              <Image
                src={featuredExhibition.imageUrl}
                alt={featuredExhibition.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 text-sm font-medium rounded-full">
                  {new Date(featuredExhibition.endDate) >= new Date() ? 'Güncel Sergi' : 'Son Sergi'}
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-4">{featuredExhibition.title}</h2>
              <p className="text-neutral-600 mb-6">{featuredExhibition.description}</p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm">
                  <svg className="w-4 h-4 mr-2 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span>{new Date(featuredExhibition.startDate).toLocaleDateString('tr-TR')} - {new Date(featuredExhibition.endDate).toLocaleDateString('tr-TR')}</span>
                </div>
                <div className="flex items-center text-sm">
                  <svg className="w-4 h-4 mr-2 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span>{featuredExhibition.location}</span>
                </div>
              </div>
              <Link 
                href="/exhibitions"
                className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition duration-300"
              >
                Tüm Sergileri Gör
              </Link>
            </div>
          </div>
        </section>
      )}
      
      {/* Son Blog Yazıları */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Son Blog Yazısı</h2>
          <Link 
          href="/blog" 
          className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
        >
          Tümünü Gör
        <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </Link>
    </div>

      {/* Bu div'i flex column yap ve grid'i kaldır */}
      <div className="flex flex-col gap-10">
        {featuredBlogPosts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
    </section>

      
      {/* İletişim CTA */}
      <section className="bg-primary-100 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Eserlerim Hakkında Bilgi Almak İster misiniz?</h2>
        <p className="text-neutral-700 mb-6 max-w-2xl mx-auto">
          Eserlerim, sergi iş birlikleri veya satın alma hakkında detaylı bilgi için benimle iletişime geçebilirsiniz.
        </p>
        <Link 
          href="/contact" 
          className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-md transition duration-300"
        >
          İletişime Geç
        </Link>
      </section>
    </div>
  );
}