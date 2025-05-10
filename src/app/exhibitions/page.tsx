import { getExhibitions } from '@/lib/utils';
import ExhibitionList from '@/components/ExhibitionList';

export const metadata = {
  title: 'Sergiler | Sanat Portfolyom',
  description: 'Geçmiş ve gelecek sergilerim hakkında bilgiler',
};

export default async function ExhibitionsPage() {
  const exhibitions = await getExhibitions();
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Sergilerim</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Ulusal ve uluslararası galerilerde gerçekleşen sergilerim hakkında bilgi edinebilirsiniz.
        </p>
      </div>
      
      <ExhibitionList exhibitions={exhibitions} />
    </div>
  );
}