"use client";

import { Card, CardContent } from "@/components/ui/card";

const galleryItems = [
  {
    title: "Mazinger Z",
    subtitle: "Robot Principal",
    description: "El legendario super robot pilotado por Koji Kabuto",
    span: "col-span-2 row-span-2",
    bg: "from-primary/30 to-primary/10",
  },
  {
    title: "Great Mazinger",
    subtitle: "Sucesor",
    description: "El poderoso sucesor de Mazinger Z",
    span: "col-span-1 row-span-1",
    bg: "from-secondary/30 to-secondary/10",
  },
  {
    title: "UFO Grendizer",
    subtitle: "Trilogía",
    description: "El robot espacial de Duke Fleed",
    span: "col-span-1 row-span-1",
    bg: "from-accent/30 to-accent/10",
  },
  {
    title: "Aphrodite A",
    subtitle: "Aliado",
    description: "Pilotado por Sayaka Yumi",
    span: "col-span-1 row-span-2",
    bg: "from-destructive/30 to-destructive/10",
  },
  {
    title: "Boss Borot",
    subtitle: "Cómico",
    description: "El robot de Boss y sus amigos",
    span: "col-span-1 row-span-1",
    bg: "from-muted-foreground/30 to-muted-foreground/10",
  },
  {
    title: "Bestias Mecánicas",
    subtitle: "Enemigos",
    description: "El ejército del Dr. Hell",
    span: "col-span-2 row-span-1",
    bg: "from-primary/30 to-primary/10",
  },
];

export function GallerySection() {
  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-4">
            Galería
          </p>
          <h2 className="font-[var(--font-display)] text-4xl md:text-5xl font-bold mb-6 text-balance">
            Los Robots de la Saga
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Explora los icónicos robots que definieron una era del anime japonés.
          </p>
        </div>
        
        {/* Bento grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
          {galleryItems.map((item) => (
            <Card 
              key={item.title}
              className={`${item.span} bg-gradient-to-br ${item.bg} border-border hover:border-primary/50 transition-all duration-300 overflow-hidden group cursor-pointer`}
            >
              <CardContent className="p-6 h-full flex flex-col justify-end relative">
                {/* Pattern overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.3)_100%)]" />
                
                {/* Decorative element */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-foreground/10 rounded-full group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-foreground/10 rounded-full group-hover:scale-125 transition-transform duration-700" />
                
                <div className="relative z-10">
                  <span className="text-xs uppercase tracking-wider text-secondary font-medium">
                    {item.subtitle}
                  </span>
                  <h3 className="font-[var(--font-display)] text-xl md:text-2xl font-bold text-foreground mt-1">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
