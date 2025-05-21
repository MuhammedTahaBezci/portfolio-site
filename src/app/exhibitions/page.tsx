// app/exhibitions/page.tsx
import { getExhibitions } from "@/lib/utils";
import ExhibitionList from "@/components/ExhibitionList";
import { Exhibition } from "@/types/exhibition";

export const metadata = {
  title: "Sergiler | Sanat Portfolyom",
  description: "Geçmiş ve gelecek sergilerim hakkında bilgiler",
};

export default async function ExhibitionsPage() {
  const exhibitions = await getExhibitions();

  // Şu anki tarih
  const now = new Date();

  const upcoming: Exhibition[] = [];
  const past: Exhibition[] = [];

  exhibitions.forEach((exhibition) => {
    const endDate = new Date(exhibition.endDate);
    if (endDate >= now) {
      upcoming.push(exhibition);
    } else {
      past.push(exhibition);
    }
  });

  // Yaklaşan sergileri başlama tarihine göre sıralıyoruz (en yakından uzağa)
  upcoming.sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  // Geçmiş sergileri başlama tarihine göre sıralıyoruz (en yeni en önce)
  past.sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  const sortedExhibitions = [...upcoming, ...past];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Sergilerim</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Ulusal ve uluslararası galerilerde gerçekleşen sergilerim hakkında bilgi edinebilirsiniz.
        </p>
      </div>

      <ExhibitionList exhibitions={sortedExhibitions} />
    </div>
  );
}
