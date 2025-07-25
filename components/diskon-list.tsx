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
  fetchDiscounts,
  deleteDiscount,
  createDiscount,
  updateDiscount,
} from "@/lib/api";
import { Button } from "./ui/button";
import { toast } from "sonner";
import DiscountFormModal from "./DiskonFromModal";
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

interface Discount {
  id: string;
  product_id: string;
  name: string;
  description: string;
  discount_value: number;
  discount_type: "percentage" | "fixed";
  start_date: string;
  end_date: string;
  is_active: boolean;
  finalPrice?: number;
}

export default function DiscountList() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);

  const loadDiscounts = async () => {
    try {
      const data = await fetchDiscounts();
      const mapped = data.map((d: any) => {
        const price = parseFloat(d.product?.price ?? "0");
        const discountValue = parseFloat(d.discount_value ?? "0");
        let finalPrice = price;

        if (d.discount_type === "percentage") {
          finalPrice = price - (price * discountValue) / 100;
        } else {
          finalPrice = price - discountValue;
        }

        return {
          id: d.id,
          product_id: d.product_id,
          name: d.product?.name ?? "-",
          description: d.product?.description ?? "-",
          discount_value: discountValue,
          discount_type: d.discount_type,
          start_date: d.start_date.split("T")[0],
          end_date: d.end_date.split("T")[0],
          is_active: d.is_active,
          finalPrice: Math.max(0, finalPrice),
        };
      });

      setDiscounts(mapped);
    } catch (err) {
      toast.error("Gagal memuat diskon");
    }
  };

  useEffect(() => {
    loadDiscounts();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteDiscount(id);
      await loadDiscounts();
      toast.success("Diskon berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus diskon");
    }
  };

  const handleCreate = async (data: any) => {
    await createDiscount(data);
    await loadDiscounts();
    toast.success("Diskon berhasil ditambahkan");
  };

  const handleUpdate = async (data: any) => {
    await updateDiscount(data.id, data);
    await loadDiscounts();
    toast.success("Diskon berhasil diperbarui");
  };

  return (
    <div className="rounded-md border p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Daftar Diskon</h2>
        <DiscountFormModal
          trigger={<Button>+ Tambah</Button>}
          onSubmit={handleCreate}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Produk</TableHead>
            <TableHead>Harga Akhir</TableHead>
            <TableHead>Diskon</TableHead>
            <TableHead>Mulai</TableHead>
            <TableHead>Selesai</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {discounts.map((discount, index) => (
            <TableRow key={discount.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{discount.name}</TableCell>
              <TableCell>
                Rp {discount.finalPrice?.toLocaleString("id-ID")}
              </TableCell>
              <TableCell>
                {discount.discount_type === "percentage"
                  ? `${discount.discount_value}%`
                  : `Rp ${discount.discount_value.toLocaleString("id-ID")}`}
              </TableCell>
              <TableCell>{discount.start_date}</TableCell>
              <TableCell>{discount.end_date}</TableCell>
              <TableCell>
                {discount.is_active ? (
                  <span className="text-green-600">Aktif</span>
                ) : (
                  <span className="text-gray-400">Nonaktif</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end items-center space-x-2">
                  <DiscountFormModal
                    discountToEdit={discount}
                    trigger={
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    }
                    onSubmit={handleUpdate}
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
                          Yakin ingin menghapus diskon ini?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Tindakan ini tidak bisa dibatalkan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(discount.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Ya, Hapus
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
