"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Mail } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/lib/api";

export default function Topbar() {
  const router = useRouter();
  const [user, setUser] = useState<{
    name: string;
    email: string;
    avatar?: string;
  } | null>(null);

  // 🔐 Cek login & ambil user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Anda belum login!");
      router.push("/login-new");
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser({
        name: "Asrul Abdullah",
        email: "asrul@example.com",
        avatar: "https://i.pravatar.cc/300",
      }); // fallback dummy user
    }
  }, [router]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await logout(token);
      toast.success("Logout berhasil");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/login");
    } catch (err) {
      toast.error("Gagal logout");
    }
  };

  if (!user) return null;

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-xl font-semibold text-gray-800">
        Welcome to Dashboard
      </h1>

      <div className="flex items-center gap-4">
        <button className="text-gray-600 hover:text-blue-500">
          <Mail size={20} />
        </button>
        <button className="text-gray-600 hover:text-blue-500">
          <Bell size={20} />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="w-9 h-9 rounded-full overflow-hidden border cursor-pointer">
              <img
                src={user.avatar || "https://i.pravatar.cc/300"}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => alert("Go to Profile")}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600 cursor-pointer"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
