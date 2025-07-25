"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { createBook, deleteBook, fetchBook, updateBook } from "@/lib/api";
import { Button } from "./ui/button";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import BookFromModal from "./BooksFormModal";

interface Book {
  id: number;
  title: string;
  isbn: string;
  publisher: string;
  year_published: number;
  stock: number;
}

export default function BookList({ searchTerm = "" }: { searchTerm?: string }) {
  const [book, setBook] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 5;

  useEffect(() => {
    fetchBook().then((data) => {
      setBook(data);
    });
  }, []);

  // Filtering berdasarkan searchTerm
  const filteredBooks = book.filter((b) =>
    `${b.title} ${b.publisher} ${b.isbn}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const currentBooks = filteredBooks.slice(
    startIndex,
    startIndex + booksPerPage
  );

  const handlePageChange = (direction: "prev" | "next") => {
    setCurrentPage((prev) => {
      if (direction === "prev") return Math.max(prev - 1, 1);
      if (direction === "next") return Math.min(prev + 1, totalPages);
      return prev;
    });
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      await deleteBook(id, token);
      setBook((prev) => prev.filter((b) => b.id !== id));
      toast.success("Data Buku berhasil dihapus");
    } catch (err) {
      toast.error("Gagal menghapus Data Buku");
    }
  };

  const handleUpdate = async (data: any) => {
    const token = localStorage.getItem("token");
    try {
      await updateBook(data.id, data, token);
      const updatedBook = await fetchBook();
      setBook(updatedBook);
      toast.success("Data Buku berhasil diupdate");
    } catch (err) {
      toast.error("Gagal mengupdate Data Buku");
    }
  };

  const handleCreate = async (data: { id_barang: string; limit: number }) => {
    const token = localStorage.getItem("token");
    try {
      await createBook(data, token);
      const updated = await fetchBook();
      setBook(updated);
      toast.success("Data Buku berhasil ditambahkan");
    } catch (err) {
      toast.error("Gagal menambahkan Data Buku");
    }
  };

  return (
    <div className="rounded-md border p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Daftar Buku</h2>
        <BookFromModal
          onSubmit={handleCreate}
          trigger={<Button>+ Tambah</Button>}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Nama Buku</TableHead>
            <TableHead>Isbn</TableHead>
            <TableHead>Penerbit</TableHead>
            <TableHead>Tahun Diterbit</TableHead>
            <TableHead>Stok</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentBooks.map((book, index) => (
            <TableRow key={book.id}>
              <TableCell>{startIndex + index + 1}</TableCell>
              <TableCell>{book.title}</TableCell>
              <TableCell>{book.isbn}</TableCell>
              <TableCell>{book.publisher}</TableCell>
              <TableCell>{book.year_published}</TableCell>
              <TableCell>{book.stock}</TableCell>
              <TableCell className="text-right space-x-2">
                <BookFromModal
                  book={book}
                  onSubmit={handleUpdate}
                  trigger={
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  }
                />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      Hapus
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Yakin ingin menghapus buku ini?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Tindakan ini tidak bisa dibatalkan. Data akan hilang
                        permanen.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(book.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Ya, Hapus
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination controls */}
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
