"use client";

import React from 'react'; 
import { useRouter } from 'next/navigation';
import svgPaths from "../../public/imports/svg-rh6umkm19p";

function Group6() {
  return (
    <div className="absolute contents left-[30px] top-0">
      <div className="absolute left-[30px] size-[257px] top-0" data-name="bangon 2">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src="./imports/logo.png" />
      </div>
      <div className="absolute h-[35.078px] left-[172.46px] top-[93.06px] w-[23.982px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 36">
          <path d={svgPaths.p375be280} fill="url(#paint0_linear_5_387)" id="Vector 4" />
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_5_387" x1="2.47084e-07" x2="22.1922" y1="1.07382" y2="35.078">
              <stop stopColor="#F1DA92" />
              <stop offset="1" stopColor="#D2A834" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*0.007430866360664368)+(var(--transform-inner-height)*0.999972403049469)))] items-center justify-center left-[91.56px] top-[133.14px] w-[calc(1px*((var(--transform-inner-height)*0.007430866360664368)+(var(--transform-inner-width)*0.999972403049469)))]" style={{ "--transform-inner-width": "25.390625", "--transform-inner-height": "37.9375" } as React.CSSProperties}>
        <div className="flex-none rotate-[180.426deg] scale-y-[-100%]">
          <div className="h-[37.953px] relative w-[25.392px]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26 38">
              <path d={svgPaths.p4feca00} fill="url(#paint0_linear_5_414)" id="Vector 5" />
              <defs>
                <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_5_414" x1="2.61615e-07" x2="24.2163" y1="1.16183" y2="37.4736">
                  <stop stopColor="#3970B2" />
                  <stop offset="1" stopColor="#172773" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Group16() {
  return (
    <div className="relative size-full">
      <p className="absolute font-['Manrope:Bold',_sans-serif] font-bold h-[109px] leading-[28px] left-[calc(50%-375px)] text-[150px] text-blue-900 top-[108px] w-[750px] whitespace-pre-wrap">{`B   NGON`}</p>
      <Group6 />
    </div>
  );
}

interface AirplaneProps {
  src: string;
  alt: string;
  className?: string; 
}

const AirplanePlaceholder: React.FC<AirplaneProps> = ({ src, alt, className }) => (
  <img
    src={src}
    alt={alt}
    className={`absolute hidden lg:block ${className || ''}`} 
  />
);


export function HeroSection() {
    const router = useRouter();

  const handleDonateClick = () => {
    router.push('/login'); 
  };

  return (
<section className="bg-[rgba(0,167,238,0.05)] min-h-[900px] relative flex items-center justify-center overflow-hidden">
  <AirplanePlaceholder src="./imports/airplane4.png" alt="Airplane 1" className="top-[600px] left-[20%] w-[140px] lg:w-[170px] transition-transform duration-300 hover: hover:translate-x-5 hover:-translate-y-5" />
  <AirplanePlaceholder src="./imports/airplane5.png" alt="Airplane 3" className="bottom-[240px] left-[8%] w-[180px] lg:w-[250px] transition-transform duration-300 hover: hover:translate-x-5 hover:-translate-y-5" />
  <AirplanePlaceholder src="./imports/airplane2.png" alt="Airplane 4" className="top-[400px] right-[8%] w-[180px] lg:w-[250px] transition-transform duration-300 hover: hover:-translate-x-5 hover:-translate-y-5" />
  <AirplanePlaceholder src="./imports/airplane3.png" alt="Airplane 5" className="bottom-[-30px] right-[1%] w-[230px] lg:w-[300px] transition-transform duration-300 hover: hover:-translate-x-5 hover:-translate-y-5" />
  <AirplanePlaceholder src="./imports/airplane1.png" alt="Airplane 2" className="top-[600px] left-[1%] w-[230px] lg:w-[300px] transition-transform duration-300 hover: hover:translate-x-5 hover:-translate-y-5" />
  <AirplanePlaceholder src="./imports/airplane6.png" alt="Airplane 6" className="top-[600px] right-[20%] w-[140px] lg:w-[170px] transition-transform duration-300 hover: hover:-translate-x-5 hover:-translate-y-5" />

      <div className="max-w-7xl mx-auto px-8 text-center relative z-10 -mt-45"> 
        {/* Logo and Main Title */}
        <div className="relative mb-0 flex justify-center">
          <div className="relative w-[656px] h-[210px]">
            <Group16 />
          </div>
        </div>

        <div className="mb-8">
          <p className="font-['Nunito:Regular',_sans-serif] font-normal text-[24px] text-[#4a5565] leading-[39px] max-w-[896px] mx-auto">
            Blockchain-powered donations with AI fact-checking. Every contribution is tracked transparently from donor to beneficiary.
          </p>
        </div>

        <div className="bg-[rgba(250,204,21,0.75)] rounded-[10px] px-12 py-4 inline-flex items-center justify-center cursor-pointer hover:bg-yellow-200 transition-colors " 
        onClick={handleDonateClick}>
          <span className="font-['Arimo:Regular',_sans-serif] font-normal text-[18px] text-blue-900 leading-[28px]">
            Donate Now
          </span>
        </div>
      </div>
    </section>
  );
}