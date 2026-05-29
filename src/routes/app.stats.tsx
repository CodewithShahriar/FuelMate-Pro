import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Car, Fuel, Gauge, CalendarDays, DollarSign, Route as RouteIcon } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { expenses, fuelLogs, totals, vehicles } from "@/lib/mock-data";

export const Route = createFileRoute("/app/stats")({
  head: () => ({ meta: [{ title: "Stats — FuelMate Pro" }] }),
  component: StatsPage,
});

type Tab = "Fill-ups" | "Costs" | "Distance";

function StatsPage() {
  const [tab, setTab] = useState<Tab>("Fill-ups");
  const stats = useMemo(() => {
    const totalFuel = fuelLogs.reduce((sum, log) => sum + log.liters, 0);
    const totalCosts = fuelLogs.reduce((sum, log) => sum + log.cost, 0) + expenses.reduce((sum, e) => sum + e.amount, 0);
    const minFill = Math.min(...fuelLogs.map((log) => log.liters));
    const maxFill = Math.max(...fuelLogs.map((log) => log.liters));
    const lowestBill = Math.min(...fuelLogs.map((log) => log.cost));
    const highestBill = Math.max(...fuelLogs.map((log) => log.cost));
    const bestPrice = Math.min(...fuelLogs.map((log) => log.cost / log.liters));
    const worstPrice = Math.max(...fuelLogs.map((log) => log.cost / log.liters));
    const bestEfficiency = Math.max(...fuelLogs.map((log) => log.mileage));
    const worstEfficiency = Math.min(...fuelLogs.map((log) => log.mileage));
    const distance = totals.mileage;

    return {
      totalFuel,
      totalCosts,
      minFill,
      maxFill,
      lowestBill,
      highestBill,
      bestPrice,
      worstPrice,
      bestEfficiency,
      worstEfficiency,
      distance,
      lastOdo: Math.max(...vehicles.map((v) => v.odometer)),
      avgDaily: Math.round(distance / 365),
      avgMonthly: Math.round(distance / 12),
    };
  }, []);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <header className="flex items-center gap-4">
        <Link to="/app/dashboard" className="grid h-11 w-11 place-items-center rounded-full bg-white text-slate-900 shadow-card">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-4xl font-display font-semibold">Stats</h1>
      </header>

      <div className="grid grid-cols-3 rounded-2xl bg-white/10 p-1 text-sm">
        {(["Fill-ups", "Costs", "Distance"] as Tab[]).map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`rounded-xl px-3 py-2 transition-colors ${
              tab === item ? "bg-white text-slate-950 shadow-sm" : "text-muted-foreground"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {tab === "Fill-ups" && (
        <div className="space-y-4">
          <StatsCard title="Fill-ups total" icon={Fuel} rows={[
            ["This year", `${fuelLogs.length}`],
            ["This month", "6"],
            ["Previous year", "42"],
            ["Previous month", "5"],
          ]} />
          <StatsCard title="Fuel total" icon={Gauge} rows={[
            ["This year", `${stats.totalFuel.toFixed(1)} L`],
            ["This month", "254.8 L"],
            ["Previous year", "1,960.4 L"],
            ["Previous month", "211.2 L"],
            ["Min fill-up", `${stats.minFill.toFixed(1)} L`],
            ["Max fill-up", `${stats.maxFill.toFixed(1)} L`],
          ]} />
          <StatsCard title="Fuel consumption" icon={Car} rows={[
            ["Average fuel consumption", `${totals.efficiency} km/L`],
            ["Best fuel consumption", `${stats.bestEfficiency.toFixed(1)} km/L`],
            ["Worst fuel consumption", `${stats.worstEfficiency.toFixed(1)} km/L`],
          ]} />
        </div>
      )}

      {tab === "Costs" && (
        <div className="space-y-4">
          <StatsCard title="Total costs" icon={DollarSign} rows={[
            ["This year", `$${stats.totalCosts.toFixed(0)}`],
            ["This month", "$1,184"],
            ["Previous year", "$9,820"],
            ["Previous month", "$1,062"],
          ]} />
          <StatsCard title="Bills" icon={CalendarDays} rows={[
            ["Lowest bill", `$${stats.lowestBill.toFixed(2)}`],
            ["Highest bill", `$${stats.highestBill.toFixed(2)}`],
          ]} />
          <StatsCard title="Fuel price" icon={Fuel} rows={[
            ["Best price", `$${stats.bestPrice.toFixed(2)} / L`],
            ["Worst price", `$${stats.worstPrice.toFixed(2)} / L`],
            ["Average cost per kilometre", "$0.12 / km"],
            ["Average cost per day", "$18.40"],
            ["Average cost per month", "$552"],
          ]} />
        </div>
      )}

      {tab === "Distance" && (
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-3xl bg-[oklch(0.55_0.22_305)] p-6 text-white shadow-card">
            <div className="absolute right-5 top-5 h-20 w-20 rounded-full bg-white/15" />
            <div className="relative flex items-center gap-5">
              <div className="grid h-20 w-20 place-items-center rounded-3xl bg-white/20">
                <Car className="h-11 w-11" />
              </div>
              <div>
                <p className="text-sm text-white/75">FuelMate distance</p>
                <h2 className="text-3xl font-display font-semibold">{stats.distance.toLocaleString()} km</h2>
              </div>
            </div>
          </div>
          <StatsCard title="Distance driven with FuelMate" icon={RouteIcon} rows={[
            ["Distance driven with FuelMate", `${stats.distance.toLocaleString()} km`],
            ["Last odo counter value", `${stats.lastOdo.toLocaleString()} km`],
            ["This year", "18,420 km"],
            ["This month", "1,580 km"],
            ["Previous year", "32,740 km"],
            ["Previous month", "1,420 km"],
            ["Average mileage per day", `${stats.avgDaily.toLocaleString()} km`],
            ["Average mileage per month", `${stats.avgMonthly.toLocaleString()} km`],
          ]} />
        </div>
      )}
    </div>
  );
}

function StatsCard({
  title,
  icon: Icon,
  rows,
}: {
  title: string;
  icon: LucideIcon;
  rows: Array<[string, string]>;
}) {
  return (
    <section className="rounded-3xl bg-white p-5 text-slate-950 shadow-card">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">{title}</h2>
        <div className="grid h-10 w-10 place-items-center rounded-full bg-[oklch(0.94_0.03_300)] text-[oklch(0.55_0.22_305)]">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="divide-y divide-slate-100">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 py-3 text-sm">
            <span className="text-slate-500">{label}</span>
            <span className="font-semibold text-slate-950">{value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
