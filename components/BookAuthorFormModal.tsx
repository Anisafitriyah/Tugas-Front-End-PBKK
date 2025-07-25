"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { fetchBook, fetchAuthor } from "@/lib/api"; // Fungsi API untuk ambil data buku & penulis

interface Book {
  id: string;
  title: string;
}

interface Author {
  id: string;
  name: string;
}

interface BookAuthor {
  id?: string;
  book_id: string;
  author_id: string;
}

interface Props {
  bookAuthor?: BookAuthor;
  trigger: React.ReactNode;
  onSubmit: (data: BookAuthor) => void;
}

export default function BookAuthorFormModal({
  bookAuthor,
  trigger,
  onSubmit,
}: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    book_id: bookAuthor?.book_id ?? "",
    author_id: bookAuthor?.author_id ?? "",
  });

  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);

  useEffect(() => {
    // Load books
    const loadBooks = async () => {
      try {
        const data = await fetchBook();
        setBooks(data);
      } catch (err) {
        console.error("Error fetching books:", err);
      }
    };
    // Load authors
    const loadAuthors = async () => {
      try {
        const data = await fetchAuthor();
        setAuthors(data);
      } catch (err) {
        console.error("Error fetching authors:", err);
      }
    };

    loadBooks();
    loadAuthors();
  }, []);

  const handleSubmit = () => {
    if (!form.book_id || !form.author_id) {
      alert("Silakan pilih buku dan penulis.");
      return;
    }

    onSubmit({
      id: bookAuthor?.id,
      book_id: form.book_id,
      author_id: form.author_id,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {bookAuthor ? "Edit Book Author" : "Tambah Book Author"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Select Book */}
          <Select
            value={form.book_id}
            onValueChange={(val) =>
              setForm((prev) => ({ ...prev, book_id: val }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Buku" />
            </SelectTrigger>
            <SelectContent>
              {books.map((book) => (
                <SelectItem key={book.id} value={book.id}>
                  {book.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Select Author */}
          <Select
            value={form.author_id}
            onValueChange={(val) =>
              setForm((prev) => ({ ...prev, author_id: val }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Penulis" />
            </SelectTrigger>
            <SelectContent>
              {authors.map((author) => (
                <SelectItem key={author.id} value={author.id}>
                  {author.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit}>
            {bookAuthor ? "Simpan" : "Tambah"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
