"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/useUser";
import { Navigation } from "@/components/ui/navigation";
import { Sidebar } from "@/components/ui/sidebar";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top navigation */}
      <Navigation />

      {/* Sidebar + Content */}
      <div className="flex flex-1">
        <Sidebar
          isAdmin={user?.role === "admin"}
          currentPage={""}
          onNavigate={function (page: string, disasterId?: string): void {
            throw new Error("Function not implemented.");
          }}
        />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
