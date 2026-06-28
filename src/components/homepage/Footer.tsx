import Link from "next/link";

export default function HomeFooter() {
  return (
    <footer className="w-full px-6 py-6 bg-[#f9f4fd] text-center text-sm text-primary mt-20">
      <nav className="mb-2 flex items-center justify-center gap-4">
        <Link href="/privacy" className="hover:underline">
          Privacy Policy
        </Link>
        <span aria-hidden className="text-primary/40">
          •
        </span>
        <Link href="/terms" className="hover:underline">
          Terms of Service
        </Link>
      </nav>
      <p>&copy; {new Date().getFullYear()} OverYonder. All rights reserved.</p>
    </footer>
  );
}
