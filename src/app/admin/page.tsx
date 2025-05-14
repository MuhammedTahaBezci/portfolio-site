import Sidebar from "@/components/Sidebar";""

export default function AdminPage() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold">Admin Paneli</h1>
        <p className="mt-4">Admin paneline hoş geldiniz!</p>
        <p className="mt-2">
          Buradan kullanıcıları yönetebilir, içerik ekleyebilir ve diğer admin
          işlemlerini gerçekleştirebilirsiniz.
        </p>
        <p className="mt-2">
          Admin paneli, kullanıcıların içeriklerini yönetmelerine ve web
          sitesinin genel ayarlarını değiştirmelerine olanak tanır.
        </p>

        <p>Sol taraftan bir işlem seçiniz.</p>
      </div>
    </div>
  );
}
