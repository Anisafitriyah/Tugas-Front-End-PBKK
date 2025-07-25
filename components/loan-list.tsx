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
import { fetchLoan } from "@/lib/api";
import LoanWithBooksModal from "./LoanWithBooksModal";
import LoanItemsModal from "./LoanItemsFromModal";

export default function DaftarLoan({
  searchTerm = "",
}: {
  searchTerm?: string;
}) {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const loadData = async () => {
    try {
      const data = await fetchLoan();
      setLoans(data);
    } catch (err) {
      console.error("Gagal fetch loans:", err);
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

  const filteredLoans = loans.filter((loan) =>
    `${loan.user?.name} ${loan.status} ${loan.loan_date}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredLoans.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredLoans.slice(
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
        <h2 className="text-xl font-semibold">Daftar Peminjaman</h2>
        <LoanWithBooksModal
          onSuccess={loadData}
          trigger={<Button>+ Tambah</Button>}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Nama Peminjam</TableHead>
            <TableHead>Tanggal Pinjam</TableHead>
            <TableHead>Jumlah Jenis Buku</TableHead>
            <TableHead>Total Buku</TableHead>
            <TableHead>Status Peminjaman</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((loan, i) => {
            const jumlahJenis = loan.loan_items?.length ?? 0;
            const totalBuku = loan.loan_items?.reduce(
              (sum: number, item: any) => sum + item.quantity,
              0
            );

            return (
              <TableRow key={loan.id}>
                <TableCell>{startIndex + i + 1}</TableCell>
                <TableCell>{loan.user?.name ?? "-"}</TableCell>
                <TableCell>
                  {loan.loan_date
                    ? new Date(loan.loan_date).toLocaleDateString("id-ID")
                    : "-"}
                </TableCell>
                <TableCell>{jumlahJenis}</TableCell>
                <TableCell>{totalBuku ?? 0}</TableCell>
                <TableCell>{loan.status ?? "-"}</TableCell>
                <TableCell className="text-right">
                  <LoanItemsModal
                    loanId={loan.id}
                    trigger={<Button variant="secondary">Lihat Buku</Button>}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-between items-center pt-4">
        <p className="text-sm text-muted-foreground">
          Halaman {currentPage} dari {totalPages}
        </p>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => handlePageChange("prev")}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange("next")}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
