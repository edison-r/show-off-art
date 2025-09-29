import Link from "next/link";

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/actuallyedison/" },
  { label: "Behance", href: "https://www.behance.net/edisonronquil1" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/edison-ronquillo-pazmino/" },
];

export default function Footer() {
  return (
    <footer className="font-mono md:px-16 xl:px-24 px-4">
      <div className="mx-auto py-6 flex flex-col md:flex-row items-center md:items-start justify-between">
        <ul className="flex flex-wrap gap-8 text-sm">
          {socials.map(s => (
            <li key={s.label}>
              <Link href={s.href} className="relative group">{s.label}
              <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-footer-gray transition-all duration-500 group-hover:w-full"></span>
              </Link>
            </li>
          ))}
          <li><Link href="#" className="relative group">Privacy Policy
          <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-footer-gray transition-all duration-500 group-hover:w-full"></span>
          </Link></li>
          <li><Link href="#" className="relative group">Cookies
          <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-footer-gray transition-all duration-500 group-hover:w-full"></span>
          </Link></li>
        </ul>

        <p className="text-xs">
          show-off — {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
