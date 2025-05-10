import Image from 'next/image';

export const metadata = {
  title: 'Hakkımda | Sanat Portfolyom',
  description: 'Sanatçı biyografisi ve çalışma felsefem',
};

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Hakkımda</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Sanatsal yolculuğum, eserlerim ve felsefem hakkında daha fazla bilgi edinin.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-10">
        <div className="md:flex">
          <div className="md:w-1/3 relative">
            <div className="h-80 md:h-full relative">
              <Image
                src="/images/artist-portrait.jpg"
                alt="Sanatçı Portresi"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </div>
          <div className="md:w-2/3 p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-4">Sanatsal Yolculuğum</h2>
            <p className="text-gray-700 mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eget justo non enim consequat ullamcorper. Sed finibus risus sit amet nulla tempus, vel pretium ex fermentum. Nulla facilisi. In hac habitasse platea dictumst. Donec auctor, neque id lacinia facilisis, justo nisl vestibulum enim, eu mollis nulla eros at nisl.
            </p>
            <p className="text-gray-700 mb-4">
              Integer id turpis nec nulla auctor tempus. Etiam in massa ac eros viverra viverra. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Duis varius dolor nec enim cursus, vel bibendum nisi tempus. Aliquam erat volutpat. Suspendisse potenti. Sed sodales, ligula non luctus pellentesque, justo orci volutpat mauris, sit amet convallis enim turpis a magna.
            </p>
            <p className="text-gray-700">
              Sed varius mauris eu sem rhoncus, id lacinia tellus dictum. Donec vitae libero sed risus efficitur varius. Curabitur at metus dui. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Praesent fermentum magna ac diam viverra, non consectetur risus elementum.
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Eğitim</h2>
          <ul className="space-y-4">
            <li>
              <div className="text-gray-500 text-sm mb-1">2010 - 2014</div>
              <div className="font-medium">Güzel Sanatlar Fakültesi, Resim Bölümü</div>
              <div className="text-gray-600">İstanbul Üniversitesi</div>
            </li>
            <li>
              <div className="text-gray-500 text-sm mb-1">2014 - 2016</div>
              <div className="font-medium">Güzel Sanatlar Yüksek Lisans</div>
              <div className="text-gray-600">Paris Sanat Akademisi</div>
            </li>
            <li>
              <div className="text-gray-500 text-sm mb-1">2016 - 2017</div>
              <div className="font-medium">Çağdaş Sanat Sertifika Programı</div>
              <div className="text-gray-600">New York Sanat Okulu</div>
            </li>
          </ul>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Beceriler ve Teknikler</h2>
          <ul className="space-y-2">
            <li className="flex items-center">
              <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
              <span>Yağlı Boya Tekniği</span>
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
              <span>Suluboya ve Akrilik</span>
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
              <span>Dijital Sanat</span>
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
              <span>Kaligrafi</span>
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
              <span>Heykel ve 3D Çalışmalar</span>
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
              <span>Karışık Medya</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-10">
        <h2 className="text-xl font-bold mb-4">Sanat Felsefem</h2>
        <p className="text-gray-700 mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eget justo non enim consequat ullamcorper. Sed finibus risus sit amet nulla tempus, vel pretium ex fermentum. Nulla facilisi. In hac habitasse platea dictumst. Donec auctor, neque id lacinia facilisis, justo nisl vestibulum enim, eu mollis nulla eros at nisl.
        </p>
        <p className="text-gray-700">
          Integer id turpis nec nulla auctor tempus. Etiam in massa ac eros viverra viverra. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Duis varius dolor nec enim cursus, vel bibendum nisi tempus. Aliquam erat volutpat. Suspendisse potenti. Sed sodales, ligula non luctus pellentesque, justo orci volutpat mauris, sit amet convallis enim turpis a magna.
        </p>
      </div>
      
      <div className="bg-yellow-100 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">İş Birliği Teklifleri için</h2>
        <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
          Sergiler, sanatsal projeler veya özel siparişler için benimle iletişime geçebilirsiniz.
        </p>
        <a 
          href="/contact" 
          className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 px-6 rounded-md transition duration-300"
        >
          İletişime Geç
        </a>
      </div>
    </div>
  );
}