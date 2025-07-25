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
import {
  createBookAuthor,
  deleteBookAuthor,
  fetchBookAuthor,
  updateBookAuthor,
} from "@/lib/api";
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
import BookAuthorFormModal from "./BookAuthorFormModal";

interface BookAuthor {
  id?: string;
  book_id: string;
  author_id: string;
  book?: {
    title: string;
    publisher: string;
  };
  author?: {
    name: string;
  };
}

export default function BookAuthorList({
  searchTerm = "",
}: {
  searchTerm?: string;
}) {
  const [bookAuthors, setBookAuthors] = useState<BookAuthor[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const loadData = async () => {
    try {
      const data = await fetchBookAuthor();
      setBookAuthors(data);
    } catch (error) {
      toast.error("Gagal memuat data Book Author");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setCurrentPage(1); // Reset ke halaman 1 saat search berubah
  }, [searchTerm]);

  const filteredData = bookAuthors.filter((item) =>
    `${item.book?.title} ${item.author?.name} ${item.book?.publisher}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredData.slice(
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

  const handleCreate = async (data: BookAuthor) => {
    try {
      await createBookAuthor(data);
      toast.success("Book Author berhasil ditambahkan");
      loadData();
    } catch (error) {
      toast.error("Gagal menambahkan Book Author");
    }
  };

  const handleUpdate = async (data: BookAuthor) => {
    try {
      if (!data.id) {
        toast.error("ID Book Author tidak ditemukan");
        return;
      }
      await updateBookAuthor(data.id, data);
      toast.success("Book Author berhasil diupdate");
      loadData();
    } catch (error) {
      toast.error("Gagal mengupdate Book Author");
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await deleteBookAuthor(id);
      toast.success("Book Author berhasil dihapus");
      loadData();
    } catch (error) {
      toast.error("Gagal menghapus Book Author");
    }
  };

  return (
    <div className="rounded-md border p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Daftar Book Author</h2>
        <BookAuthorFormModal
          onSubmit={handleCreate}
          trigger={<Button>+ Tambah</Button>}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Judul Buku</TableHead>
            <TableHead>Pengarang</TableHead>
            <TableHead>Penerbit</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{startIndex + index + 1}</TableCell>
              <TableCell>{item.book?.title}</TableCell>
              <TableCell>{item.author?.name}</TableCell>
              <TableCell>{item.book?.publisher}</TableCell>
              <TableCell className="text-right space-x-2">
                <BookAuthorFormModal
                  bookAuthor={item}
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
                        Yakin ingin menghapus data ini?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Tindakan ini tidak bisa dibatalkan. Data akan hilang
                        permanen.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(item.id)}
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

      {/* Pagination Controls */}
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
