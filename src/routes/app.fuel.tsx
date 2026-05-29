import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fuelLogs, vehicles } from "@/lib/mock-data";
import {
  Banknote,
  CalendarDays,
  Camera,
  ChevronDown,
  Clock,
  Droplets,
  Gauge,
  MapPin,
  Plus,
  Route as RouteIcon,
  Search,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format, parseISO } from "date-fns";

export const Route = createFileRoute("/app/fuel")({
  head: () => ({ meta: [{ title: "Fuel logs — FuelMate Pro" }] }),
  component: FuelPage,
});

function FuelPage() {
  const [q, setQ] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const grouped = useMemo(() => {
    const rows = fuelLogs
      .filter((log) => {
        const vehicle = vehicles.find((v) => v.id === log.vehicleId);
        const haystack = `${log.station} ${vehicle?.brand ?? ""} ${vehicle?.model ?? ""}`.toLowerCase();
        return haystack.includes(q.toLowerCase());
      })
      .map((log, index, all) => {
        const prev = all[index + 1];
        return {
          ...log,
          distanceSinceLast: prev ? Math.max(log.odometer - prev.odometer, 0) : 420,
          fuelType: vehicles.find((v) => v.id === log.vehicleId)?.fuelType ?? "Petrol",
          vehicle: vehicles.find((v) => v.id === log.vehicleId)!,
          pictureCount: index % 3 === 0 ? 2 : 0,
        };
      });

    return rows.reduce<Record<string, typeof rows>>((acc, log) => {
      const month = format(parseISO(log.date), "MMMM yyyy");
      acc[month] = [...(acc[month] ?? []), log];
      return acc;
    }, {});
  }, [q]);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <header className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Activity</p>
          <h1 className="mt-1 text-3xl font-display font-semibold tracking-tight">Fuel Logs</h1>
        </div>
        <div className="flex rounded-full bg-white p-1 text-slate-950 shadow-card">
          <button
            onClick={() => setSearchOpen((value) => !value)}
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-slate-100"
            aria-label="Search fuel logs"
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            onClick={() => setOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-full bg-[oklch(0.55_0.22_305)] text-white"
            aria-label="Add fill-up"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </header>

      {searchOpen && (
        <div className="rounded-2xl bg-white p-2 text-slate-950 shadow-card">
          <Input
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="Search station or vehicle"
            className="border-0 bg-transparent text-slate-950 placeholder:text-slate-400 focus-visible:ring-0"
          />
        </div>
      )}

      <div className="space-y-6">
        {Object.entries(grouped).map(([month, logs]) => (
          <section key={month} className="space-y-3">
            <h2 className="px-1 text-sm font-semibold text-muted-foreground">{month}</h2>
            {logs.map((log) => {
              const pricePerLitre = log.cost / log.liters;
              const costPerKm = log.cost / Math.max(log.distanceSinceLast, 1);

              return (
                <article key={log.id} className="rounded-3xl bg-white p-4 text-slate-950 shadow-card">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-slate-500">{format(parseISO(log.date), "EEEE, MMM d")}</p>
                      <h3 className="mt-1 font-display text-2xl font-semibold">${log.cost.toFixed(2)}</h3>
                    </div>
                    {log.pictureCount > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[oklch(0.94_0.03_300)] px-3 py-1 text-xs text-[oklch(0.55_0.22_305)]">
                        <Camera className="h-3.5 w-3.5" />
                        {log.pictureCount}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 grid gap-3 text-sm">
                    <InfoRow icon={Gauge} label="Odometer" value={`${log.odometer.toLocaleString()} km`} />
                    <InfoRow icon={RouteIcon} label="Distance since last fill" value={`${log.distanceSinceLast.toLocaleString()} km`} />
                    <InfoRow icon={Droplets} label="Fuel" value={`${log.liters} L -> $${pricePerLitre.toFixed(2)}/L -> ${log.fuelType}`} />
                    <InfoRow icon={Gauge} label="Mileage" value={`${log.mileage} km/L`} />
                    <InfoRow icon={Banknote} label="Cost per km" value={`$${costPerKm.toFixed(2)} / km`} />
                    <InfoRow icon={MapPin} label="Petrol station" value={log.station} />
                  </div>
                </article>
              );
            })}
          </section>
        ))}
      </div>

      <AnimatePresence>
        {open && <FillUpModal onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[oklch(0.94_0.03_300)] text-[oklch(0.55_0.22_305)]">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-slate-400">{label}</p>
        <p className="truncate font-medium">{value}</p>
      </div>
    </div>
  );
}

function FillUpModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-end bg-black/45 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        exit={{ y: 80 }}
        transition={{ type: "spring", damping: 28, stiffness: 260 }}
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-[2rem] bg-[oklch(0.96_0.01_260)] p-4 text-slate-950 shadow-elegant"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto max-w-2xl space-y-4">
          <header className="grid grid-cols-3 items-center py-2 text-sm">
            <button onClick={onClose} className="justify-self-start font-medium text-[oklch(0.55_0.22_305)]">Cancel</button>
            <h2 className="justify-self-center whitespace-nowrap font-semibold">Add Fill-up</h2>
            <button onClick={onClose} className="justify-self-end font-semibold text-[oklch(0.55_0.22_305)]">Save</button>
          </header>

          <section className="rounded-3xl bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Vehicle</p>
            <div className="mt-3 flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold">{vehicles[0].brand} {vehicles[0].model}</p>
                <p className="text-sm text-slate-500">{vehicles[0].plate}</p>
              </div>
              <ChevronDown className="h-5 w-5 text-[oklch(0.55_0.22_305)]" />
            </div>
          </section>

          <section className="rounded-3xl bg-white p-4 shadow-sm">
            <div className="divide-y divide-slate-100">
              <FormRow label="Odo counter (km)" placeholder="24560" />
              <FormRow label="Fuel (l)" placeholder="42.0" />
              <FormSelect label="Fuel type" />
              <FormRow label="Fuel price" placeholder="1.65" />
              <FormRow label="Total cost" placeholder="68.50" />
            </div>
          </section>

          <section className="rounded-3xl bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Date</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Chip icon={CalendarDays} label={format(new Date(), "MMM d, yyyy")} />
              <Chip icon={Clock} label={format(new Date(), "h:mm a")} />
            </div>
          </section>

          <section className="rounded-3xl bg-white p-4 shadow-sm">
            <ToggleRow label="Full tank" defaultOn />
            <ToggleRow label="Set up tank level" />
          </section>

          <section className="rounded-3xl bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Petrol Station</p>
            <div className="mt-3 flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-3">
              <MapPin className="h-5 w-5 text-[oklch(0.55_0.22_305)]" />
              <input className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400" placeholder="Select petrol station" />
              <X className="h-4 w-4 text-slate-300" />
            </div>
          </section>

          <Button onClick={onClose} className="h-12 w-full rounded-2xl bg-[oklch(0.55_0.22_305)] text-white hover:opacity-90">
            Save fill-up
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function FormRow({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label className="flex items-center justify-between gap-4 py-3">
      <span className="text-sm text-slate-500">{label}</span>
      <input
        className="w-32 bg-transparent text-right font-semibold outline-none placeholder:text-slate-300"
        placeholder={placeholder}
      />
    </label>
  );
}

function FormSelect({ label }: { label: string }) {
  return (
    <label className="flex items-center justify-between gap-4 py-3">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="inline-flex items-center gap-1 font-semibold">
        Petrol <ChevronDown className="h-4 w-4 text-[oklch(0.55_0.22_305)]" />
      </span>
    </label>
  );
}

function Chip({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <button className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium">
      <Icon className="h-4 w-4 text-[oklch(0.55_0.22_305)]" />
      {label}
    </button>
  );
}

function ToggleRow({ label, defaultOn = false }: { label: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button onClick={() => setOn((value) => !value)} className="flex w-full items-center justify-between py-3 text-left">
      <span className="text-sm font-medium">{label}</span>
      <span className={`flex h-8 w-14 items-center rounded-full p-1 transition-colors ${on ? "bg-[oklch(0.55_0.22_305)]" : "bg-slate-200"}`}>
        <span className={`h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${on ? "translate-x-6" : ""}`} />
      </span>
    </button>
  );
}
