import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-navy text-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <span className="text-sm font-semibold text-white">
              fenilo.pl
            </span>
            <span className="hidden sm:inline text-white/30">|</span>
            <span className="text-sm text-white/60">
              Giełda Transportowa
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-white/50">
            <Link
              href="/privacy-policy"
              className="hover:text-primary transition-colors"
            >
              Polityka prywatności
            </Link>
            <Link
              href="/rodo"
              className="hover:text-primary transition-colors"
            >
              RODO
            </Link>
            <Link
              href="mailto:fenilo@fenilo.pl"
              className="hover:text-primary transition-colors"
            >
              Kontakt
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-white/30">
          &copy; {new Date().getFullYear()} Fenilo. Wszelkie prawa zastrzeżone.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
