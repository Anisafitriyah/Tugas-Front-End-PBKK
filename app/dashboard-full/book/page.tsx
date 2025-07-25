"use client";

import Layout from "@/components/Layout";
import BookList from "@/components/books-list";
import { Users } from "lucide-react";
import { useState } from "react";

export default function UserPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Layout>
      {/* Optional: kamu bisa tambahkan StatCard khusus user, kalau mau */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow flex items-center gap-3">
          <Users size={24} className="text-blue-600" />
          <div>
            <p className="text-sm text-gray-500">Total Buku</p>
            <p className="text-xl font-semibold">1234</p>
          </div>
        </div>
      </div>

      {/* Search dan Book List */}
      <div className="bg-white p-4 rounded shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Daftar Buku</h2>
          <input
            type="text"
            placeholder="Cari buku..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-3 py-2 rounded-md text-sm w-64"
          />
        </div>

        <BookList searchTerm={searchTerm} />
      </div>
    </Layout>
  );
}
