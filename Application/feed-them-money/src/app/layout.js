import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Login - Feed Them Money",
  keywords: ["Feed Them Money", "Finance", "Expenses", "Budgeting"],
  authors: [{ name: "Feed Them Money Team", url: "https://feedthemmoney.com" }],
  creator: "Feed Them Money Team",
  description: "Feed Them Money is a tool to help you manage your finances and track your expenses.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
