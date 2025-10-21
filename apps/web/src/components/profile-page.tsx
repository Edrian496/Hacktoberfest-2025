"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

function ProfileHeader({ fullName }: { fullName: string }) {
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="bg-gradient-to-r from-blue-900 to-[#00a7ee] pt-20 pb-32 px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
            <span className="font-['Manrope:Bold',_sans-serif] text-4xl font-bold text-blue-900">
              {initials}
            </span>
          </div>
          <div>
            <h1 className="font-['Manrope:Bold',_sans-serif] font-bold text-4xl text-white mb-2">
              {fullName}
            </h1>
            <p className="font-['Nunito:Regular',_sans-serif] text-lg text-white/80">
              TrustChain Member
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-[rgba(0,167,238,0.1)] rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="flex-1">
          <p className="font-['Arimo:Regular',_sans-serif] text-sm text-[#6a7282] mb-1">
            {label}
          </p>
          <p className="font-['Manrope:Bold',_sans-serif] font-semibold text-lg text-[#101828]">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function StatsCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="bg-gradient-to-br from-white to-[rgba(0,167,238,0.05)] rounded-xl p-6 border border-[rgba(0,167,238,0.1)] hover:border-[rgba(0,167,238,0.3)] transition-all duration-300">
      <h3 className="font-['Arimo:Regular',_sans-serif] text-sm text-[#6a7282] mb-2">
        {title}
      </h3>
      <p className="font-['Manrope:Bold',_sans-serif] font-bold text-3xl text-blue-900 mb-1">
        {value}
      </p>
      <p className="font-['Nunito:Regular',_sans-serif] text-sm text-[#4a5565]">
        {description}
      </p>
    </div>
  );
}

function ActionButton({
  label,
  icon,
  onClick,
  variant = "primary",
}: {
  label: string;
  icon: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}) {
  const baseClasses =
    "flex items-center gap-3 px-6 py-3 rounded-lg font-['Arimo:Regular',_sans-serif] font-medium transition-all duration-300";
  const variantClasses =
    variant === "primary"
      ? "bg-[#00a7ee] text-white hover:bg-blue-800 shadow-md hover:shadow-lg"
      : "bg-white text-[#101828] hover:bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md";

  return (
    <button className={`${baseClasses} ${variantClasses}`} onClick={onClick}>
      <span className="text-xl">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

export function ProfilePage() {
  const router = useRouter();
  const [userData] = useState({
    fullName: "Juan Dela Cruz",
    email: "juan.delacruz@email.com",
  });

  const handleEditProfile = () => {
    console.log("Edit profile clicked");
  };

  const handleViewDonations = () => {
    router.push("/donations");
  };

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[rgba(0,167,238,0.05)]">
      <ProfileHeader fullName={userData.fullName} />

      <div className="max-w-4xl mx-auto px-8 -mt-20 pb-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="font-['Manrope:Bold',_sans-serif] font-bold text-2xl text-[#101828] mb-6">
            Account Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoCard label="Full Name" value={userData.fullName} icon="👤" />
            <InfoCard label="Email Address" value={userData.email} icon="✉️" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="font-['Manrope:Bold',_sans-serif] font-bold text-2xl text-[#101828] mb-6">
            Your Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard
              title="Total Donations"
              value="₱5,250"
              description="Lifetime contributions"
            />
            <StatsCard
              title="Campaigns Supported"
              value="3"
              description="Active campaigns"
            />
            <StatsCard
              title="Member Since"
              value="2024"
              description="Trusted donor"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="font-['Manrope:Bold',_sans-serif] font-bold text-2xl text-[#101828] mb-6">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <ActionButton
              label="Edit Profile"
              icon="✏️"
              onClick={handleEditProfile}
              variant="secondary"
            />
            <ActionButton
              label="View Donations"
              icon="📊"
              onClick={handleViewDonations}
              variant="primary"
            />
            <ActionButton
              label="Log Out"
              icon="🚪"
              onClick={handleLogout}
              variant="secondary"
            />
          </div>
        </div>
      </div>
    </div>
  );
}