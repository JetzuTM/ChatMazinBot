"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const characters = [
  {
    name: "Koji Kabuto",
    role: "Piloto Principal",
    description: "El valiente piloto de Mazinger Z. Nieto del Dr. Kabuto, heredó la misión de proteger al mundo del Dr. Hell.",
    color: "bg-primary",
  },
  {
    name: "Sayaka Yumi",
    role: "Piloto de Aphrodite A",
    description: "Hija del Dr. Yumi y piloto del robot Aphrodite A. Compañera leal de Koji en la batalla contra el mal.",
    color: "bg-secondary",
  },
  {
    name: "Dr. Hell",
    role: "Antagonista Principal",
    description: "El científico malvado que busca conquistar el mundo con su ejército de bestias mecánicas.",
    color: "bg-destructive",
  },
  {
    name: "Baron Ashura",
    role: "Sirviente del Dr. Hell",
    description: "Una criatura mitad hombre, mitad mujer, creada por el Dr. Hell. Uno de sus más fieles comandantes.",
    color: "bg-accent",
  },
  {
    name: "Boss",
    role: "Piloto de Boss Borot",
    description: "Amigo de Koji y piloto del robot Boss Borot. Proporciona alivio cómico pero tiene un corazón valiente.",
    color: "bg-muted",
  },
  {
    name: "Dr. Kabuto",
    role: "Creador de Mazinger Z",
    description: "El brillante científico que descubrió el Japanium y creó a Mazinger Z para proteger a la humanidad.",
    color: "bg-primary",
  },
];

export function CharactersSection() {
  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-4">
            Personajes
          </p>
          <h2 className="font-[var(--font-display)] text-4xl md:text-5xl font-bold mb-6 text-balance">
            Los Héroes y Villanos
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Conoce a los personajes que hicieron de Mazinger Z una serie inolvidable.
          </p>
        </div>
        
        {/* Characters grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((character, index) => (
            <Card 
              key={character.name}
              className="bg-card border-border hover:border-primary/50 transition-all duration-300 overflow-hidden group"
            >
              <CardContent className="p-0">
                {/* Character avatar placeholder */}
                <div className={`h-48 ${character.color}/20 relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_25%,rgba(255,255,255,0.1)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.1)_75%)] bg-[length:20px_20px]" />
                  <div className="absolute bottom-4 left-4">
                    <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                      {character.role}
                    </Badge>
                  </div>
                  {/* Character initial */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-[var(--font-display)] text-8xl font-bold text-foreground/10 group-hover:text-foreground/20 transition-colors">
                      {character.name.charAt(0)}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-semibold text-xl mb-2 text-foreground">
                    {character.name}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {character.description}
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
