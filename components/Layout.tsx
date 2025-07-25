"use client";

import Sidebar from "./Apps_Sidebar";
import Topbar from "./Topbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Border bawah di container dengan padding px-6 */}
        <div className="border-b border-gray-200 bg-teal-500 px-6 py-9">
          <Topbar />
        </div>

        <main className="p-6 bg-gray-100 min-h-screen">{children}</main>
      </div>
    </div>
  );
}
