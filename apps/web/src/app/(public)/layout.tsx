import type { ReactNode } from "react";
import { Navigation } from "@/components/ui/navigation";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">{children}</main>
    </div>
  );
}
