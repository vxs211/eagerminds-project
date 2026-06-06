import type { Metadata } from "next";
import "./globals.css";

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
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
