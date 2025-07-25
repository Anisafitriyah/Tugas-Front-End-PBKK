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
import {
  createAuthor,
  deleteAuthor,
  fetchAuthor,
  updateAuthor,
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
import CustomerFormModal from "./AuthorFormModal";

interface Author {
  id: number;
  name: string;
  nationality: string;
  birthdate: string;
}

export default function AuthorTable({
  searchTerm = "",
}: {
  searchTerm?: string;
}) {
  const [author, setAuthor] = useState<Author[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const authorsPerPage = 5;

  useEffect(() => {
    fetchAuthor().then(setAuthor);
  }, []);

  useEffect(() => {
    setCurrentPage(1); // reset ke halaman pertama saat searchTerm berubah
  }, [searchTerm]);

  const filteredAuthors = author.filter((a) =>
    `${a.name} ${a.nationality}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAuthors.length / authorsPerPage);
  const startIndex = (currentPage - 1) * authorsPerPage;
  const currentAuthors = filteredAuthors.slice(
    startIndex,
    startIndex + authorsPerPage
  );

  const handlePageChange = (direction: "prev" | "next") => {
    setCurrentPage((prev) => {
      if (direction === "prev") return Math.max(prev - 1, 1);
      if (direction === "next") return Math.min(prev + 1, totalPages);
      return prev;
    });
  };

  // ... sisa kode sama seperti sebelumnya (handleCreate, handleUpdate, handleDelete, dsb)

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      await deleteAuthor(id, token);
      setAuthor((prev) => prev.filter((u) => u.id !== id));
      toast.success("Data Author berhasil dihapus");
    } catch (err) {
      toast.error("Gagal menghapus Author");
    }
  };

  const handleUpdate = async (data: any) => {
    const token = localStorage.getItem("token");
    try {
      await updateAuthor(data.id, data, token);
      const updatedAuthor = await fetchAuthor();
      setAuthor(updatedAuthor);
      toast.success("Data Author berhasil diupdate");
    } catch (e) {
      toast.error("Gagal mengupdate Author");
    }
  };

  const handleCreate = async (data: any) => {
    const token = localStorage.getItem("token");
    try {
      await createAuthor(data);
      const updated = await fetchAuthor();
      setAuthor(updated);
      toast.success("Data Author berhasil ditambahkan");
    } catch {
      toast.error("Gagal menambahkan Author");
    }
  };

  return (
    <div className="rounded-md border p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Daftar Author</h2>
        <CustomerFormModal
          onSubmit={handleCreate}
          trigger={<Button>+ Tambah</Button>}
        />
      </div>

      {/* Search input */}
      <div className="flex justify-end">
        <input
          type="text"
          placeholder="Cari author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded-md text-sm w-64 mb-4"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Nama Pengarang</TableHead>
            <TableHead>Kebangsaan</TableHead>
            <TableHead>Tgl Lahir</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentAuthors.map((author, index) => (
            <TableRow key={author.id}>
              <TableCell>{startIndex + index + 1}</TableCell>
              <TableCell>{author.name}</TableCell>
              <TableCell>{author.nationality}</TableCell>
              <TableCell>
                {new Date(author.birthdate).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <CustomerFormModal
                  author={author}
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
                        Yakin ingin menghapus author ini?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Tindakan ini tidak bisa dibatalkan.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(author.id)}
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
