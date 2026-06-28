import Link from "next/link";
import HomeHeader from "@/components/homepage/Header";
import HomeFooter from "@/components/homepage/Footer";

// Shared shell for static legal pages (privacy, terms). Child markup is plain
// semantic HTML (h2/p/ul) — element styling is applied here via arbitrary
// variants so the pages stay free of repeated utility classes.
export default function LegalPage({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <HomeHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <h1 className="text-3xl font-bold text-primary">{title}</h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: {lastUpdated}</p>

        <div
          className="mt-8 space-y-4 text-gray-700
            [&_a]:text-primary [&_a]:underline
            [&_h2]:mt-8 [&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-gray-900
            [&_li]:leading-relaxed
            [&_p]:leading-relaxed
            [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6"
        >
          {children}
        </div>

        <div className="mt-12">
          <Link href="/" className="text-primary underline">
            ← Back to home
          </Link>
        </div>
      </main>
      <HomeFooter />
    </div>
  );
}
