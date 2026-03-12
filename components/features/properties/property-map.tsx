import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 text-[10px] font-bold gap-1.5 uppercase tracking-wider bg-background/50 backdrop-blur-sm">
          <MapPin className="size-3" />
          Project Locations
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-xl flex items-center gap-2">
                <MapPin className="size-5 text-primary" />
                Project Locations
              </DialogTitle>
              <DialogDescription>
                Geographic distribution of Madinet Masr developments in East Cairo.
              </DialogDescription>
            </div>
            <Badge variant="secondary" className="h-6 uppercase font-bold tracking-tight">
              East Cairo Cluster
            </Badge>
          </div>
        </DialogHeader>
        
        <div className="relative bg-muted/20 aspect-video w-full mt-6 border-t">
          {/* Abstract Map UI */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none">
              <path d="M100,50 Q250,150 400,100 T700,200" fill="none" stroke="currentColor" strokeWidth="40" />
              <path d="M50,400 Q300,300 600,450" fill="none" stroke="currentColor" strokeWidth="60" />
              <circle cx="400" cy="250" r="100" fill="currentColor" />
            </svg>
          </div>
          
          {/* Grid Lines */}
          <div className="absolute inset-0 grid grid-cols-12 grid-rows-8 opacity-[0.03] pointer-events-none">
            {Array.from({ length: 96 }).map((_, i) => (
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
                  <Landmark className="size-5 text-muted-foreground/60" />
                ) : (
                  <div className={cn("size-4 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.2)] animate-pulse", loc.color)} />
                )}
                
                <div className="absolute top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="bg-popover text-popover-foreground text-xs font-bold px-3 py-1 rounded shadow-xl whitespace-nowrap border border-border">
                    {loc.name}
                  </div>
                </div>
                
                <span className="mt-1.5 text-[10px] font-bold uppercase tracking-tighter text-muted-foreground/60 whitespace-nowrap">
                  {loc.name}
                </span>
              </div>
            </div>
          ))}

          {/* Legend */}
          <div className="absolute bottom-6 left-6 space-y-3 bg-background/80 backdrop-blur-md p-4 rounded-xl border border-border shadow-2xl">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground pb-1">Legend</p>
            <div className="flex items-center gap-3">
              <div className="size-2.5 rounded-full bg-emerald-400" />
              <span className="text-xs text-foreground font-medium">TALALA (Ready to Move)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-2.5 rounded-full bg-blue-400" />
              <span className="text-xs text-foreground font-medium">Club Views (Sarai)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-2.5 rounded-full bg-amber-400" />
              <span className="text-xs text-foreground font-medium">Elm Tree (Sarai)</span>
            </div>
          </div>

          <div className="absolute top-6 right-6">
             <Button variant="secondary" size="sm" className="font-bold gap-2 shadow-lg">
               <Navigation className="size-4" />
               Interactive Map
             </Button>
          </div>
        </div>
        <div className="p-6 bg-muted/10 text-[10px] text-muted-foreground italic text-center">
          Map data is for visualization purposes only and represents planned community layouts.
        </div>
      </DialogContent>
    </Dialog>
  );
}
