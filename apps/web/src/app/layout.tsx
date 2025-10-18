import type { Metadata } from "next";
import "../styles/globals.css";
import { Manrope, Nunito } from 'next/font/google';
import '../styles/globals.css'; 

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

export const metadata: Metadata = {
  title: "TrustChain",
  description: "Bridging the trust gap in disaster relief through blockchain technology and AI-powered verification.",
  icons: {
    icon: "./imports/logo.png", 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${nunito.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
