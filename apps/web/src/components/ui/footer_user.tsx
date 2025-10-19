"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/useUser";

function BrandSection({ isAuthenticated }: { isAuthenticated: boolean }) {
  const router = useRouter();
  const HEADER_HEIGHT = 80;

  const scrollToSection = (sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (target) {
      window.scrollTo({
        top: target.offsetTop - HEADER_HEIGHT,
        behavior: "smooth",
      });
    }
  };

  const handleBrandLogoClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      const homeSection = document.getElementById("home");
      if (homeSection) {
        scrollToSection("home");
      } else {
        router.push("/");
      }
    }
  };

  return (
    <div className="flex flex-col items-center lg:items-start">
      <div className="relative mb-4">
        <div
          className="relative h-[30px] w-[184px] cursor-pointer"
          onClick={handleBrandLogoClick}
        >
          <h1 className="absolute font-['Manrope:Bold',_sans-serif] font-bold h-[30px] leading-[28px] left-0 text-[40px] top-0 w-[184px] whitespace-pre-wrap">
            <span className="text-[var(--primary)] text-4xl">Trust</span>
            <span className="text-[var(--accent)]">Chain</span>
          </h1>
        </div>
      </div>

      <p className="font-['Nunito:Regular',_sans-serif] font-normal leading-[24px] text-[#d1d5dc] text-[16px] max-w-[435px] mb-8 text-center lg:text-left">
        Blockchain-powered donation platform ensuring transparency and
        accountability in disaster relief efforts.
      </p>

      <div className="flex items-center justify-center lg:justify-start">
        <div className="w-0 h-4 mr-1 flex-shrink-0"></div>
        <img
          alt="email"
          className="w-4 h-4 mr-3 flex-shrink-0"
          src="./imports/email.png"
        />
        <p className="font-['Nunito:Regular',_sans-serif] font-normal leading-[20px] text-[#d1d5dc] text-[14px]">
          contact@bangon.org
        </p>
      </div>
    </div>
  );
}

function QuickLinks({ isAuthenticated }: { isAuthenticated: boolean }) {
  const router = useRouter();
  const HEADER_HEIGHT = 80;

  const scrollToSection = (sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (target) {
      const targetPosition = target.offsetTop - HEADER_HEIGHT;
      const currentPosition = window.pageYOffset;

      if (Math.abs(targetPosition - currentPosition) > 5) {
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      } else {
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    }
  };

  const guestLinks = [
    { name: "Home", href: "#home", sectionId: "home" },
    { name: "About", href: "#about", sectionId: "about" },
    { name: "Partners", href: "#partners", sectionId: "partners" },
    { name: "Campaigns", href: "#campaigns", sectionId: "campaigns" },
  ];

  const authenticatedLinks = [
    { name: "Dashboard", href: "/dashboard", route: "/dashboard" },
    { name: "My Donations", href: "/donation", route: "/donation" },
    { name: "Fact Check", href: "/fact-check", route: "/fact-check" },
    { name: "Request Help", href: "/request-help", route: "/request_help" },
  ];

  const links = isAuthenticated ? authenticatedLinks : guestLinks;

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    link: any
  ) => {
    e.preventDefault();

    if (isAuthenticated && link.route) {
      router.push(link.route);
    } else if (!isAuthenticated && link.sectionId) {
      const targetSection = document.getElementById(link.sectionId);
      if (targetSection) {
        scrollToSection(link.sectionId);
      } else {
        router.push(`/#${link.sectionId}`);
      }
    }
  };

  return (
    <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
      <h3 className="font-['Manrope:SemiBold',_sans-serif] font-semibold leading-[27px] text-[18px] text-white mb-6">
        Quick Links
      </h3>
      <ul className="space-y-4">
        {links.map((link, index) => (
          <li key={index}>
            <a
              href={link.href}
              onClick={(e) => handleLinkClick(e, link)}
              className="font-['Nunito:Regular',_sans-serif] font-normal leading-[24px] text-[#d1d5dc] text-[16px] hover:text-white transition-colors cursor-pointer"
            >
              {link.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContactInfo() {
  const contactItems = [
    { label: "support@trustchain.org", type: "email" },
    { label: "+1 (555) 123-4567", type: "phone" },
  ];

  return (
    <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
      <h3 className="font-['Manrope:SemiBold',_sans-serif] font-semibold leading-[24px] text-[16px] text-white mb-4">
        Contact
      </h3>
      <ul className="space-y-2">
        {contactItems.map((item, index) => (
          <li key={index}>
            <p className="font-['Nunito:Regular',_sans-serif] font-normal leading-[20px] text-[#d1d5dc] text-[14px]">
              {item.label}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const { user } = useUser();
  const isAuthenticated = !!user;

  return (
    <footer className="bg-gradient-to-b from-[#162D71] to-[#1C398E] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
          <div className="lg:col-span-6 text-center lg:text-left flex flex-col items-center lg:items-start">
            <BrandSection isAuthenticated={isAuthenticated} />
          </div>

          <div className="ml-40 lg:col-span-3 text-center lg:text-left flex flex-col items-center lg:items-start">
            <QuickLinks isAuthenticated={isAuthenticated} />
          </div>

          <div className="ml-30 lg:col-span-3 text-center lg:text-left flex flex-col items-center lg:items-start">
            <ContactInfo />
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 pb-5">
          <p className="font-['Nunito:Regular',_sans-serif] font-normal leading-[20px] text-[#d1d5dc] text-[14px] text-center">
            © 2025 TrustChain. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
