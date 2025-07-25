"use client";
import { LoginForm } from "@/components/login-form";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <LoginForm />
      </div>
    </main>
  );
}
