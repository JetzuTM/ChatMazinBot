"use client";

const timelineEvents = [
  {
    year: "1972",
    title: "Debut del Manga",
    description: "Go Nagai publica el manga de Mazinger Z en la revista Shonen Jump. El anime comienza a transmitirse en Fuji TV.",
  },
  {
    year: "1974",
    title: "Great Mazinger",
    description: "Debut de la secuela Great Mazinger, pilotado por Tetsuya Tsurugi, continuando el legado de la serie original.",
  },
  {
    year: "1975",
    title: "UFO Robot Grendizer",
    description: "La tercera parte de la trilogía Mazinger. Grendizer se convierte en un fenómeno mundial, especialmente en Francia.",
  },
  {
    year: "2009",
    title: "Shin Mazinger Z",
    description: "Nueva adaptación animada que reimagina la historia original con animación moderna y elementos del manga.",
  },
  {
    year: "2017",
    title: "Mazinger Z: Infinity",
    description: "Película animada que sirve como secuela de la serie original, celebrando el 45 aniversario de la franquicia.",
  },
  {
    year: "2024",
    title: "Legado Continúa",
    description: "La franquicia sigue viva con merchandise, videojuegos y nuevas generaciones descubriendo al legendario robot.",
  },
];

export function TimelineSection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-4">
            Historia
          </p>
          <h2 className="font-[var(--font-display)] text-4xl md:text-5xl font-bold mb-6 text-balance">
            Cronología de la Franquicia
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Más de 50 años de historia en el género Super Robot.
          </p>
        </div>
        
        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2" />
          
          {timelineEvents.map((event, index) => (
            <div 
              key={event.year}
              className={`relative flex items-start mb-12 last:mb-0 ${
                index % 2 === 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Timeline dot */}
              <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background md:-translate-x-1/2 z-10" />
              
              {/* Content */}
              <div className={`ml-12 md:ml-0 md:w-[calc(50%-2rem)] ${
                index % 2 === 0 ? "md:mr-auto md:pr-8 md:text-right" : "md:ml-auto md:pl-8"
              }`}>
                <span className="font-[var(--font-display)] text-2xl font-bold text-secondary">
                  {event.year}
                </span>
                <h3 className="font-semibold text-xl mt-2 mb-2 text-foreground">
                  {event.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
