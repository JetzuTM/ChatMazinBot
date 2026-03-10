"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Zap, Shield, Sword, Target } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Rayo Fotónico",
    description: "El poderoso rayo láser disparado desde los ojos de Mazinger Z, capaz de destruir cualquier enemigo mecánico.",
  },
  {
    icon: Shield,
    title: "Aleación Z",
    description: "Material super resistente derivado del Japanium, hace a Mazinger Z prácticamente indestructible.",
  },
  {
    icon: Sword,
    title: "Puño Cohete",
    description: "Los puños de Mazinger Z pueden ser lanzados como proyectiles y regresar magnéticamente.",
  },
  {
    icon: Target,
    title: "Rayo Térmico",
    description: "Disparo de energía termal desde el pecho que puede derretir el metal más resistente.",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="py-24 px-4 relative">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-4">
            Sobre la Serie
          </p>
          <h2 className="font-[var(--font-display)] text-4xl md:text-5xl font-bold mb-6 text-balance">
            El Origen de los Super Robots
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
            Creado por el maestro Go Nagai en 1972, Mazinger Z revolucionó el género mecha 
            al introducir el concepto de un robot gigante pilotado desde su interior.
            Esta innovación cambió para siempre la historia del anime y el manga.
          </p>
        </div>
        
        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={feature.title}
              className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "1972", label: "Año de Estreno" },
            { value: "92", label: "Episodios" },
            { value: "18m", label: "Altura" },
            { value: "20t", label: "Peso" },
          ].map((stat) => (
            <div key={stat.label} className="p-4">
              <p className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-secondary mb-2">
                {stat.value}
              </p>
              <p className="text-muted-foreground text-sm uppercase tracking-wide">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
