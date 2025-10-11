"use client";

import { useState, useEffect } from 'react';
import svgPaths from "../../public/imports/svg-3okl1n2ttv";

export function Header() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const sections = ['home', 'about', 'campaigns', 'partners'];
    const sectionElements = sections.map(id => document.getElementById(id)).filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        threshold: [0.1, 0.5, 0.9],
        rootMargin: '-80px 0px -50% 0px'
      }
    );

    sectionElements.forEach((el) => observer.observe(el));

    return () => {
      sectionElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const isActive = (section: string) => activeSection === section;

  const getLinkClasses = (section: string) => {
    const baseClasses = "font-['Manrope:Medium',_sans-serif] font-medium text-[14px] transition-colors hover:text-primary";
    if (isActive(section)) {
      return `${baseClasses} text-primary border-b-2 border-primary pb-1`;
    }
    return `${baseClasses} text-[#364153]`;
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
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 3">
                  <path d={svgPaths.p2ee09680} fill="url(#paint0_linear_5_1602)" id="Vector 4" />
                  <defs>
                    <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_5_1602" x1="9.80643e-08" x2="8.8078" y1="0.426184" y2="13.922">
                      <stop stopColor="#F1DA92" />
                      <stop offset="1" stopColor="#D2A834" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*0.007430866360664368)+(var(--transform-inner-height)*0.999972403049469)))] items-center justify-center left-[6.58px] top-[8.46px] w-[calc(1px*((var(--transform-inner-height)*0.007430866360664368)+(var(--transform-inner-width)*0.999972403049469)))]" style={{ "--transform-inner-width": "10.0625", "--transform-inner-height": "15.0625" } as React.CSSProperties}>
                <div className="flex-none rotate-[180.426deg] scale-y-[-100%]">
                  <div className="h-[3.766px] relative w-[2.519px]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 4">
                      <path d={svgPaths.p1a27a600} fill="url(#paint0_linear_5_1600)" id="Vector 5" />
                      <defs>
                        <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_5_1600" x1="1.03832e-07" x2="9.61113" y1="0.461114" y2="14.8728">
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
            <nav className="flex items-center space-x-8">
              <a 
                href="#about" 
                className={getLinkClasses('about')}
              >
                About
              </a>
              <a 
                href="#partners" 
                className={getLinkClasses('partners')}
              >
                Partners
              </a>
              <a 
                href="#campaigns" 
                className={getLinkClasses('campaigns')}
              >
                Active Campaigns
              </a>
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