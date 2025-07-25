"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  createReturns,
  fetchLoan,
  fetchLoanItemsAll,
  saveReturnItems,
} from "@/lib/api";

interface ReturnWithBookFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ReturnWithBookFormModal({
  open,
  onClose,
  onSuccess,
}: ReturnWithBookFormModalProps) {
  const [loans, setLoans] = useState<any[]>([]);
  const [selectedLoanId, setSelectedLoanId] = useState("");
  const [itemList, setItemList] = useState<any[]>([]);
  const [notes, setNotes] = useState("");
  const [showItems, setShowItems] = useState(false);

  useEffect(() => {
    fetchLoan().then(setLoans);
  }, []);

  const handleShowItems = async () => {
    if (!selectedLoanId) {
      toast.error("Pilih peminjaman terlebih dahulu");
      return;
    }

    try {
      const allLoanItems = await fetchLoanItemsAll();
      const filtered = allLoanItems.filter(
        (item: any) => item.loan_id === selectedLoanId
      );

      const mapped = filtered.map((item: any) => ({
        loan_item_id: item.id,
        book_id: item.book.id,
        book_title: item.book.title,
        max_quantity: item.quantity,
        quantity: 0,
        condition_note: "",
      }));

      setItemList(mapped);
      setShowItems(true);
    } catch (err) {
      toast.error("Gagal mengambil data loan items");
    }
  };

  const handleQuantityChange = (index: number, value: number) => {
    const newItems = [...itemList];
    newItems[index].quantity = value;
    setItemList(newItems);
  };

  const handleNoteChange = (index: number, value: string) => {
    const newItems = [...itemList];
    newItems[index].condition_note = value;
    setItemList(newItems);
  };

  const handleSubmit = async () => {
    if (!selectedLoanId) return toast.error("Pilih peminjaman terlebih dahulu");

    const itemsToSend = itemList.filter((item) => item.quantity > 0);

    if (itemsToSend.length === 0) {
      return toast.error("Masukkan minimal 1 item buku yang dikembalikan");
    }

    const duplicateCheck = new Set(itemsToSend.map((i) => i.loan_item_id));
    if (duplicateCheck.size !== itemsToSend.length) {
      toast.error("Terdapat item dengan loan_item_id yang duplikat!");
      return;
    }

    try {
      const newReturn = await createReturns({
        loan_id: selectedLoanId,
        return_date: new Date().toISOString().slice(0, 10),
        notes: notes || null,
        items: [],
      });

      await saveReturnItems(newReturn.id, { items: itemsToSend });

      toast.success("Pengembalian berhasil diproses");
      onClose();
      setSelectedLoanId("");
      setItemList([]);
      setNotes("");
      setShowItems(false);
      onSuccess?.();
    } catch (error) {
      toast.error("Gagal menyimpan data pengembalian");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-lg">Form Pengembalian Buku</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Pilih peminjaman */}
          <div>
            <Label htmlFor="loan">Pilih Peminjaman</Label>
            <select
              id="loan"
              className="w-full border rounded p-2"
              value={selectedLoanId}
              onChange={(e) => setSelectedLoanId(e.target.value)}
            >
              <option value="">Pilih Peminjaman</option>
              {loans
                .filter((loan) => loan.status !== "selesai")
                .map((loan) => (
                  <option key={loan.id} value={loan.id}>
                    {loan.user?.name} -{" "}
                    {new Date(loan.loan_date).toLocaleDateString("id-ID")} -
                    Status: {loan.status}
                  </option>
                ))}
            </select>
          </div>

          {/* Catatan umum */}
          <div>
            <Label htmlFor="notes">Catatan Umum</Label>
            <Input
              id="notes"
              placeholder="Contoh: Buku lengkap dan rapi"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1"
            />
          </div>

          {/* Tombol tampilkan item */}
          <div className="text-right">
            <Button onClick={handleShowItems} variant="outline">
              📖 Tampilkan Buku
            </Button>
          </div>

          {/* Daftar buku */}
          {showItems && itemList.length > 0 && (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {itemList.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-50 border p-4 rounded-md space-y-3"
                >
                  <h3 className="font-semibold text-sm">
                    📘 {item.book_title}
                  </h3>

                  <div className="flex items-center gap-3">
                    <Label className="w-40">Jumlah dikembalikan:</Label>
                    <Input
                      type="number"
                      value={item.quantity}
                      min={0}
                      max={item.max_quantity}
                      onChange={(e) =>
                        handleQuantityChange(index, parseInt(e.target.value))
                      }
                    />
                    <span className="text-xs text-muted-foreground">
                      Maks: {item.max_quantity}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Label className="w-40">Catatan kondisi:</Label>
                    <Input
                      type="text"
                      placeholder="Contoh: sobek di sampul"
                      value={item.condition_note}
                      onChange={(e) => handleNoteChange(index, e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <Button onClick={handleSubmit} className="w-full mt-4">
            ✅ Proses Pengembalian
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
