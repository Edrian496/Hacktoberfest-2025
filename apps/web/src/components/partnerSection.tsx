import { ImageWithFallback } from './figma/ImageWithFallback';


interface Partner {
  id: number;
  name: string;
  description: string;
  designation: 'NGO' | 'LGU';
  image: string;
}

export function PartnersSection() {
  const partners: Partner[] = [
    {
      id: 1,
      name: "Philippine Red Cross",
      description: "Leading humanitarian organization",
      designation: "NGO",
      image: "./imports/angatbuhay.jpg"
    },
    {
      id: 2,
      name: "UNICEF Philippines",
      description: "Children and family welfare",
      designation: "NGO",
      image: "./imports/angatbuhay.jpg"
    },
    {
      id: 3,
      name: "World Vision",
      description: "Global humanitarian organization",
      designation: "NGO",
      image: "./imports/angatbuhay.jpg"
    },
    {
      id: 4,
      name: "Operation Blessing",
      description: "Disaster relief and aid",
      designation: "NGO",
      image: "./imports/angatbuhay.jpg"
    },
    {
      id: 5,
      name: "Gawad Kalinga",
      description: "Community development",
      designation: "LGU",
      image: "./imports/angatbuhay.jpg"
    },
    {
      id: 6,
      name: "Habitat for Humanity",
      description: "Housing and infrastructure",
      designation: "LGU",
      image: "./imports/angatbuhay.jpg"
    }
  ];

  return (
    <section id="partners" className="bg-slate-50 py-20 relative overflow-hidden">

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="font-['Manrope:Bold',_sans-serif] font-bold text-[60px] leading-[60px] text-gray-900 mb-6">
            TRUSTED PARTNERS
          </h2>
          <p className="font-['Nunito:Regular',_sans-serif] font-normal text-[24px] leading-[39px] text-[rgba(17,24,39,0.8)] max-w-4xl mx-auto">
            Working together with world-class organizations to deliver transparent, effective disaster relief.
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-6">
          {partners.map((partner) => (
            <div key={partner.id} className="bg-[rgba(0,167,238,0.05)] border-2 border-[#00a7ee] rounded-[24px] p-8 relative hover:shadow-lg transition-shadow">
              {/* Designation Badge - All Yellow */}
              <div className="absolute top-4 right-4 bg-[#FACC15] px-3 py-1 rounded-full">
                <span className="text-[#111827] text-[14px] font-bold capitalize">
                  {partner.designation}
                </span>
              </div>

              {/* Logo */}
              <div className="bg-slate-50 w-20 h-20 rounded-[16px] mx-auto mb-4 overflow-hidden border-2 border-white shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]">
                <img 
                  src="./imports/angatbuhay.jpg"
                  alt={partner.name}
                  className="w-full h-full object-cover p-0.5"
                />
              </div>

              {/* Content */}
              <div className="text-center">
                <h3 className="font-['Manrope:Bold',_sans-serif] font-bold text-[20px] leading-[28px] text-gray-900 mb-2">
                  {partner.name}
                </h3>
                <p className="font-['Nunito:Regular',_sans-serif] font-normal text-[16px] leading-[24px] text-[rgba(17,24,39,0.7)]">
                  {partner.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="bg-[rgba(255,255,255,0.6)] border border-[rgba(0,167,238,0.2)] rounded-[16px] p-6 text-center">
            <div className="font-['Manrope:Bold',_sans-serif] font-bold text-[36px] leading-[40px] text-[#00a7ee] mb-2">
              50+
            </div>
            <p className="font-['Nunito:Regular',_sans-serif] font-normal text-[16px] leading-[24px] text-[rgba(17,24,39,0.7)]">
              Active Partners
            </p>
          </div>
          
          <div className="bg-[rgba(255,255,255,0.6)] border border-[rgba(30,58,138,0.2)] rounded-[16px] p-6 text-center">
            <div className="font-['Manrope:Bold',_sans-serif] font-bold text-[36px] leading-[40px] text-blue-900 mb-2">
              25
            </div>
            <p className="font-['Nunito:Regular',_sans-serif] font-normal text-[16px] leading-[24px] text-[rgba(17,24,39,0.7)]">
              Places served
            </p>
          </div>
          
          <div className="bg-[rgba(255,255,255,0.6)] border border-[rgba(250,204,21,0.2)] rounded-[16px] p-6 text-center">
            <div className="font-['Manrope:Bold',_sans-serif] font-bold text-[36px] leading-[40px] text-yellow-400 mb-2">
              $2M+
            </div>
            <p className="font-['Nunito:Regular',_sans-serif] font-normal text-[16px] leading-[24px] text-[rgba(17,24,39,0.7)]">
              Distributed Together
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <button className="bg-[#00a7ee] hover:bg-[#0096d1] text-white px-8 py-3 rounded-[16px] font-bold text-[14px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] transition-colors">
              Become a Partner
            </button>
            <button className="bg-slate-50 border border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white px-8 py-3 rounded-[16px] font-bold text-[14px] transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}