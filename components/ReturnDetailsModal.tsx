"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { fetchReturnDetailById } from "@/lib/api"; // sudah diarahkan ke endpoint baru

export default function ReturnDetailsFromModal({
  returnId,
  trigger,
}: {
  returnId: string;
  trigger: React.ReactNode;
}) {
  const [details, setDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const loadReturnDetail = async () => {
    setLoading(true);
    try {
      const data = await fetchReturnDetailById(returnId);
      setDetails(data);
    } catch (err) {
      console.error("Gagal fetch return detail:", err);
      setDetails([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) loadReturnDetail();
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Detail Pengembalian Buku</DialogTitle>
        </DialogHeader>

        {loading ? (
          <p>Loading...</p>
        ) : details.length === 0 ? (
          <p className="text-muted-foreground">Tidak ada data.</p>
        ) : (
          <table className="w-full text-sm mt-4 border rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Judul Buku</th>
                <th className="p-2 text-left">ISBN</th>
                <th className="p-2 text-left">Jumlah Dikembalikan</th>
                <th className="p-2 text-left">Catatan Kondisi</th>
                <th className="p-2 text-left">Tanggal Pengembalian</th>
                <th className="p-2 text-left">Catatan Pengembalian</th>
                <th className="p-2 text-left">Jumlah Pinjaman</th>
                <th className="p-2 text-left">Jatuh Tempo</th>
              </tr>
            </thead>
            <tbody>
              {details.map((item: any, idx: number) => (
                <tr key={item.id || idx} className="border-t">
                  <td className="p-2">{item.book?.title ?? "-"}</td>
                  <td className="p-2">{item.book?.isbn ?? "-"}</td>
                  <td className="p-2">{item.quantity}</td>
                  <td className="p-2">{item.condition_note ?? "-"}</td>
                  <td className="p-2">
                    {item.return?.return_date
                      ? new Date(item.return.return_date).toLocaleDateString(
                          "id-ID"
                        )
                      : "-"}
                  </td>
                  <td className="p-2">{item.return?.notes ?? "-"}</td>
                  <td className="p-2">{item.loan_item?.quantity ?? "-"}</td>
                  <td className="p-2">
                    {item.loan_item?.due_date
                      ? new Date(item.loan_item.due_date).toLocaleDateString(
                          "id-ID"
                        )
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </DialogContent>
    </Dialog>
  );
}
