import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { Web3Provider } from "@/providers/Web3Provider";
import { ToastProvider } from "@/providers/ToastProvider";
import { ToastContainer } from "@/components/common/ToastContainer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BookChain - Web3 도서 대여 플랫폼",
  description: "블록체인 기술로 안전하게 보호되는 P2P 도서 대여 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <AuthProvider>
            <Web3Provider>
              <ToastProvider>
                {children}
                <ToastContainer />
              </ToastProvider>
            </Web3Provider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
