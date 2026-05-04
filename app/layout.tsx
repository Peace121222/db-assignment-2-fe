import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Shopee",
  description: "Database Assignment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="bg-zinc-50 antialiased">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
