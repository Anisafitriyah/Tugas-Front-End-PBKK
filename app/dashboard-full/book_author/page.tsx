"use client";

import Layout from "@/components/Layout";
import BookAuthorList from "@/components/book-author-list";
import { useState } from "react";

export default function BookAuthorPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Layout>
      <div className="bg-white p-4 rounded shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Relasi Buku & Pengarang</h2>
          <input
            type="text"
            placeholder="Cari relasi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-3 py-2 rounded-md text-sm w-64"
          />
        </div>
        <BookAuthorList searchTerm={searchTerm} />
      </div>
    </Layout>
  );
}
