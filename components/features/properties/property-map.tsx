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
        <Button variant="outline" size="sm" className="h-7 text-[10px] font-bold gap-1.5 uppercase tracking-wider bg-background/50 backdrop-blur-sm hover:bg-primary/10 hover:text-primary border-primary/20 transition-all">
          <MapPin className="size-3" />
          Map View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background border-border/50 shadow-2xl">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-xl flex items-center gap-2 font-bold tracking-tight">
                <MapPin className="size-5 text-primary" />
                Project Locations
              </DialogTitle>
              <DialogDescription className="text-xs uppercase tracking-widest font-medium text-muted-foreground/70">
                East Cairo Development Cluster
              </DialogDescription>
            </div>
            <Badge variant="outline" className="h-6 border-primary/30 text-primary uppercase font-bold tracking-tighter px-3">
              Madinet Masr
            </Badge>
          </div>
        </DialogHeader>
        
        <div className="relative bg-[#0a0f1a] aspect-video w-full mt-6 border-y border-border/50 select-none overflow-hidden">
          {/* Abstract Topography / Grid */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 1000 600" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <path d="M-50,300 Q200,100 500,300 T1050,300" fill="none" stroke="currentColor" strokeWidth="80" strokeOpacity="0.5" />
              <path d="M-50,450 Q300,350 700,550 T1050,450" fill="none" stroke="currentColor" strokeWidth="120" strokeOpacity="0.3" />
            </svg>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />

          {/* Location Markers */}
          {locations.map((loc, i) => (
            <div 
              key={i}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:z-50 cursor-crosshair group"
              style={{ left: loc.x, top: loc.y }}
            >
              {/* Outer Glow */}
              <div className={cn(
                "absolute inset-0 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[20px] opacity-0 group-hover:opacity-40 transition-opacity",
                loc.color || "bg-white"
              )} />
              
              <div className="flex flex-col items-center">
                {loc.type === "city" ? (
                  <Landmark className="size-6 text-muted-foreground/30" />
                ) : (
                  <div className="relative">
                    <div className={cn("size-4 rounded-full border-2 border-background shadow-lg animate-pulse", loc.color)} />
                    <div className={cn("absolute inset-0 size-4 rounded-full animate-ping opacity-25", loc.color)} />
                  </div>
                )}
                
                {/* Consolidated Label - Visible on hover or default for projects */}
                <div className={cn(
                  "mt-2 transition-all duration-300",
                  loc.type === "city" 
                    ? "opacity-40 scale-90 group-hover:opacity-100 group-hover:scale-100" 
                    : "opacity-80 scale-100 group-hover:opacity-100 group-hover:scale-105"
                )}>
                  <div className="bg-background/80 backdrop-blur-md border border-border/50 rounded px-2 py-0.5 shadow-sm">
                    <span className="text-[10px] font-bold uppercase tracking-tighter whitespace-nowrap text-foreground">
                      {loc.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Legend Overlay */}
          <div className="absolute bottom-6 right-6 flex flex-col gap-2 bg-background/60 backdrop-blur-lg p-4 rounded-xl border border-primary/10 shadow-xl z-20">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/70 mb-1">Legend</p>
            <div className="flex items-center gap-3">
              <div className="size-2 rounded-full bg-emerald-400" />
              <span className="text-[10px] text-foreground font-bold uppercase tracking-tight">TALALA (Ready)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-2 rounded-full bg-blue-400" />
              <span className="text-[10px] text-foreground font-bold uppercase tracking-tight">Club Views</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-2 rounded-full bg-amber-400" />
              <span className="text-[10px] text-foreground font-bold uppercase tracking-tight">Elm Tree</span>
            </div>
          </div>

          <div className="absolute top-6 left-6 z-20">
             <div className="flex items-center gap-4 bg-background/40 backdrop-blur-md border border-border/50 rounded-lg px-4 py-2">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-foreground">East Coast Zone</p>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Cairo, Egypt</p>
                </div>
                <div className="h-6 w-[1px] bg-border" />
                <Button variant="link" className="h-auto p-0 text-[10px] font-bold text-primary group">
                  Open Maps <Navigation className="size-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                </Button>
             </div>
          </div>
        </div>
        
        <div className="p-4 bg-muted/5 flex justify-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium opacity-50">
            Internal Investment Preview — Not for public distribution
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
