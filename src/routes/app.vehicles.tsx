import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { vehicles } from "@/lib/mock-data";
import { Plus, Fuel, Gauge, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app/vehicles")({
  head: () => ({ meta: [{ title: "Vehicles — FuelMate Pro" }] }),
  component: Page,
});

function Page() {
  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Garage</p>
          <h1 className="mt-1 text-3xl font-display font-semibold tracking-tight">My vehicles</h1>
        </div>
        <Button className="bg-gradient-primary text-primary-foreground rounded-xl shadow-glow hover:opacity-90">
          <Plus className="h-4 w-4 mr-1" /> Add vehicle
        </Button>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((v, i) => (
          <motion.div
            key={v.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4 }}
            className="group glass rounded-2xl overflow-hidden shadow-card"
          >
            <Link to="/app/vehicles/$id" params={{ id: v.id }}>
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={v.image} alt={`${v.brand} ${v.model}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{v.year} · {v.color}</p>
                    <h3 className="font-display text-lg font-semibold">{v.brand} {v.model}</h3>
                  </div>
                  <div className="glass-strong px-2.5 py-1 rounded-lg text-xs">
                    <span className="text-primary font-semibold">{v.healthScore}</span>
                    <span className="text-muted-foreground">/100</span>
                  </div>
                </div>
              </div>
              <div className="p-4 grid grid-cols-3 gap-2 text-center">
                <Stat icon={Fuel} label={v.fuelType} />
                <Stat icon={Gauge} label={`${(v.odometer / 1000).toFixed(1)}k`} />
                <Stat icon={Calendar} label={v.plate} />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label }: { icon: typeof Fuel; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      <span className="text-xs">{label}</span>
    </div>
  );
}