"use client";

import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import StatCard from "@/components/StatCard";
import { Book, Users, Clock, LogIn, BookCheck, BookDown } from "lucide-react";
import Chart from "@/components/Chart";
import MemberTable from "@/components/MemberTable";

import { fetchDashboardCounts } from "@/lib/api";

interface DashboardCounts {
  users: number;
  books: number;
  loan: number;
  return: number;
}

export default function DashboardPage() {
  const [counts, setCounts] = useState<DashboardCounts>({
    users: 0,
    books: 0,
    loan: 0,
    return: 0,
  });

  useEffect(() => {
    async function loadCounts() {
      try {
        const data = await fetchDashboardCounts();
        setCounts(data);
      } catch (error) {
        console.error("Error fetching dashboard counts:", error);
      }
    }
    loadCounts();
  }, []);

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<Users />} label="Users" value={counts.users} />
        <StatCard icon={<Book />} label="Books" value={counts.books} />
        <StatCard icon={<BookDown />} label="Loans" value={counts.loan} />
        <StatCard icon={<BookCheck />} label="Returns" value={counts.return} />
      </div>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">Reports</h2>
        <Chart />
      </div>

      <MemberTable />
    </Layout>
  );
}
