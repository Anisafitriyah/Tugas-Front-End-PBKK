"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { fetchBook } from "@/lib/api";
import { title } from "process";

interface Book {
  id: number;
  title: string;
  isbn: string;
  publisher: string;
  year_published: number;
  stock: number;
}

interface Props {
  book?: Book;
  trigger: React.ReactNode;
  onSubmit: (data: Book) => void;
}

export default function CategoriesFormModal({
  book,
  trigger,
  onSubmit,
}: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: book?.title || "",
    isbn: book?.isbn || "",
    publisher: book?.publisher || "",
    year_published: book?.year_published || "",
    stock: book?.stock || 0,
    id: book?.id || 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit(form);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{book ? "Edit Buku" : "Tambah Buku"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <Input
            name="title"
            placeholder="Judul Buku"
            value={form.title}
            onChange={handleChange}
          />
          <Input
            name="isbn"
            placeholder="ISBN"
            value={form.isbn}
            onChange={handleChange}
          />
          <Input
            name="publisher"
            placeholder="Penerbit"
            value={form.publisher}
            onChange={handleChange}
          />
          <Input
            name="year_published"
            placeholder="Tahun Terbit"
            value={form.year_published}
            onChange={handleChange}
          />
          <Input
            name="stock"
            placeholder="Jumlah Buku"
            value={form.stock}
            onChange={handleChange}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>
            {book ? "Simpan Perubahan" : "Tambah"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
