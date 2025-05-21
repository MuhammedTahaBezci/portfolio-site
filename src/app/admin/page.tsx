"use client";

import Sidebar from "@/components/Sidebar";

export default function AdminDashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold">Yönetici Paneli</h1>
        <p>Hoş geldiniz! Sol menüden işlemlerinizi seçebilirsiniz.</p>
      </div>
    </div>
  );
}
