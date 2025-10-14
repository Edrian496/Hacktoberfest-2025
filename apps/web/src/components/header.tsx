"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import svgPaths from "../../public/imports/svg-3okl1n2ttv";

export function Header() {
  const [activeSection, setActiveSection] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const HEADER_HEIGHT = 80;
  const router = useRouter();

  useEffect(() => {
    const sections = ["home", "about", "campaigns", "partners"];
    const sectionElements = sections
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    let currentActiveSection: string | null = null;
    const observers: IntersectionObserver[] = [];

    sectionElements.forEach((el) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              currentActiveSection = entry.target.id;
              setActiveSection(entry.target.id);
            } else if (entry.target.id === currentActiveSection) {
            }
          });
        },
        {
          root: null,
          rootMargin: `-${HEADER_HEIGHT}px 0px -99.9% 0px`,
          threshold: 0,
        }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  const isActive = (section: string) => activeSection === section;

  const getLinkClasses = (section: string) => {
    const baseClasses =
      "font-['Manrope:Medium',_sans-serif] font-regular text-[14px] tracking-wide transition-all duration-300 hover:text-primary";
    if (isActive(section)) {
      return `${baseClasses} text-primary border-b-[3px] border-primary pb-2`;
    }
    return `${baseClasses} text-[#364153] border-b-[3px] border-transparent hover:border-primary`;
  };

  const getMobileLinkClasses = (section: string) => {
    const baseClasses =
      "font-['Manrope:Medium',_sans-serif] font-regular text-[16px] tracking-wide transition-all duration-300 hover:text-primary block py-3";
    if (isActive(section)) {
      return `${baseClasses} text-primary border-l-[3px] border-primary pl-4`;
    }
    return `${baseClasses} text-[#364153] border-l-[3px] border-transparent hover:border-primary pl-4`;
  };

  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    e.preventDefault();
    const target = document.getElementById(sectionId);
    if (target) {
      window.scrollTo({
        top: target.offsetTop - HEADER_HEIGHT,
        behavior: "smooth",
      });
      setActiveSection(sectionId);
      setIsMenuOpen(false); // Close mobile menu after clicking
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const target = document.getElementById("home");
    if (target) {
      window.scrollTo({
        top: target.offsetTop - HEADER_HEIGHT,
        behavior: "smooth",
      });
      setActiveSection("home");
      setIsMenuOpen(false);
    }
  };

  const handleLoginClick = () => {
    router.push('/login'); 
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-2 border-gray-300 h-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">

          {/* Logo */}
          <div className="flex items-center">
            <div className="relative cursor-pointer" onClick={handleLogoClick}>
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
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
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

            <button
              onClick={handleLoginClick}
              className="h-8 rounded-[10px] border border-primary transition-colors duration-300
                         hover:bg-primary cursor-pointer group" 
            >
              <div className="h-full px-[18px] py-[6px] flex items-center justify-center">
                <span className="font-['Nunito:Regular',_sans-serif] font-normal text-[14px] text-primary
                                   group-hover:text-white">
                  Login
                </span>
              </div>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden flex flex-col justify-center items-center w-10 h-10 space-y-1.5"
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-gray-800 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-800 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-800 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`lg:hidden absolute left-0 right-0 top-20 bg-white border-b-2 border-gray-300 transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <nav className="flex flex-col py-4 px-4">
            {["home", "about", "partners", "campaigns"].map((section) => (
              <a
                key={section}
                href={`#${section}`}
                onClick={(e) => handleScroll(e, section)}
                className={getMobileLinkClasses(section)}
              >
                {section === "campaigns"
                  ? "Active Campaigns"
                  : section.charAt(0).toUpperCase() + section.slice(1)}
              </a>
            ))}
            
            <button
              onClick={handleLoginClick}
              className="mt-4 h-10 rounded-[10px] border border-primary transition-colors duration-300
                         hover:bg-primary cursor-pointer group w-full" 
            >
              <div className="h-full px-[18px] py-[6px] flex items-center justify-center">
                <span className="font-['Nunito:Regular',_sans-serif] font-normal text-[16px] text-primary
                                   group-hover:text-white">
                  Login
                </span>
              </div>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}