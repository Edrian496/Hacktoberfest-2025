"use client";

import { Heart, Menu, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useUser } from "@/lib/useUser";
import { supabase } from "@/lib/supabaseClient"; // adjust path if needed

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();

  const links = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Disasters" },
    { href: "/fact-check", label: "Fact Check" },
  ];

  const handleLogout = async () => {
    // Supabase logout
    await supabase.auth.signOut();

    // redirect to home
    router.push("/");
  };

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          {!user ? (
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary rounded-lg p-2">
                <Heart className="w-5 h-5 text-white" fill="white" />
              </div>
              <span className="text-xl font-semibold text-foreground">
                QuakeAid
              </span>
            </Link>
          ) : (
            <div className="flex items-center gap-2 cursor-default">
              <div className="bg-primary rounded-lg p-2">
                <Heart className="w-5 h-5 text-white" fill="white" />
              </div>
              <span className="text-xl font-semibold text-foreground">
                QuakeAid
              </span>
            </div>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {!user ? (
              <Button asChild className="mx-4 mt-2">
                <Link href="/login">Login</Link>
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    <span>{user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col gap-3 mt-6">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                      pathname === link.href
                        ? "bg-accent text-primary"
                        : "text-foreground hover:bg-accent"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {!user ? (
                  <Button asChild className="mx-4 mt-4">
                    <Link href="/login">Donate Now</Link>
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={handleLogout}
                  >
                    <User className="w-4 h-4 mr-2" /> {user.email}
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
