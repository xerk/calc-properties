"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Landmark } from "lucide-react";
import { cn } from "@/lib/utils";

const locations = [
  { name: "TALALA", x: "75%", y: "45%", color: "bg-emerald-400" },
  { name: "Club Views", x: "45%", y: "65%", color: "bg-blue-400" },
  { name: "Elm Tree Park", x: "42%", y: "62%", color: "bg-amber-400" },
  { name: "New Cairo Center", x: "35%", y: "55%", type: "city" },
  { name: "New Heliopolis", x: "80%", y: "40%", type: "city" },
];

export function PropertyMap() {
  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="p-4 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <MapPin className="size-4 text-primary" />
            Project Locations
          </CardTitle>
          <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tight">
            East Cairo Cluster
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0 relative bg-muted/20 aspect-video sm:aspect-auto sm:h-[350px]">
        {/* Abstract Map UI */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none">
            <path d="M100,50 Q250,150 400,100 T700,200" fill="none" stroke="currentColor" strokeWidth="40" />
            <path d="M50,400 Q300,300 600,450" fill="none" stroke="currentColor" strokeWidth="60" />
            <circle cx="400" cy="250" r="100" fill="currentColor" />
          </svg>
        </div>
        
        {/* Grid Lines */}
        <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 opacity-[0.03] pointer-events-none">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="border border-foreground" />
          ))}
        </div>

        {/* Location Markers */}
        {locations.map((loc, i) => (
          <div 
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500 hover:scale-110"
            style={{ left: loc.x, top: loc.y }}
          >
            <div className="group relative flex flex-col items-center">
              {loc.type === "city" ? (
                <Landmark className="size-4 text-muted-foreground/60" />
              ) : (
                <div className={cn("size-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.2)] animate-pulse", loc.color)} />
              )}
              
              <div className="absolute top-full mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-popover text-popover-foreground text-[10px] font-bold px-2 py-0.5 rounded shadow-md whitespace-nowrap border border-border">
                  {loc.name}
                </div>
              </div>
              
              <span className="mt-1 text-[9px] font-bold uppercase tracking-tighter text-muted-foreground/40 whitespace-nowrap">
                {loc.name}
              </span>
            </div>
          </div>
        ))}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 space-y-2 bg-background/80 backdrop-blur-sm p-3 rounded-lg border border-border/50 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-emerald-400" />
            <span className="text-[10px] text-foreground font-medium">TALALA (Ready)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-blue-400" />
            <span className="text-[10px] text-foreground font-medium">Club Views (Sarai)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-amber-400" />
            <span className="text-[10px] text-foreground font-medium">Elm Tree (Sarai)</span>
          </div>
        </div>

        <div className="absolute top-4 right-4">
           <Button variant="secondary" size="sm" className="h-7 text-[10px] font-bold gap-1.5">
             <Navigation className="size-3" />
             Interactive Map
           </Button>
        </div>
      </CardContent>
    </Card>
  );
}
