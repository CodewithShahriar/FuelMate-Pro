import { Link } from "@tanstack/react-router";
import { Fuel } from "lucide-react";

export function Logo({ to = "/" }: { to?: string }) {
  return (
    <Link to={to} className="flex items-center gap-2 group">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-primary rounded-xl blur-md opacity-60 group-hover:opacity-90 transition-opacity" />
        <div className="relative h-9 w-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
          <Fuel className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
        </div>
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-display text-lg font-semibold tracking-tight">FuelMate</span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-primary/90">Pro</span>
      </div>
    </Link>
  );
}