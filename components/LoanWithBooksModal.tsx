"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import {
  createLoan,
  fetchUsers,
  fetchBook,
  saveLoanItems,
  deleteLoan,
} from "@/lib/api";

export default function LoanWithBooksModal({
  onSuccess,
  trigger,
}: {
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}) {
  const [users, setUsers] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [loanDate, setLoanDate] = useState("");
  const [loanCreated, setLoanCreated] = useState(false);
  const [loanId, setLoanId] = useState<string | null>(null);
  const [productList, setProductList] = useState<
    { id: string; title: string; quantity: number }[]
  >([]);
  const [selectedUser, setSelectedUser] = useState<string | undefined>(
    undefined
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setLoanDate(today);

    const load = async () => {
      try {
        const [uRes, bRes] = await Promise.all([fetchUsers(), fetchBook()]);
        setUsers(uRes);
        setBooks(bRes);
        if (uRes.length) setSelectedUser(uRes[0].id);
        setProductList(
          bRes.map((b: any) => ({ id: b.id, title: b.title, quantity: 0 }))
        );
      } catch {
        toast.error("Gagal memuat data users atau books");
      }
    };
    load();
  }, []);

  const resetForm = () => {
    setLoanCreated(false);
    setLoanId(null);
    setProductList(
      books.map((b: any) => ({ id: b.id, title: b.title, quantity: 0 }))
    );
    setSelectedUser(users.length ? users[0].id : undefined);
    const today = new Date().toISOString().split("T")[0];
    setLoanDate(today);
  };

  const handleCreateLoan = async () => {
    if (!selectedUser) {
      toast.error("Pilih peminjam terlebih dahulu");
      return;
    }

    try {
      const res = await createLoan({
        user_id: selectedUser,
        loan_date: loanDate,
        status: "pending",
      });
      const id = res?.data?.id;
      if (!id) throw new Error("ID peminjaman tidak ditemukan");
      setLoanCreated(true);
      setLoanId(id);
      toast.success("Peminjaman berhasil dibuat");
    } catch (e) {
      console.error(e);
      toast.error("Gagal membuat peminjaman");
    }
  };

  const totalBooks = productList.reduce((sum, i) => sum + i.quantity, 0);

  const handleSaveItems = async () => {
    if (!loanId) {
      toast.error("Buat peminjaman dulu");
      return;
    }

    const invalid = productList.filter(
      (i) => i.quantity > (books.find((b) => b.id === i.id)?.stock ?? 0)
    );
    if (invalid.length) {
      toast.info(
        "Jumlah melebihi stok untuk: " +
          invalid.map((i) => books.find((b) => b.id === i.id)?.title).join(", ")
      );
      return;
    }

    try {
      const items = productList
        .filter((i) => i.quantity > 0)
        .map((i) => ({
          book_id: i.id,
          quantity: i.quantity,
        }));

      await saveLoanItems(loanId, items);

      toast.success("Items peminjaman berhasil disimpan");

      resetForm(); // Reset form setelah berhasil simpan
      if (onSuccess) onSuccess();
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? e?.message ?? JSON.stringify(e);

      if (typeof msg === "string") {
        const lower = msg.toLowerCase();
        if (lower.includes("siswa")) {
          toast.error("🚫 Siswa hanya boleh meminjam maksimal 3 buku");
        } else if (lower.includes("guru")) {
          toast.error("🚫 Guru hanya boleh meminjam maksimal 40 buku");
        } else {
          toast.error(msg);
        }
      } else {
        toast.error("Gagal simpan items peminjaman");
      }
    }
  };

  const handlePickBook = (idx: number, bookId: string) => {
    const book = books.find((b) => b.id === bookId);
    setProductList((prev) => {
      const arr = [...prev];
      arr[idx].id = bookId;
      arr[idx].title = book?.title ?? "";
      return arr;
    });
  };

  const handleQtyChange = (i: number, q: number) => {
    setProductList((prev) => {
      const arr = [...prev];
      arr[i].quantity = q;
      return arr;
    });
  };

  const addRow = () =>
    setProductList((prev) => [...prev, { id: "", title: "", quantity: 0 }]);
  const delRow = (i: number) =>
    setProductList((prev) => prev.filter((_, x) => x !== i));

  // Fungsi hapus peminjaman berdasarkan loanId
  const handleDeleteLoan = async () => {
    if (!loanId) {
      toast.error("Belum ada peminjaman untuk dihapus");
      return;
    }
    try {
      await deleteLoan(loanId);
      toast.success("Peminjaman berhasil dihapus");
      resetForm();
      if (onSuccess) onSuccess();
    } catch (e) {
      toast.error("Gagal menghapus peminjaman");
      console.error(e);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? <Button>Tambah Peminjaman</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Form Peminjaman</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Peminjam */}
          <div>
            <Label>Peminjam</Label>
            <Select
              value={selectedUser}
              onValueChange={(v) => setSelectedUser(v)}
              disabled={loanCreated}
            >
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Pilih Peminjam" />
              </SelectTrigger>
              <SelectContent>
                {users.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={handleCreateLoan}
              disabled={!selectedUser || loanCreated}
              className="mt-2"
            >
              Buat Pinjaman
            </Button>
          </div>

          {/* Tanggal Pinjam */}
          <div>
            <Label>Tanggal Pinjam</Label>
            <Input
              type="date"
              value={loanDate}
              onChange={(e) => setLoanDate(e.target.value)}
              disabled={loanCreated}
            />
          </div>

          {/* Item List */}
          {loanCreated && (
            <div className="space-y-2">
              <Button variant="outline" onClick={addRow}>
                + Tambah Buku
              </Button>
              <table className="w-full text-sm border rounded">
                <thead className="bg-gray-100">
                  <tr>
                    <th>Judul Buku</th>
                    <th>Stok</th>
                    <th>Jumlah</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {productList.map((p, idx) => {
                    const bk = books.find((b) => b.id === p.id);
                    const stok = bk?.stock ?? 0;
                    return (
                      <tr key={idx}>
                        <td>
                          <Select
                            value={p.id}
                            onValueChange={(val) => handlePickBook(idx, val)}
                          >
                            <SelectTrigger className="w-64">
                              <SelectValue placeholder="Pilih Buku" />
                            </SelectTrigger>
                            <SelectContent>
                              {books.map((b) => (
                                <SelectItem key={b.id} value={b.id}>
                                  {b.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td>{stok}</td>
                        <td>
                          <Input
                            type="number"
                            min={0}
                            value={p.quantity}
                            onChange={(e) =>
                              handleQtyChange(idx, Number(e.target.value))
                            }
                            className="w-20"
                          />
                        </td>
                        <td>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => delRow(idx)}
                          >
                            Hapus
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="text-right font-semibold">
                Total Buku: {totalBooks}
              </div>
              <div className="flex justify-between">
                <Button variant="destructive" onClick={handleDeleteLoan}>
                  Hapus Peminjam
                </Button>
                <Button onClick={handleSaveItems}>Simpan Peminjaman</Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
