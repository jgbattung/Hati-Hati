import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Footer from "@/components/shared/Footer";

export const metadata: Metadata = {
  title: "Hati-Hati",
  description: "Expense sharing app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      afterSignOutUrl="sign-in"
    >
      <html lang="en">
        <body className="bg-gray-800">
          <main>
            {children}
          </main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
