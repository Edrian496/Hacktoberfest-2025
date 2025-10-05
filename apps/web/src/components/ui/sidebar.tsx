"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Heart,
  CheckCircle,
  Shield,
  Home,
} from "lucide-react";

interface SidebarProps {
  isAdmin?: boolean;
  currentPage: string;
  onNavigate: (page: string, disasterId?: string) => void;
}

export function Sidebar({ isAdmin = false }: SidebarProps) {
  const pathname = usePathname();

  const userLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/donation", label: "My Donations", icon: Heart },
    { href: "/fact-check", label: "Fact Check", icon: CheckCircle },
  ];

  const adminLinks = [
    { href: "/admin-dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/fact-check-admin", label: "Fact Check", icon: Shield },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <aside className="w-64 bg-white border-r border-border min-h-screen p-4 hidden lg:block">
      <nav className="space-y-2">
        {/* Section header */}
        <div className="pt-4 pb-2 px-4">
          <p className="text-xs uppercase text-muted-foreground">
            {isAdmin ? "Admin" : "User"} Menu
          </p>
        </div>

        {/* Sidebar links */}
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm w-full transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : "hover:bg-accent text-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
