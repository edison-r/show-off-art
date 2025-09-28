import Link from "next/link";

const socials = [
  { label: "Facebook", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "Twitter", href: "#" },
  { label: "LinkedIn", href: "#" },
];

export default function Footer() {
  return (
    <footer className="md:px-16 xl:px-24 px-4 bg-neutral-900">
      <div className="mx-auto py-6 flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
        <ul className="flex flex-wrap gap-4 text-sm text-neutral-50">
          {socials.map(s => (
            <li key={s.label}>
              <Link href={s.href} className="hover:underline">{s.label}</Link>
            </li>
          ))}
          <li><Link href="#" className="hover:underline">Privacy Policy</Link></li>
          <li><Link href="#" className="hover:underline">Cookies</Link></li>
        </ul>

        <p className="text-xs text-neutral-50">
          show-off — {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
