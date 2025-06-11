import { Geist, Geist_Mono } from "next/font/google";
import AuthGuard from "./AuthGuard";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Home - Feed Them Money",
  keywords: ["Feed Them Money", "Finance", "Expenses", "Budgeting"],
  authors: [{ name: "Feed Them Money Team", url: "https://feedthemmoney.com" }],
  creator: "Feed Them Money Team",
  description: "Feed Them Money is a tool to help you manage your finances and track your expenses.",
};

function Navbar() {
  return (
    <nav className="bg-blue-950 text-white px-6 py-3 flex gap-6 items-center shadow">
      <Link href="#" className="font-bold text-lg ">Feed Them Money</Link>
      <Link href="/app" className=" hover:underline">Home</Link>
      <Link href="/app/transactions" className=" hover:underline">Transactions</Link>
      <Link href="/app/settings" className=" hover:underline">Settings</Link>
      <Link href="/app/logout" className="ml-auto hover:underline">Logout</Link>
    </nav>
  );
}

export default function Layout({ children }) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased text-black dark:text-black bg-gray-100 min-h-screen`}>
      <AuthGuard>
        <Navbar />
        <main>{children}</main>
      </AuthGuard>
    </div>
  );
}
