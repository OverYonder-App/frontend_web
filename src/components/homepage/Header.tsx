import Link from "next/link";

export default function HomeHeader() {
  return (
    <header className="w-full px-6 py-4 bg-white shadow-sm flex items-center justify-between">
      <Link href="/">
      <h1 className="text-xl font-bold text-primary">OverYonder</h1>
      </Link>
      <nav className="space-x-4 text-sm text-primary">
        <a href="#features">Features</a>
        <a href="#preview">Preview</a>
        <a href="#faq">FAQ</a>
        <a href="/login" className="font-semibold underline">
          Login
        </a>
      </nav>
    </header>
  );
}
