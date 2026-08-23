"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardNav from "@/components/dashboard/DashboardNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      router.replace("/login");
      return;
    }

    const timer = window.setTimeout(() => {
      setCheckingAuth(false);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <DashboardNav />

      <main>{children}</main>
    </div>
  );
}