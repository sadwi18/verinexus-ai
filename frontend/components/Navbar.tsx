import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/verify", label: "Verify" },
  { href: "/history", label: "History" },
];

export default function Navbar() {
  return (
    <header className="relative z-20 flex items-center justify-between px-6 py-6 sm:px-10">
      <Link href="/" className="font-display text-xl font-bold tracking-tight">
        Veri<span className="text-accent-light">Nexus</span> AI
      </Link>

      <nav className="hidden items-center gap-8 text-sm text-white/80 md:flex">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="transition-colors hover:text-white"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
