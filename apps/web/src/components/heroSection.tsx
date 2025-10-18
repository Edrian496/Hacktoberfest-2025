"use client";

import React from "react";
import { useRouter } from "next/navigation";

function Group16() {
  return (
    <div className="relative size-full">
      <p className="absolute font-['Manrope:Bold',_sans-serif] font-bold h-[52%] leading-[0.19] left-0 text-[min(18vw,130px)] top-[51.4%] w-full whitespace-pre-wrap flex items-center justify-center">
        <span className="text-blue-900 text-[min(18vw,130px)]">Trust</span>
        <span className="text-[#FACC15]">Chain</span>
      </p>{" "}
    </div>
  );
}

interface AirplaneProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

const AirplanePlaceholder: React.FC<AirplaneProps> = ({
  src,
  alt,
  className = "",
  style,
}) => (
  <img src={src} alt={alt} className={`absolute ${className}`} style={style} />
);

export function HeroSection() {
  const router = useRouter();

  const handleDonateClick = () => {
    router.push("/login");
  };

  return (
    <section className="bg-[rgba(0,167,238,0.05)] h-screen min-h-[600px] relative flex items-center justify-center overflow-hidden">
      <AirplanePlaceholder
        src="./imports/airplane4.png"
        alt="Airplane 1"
        className="hidden md:block transition-transform duration-300 hover:translate-x-5 hover:-translate-y-5"
        style={{
          top: "65%",
          left: "33%",
          width: "clamp(100px, 14vw, 170px)",
          transform: "translate(-50%, -50%)",
          userSelect: "none",
          pointerEvents: "auto",
        }}
      />

      <AirplanePlaceholder
        src="./imports/airplane5.png"
        alt="Airplane 2"
        className="hidden md:block transition-transform duration-300 hover:translate-x-5 hover:-translate-y-5"
        style={{
          bottom: "48%",
          left: "19%",
          width: "clamp(130px, 18vw, 250px)",
          transform: "translate(-50%, 50%)",
          userSelect: "none",
          pointerEvents: "auto",
        }}
      />

      <AirplanePlaceholder
        src="./imports/airplane2.png"
        alt="Airplane 3"
        className="hidden md:block transition-transform duration-300 hover:-translate-x-5 hover:-translate-y-5"
        style={{
          top: "51%",
          right: "18%",
          width: "clamp(130px, 18vw, 250px)",
          transform: "translate(50%, -50%)",
          userSelect: "none",
          pointerEvents: "auto",
        }}
      />

      <AirplanePlaceholder
        src="./imports/airplane3.png"
        alt="Airplane 4"
        className="hidden md:block transition-transform duration-300 hover:-translate-x-5 hover:-translate-y-5"
        style={{
          bottom: "22%",
          right: "10%",
          width: "clamp(160px, 22vw, 300px)",
          transform: "translate(50%, 50%)",
          userSelect: "none",
          pointerEvents: "auto",
        }}
      />

      <AirplanePlaceholder
        src="./imports/airplane1.png"
        alt="Airplane 5"
        className="hidden md:block transition-transform duration-300 hover:translate-x-5 hover:-translate-y-5"
        style={{
          top: "76%",
          left: "10%",
          width: "clamp(160px, 22vw, 300px)",
          transform: "translate(-50%, -50%)",
          userSelect: "none",
          pointerEvents: "auto",
        }}
      />

      <AirplanePlaceholder
        src="./imports/airplane6.png"
        alt="Airplane 6"
        className="hidden md:block transition-transform duration-300 hover:-translate-x-5 hover:-translate-y-5"
        style={{
          top: "65%",
          right: "32%",
          width: "clamp(100px, 14vw, 170px)",
          transform: "translate(50%, -50%)",
          userSelect: "none",
          pointerEvents: "auto",
        }}
      />

      <div className="max-w-7xl mx-auto px-8 text-center relative z-10 -mt-65">
        <div className="relative mb-10  flex justify-center">
          <div className="relative w-full max-w-[700px] aspect-[890/210]">
            <Group16 />
          </div>
        </div>

        <div className="mb-8">
          <p className="font-['Nunito:Regular',_sans-serif] font-normal text-[clamp(16px,2.5vw,24px)] text-[#4a5565] leading-[1.625] max-w-[896px] mx-auto">
            Blockchain-powered donations with AI fact-checking. Every
            contribution is tracked transparently from donor to beneficiary.
          </p>
        </div>

        <div
          className="bg-[var(--primary)] rounded-[10px] px-8 sm:px-12 py-3 sm:py-4 inline-flex items-center justify-center cursor-pointer hover:bg-blue-800 transition-colors"
          onClick={handleDonateClick}
        >
          <span className="font-['Arimo:Regular',_sans-serif] font-normal text-[clamp(16px,1.875vw,18px)] text-white leading-[1.56]">
            Donate Now
          </span>
        </div>
      </div>
    </section>
  );
}
