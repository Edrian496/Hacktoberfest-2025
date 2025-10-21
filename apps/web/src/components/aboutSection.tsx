import svgPaths from "../../public/imports/svg-3okl1n2ttv";

export function AboutSection() {
  return (
    <section id="about" className="bg-transparent-40 py-20">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-['Manrope:Bold',_sans-serif] font-bold text-[60px] leading-[60px] text-[var(--secondary)] mb-6">
            ABOUT
          </h2>
          <p className="font-['Nunito:Regular',_sans-serif] font-normal text-[24px] leading-[39px] text-[#4a5565] max-w-[896px] mx-auto">
            Bridging the trust gap in disaster relief through blockchain technology and AI-powered verification.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
          <div className="h-[384px] rounded-[16px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] overflow-hidden">
            <img 
              alt="About TrustChain" 
              className="w-full h-full object-cover" 
              src="./imports/about.png" 
            />
          </div>

          <div className="space-y-6">
            <p className="font-['Nunito:Regular',_sans-serif] font-normal text-[18px] leading-[29.25px] text-[#4a5565]">
              In times of crisis, people want to help but face challenges with trust in donation handling and exposure to misinformation.
            </p>
            <p className="font-['Nunito:Regular',_sans-serif] font-normal text-[18px] leading-[29.25px] text-[#4a5565]">
              TrustChain combines blockchain transparency with AI-driven fact-checking to ensure donations reach those who need them most while providing accurate, verified information to communities.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-[rgba(0,167,238,0.10)] rounded-full size-20 mx-auto mb-6 flex items-center justify-center">
              <div className="size-8">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25 30">
                  <path d={svgPaths.p1e4c8800} id="Vector" stroke="#00A7EE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
                </svg>
              </div>
            </div>
            <h3 className="font-['Manrope:Bold',_sans-serif] font-bold text-[20px] leading-[28px] text-[#101828] mb-3">
              Blockchain Transparency
            </h3>
            <p className="font-['Nunito:Regular',_sans-serif] font-normal text-[16px] leading-[26px] text-[#4a5565]">
              Every donation tracked on an immutable ledger with complete transparency.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-[rgba(0,167,238,0.10)] rounded-full size-20 mx-auto mb-6 flex items-center justify-center">
              <div className="size-8">
                <img 
                src="./imports/fact-check.png" 
                alt="AI Fact-Checking" 
                className="w-full h-full object-contain" 
                />
              </div>
            </div>
            <h3 className="font-['Manrope:Bold',_sans-serif] font-bold text-[20px] leading-[28px] text-[#101828] mb-3">
              AI Fact-Checking
            </h3>
            <p className="font-['Nunito:Regular',_sans-serif] font-normal text-[16px] leading-[26px] text-[#4a5565]">
              Combat misinformation with AI-powered information verification.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-[rgba(0,167,238,0.10)] rounded-full size-20 mx-auto mb-6 flex items-center justify-center">
              <div className="size-10">
                <img 
                src="./imports/partners.png" 
                alt="Verified Partners" 
                className="w-full h-full object-contain" 
                />
              </div>
            </div>
            <h3 className="font-['Manrope:Bold',_sans-serif] font-bold text-[20px] leading-[28px] text-[#101828] mb-3">
              Verified Partners
            </h3>
            <p className="font-['Nunito:Regular',_sans-serif] font-normal text-[16px] leading-[26px] text-[#4a5565]">
              Work exclusively with accredited NGOs and verified organizations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}