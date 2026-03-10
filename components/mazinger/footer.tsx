"use client";

import { Separator } from "@/components/ui/separator";

const links = [
  { label: "Historia", href: "#about" },
  { label: "Personajes", href: "#characters" },
  { label: "Cronología", href: "#timeline" },
  { label: "Galería", href: "#gallery" },
];

export function Footer() {
  return (
    <footer className="py-12 px-4 bg-card border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <div className="text-center md:text-left">
            <h3 className="font-[var(--font-display)] text-2xl font-bold text-foreground">
              MAZINGER Z
            </h3>
            <p className="text-muted-foreground text-sm mt-1">
              Fan tribute site
            </p>
          </div>
          
          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-6">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        
        <Separator className="my-8 bg-border" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-muted-foreground text-sm">
            Mazinger Z © Go Nagai / Dynamic Planning Inc.
          </p>
          <p className="text-muted-foreground text-sm">
            Este es un sitio de fans, no oficial. Todos los derechos reservados a sus respectivos propietarios.
          </p>
        </div>
      </div>
    </footer>
  );
}
