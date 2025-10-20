"use client";

import { Menu, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/lib/useUser";
import { supabase } from "@/lib/supabaseClient";
import svgPaths from "../../../public/imports/svg-3okl1n2ttv";

interface NavigationProps {
  isAdmin?: boolean;
}

type UserLink = { href: string; label: string };
type AdminLink = { section: "dashboard" | "transactions"; label: string };
type NavLink = UserLink | AdminLink;

export function Navigation({ isAdmin = false }: NavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<
    "dashboard" | "transactions"
  >("dashboard");

  // Close mobile menu when viewport is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  const userLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/donation", label: "My Donations" },
    { href: "/fact-check", label: "Fact Check" },
    { href: "/request_help", label: "Request Help" },
  ];

  const adminLinks = [
    { section: "dashboard" as const, label: "Dashboard" },
    { section: "transactions" as const, label: "Transaction" },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  const handleAdminNavClick = (section: "dashboard" | "transactions") => {
    setActiveSection(section);
    // Dispatch custom event to scroll to section
    window.dispatchEvent(
      new CustomEvent("navigateToSection", { detail: { section } })
    );
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const getLinkClasses = (item: NavLink) => {
    const baseClasses =
      "font-['Manrope:Medium',_sans-serif] font-medium text-[14px] tracking-wide transition-all duration-300 hover:text-primary cursor-pointer";

    // For admin navigation, use section-based active state
    if (isAdmin && "section" in item) {
      if (activeSection === item.section) {
        return `${baseClasses} text-primary border-b-[3px] border-primary pb-1`;
      }
      return `${baseClasses} text-[#364153] border-b-[3px] border-transparent pb-1 hover:border-primary`;
    }

    // For user navigation, use pathname-based active state
    if ("href" in item && pathname === item.href) {
      return `${baseClasses} text-primary border-b-[3px] border-primary pb-1`;
    }
    return `${baseClasses} text-[#364153] border-b-[3px] border-transparent pb-1 hover:border-primary`;
  };

  const getMobileLinkClasses = (href: string) => {
    const baseClasses =
      "font-['Manrope:Medium',_sans-serif] font-regular text-[16px] tracking-wide transition-all duration-300 hover:text-primary block py-3";
    if (pathname === href) {
      return `${baseClasses} text-primary border-l-[3px] border-primary pl-4`;
    }
    return `${baseClasses} text-[#364153] border-l-[3px] border-transparent hover:border-primary pl-4`;
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-2 border-gray-300 h-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link href={user ? "/dashboard" : "/"} className="flex items-center">
            <div className="relative cursor-pointer">
              <div className="size-12 sm:size-16" data-name="bangon 2">
                <img
                  alt="Bangon Logo"
                  className="absolute inset-2 max-w-none object-50%-50% object-cover pointer-events-none size-full"
                  src="./imports/emblem.png"
                />
              </div>
              <div className="absolute h-[2.206px] left-[11.62px] top-[4.31px] w-[1.509px] hidden sm:block">
                <svg
                  className="block size-full"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 2 3"
                >
                  <path
                    d={svgPaths.p2ee09680}
                    fill="url(#paint0_linear_5_1602)"
                    id="Vector 4"
                  />
                  <defs>
                    <linearGradient
                      gradientUnits="userSpaceOnUse"
                      id="paint0_linear_5_1602"
                      x1="9.80643e-08"
                      x2="8.8078"
                      y1="0.426184"
                      y2="13.922"
                    >
                      <stop stopColor="#F1DA92" />
                      <stop offset="1" stopColor="#D2A834" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div
                className="absolute hidden sm:flex h-[calc(1px*((var(--transform-inner-width)*0.007430866360664368)+(var(--transform-inner-height)*0.999972403049469)))] items-center justify-center left-[6.58px] top-[8.46px] w-[calc(1px*((var(--transform-inner-height)*0.007430866360664368)+(var(--transform-inner-width)*0.999972403049469)))]"
                style={
                  {
                    "--transform-inner-width": "10.0625",
                    "--transform-inner-height": "15.0625",
                  } as React.CSSProperties
                }
              >
                <div className="flex-none rotate-[180.426deg] scale-y-[-100%]">
                  <div className="h-[3.766px] relative w-[2.519px]">
                    <svg
                      className="block size-full"
                      fill="none"
                      preserveAspectRatio="none"
                      viewBox="0 0 3 4"
                    >
                      <path
                        d={svgPaths.p1a27a600}
                        fill="url(#paint0_linear_5_1600)"
                        id="Vector 5"
                      />
                      <defs>
                        <linearGradient
                          gradientUnits="userSpaceOnUse"
                          id="paint0_linear_5_1600"
                          x1="1.03832e-07"
                          x2="9.61113"
                          y1="0.461114"
                          y2="14.8728"
                        >
                          <stop stopColor="#3970B2" />
                          <stop offset="1" stopColor="#172773" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <nav className="flex items-center space-x-10">
              {links.map((link) => {
                // Admin navigation with section-based routing
                if (isAdmin && "section" in link) {
                  return (
                    <button
                      key={link.section}
                      onClick={() => handleAdminNavClick(link.section)}
                      className={getLinkClasses(link)}
                    >
                      {link.label}
                    </button>
                  );
                }

                // User navigation with href-based routing
                return (
                  <Link
                    key={"href" in link ? link.href : link.label}
                    href={"href" in link ? link.href : "#"}
                    className={getLinkClasses(link)}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* User Avatar/Dropdown */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 transition-colors duration-300 flex items-center justify-center cursor-pointer">
                    <User className="w-5 h-5 text-white" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
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

          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button
                className="lg:hidden flex flex-col justify-center items-center w-10 h-10 space-y-1.5"
                aria-label="Toggle menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col gap-3 mt-6">
                {links.map((link) => {
                  const linkHref = "href" in link ? link.href : "#";
                  const linkKey =
                    "href" in link
                      ? link.href
                      : "section" in link
                      ? link.section
                      : "";

                  return (
                    <Link
                      key={linkKey}
                      href={linkHref}
                      className={getMobileLinkClasses(linkHref)}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  );
                })}

                {/* Mobile User Menu */}
                {user && (
                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                    <Link
                      href="/profile"
                      className="font-['Manrope:Medium',_sans-serif] text-[16px] text-[#364153] hover:text-primary block py-2 pl-4"
                      onClick={() => setIsOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="font-['Manrope:Medium',_sans-serif] text-[16px] text-[#364153] hover:text-primary block py-2 pl-4"
                      onClick={() => setIsOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        handleLogout();
                      }}
                      className="font-['Manrope:Medium',_sans-serif] text-[16px] text-[#364153] hover:text-primary block py-2 pl-4 w-full text-left"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
