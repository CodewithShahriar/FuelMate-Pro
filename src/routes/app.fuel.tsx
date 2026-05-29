import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fuelLogs, vehicles } from "@/lib/mock-data";
import { Plus, Search, LayoutGrid, List, Fuel, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format, parseISO } from "date-fns";

export const Route = createFileRoute("/app/fuel")({
  head: () => ({ meta: [{ title: "Fuel logs — FuelMate Pro" }] }),
  component: Page,
});

function Page() {
  const [view, setView] = useState<"table" | "cards">("table");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = fuelLogs.filter((l) =>
    l.station.toLowerCase().includes(q.toLowerCase()) ||
    (vehicles.find((v) => v.id === l.vehicleId)?.model.toLowerCase().includes(q.toLowerCase()) ?? false)
  );

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Activity</p>
          <h1 className="mt-1 text-3xl font-display font-semibold tracking-tight">Fuel logs</h1>
        </div>
        <Button onClick={() => setOpen(true)} className="bg-gradient-primary text-primary-foreground rounded-xl shadow-glow hover:opacity-90">
          <Plus className="h-4 w-4 mr-1" /> New fuel log
        </Button>
      </header>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2 glass rounded-xl px-3 py-2 flex-1 min-w-[200px]">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search station or vehicle…" className="bg-transparent outline-none text-sm flex-1" />
        </div>
        <div className="glass rounded-xl p-1 flex">
          <button onClick={() => setView("table")} className={`p-2 rounded-lg ${view === "table" ? "bg-accent/15" : ""}`}>
            <List className="h-4 w-4" />
          </button>
          <button onClick={() => setView("cards")} className={`p-2 rounded-lg ${view === "cards" ? "bg-accent/15" : ""}`}>
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>

      {view === "table" ? (
        <div className="glass rounded-2xl overflow-hidden shadow-card">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border/60">
              <tr>
                <Th>Date</Th><Th>Vehicle</Th><Th>Station</Th>
                <Th className="text-right">Liters</Th>
                <Th className="text-right">Cost</Th>
                <Th className="text-right">Efficiency</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => {
                const v = vehicles.find((v) => v.id === l.vehicleId)!;
                return (
                  <tr key={l.id} className="border-b border-border/40 hover:bg-accent/5 transition-colors">
                    <Td>{format(parseISO(l.date), "MMM d, yyyy")}</Td>
                    <Td><span className="font-medium">{v.brand} {v.model}</span></Td>
                    <Td className="text-muted-foreground">{l.station}</Td>
                    <Td className="text-right">{l.liters}L</Td>
                    <Td className="text-right font-display font-semibold">${l.cost.toFixed(2)}</Td>
                    <Td className="text-right text-primary">{l.mileage} km/L</Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((l) => {
            const v = vehicles.find((v) => v.id === l.vehicleId)!;
            return (
              <div key={l.id} className="glass rounded-2xl p-4 shadow-card">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Fuel className="h-3.5 w-3.5 text-primary" /> {l.station}
                </div>
                <p className="mt-2 font-display text-2xl font-semibold">${l.cost.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">{v.brand} {v.model} · {format(parseISO(l.date), "MMM d")}</p>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                  <Box label="Liters" value={`${l.liters}L`} />
                  <Box label="Efficiency" value={`${l.mileage} km/L`} />
                  <Box label="Odo" value={`${(l.odometer / 1000).toFixed(1)}k`} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {open && <FuelModal onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`text-left px-4 py-3 font-medium ${className}`}>{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 ${className}`}>{children}</td>;
}
function Box({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-lg py-2">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className="text-xs font-medium">{value}</p>
    </div>
  );
}

function FuelModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm grid place-items-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
        className="glass-strong rounded-2xl p-6 w-full max-w-md shadow-elegant"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-xl font-semibold">New fuel log</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-accent/10"><X className="h-4 w-4" /></button>
        </div>
        <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
          <Sel label="Vehicle">
            {vehicles.map((v) => <option key={v.id}>{v.brand} {v.model}</option>)}
          </Sel>
          <div className="grid grid-cols-2 gap-3">
            <Fld label="Liters" type="number" placeholder="42" />
            <Fld label="Cost ($)" type="number" placeholder="68.50" />
          </div>
          <Fld label="Station" placeholder="Shell V-Power" />
          <div className="grid grid-cols-2 gap-3">
            <Fld label="Odometer (km)" type="number" placeholder="24560" />
            <Fld label="Date" type="date" />
          </div>
          <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 rounded-xl">
            Save fuel log
          </Button>
        </form>
      </motion.div>
    </motion.div>
  );
}

function Fld({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-xs text-muted-foreground">{label}</label>
      <Input className="glass mt-1 h-10 border-border/60" {...rest} />
    </div>
  );
}
function Sel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground">{label}</label>
      <select className="mt-1 h-10 w-full rounded-md glass px-3 text-sm border border-border/60 bg-card">
        {children}
      </select>
    </div>
  );
}
