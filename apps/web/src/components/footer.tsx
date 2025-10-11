import svgPaths from "./imports/svg-exttrbbolr";
import imgBangon2 from "figma:asset/dcdd7aafc46ccc47051f47da4f0d1d394701e2ab.png";

function Group8() {
  return (
    <div className="relative ml-2 mt-2">
      <div className="relative w-[67px] h-[67px]">
        <img alt="" className="absolute inset-0 w-full h-full object-cover -translate-y-[42px]" src={imgBangon2} />
      </div>
      <div className="absolute h-[9px] left-[37px] top-[6px] w-[6px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 10">
          <path d={svgPaths.p3f09b580} fill="url(#paint0_linear_5_1610)" id="Vector 4" />
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_5_1610" x1="6.42787e-08" x2="5.77329" y1="0.279353" y2="9.12552">
              <stop stopColor="#F1DA92" />
              <stop offset="1" stopColor="#D2A834" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute left-[22px] top-[16px] w-[7px] h-[10px] flex items-center justify-center">
        <div className="rotate-[180.426deg] scale-y-[-100%]">
          <div className="h-[10px] relative w-[7px]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 10">
              <path d={svgPaths.p36062900} fill="url(#paint0_linear_5_1608)" id="Vector 5" />
              <defs>
                <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_5_1608" x1="6.8059e-08" x2="6.29985" y1="0.302249" y2="9.74873">
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

function BrandSection() {
  return (
    <div className="flex flex-col">
      {/* Logo */}
      <div className="relative mb-4">
        <div className="relative h-[30px] w-[184px]">
          <p className="absolute font-['Manrope:Bold',_sans-serif] font-bold h-[30px] leading-[28px] left-0 text-[40px] text-gray-100 top-0 w-[184px] whitespace-pre-wrap">{`B    NGON`}</p>
          <div className="absolute left-[2px] top-[18px]">
            <Group8 />
          </div>
        </div>
      </div>
      
      {/* Description */}
      <p className="font-['Nunito:Regular',_sans-serif] font-normal leading-[24px] text-[#d1d5dc] text-[16px] max-w-[435px] mb-8">
        Blockchain-powered donation platform ensuring transparency and accountability in disaster relief efforts.
      </p>
      
      {/* Contact */}
      <div className="flex items-center">
        <div className="w-4 h-4 mr-3 flex-shrink-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 13">
            <path d={svgPaths.p3ece6300} id="Vector_2" stroke="#D1D5DC" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
        <p className="font-['Nunito:Regular',_sans-serif] font-normal leading-[20px] text-[#d1d5dc] text-[14px]">
          contact@bangon.org
        </p>
      </div>
    </div>
  );
}

function QuickLinks() {
  const links = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Fact Check", href: "#fact-check" },
    { name: "Campaigns", href: "#campaigns" },
    { name: "Partners", href: "#partners" }
  ];

  return (
    <div className="flex flex-col">
      <h3 className="font-['Manrope:SemiBold',_sans-serif] font-semibold leading-[27px] text-[18px] text-white mb-6">
        Quick Links
      </h3>
      <ul className="space-y-4">
        {links.map((link, index) => (
          <li key={index}>
            <a 
              href={link.href}
              className="font-['Nunito:Regular',_sans-serif] font-normal leading-[24px] text-[#d1d5dc] text-[16px] hover:text-white transition-colors"
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
    { label: "support@bangon.org", type: "email" },
    { label: "+1 (555) 123-4567", type: "phone" }
  ];

  return (
    <div className="flex flex-col">
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
  return (
    <footer className="bg-blue-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
          {/* Brand Section - Takes up more space */}
          <div className="lg:col-span-6">
            <BrandSection />
          </div>
          
          {/* Quick Links */}
          <div className="lg:col-span-3">
            <QuickLinks />
          </div>
          
          {/* Contact Info */}
          <div className="lg:col-span-3">
            <ContactInfo />
          </div>
        </div>
        
        {/* Bottom Border and Copyright */}
        <div className="border-t border-gray-100 pt-8">
          <p className="font-['Nunito:Regular',_sans-serif] font-normal leading-[20px] text-[#d1d5dc] text-[14px] text-center">
            © 2025 Bangon. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}