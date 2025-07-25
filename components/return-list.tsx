"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { fetchReturns } from "@/lib/api";
import ReturnWithBookFormModal from "./ReturnWithBookFormModal";
import ReturnDetailsFromModal from "./ReturnDetailsModal";

export default function DaftarPengembalian({
  searchTerm = "",
}: {
  searchTerm?: string;
}) {
  const [returns, setReturns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const loadData = async () => {
    try {
      const data = await fetchReturns();
      setReturns(data);
    } catch (err) {
      console.error("Gagal fetch pengembalian:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredReturns = returns.filter((ret) =>
    `${ret.username} ${ret.return_date}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredReturns.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredReturns.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (direction: "prev" | "next") => {
    setCurrentPage((prev) => {
      if (direction === "prev") return Math.max(prev - 1, 1);
      if (direction === "next") return Math.min(prev + 1, totalPages);
      return prev;
    });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="rounded-md border p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Daftar Pengembalian</h2>
        <Button onClick={() => setShowModal(true)}>
          + Tambah Pengembalian
        </Button>
      </div>

      <ReturnWithBookFormModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          loadData();
        }}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Nama Peminjam</TableHead>
            <TableHead>Tanggal Kembali</TableHead>
            <TableHead>Jumlah Buku Dikembalikan</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((ret, i) => {
            const total = ret.return_items?.reduce(
              (sum: number, item: any) => sum + item.quantity,
              0
            );

            return (
              <TableRow key={ret.id}>
                <TableCell>{startIndex + i + 1}</TableCell>
                <TableCell>{ret.username ?? "-"}</TableCell>
                <TableCell>
                  {new Date(ret.return_date).toLocaleDateString("id-ID")}
                </TableCell>
                <TableCell>{total}</TableCell>
                <TableCell className="text-right">
                  <ReturnDetailsFromModal
                    returnId={ret.id}
                    trigger={<Button variant="secondary">Lihat Buku</Button>}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center pt-4">
        <p className="text-sm text-muted-foreground">
          Halaman {currentPage} dari {totalPages}
        </p>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange("prev")}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange("next")}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
