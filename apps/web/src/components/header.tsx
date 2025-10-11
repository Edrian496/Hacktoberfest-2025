"use client";

import { useState, useEffect } from "react";
import svgPaths from "../../public/imports/svg-3okl1n2ttv";

export function Header() {
  const [activeSection, setActiveSection] = useState("home");
  const HEADER_HEIGHT = 80; // Define your header height for easy adjustment

  useEffect(() => {
    const sections = ["home", "about", "campaigns", "partners"];
    const sectionElements = sections
      .map((id) => document.getElementById(id))
      .filter(Boolean); // Ensure elements exist

    // Store a reference to the active observer to clean up
    let currentActiveSection: string | null = null;
    const observers: IntersectionObserver[] = [];

    sectionElements.forEach((el) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // When a section enters the viewport area defined by rootMargin,
              // set it as the active section.
              // The rootMargin will make sure it becomes active when its top passes the header.
              currentActiveSection = entry.target.id;
              setActiveSection(entry.target.id);
            } else if (entry.target.id === currentActiveSection) {
              // If the currently active section scrolls *out* of view
              // (e.g., scrolling up past it), we need to find the next active section.
              // This part can be tricky. A better approach is to rely on the
              // 'isIntersecting' of the *next* section to become active.
              // For simplicity with this observer setup, let's trust the
              // 'isIntersecting' of the next one to take over.
            }
          });
        },
        {
          root: null, // default to the viewport
          // rootMargin: Top, Right, Bottom, Left
          // We want the intersection to happen when the section's top is at HEADER_HEIGHT from the viewport top
          // The bottom margin needs to be large enough so sections don't 'disappear' too early.
          // Or, more robustly, detect when the top of the element crosses the header line.
          rootMargin: `-${HEADER_HEIGHT}px 0px -99.9% 0px`, // Detect when top of section crosses the header line
          threshold: 0, // Trigger immediately when any part enters/leaves the rootMargin
        }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []); // Empty dependency array means this runs once on mount

  const isActive = (section: string) => activeSection === section;

  const getLinkClasses = (section: string) => {
    const baseClasses =
      "font-['Manrope:Medium',_sans-serif] font-regular text-[14px] tracking-wide transition-all duration-300 hover:text-primary";
    if (isActive(section)) {
      return `${baseClasses} text-primary border-b-[3px] border-primary pb-2`;
    }
    return `${baseClasses} text-[#364153] border-b-[3px] border-transparent hover:border-primary`;
  };

  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    e.preventDefault();
    const target = document.getElementById(sectionId);
    if (target) {
      window.scrollTo({
        top: target.offsetTop - HEADER_HEIGHT, // adjust offset to match your header height
        behavior: "smooth", // 👈 smooth scrolling
      });
      // Immediately set the active section when a link is clicked
      setActiveSection(sectionId);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 h-20">
      <div className="max-w-7xl mx-auto px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex items-center">
            <div className="relative">
              <div className="size-16" data-name="bangon 2">
                <img
                  alt="Bangon Logo"
                  className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full"
                  src="./imports/emblem.png"
                />
              </div>
              <div className="absolute h-[2.206px] left-[11.62px] top-[4.31px] w-[1.509px]">
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
                className="absolute flex h-[calc(1px*((var(--transform-inner-width)*0.007430866360664368)+(var(--transform-inner-height)*0.999972403049469)))] items-center justify-center left-[6.58px] top-[8.46px] w-[calc(1px*((var(--transform-inner-height)*0.007430866360664368)+(var(--transform-inner-width)*0.999972403049469)))]"
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
          </div>

          {/* Right side container with Navigation and Login */}
          <div className="flex items-center space-x-8">
            {/* Navigation */}
            <nav className="flex items-center space-x-10">
              {["home", "about", "partners", "campaigns"].map((section) => (
                <a
                  key={section}
                  href={`#${section}`}
                  onClick={(e) => handleScroll(e, section)}
                  className={getLinkClasses(section)}
                >
                  {section === "campaigns"
                    ? "Active Campaigns"
                    : section.charAt(0).toUpperCase() + section.slice(1)}
                </a>
              ))}
            </nav>

            {/* Login Button */}
            <div className="bg-slate-50 h-8 rounded-[10px] border border-primary">
              <div className="h-full px-[13px] py-[6px] flex items-center justify-center">
                <span className="font-['Nunito:Regular',_sans-serif] font-normal text-[14px] text-primary">
                  Login
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}