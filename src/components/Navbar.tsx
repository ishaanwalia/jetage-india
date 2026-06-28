"use client";

import { useState, useEffect } from "react";
import { Menu, X, MessageCircle, ChevronDown, Laptop, Monitor, Printer, Mouse } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const categories = [
  { id: "laptop", name: "Laptops", icon: Laptop, href: "/category/laptop/" },
  { id: "desktop", name: "Desktops", icon: Monitor, href: "/category/desktop/" },
  { id: "printer", name: "Printers", icon: Printer, href: "/category/printer/" },
  { id: "monitor", name: "Monitors", icon: Monitor, href: "/category/monitor/" },
  { id: "accessory", name: "Accessories", icon: Mouse, href: "/category/accessory/" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress((scrollY / docHeight) * 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".category-dropdown")) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Check if a link is active based on pathname
  const isLinkActive = (href: string) => {
    if (href === "/") {
      return pathname === "/" || pathname === "";
    }
    return pathname.startsWith(href.replace(/\/$/, ""));
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products/", label: "Products" },
    { href: "/about/", label: "About" },
    { href: "/showroom/", label: "Showroom" },
    { href: "/blogs/", label: "Blogs" },
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? "glass-strong py-3 shadow-lg shadow-black/5" 
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo - BIGGER SIZE */}
            <Link href="/" className="group relative flex items-center">
              <Image 
                src="/LogoJ.png" 
                alt="Jetage India - Authorized HP World Partner in Chandigarh" 
                width={80} 
                height={80} 
                className="rounded-xl transition-transform duration-300 group-hover:scale-105" 
              />
              <div className="absolute -inset-2 bg-jet-primary/0 rounded-xl group-hover:bg-jet-primary/5 transition-all duration-300" />
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 group ${
                    isLinkActive(link.href)
                      ? "text-jet-primary"
                      : "text-jet-text-dim hover:text-jet-primary"
                  }`}
                >
                  {link.label}
                  <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-jet-primary rounded-full transition-all duration-300 ${
                    isLinkActive(link.href)
                      ? "w-6 opacity-100"
                      : "w-0 opacity-0 group-hover:w-6 group-hover:opacity-100"
                  }`} />
                </Link>
              ))}

              <div className="relative category-dropdown">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCategoryOpen(!isCategoryOpen);
                  }}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-jet-text-dim hover:text-jet-primary transition-colors group relative"
                >
                  Categories
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isCategoryOpen ? 'rotate-180' : ''}`} />
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-jet-primary rounded-full w-0 opacity-0 group-hover:w-6 group-hover:opacity-100 transition-all duration-300" />
                </button>

                {isCategoryOpen && (
                  <div className="absolute top-full left-0 mt-3 w-64 glass-strong rounded-2xl overflow-hidden shadow-premium-hover border border-jet-border-strong animate-in fade-in slide-in-from-top-2 duration-200">
                    {categories.map((cat, i) => (
                      <Link
                        key={cat.id}
                        href={cat.href}
                        onClick={() => setIsCategoryOpen(false)}
                        className="flex items-center gap-3 px-5 py-3.5 text-sm text-jet-text-dim hover:text-jet-primary hover:bg-jet-primary/5 transition-all group"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        <div className="w-9 h-9 rounded-lg bg-jet-bg-elevated border border-jet-border flex items-center justify-center group-hover:border-jet-primary/30 group-hover:bg-jet-primary/10 transition-all">
                          <cat.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold">{cat.name}</p>
                          <p className="text-xs text-jet-text-muted">View all {cat.name.toLowerCase()}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <a
                href="https://wa.me/919814958295?text=Hi%20Jetage%2C%20I%20want%20to%20inquire%20about%20HP%20products"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-2 px-5 py-2.5 bg-jet-whatsapp/10 text-jet-whatsapp border border-jet-whatsapp/20 rounded-full text-sm font-semibold hover:bg-jet-whatsapp hover:text-white transition-all duration-300 overflow-hidden"
              >
                <span className="absolute inset-0 bg-jet-whatsapp translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <MessageCircle className="w-4 h-4 relative z-10" />
                <span className="relative z-10">WhatsApp</span>
              </a>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-jet-bg-card border border-jet-border hover:border-jet-primary/40 transition-all"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-jet-text" />
              ) : (
                <Menu className="w-5 h-5 text-jet-text" />
              )}
            </button>
          </div>

          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 py-6 border-t border-jet-border space-y-1 bg-jet-bg-card/95 backdrop-blur-xl rounded-2xl px-4 animate-in slide-in-from-top-2 fade-in duration-200">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 font-medium rounded-xl transition-all ${
                    isLinkActive(link.href)
                      ? "text-jet-primary bg-jet-primary/5"
                      : "text-jet-text-dim hover:text-jet-primary hover:bg-jet-primary/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="px-4 py-3">
                <p className="text-xs text-jet-text-muted uppercase tracking-wider mb-3">Categories</p>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={cat.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 py-2.5 px-3 text-jet-text-dim hover:text-jet-primary hover:bg-jet-primary/5 rounded-xl transition-all"
                    >
                      <cat.icon className="w-4 h-4" />
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-jet-border px-4">
                <a
                  href="https://wa.me/919814958295"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-jet-whatsapp text-white rounded-full text-sm font-semibold"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp Order
                </a>
              </div>
            </div>
          )}
        </div>

        <div 
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-jet-primary via-jet-accent to-jet-primary transition-all duration-100"
          style={{ width: `${scrollProgress}%` }}
        />
      </nav>
    </>
  );
}
