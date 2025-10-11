import Link from "next/link";
import { useNavigationHelper } from "@/hooks/useNavigationHelper";

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/actuallyedison/" },
  { label: "Behance", href: "https://www.behance.net/edisonronquil1" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/edison-ronquillo-pazmino/" },
];

export default function Footer() {
    const { navigateWithTransition } = useNavigationHelper();
  
  return (
    <footer className="font-mono px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24">
      <div className="mx-auto py-6 flex flex-col md:flex-row items-center md:items-start justify-between gap-4 md:gap-0">
        <ul className="flex flex-wrap justify-center md:justify-start gap-4 sm:gap-6 md:gap-8 text-xs sm:text-sm">
          {socials.map(s => (
            <li key={s.label}>
              <Link href={s.href} target="_blank" className="relative group">
                {s.label}
                <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-footer-gray transition-all duration-500 group-hover:w-full"></span>
              </Link>
            </li>
          ))}
          <li className="ml-12">
            <button 
              onClick={() => navigateWithTransition('/terms', { 
                direction: 'right', 
                color: "white",
                duration: 1200
              })}
              className="relative group cursor-pointer"
            >
              Terms of Service & Privacy Policy
              <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-footer-gray transition-all duration-500 group-hover:w-full"></span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => navigateWithTransition('/cookies', { 
                direction: 'right', 
                color: "white",
                duration: 1200
              })}
              className="relative group cursor-pointer"
            >              Cookies
              <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-footer-gray transition-all duration-500 group-hover:w-full"></span>
            </button>
          </li>
        </ul>

        <p className="text-xs">
          show-off — {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}