function Group8() {
  return (
    <div className="relative ml-2 mt-2">
      <div className="relative w-[67px] h-[67px]">
        <img
          alt=""
          className="absolute inset-0.5 w-full h-full object-cover -translate-y-[45px]"
          src="./imports/emblem_small.png"
        />
      </div>
    </div>
  );
}

function BrandSection() {
  return (
    <div className="flex flex-col items-center lg:items-start">
      <div className="relative mb-4">
        <div className="relative h-[30px] w-[184px]">
          <p className="absolute font-['Manrope:Bold',_sans-serif] font-bold h-[30px] leading-[28px] left-0 text-[40px] text-gray-100 top-0 w-[184px] whitespace-pre-wrap">
            {`B   NGON`}
          </p>
          <div className="absolute left-[2px] top-[18px]">
            <Group8 />
          </div>
        </div>
      </div>

      <p className="font-['Nunito:Regular',_sans-serif] font-normal leading-[24px] text-[#d1d5dc] text-[16px] max-w-[435px] mb-8 text-center lg:text-left">
        {" "}
        {/* Added text-center for mobile */}
        Blockchain-powered donation platform ensuring transparency and
        accountability in disaster relief efforts.
      </p>

      <div className="flex items-center justify-center lg:justify-start">
        <div className="w-4 h-4 mr-3 flex-shrink-0"></div>
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
    { name: "Partners", href: "#partners" },
  ];

  return (
    <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
      {" "}
      {/* Added items-center and text-center */}
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
    { label: "+1 (555) 123-4567", type: "phone" },
  ];

  return (
    <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
      {" "}
      {/* Added items-center and text-center */}
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
          <div className="lg:col-span-6 text-center lg:text-left flex flex-col items-center lg:items-start">
            <BrandSection />
          </div>

          <div className="lg:col-span-3 text-center lg:text-left flex flex-col items-center lg:items-start">
            <QuickLinks />
          </div>

          <div className="lg:col-span-3 text-center lg:text-left flex flex-col items-center lg:items-start">
            <ContactInfo />
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8">
          <p className="font-['Nunito:Regular',_sans-serif] font-normal leading-[20px] text-[#d1d5dc] text-[14px] text-center">
            © 2025 Bangon. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
