"use client";

import Layout from "@/components/Layout";
import AuthorList from "@/components/author-list";
import { useState } from "react";

export default function AuthorPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Layout>
      <div className="bg-white p-4 rounded shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Daftar Author</h2>
          <input
            type="text"
            placeholder="Cari author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-3 py-2 rounded-md text-sm w-64"
          />
        </div>

        <AuthorList searchTerm={searchTerm} />
      </div>
    </Layout>
  );
}
