"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  Users,
  FileText,
  BookUser,
  Feather,
} from "lucide-react";

const menuItems = [
  { icon: <Home size={18} />, label: "Dashboard", href: "/dashboard-full" },
  { icon: <Users size={18} />, label: "User", href: "/dashboard-full/user" },
  { icon: <BookOpen size={18} />, label: "Books", href: "/dashboard-full/book" },
  { icon: <Feather size={18} />, label: "Author", href: "/dashboard-full/author" },
  { icon: <BookUser size={18} />, label: "Author Books", href: "/dashboard-full/book_author" },
  { icon: <FileText size={18} />, label: "Loans", href: "/dashboard-full/loan" },
];

export default function Apps_Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4 flex flex-col justify-between">
      {/* Header Brand */}
      <div>
        <div className="flex items-center gap-3 px-2 mb-8">
          <img src="/logos.png" alt="Logo" className="" />
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          <p className="text-xs text-gray-500 uppercase px-2 mb-2">Main Menu</p>
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={index}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
                  ${isActive
                    ? "bg-pink-600 text-white font-semibold shadow-md"
                    : "text-gray-300 hover:bg-pink-500/20 hover:text-white"
                  }`}
              >
                <div className={`p-2 rounded-lg ${isActive ? "bg-white text-pink-600" : "bg-gray-700"}`}>
                  {item.icon}
                </div>
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Divider */}
          <div className="border-t border-gray-700 my-4" />

          
        </nav>
      </div>

      {/* Footer */}
      
    </aside>
  );
}
