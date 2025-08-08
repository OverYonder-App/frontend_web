import type { Metadata } from "next";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import { InstitutionProvider } from "@/context/InstitutionContext";


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
        <UserProvider>
          <InstitutionProvider>{children}</InstitutionProvider>
        </UserProvider>
      </body>
    </html>
  );
}
