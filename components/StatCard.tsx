"use client";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
}

export default function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded shadow">
      <div className="text-3xl text-blue-500">{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}
