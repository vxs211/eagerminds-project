import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bookmarks - Your Personal Link Directory",
  description:
    "Save, manage, and share your favorite bookmarks with the world. Think Linktree meets Pocket.",
  openGraph: {
    title: "Bookmarks - Your Personal Link Directory",
    description: "Save and share your favorite links easily.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bookmarks",
    description: "Save and share your favorite links easily.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
