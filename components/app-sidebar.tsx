"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  IconCamera,
  IconChartBar,
  IconFolder,
  IconReport,
  IconUsers,
  IconDatabase,
  IconDiscount,
  IconWriting,
  IconBook,
  IconBookDownload,
  IconBookUpload,
} from "@tabler/icons-react";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/admin.png",
  },
  teams: [
    {
      name: "Shopyfy",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],
  navMain: [
    { title: "User", url: "/dashboard-full/user", icon: IconUsers },
    { title: "Author", url: "/dashboard-full/author", icon: IconWriting },
    { title: "Book", url: "/dashboard-full/book", icon: IconBook },
    {
      title: "Penulis Buku",
      url: "/dashboard-full/book_author",
      icon: IconFolder,
    },
    {
      title: "Peminjaman",
      url: "/dashboard-full/loan",
      icon: IconBookDownload,
    },
    {
      title: "Pengembalian",
      url: "/dashboard-full/return",
      icon: IconBookUpload,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
