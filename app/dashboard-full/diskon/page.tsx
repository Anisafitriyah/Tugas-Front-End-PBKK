"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import DiskonList from "@/components/diskon-list"; // pastikan path file sesuai

export default function CustomerPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              <h1 className="text-2xl font-semibold tracking-tight">
                Daftar Diskon
              </h1>
              <p className="text-muted-foreground">
                Berikut adalah daftar Diskon barang yang diambil dari API
                Laravel.
              </p>

              <div className="border rounded-lg p-4 bg-muted">
                <DiskonList />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
