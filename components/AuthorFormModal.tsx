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
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // pastikan sudah install lucide-react

interface Author {
  id: number;
  name: string;
  nationality: string;
  birthdate: string;
}

interface Props {
  author?: Author;
  trigger: React.ReactNode;
  onSubmit: (data: Author) => void;
}

export default function AuthorFormModal({ author, trigger, onSubmit }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Author>({
    name: author?.name || "",
    nationality: author?.nationality || "",
    birthdate: author?.birthdate || "",
    id: author?.id || 0,
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
          <DialogTitle>
            {author ? "Edit Customer" : "Tambah Customer"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <Input
            name="name"
            placeholder="Nama"
            value={form.name}
            onChange={handleChange}
            required
          />
          <Input
            name="nationality"
            placeholder="Kebangsaan"
            value={form.nationality}
            onChange={handleChange}
            required
          />
          <Input
            type="date"
            name="birthdate"
            placeholder="Tgl Lahir"
            value={form.birthdate}
            onChange={handleChange}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>
            {author ? "Simpan Perubahan" : "Tambah"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
