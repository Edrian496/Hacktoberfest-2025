"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/lib/useUser";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from '../../components/ui/footer_user';
import "../../styles/globals.css";
import { Manrope, Nunito } from 'next/font/google';
import { motion } from "framer-motion";
import Image from "next/image"; 
import Emblem from '../../../public/imports/emblem.png';

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap', 
  variable: '--font-manrope', 
});

const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito', 
});


export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && (pathname === "/" || pathname === "/home")) {
      router.replace("/dashboard");
    }
  }, [user, pathname, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="flex flex-col items-center justify-center">

          <motion.div
            initial={{
              rotateY: 0
            }}
            animate={{
              rotateY: 360
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear"
            }}
            className="relative w-40 h-40"
            style={{
              transformStyle: "preserve-3d",
              perspective: 1000,
            }}
          >
            <Image
              src={Emblem}
              alt="TrustChain Emblem"
              fill
              className="object-contain"
              priority
              style={{ backfaceVisibility: "hidden" }}
            />
          </motion.div>

          <div className="flex gap-2 mt-3">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '10ms' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '250ms' }}></div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <div className="flex flex-1">
        <main className="flex-1 p-6">{children}</main>
        <body
        className={`${manrope.variable} ${nunito.variable} antialiased`}
      ></body>
      </div>

      <Footer />
    </div>
  );
}