import Link from "next/link";
import { Star, Twitter, Linkedin, Github } from "lucide-react";

const FOOTER_LINKS = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Live Demo", href: "/dashboard" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
  ],
  Resources: [
    { label: "Help Center", href: "/help" },
    { label: "API Docs", href: "/docs" },
    { label: "Status", href: "/status" },
  ],
  Legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="container py-16">
        <div className="grid gap-10 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2 text-lg font-bold text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600">
                <Star className="h-4 w-4 fill-white text-white" />
              </span>
              Reputicious
            </Link>
            <p className="mt-4 max-w-xs text-sm text-slate-400">
              AI-powered review management for local businesses that want to grow their
              reputation on autopilot.
            </p>
            <div className="mt-6 flex gap-4">
              <Link href="#" className="text-slate-500 hover:text-white">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-slate-500 hover:text-white">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-slate-500 hover:text-white">
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-sm font-semibold text-white">{section}</h4>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Reputicious. All rights reserved.
          </p>
          <p className="text-xs text-slate-500">Made for local businesses, everywhere.</p>
        </div>
      </div>
    </footer>
  );
}
