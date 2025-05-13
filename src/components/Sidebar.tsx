"use client";
import React from "react";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const router = useRouter();

  const menuItems = [
    { name: "Resim Ekle", path: "/admin/add-image" },
    { name: "Resim Güncelle", path: "/admin/edit-image" },
  ];

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      <ul>
        {menuItems.map((item) => (
          <li key={item.path} className="mb-4">
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded-md"
              onClick={() => router.push(item.path)}
            >
              {item.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
