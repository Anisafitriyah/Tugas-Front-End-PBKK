"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { fetchLoanItems } from "@/lib/api"; // Pastikan ada API ini di backend

export default function LoanItemsFromModal({
  loanId,
  trigger,
}: {
  loanId: string;
  trigger: React.ReactNode;
}) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const loadLoanItems = async () => {
    setLoading(true);
    try {
      const data = await fetchLoanItems(loanId);
      setItems(data);
    } catch (err) {
      console.error("Gagal fetch loan items:", err);
    } finally {
      setLoading(false);
    }
  };

  // Hitung total buku (jumlah)
  const totalBooks = items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) loadLoanItems();
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detail Buku Dipinjam</DialogTitle>
        </DialogHeader>

        {loading ? (
          <p>Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-muted-foreground">Tidak ada data peminjaman.</p>
        ) : (
          <>
            <table className="w-full text-sm mt-4 border rounded">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-2">Judul Buku</th>
                  <th className="text-left p-2">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-2">{item.book?.title ?? "-"}</td>
                    <td className="p-2">{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end mt-4 pr-2 text-lg font-semibold">
              Total Buku: {totalBooks}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
