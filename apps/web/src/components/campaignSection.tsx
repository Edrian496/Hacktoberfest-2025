interface Campaign {
  id: number;
  title: string;
  description: string;
  location: string;
  status: 'Urgent' | 'Active' | 'Ongoing';
  amountRaised: string;
  image: string;
}

export function CampaignsSection() {
  const campaigns: Campaign[] = [
    {
      id: 1,
      title: "Typhoon Mawar Emergency Relief",
      description: "Providing immediate emergency aid including food, water, shelter, and medical supplies.",
      location: "📍 Northern Luzon",
      status: "Urgent",
      amountRaised: "₱1,875,000",
      image: "./imports/Disaster1.png"
    },
    {
      id: 2,
      title: "Mindanao Earthquake Recovery",
      description: "Long-term recovery support including housing reconstruction and livelihood restoration.",
      location: "📍 Southern Philippines",
      status: "Active",
      amountRaised: "₱980,000",
      image: "./imports/Disaster2.png"
    },
    {
      id: 3,
      title: "Flash Flood Response Fund",
      description: "Emergency response for families displaced by recent flash floods.",
      location: "📍 Metro Manila",
      status: "Active",
      amountRaised: "₱520,000",
      image: "./imports/Disaster3.png"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Urgent':
        return 'bg-[#ffe2e2] border-[#ffc9c9] text-[#9f0712]';
      case 'Active':
        return 'bg-[rgba(250,204,21,0.2)] border-[rgba(250,204,21,0.3)] text-gray-900';
      case 'Ongoing':
        return 'bg-[rgba(0,167,238,0.2)] border-[rgba(0,167,238,0.3)] text-[#00a7ee]';
      default:
        return 'bg-[rgba(250,204,21,0.2)] border-[rgba(250,204,21,0.3)] text-gray-900';
    }
  };

  return (
    <section id="campaigns" className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-['Manrope:Bold',_sans-serif] font-bold text-[60px] leading-[60px] text-[#101828] mb-6">
            ACTIVE CAMPAIGNS
          </h2>
          <p className="font-['Nunito:Regular',_sans-serif] font-normal text-[24px] leading-[39px] text-[#4a5565]">
            Support ongoing relief efforts with complete blockchain transparency.
          </p>
        </div>

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white rounded-[16px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] overflow-hidden">
              {/* Image with Status Badge */}
              <div className="relative h-48">
                <img 
                  src={campaign.image} 
                  alt={campaign.title}
                  className="w-full h-full object-cover"
                />

              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-['Manrope:Bold',_sans-serif] font-bold text-[20px] leading-[28px] text-[#101828] mb-4">
                  {campaign.title}
                </h3>
                
                <p className="font-['Nunito:Regular',_sans-serif] font-normal text-[14px] leading-[20px] text-[#4a5565] mb-4">
                  {campaign.description}
                </p>

                {/* Location and Status */}
                <div className="flex justify-between items-center mb-6">
                  <span className="font-['Arimo:Regular',_sans-serif] font-normal text-[12px] leading-[16px] text-[#6a7282]">
                    {campaign.location}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${getStatusBadge(campaign.status)}`}>
                    Status: {campaign.status}
                  </span>
                </div>

                {/* Amount Raised */}
                <div className="mb-6">
                  <div className="font-['Manrope:Bold',_sans-serif] font-bold text-[24px] leading-[32px] text-[#00a7ee] mb-1">
                    {campaign.amountRaised}
                  </div>
                  <div className="font-['Arimo:Regular',_sans-serif] font-normal text-[12px] leading-[16px] text-[#6a7282]">
                    donated so far
                  </div>
                </div>

                {/* Support Button */}
                <button className="w-full bg-[#00a7ee] text-white text-[14px] font-bold py-2 px-4 rounded-[16px] hover:bg-[#0096d1] transition-colors">
                  Support Campaign
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}