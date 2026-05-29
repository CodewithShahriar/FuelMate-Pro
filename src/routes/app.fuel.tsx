import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fuelLogs, vehicles } from "@/lib/mock-data";
import {
  Banknote,
  CalendarDays,
  ChevronDown,
  Clock,
  Droplets,
  Fuel,
  Image,
  MapPin,
  Plus,
  Search,
  TrendingUp,
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
        const haystack =
          `${log.station} ${vehicle?.brand ?? ""} ${vehicle?.model ?? ""}`.toLowerCase();
        return haystack.includes(q.toLowerCase());
      })
      .map((log, index, all) => {
        const prev = all[index + 1];
        return {
          ...log,
          distanceSinceLast: prev ? Math.max(log.odometer - prev.odometer, 0) : 420,
          fuelType: vehicles.find((v) => v.id === log.vehicleId)?.fuelType ?? "Petrol",
          vehicle: vehicles.find((v) => v.id === log.vehicleId)!,
        };
      });

    return rows.reduce<Record<string, typeof rows>>((acc, log) => {
      const month = format(parseISO(log.date), "MMMM yyyy");
      acc[month] = [...(acc[month] ?? []), log];
      return acc;
    }, {});
  }, [q]);

  return (
    <div className="mx-auto max-w-3xl space-y-5 text-foreground">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-5xl font-bold tracking-tight">Fill-ups</h1>
        </div>
        <div className="flex rounded-full bg-card p-1 text-foreground shadow-[0_12px_35px_oklch(0_0_0/0.12)]">
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
        <div className="rounded-2xl bg-card p-2 text-foreground shadow-card">
          <Input
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="Search station or vehicle"
            className="border-0 bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
          />
        </div>
      )}

      <div className="space-y-6">
        {Object.entries(grouped).map(([month, logs]) => (
          <section key={month} className="space-y-3">
            <h2 className="px-1 text-2xl font-bold text-muted-foreground">{month}</h2>
            {logs.map((log) => {
              const pricePerLitre = log.fuelPricePerLiter;
              const costPerKm = log.cost / Math.max(log.distanceSinceLast, 1);
              const stationLabel =
                log.city && log.station !== log.city ? `${log.city} - ${log.station}` : log.station;

              return (
                <article
                  key={log.id}
                  className="rounded-2xl bg-card p-5 text-foreground shadow-[0_12px_35px_oklch(0_0_0/0.08)]"
                >
                  <div className="flex gap-4">
                    <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-background shadow-[0_10px_24px_oklch(0_0_0/0.08)]">
                      <Fuel className="h-8 w-8" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-2xl font-bold">
                            {format(parseISO(log.date), "d MMM, yyyy")}
                          </p>
                          <p className="mt-1 text-2xl font-bold">
                            {log.cost.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                            ৳
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">{log.odometer.toLocaleString()} km</p>
                          <p className="mt-1 text-xl text-muted-foreground">
                            {log.distanceSinceLast.toFixed(1)} km
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 border-t border-border pt-4">
                        <CompactRow
                          icon={Droplets}
                          value={`${log.liters} l -> ${pricePerLitre.toFixed(2)}৳/l (${log.fuelTypeCode === "0" ? "Not set" : log.fuelType})`}
                        />
                        <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
                          <CompactValue
                            icon={TrendingUp}
                            value={`${log.mileage} km/l`}
                            className="text-[oklch(0.72_0.18_150)]"
                          />
                          <CompactValue
                            icon={Banknote}
                            value={`${costPerKm.toFixed(3)}৳/km`}
                            className="text-muted-foreground"
                          />
                        </div>
                      </div>

                      <div className="mt-4 border-t border-border pt-4">
                        {log.pictureCount > 0 ? (
                          <CompactRow
                            icon={Image}
                            value="Pictures"
                            trailing={`${log.pictureCount}`}
                          />
                        ) : (
                          <CompactRow icon={MapPin} value={stationLabel} />
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        ))}
      </div>

      <AnimatePresence>{open && <FillUpModal onClose={() => setOpen(false)} />}</AnimatePresence>
    </div>
  );
}

function CompactRow({
  icon: Icon,
  value,
  trailing,
}: {
  icon: LucideIcon;
  value: string;
  trailing?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-2xl">
      <span className="flex min-w-0 items-center gap-4">
        <Icon className="h-7 w-7 shrink-0 text-[oklch(0.48_0.2_295)]" />
        <span className="truncate">{value}</span>
      </span>
      {trailing && <span className="font-bold">{trailing}</span>}
    </div>
  );
}

function CompactValue({
  icon: Icon,
  value,
  className,
}: {
  icon: LucideIcon;
  value: string;
  className: string;
}) {
  return (
    <div className={`flex items-center gap-3 text-2xl font-semibold ${className}`}>
      <Icon className="h-7 w-7 text-[oklch(0.48_0.2_295)]" />
      {value}
    </div>
  );
}

function FillUpModal({ onClose }: { onClose: () => void }) {
  const latest = fuelLogs[0];
  const latestVehicle = vehicles.find((vehicle) => vehicle.id === latest.vehicleId) ?? vehicles[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-60 flex items-end bg-black/45 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        exit={{ y: 80 }}
        transition={{ type: "spring", damping: 28, stiffness: 260 }}
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-[2rem] bg-card p-4 text-foreground shadow-elegant"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto max-w-2xl space-y-4">
          <header className="grid grid-cols-3 items-center py-2 text-2xl">
            <button
              onClick={onClose}
              className="justify-self-start rounded-full bg-background px-7 py-4 font-medium shadow-[0_12px_35px_oklch(0_0_0/0.08)] text-foreground"
            >
              Cancel
            </button>
            <h2 className="justify-self-center whitespace-nowrap font-bold">Edit</h2>
            <button
              onClick={onClose}
              className="justify-self-end rounded-full bg-background px-7 py-4 font-bold shadow-[0_12px_35px_oklch(0_0_0/0.08)] text-foreground"
            >
              Save
            </button>
          </header>

          <section className="rounded-2xl bg-[oklch(0.94_0.01_285)] p-6">
            <div className="flex items-center justify-between gap-3 text-2xl">
              <p className="font-medium text-[oklch(0.48_0.2_295)]">{latestVehicle.name}</p>
              <ChevronDown className="h-7 w-7 text-[oklch(0.48_0.2_295)]" />
            </div>
          </section>

          <section className="rounded-3xl bg-[oklch(0.94_0.01_285)] p-6">
            <FormBlock
              label="Odo counter (km)"
              placeholder={latest.odometer.toLocaleString(undefined, {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })}
              wide
              helper={`Last value: ${fuelLogs[1]?.odometer.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) ?? latest.odometer.toLocaleString()} km`}
            />
            <div className="mt-6 grid grid-cols-2 gap-5">
              <FormBlock label="Fuel (l)" placeholder={latest.liters.toString()} />
              <FormSelect label="Fuel type" />
              <FormBlock label="Fuel price" placeholder={latest.fuelPricePerLiter.toString()} />
              <FormBlock label="Total cost" placeholder={latest.cost.toString()} />
            </div>
          </section>

          <section className="rounded-3xl bg-[oklch(0.94_0.01_285)] p-6">
            <p className="text-2xl font-bold">Date</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Chip icon={CalendarDays} label={format(new Date(), "MMM d, yyyy")} />
              <Chip icon={Clock} label={format(new Date(), "h:mm a")} />
            </div>
            <p className="mt-4 text-lg text-muted-foreground">
              {format(new Date(), "MMM d, yyyy h:mm a")}
            </p>
          </section>

          <section className="rounded-3xl bg-[oklch(0.94_0.01_285)] p-6">
            <ToggleRow label="Full tank" defaultOn={latest.full} />
            <ToggleRow label="Set up tank level" />
          </section>

          <section className="rounded-3xl bg-[oklch(0.94_0.01_285)] p-6">
            <div className="flex items-center justify-between">
              <p className="text-2xl">Petrol Station</p>
              <ToggleSwitch defaultOn />
            </div>
            <div className="mt-6 space-y-2 text-2xl">
              <p>Selected</p>
              <p>{latest.station}</p>
              <p className="text-lg text-muted-foreground">
                {latest.city || "Station ID " + latest.stationId}
              </p>
            </div>
            <div className="mt-6 flex justify-between gap-4 text-2xl text-[oklch(0.48_0.2_295)]">
              <button>Select petrol station</button>
              <button>Add to favourites</button>
            </div>
          </section>

          <Button
            onClick={onClose}
            className="h-12 w-full rounded-2xl bg-[oklch(0.55_0.22_305)] text-white hover:opacity-90"
          >
            Save fill-up
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function FormBlock({
  label,
  placeholder,
  helper,
  wide,
}: {
  label: string;
  placeholder: string;
  helper?: string;
  wide?: boolean;
}) {
  return (
    <label className={wide ? "block" : "block"}>
      <span className="text-2xl">{label}</span>
      <input
        className="mt-3 h-14 w-full rounded-lg border border-border bg-background px-3 text-2xl outline-none placeholder:text-muted-foreground"
        placeholder={placeholder}
      />
      {helper && <span className="mt-3 block text-lg text-muted-foreground">{helper}</span>}
    </label>
  );
}

function FormSelect({ label }: { label: string }) {
  return (
    <label className="block">
      <span className="text-2xl">{label}</span>
      <span className="mt-3 flex h-14 items-center justify-between rounded-2xl border border-border px-4 text-2xl">
        Not set <ChevronDown className="h-6 w-6 text-muted-foreground" />
      </span>
    </label>
  );
}

function Chip({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <button className="inline-flex items-center gap-2 rounded-full bg-muted/70 px-5 py-3 text-2xl font-medium text-foreground">
      <Icon className="h-4 w-4 text-[oklch(0.55_0.22_305)]" />
      {label}
    </button>
  );
}

function ToggleRow({ label, defaultOn = false }: { label: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn((value) => !value)}
      className="flex w-full items-center justify-between py-3 text-left"
    >
      <span className="text-2xl">{label}</span>
      <ToggleSwitch on={on} />
    </button>
  );
}

function ToggleSwitch({ on, defaultOn = false }: { on?: boolean; defaultOn?: boolean }) {
  const active = on ?? defaultOn;
  return (
    <span
      className={`flex h-11 w-20 items-center rounded-full p-1 transition-colors ${active ? "bg-[oklch(0.72_0.18_150)]" : "bg-slate-300"}`}
    >
      <span
        className={`h-9 w-9 rounded-full bg-background shadow-sm transition-transform ${active ? "translate-x-9" : ""}`}
      />
    </span>
  );
}
