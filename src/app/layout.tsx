import type { Metadata } from "next";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import { InstitutionProvider } from "@/context/InstitutionContext";
import QueryProvider from "@/context/QueryProvider";
import CookieConsent from "@/components/CookieConsent";


export const metadata: Metadata = {
  title: "OverYonder",
  description: "The number #1 campus engagement platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`antialiased scroll-smooth`}
      >
        <QueryProvider>
          <UserProvider>
            <InstitutionProvider>{children}</InstitutionProvider>
          </UserProvider>
        </QueryProvider>
        <CookieConsent />
      </body>
    </html>
  );
}
