import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Car,
  DollarSign,
  Fuel,
  Gauge,
  Navigation,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { expenses, fuelLogs, totals } from "@/lib/mock-data";

export const Route = createFileRoute("/app/stats")({
  head: () => ({ meta: [{ title: "Stats — FuelMate Pro" }] }),
  component: StatsPage,
});

type Tab = "Fill-ups" | "Costs" | "Distance";

const purple = "text-[oklch(0.48_0.2_295)]";

function StatsPage() {
  const [tab, setTab] = useState<Tab>("Fill-ups");
  const stats = useMemo(() => {
    const latest = fuelLogs[0];
    const oldest = fuelLogs[fuelLogs.length - 1];
    const latestDate = new Date(latest.date);
    const previousMonthDate = new Date(latestDate.getFullYear(), latestDate.getMonth() - 1, 1);
    const currentYear = latestDate.getFullYear();
    const previousYear = currentYear - 1;
    const currentMonth = latestDate.getMonth();
    const previousMonth = previousMonthDate.getMonth();
    const previousMonthYear = previousMonthDate.getFullYear();
    const inYear = (year: number) => (log: { date: string }) =>
      new Date(log.date).getFullYear() === year;
    const inMonth = (year: number, month: number) => (log: { date: string }) => {
      const date = new Date(log.date);
      return date.getFullYear() === year && date.getMonth() === month;
    };
    const thisYearLogs = fuelLogs.filter(inYear(currentYear));
    const thisMonthLogs = fuelLogs.filter(inMonth(currentYear, currentMonth));
    const previousYearLogs = fuelLogs.filter(inYear(previousYear));
    const previousMonthLogs = fuelLogs.filter(inMonth(previousMonthYear, previousMonth));
    const efficientLogs = fuelLogs.filter((log) => log.mileage > 0);
    const totalFuel = fuelLogs.reduce((sum, log) => sum + log.liters, 0);
    const fuelCost = fuelLogs.reduce((sum, log) => sum + log.cost, 0);
    const totalCosts = fuelCost + expenses.reduce((sum, e) => sum + e.amount, 0);
    const minFill = Math.min(...fuelLogs.map((log) => log.liters));
    const maxFill = Math.max(...fuelLogs.map((log) => log.liters));
    const lowestBill = Math.min(...fuelLogs.map((log) => log.cost));
    const highestBill = Math.max(...fuelLogs.map((log) => log.cost));
    const bestPrice = Math.min(...fuelLogs.map((log) => log.cost / log.liters));
    const worstPrice = Math.max(...fuelLogs.map((log) => log.cost / log.liters));
    const bestEfficiency = Math.max(...efficientLogs.map((log) => log.mileage));
    const worstEfficiency = Math.min(...efficientLogs.map((log) => log.mileage));
    const distance = latest.odometer - oldest.odometer;
    const days = Math.max(
      1,
      Math.ceil((latestDate.getTime() - new Date(oldest.date).getTime()) / 86400000),
    );
    const months = Math.max(
      1,
      (latestDate.getFullYear() - new Date(oldest.date).getFullYear()) * 12 +
        latestDate.getMonth() -
        new Date(oldest.date).getMonth() +
        1,
    );
    const sum = (logs: typeof fuelLogs, field: "cost" | "liters") =>
      logs.reduce((total, log) => total + log[field], 0);

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
      lastOdo: latest.odometer,
      avgDaily: distance / days,
      avgMonthly: distance / months,
      avgCostKm: fuelCost / Math.max(distance, 1),
      thisYearFillUps: thisYearLogs.length,
      thisMonthFillUps: thisMonthLogs.length,
      previousYearFillUps: previousYearLogs.length,
      previousMonthFillUps: previousMonthLogs.length,
      thisYearFuel: sum(thisYearLogs, "liters"),
      thisMonthFuel: sum(thisMonthLogs, "liters"),
      previousYearFuel: sum(previousYearLogs, "liters"),
      previousMonthFuel: sum(previousMonthLogs, "liters"),
      thisYearCosts: sum(thisYearLogs, "cost"),
      thisMonthCosts: sum(thisMonthLogs, "cost"),
      previousYearCosts: sum(previousYearLogs, "cost"),
      previousMonthCosts: sum(previousMonthLogs, "cost"),
      thisYearDistance:
        thisYearLogs[0]?.odometer && thisYearLogs.at(-1)?.odometer
          ? thisYearLogs[0].odometer - thisYearLogs.at(-1)!.odometer
          : 0,
      thisMonthDistance:
        thisMonthLogs[0]?.odometer && thisMonthLogs.at(-1)?.odometer
          ? thisMonthLogs[0].odometer - thisMonthLogs.at(-1)!.odometer
          : 0,
      previousYearDistance:
        previousYearLogs[0]?.odometer && previousYearLogs.at(-1)?.odometer
          ? previousYearLogs[0].odometer - previousYearLogs.at(-1)!.odometer
          : 0,
      previousMonthDistance:
        previousMonthLogs[0]?.odometer && previousMonthLogs.at(-1)?.odometer
          ? previousMonthLogs[0].odometer - previousMonthLogs.at(-1)!.odometer
          : 0,
    };
  }, []);

  return (
    <div className="mx-auto max-w-3xl space-y-5 text-slate-950">
      <header className="space-y-7 pt-1">
        <Link
          to="/app/dashboard"
          className="grid h-14 w-14 place-items-center rounded-full bg-white text-slate-950 shadow-[0_12px_35px_oklch(0_0_0/0.12)]"
        >
          <ArrowLeft className="h-7 w-7" />
        </Link>
        <h1 className="text-5xl font-bold tracking-tight">Stats</h1>
      </header>

      <div className="grid grid-cols-3 rounded-full bg-slate-200/80 p-1 text-base font-medium">
        {(["Fill-ups", "Costs", "Distance"] as Tab[]).map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`rounded-full px-3 py-2.5 transition-colors ${
              tab === item ? "bg-white text-slate-950 shadow-sm" : "text-slate-950"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {tab === "Fill-ups" && (
        <div className="space-y-5">
          <MetricCard
            title="Fill-ups"
            value={`${fuelLogs.length}`}
            metrics={[
              { icon: Fuel, value: `${stats.thisYearFillUps}`, label: "This year" },
              { icon: Fuel, value: `${stats.thisMonthFillUps}`, label: "This month" },
              { value: `${stats.previousYearFillUps}`, label: "Previous year" },
              { value: `${stats.previousMonthFillUps}`, label: "Previous month" },
            ]}
          />
          <MetricCard
            title="Fuel"
            value={`${stats.totalFuel.toFixed(3)} l`}
            metrics={[
              { icon: Gauge, value: `${stats.thisYearFuel.toFixed(2)} l`, label: "This year" },
              { icon: Gauge, value: `${stats.thisMonthFuel.toFixed(2)} l`, label: "This month" },
              { value: `${stats.previousYearFuel.toFixed(3)} l`, label: "Previous year" },
              { value: `${stats.previousMonthFuel.toFixed(2)} l`, label: "Previous month" },
              { icon: TrendingDown, value: `${stats.minFill.toFixed(1)} l`, label: "Min fill-up" },
              { icon: TrendingUp, value: `${stats.maxFill.toFixed(2)} l`, label: "Max fill-up" },
            ]}
            dividerAt={4}
          />
          <MetricCard
            title="Average fuel consumption"
            value={`${totals.efficiency} km/l`}
            metrics={[
              {
                icon: Gauge,
                value: `${stats.bestEfficiency.toFixed(2)} km/l`,
                label: "Best fuel consumption",
                tone: "green",
              },
              {
                icon: Gauge,
                value: `${stats.worstEfficiency.toFixed(2)} km/l`,
                label: "Worst fuel consumption",
                tone: "red",
              },
            ]}
          />
        </div>
      )}

      {tab === "Costs" && (
        <div className="space-y-5">
          <MetricCard
            title="Costs"
            value={`${stats.totalCosts.toLocaleString(undefined, { maximumFractionDigits: 2 })}৳`}
            metrics={[
              {
                icon: TrendingDown,
                value: `${stats.thisYearCosts.toFixed(2)}৳`,
                label: "This year",
                tone: "green",
              },
              { value: `${stats.thisMonthCosts.toFixed(2)}৳`, label: "This month" },
              { value: `${stats.previousYearCosts.toFixed(2)}৳`, label: "Previous year" },
              { value: `${stats.previousMonthCosts.toFixed(2)}৳`, label: "Previous month" },
            ]}
          />
          <MetricCard
            title=""
            value=""
            metrics={[
              {
                icon: DollarSign,
                value: `${stats.lowestBill.toFixed(2)}৳`,
                label: "Lowest bill",
                heading: "BILLS",
                tone: "green",
              },
              {
                icon: Fuel,
                value: `${stats.bestPrice.toFixed(3)}৳`,
                label: "Best price",
                heading: "FUEL PRICE",
                tone: "green",
              },
              {
                icon: DollarSign,
                value: `${stats.highestBill.toFixed(2)}৳`,
                label: "Highest bill",
                tone: "red",
              },
              {
                icon: Fuel,
                value: `${stats.worstPrice.toFixed(2)}৳`,
                label: "Worst price",
                tone: "red",
              },
            ]}
          />
          <MetricCard
            title="Average cost per kilometre"
            value={`${stats.avgCostKm.toFixed(3)}৳/km`}
            metrics={[
              {
                icon: DollarSign,
                value: `${stats.bestPrice.toFixed(3)}৳/l`,
                label: "Best cost per litre",
                tone: "green",
              },
              {
                icon: DollarSign,
                value: `${stats.worstPrice.toFixed(3)}৳/l`,
                label: "Worst cost per litre",
                tone: "red",
              },
            ]}
          />
          <MetricCard
            title=""
            value=""
            metrics={[
              {
                icon: DollarSign,
                value: `${(stats.totalCosts / Math.max(stats.distance / stats.avgDaily, 1)).toFixed(3)}৳`,
                label: "AVERAGE COST PER DAY",
                tone: "red",
                labelFirst: true,
              },
              {
                icon: DollarSign,
                value: `${(stats.totalCosts / Math.max(stats.distance / stats.avgMonthly, 1)).toFixed(3)}৳`,
                label: "AVERAGE COST PER MONTH",
                tone: "red",
                labelFirst: true,
              },
            ]}
          />
        </div>
      )}

      {tab === "Distance" && (
        <div className="space-y-5">
          <div className="relative h-36 overflow-hidden rounded-2xl bg-[oklch(0.48_0.2_295)] p-5 text-white shadow-card">
            <div className="absolute bottom-0 left-10 h-24 w-36 rounded-t-full border-[10px] border-white/15" />
            <div className="absolute right-8 top-8 rounded-2xl bg-red-500 p-4 shadow-lg">
              <Gauge className="h-12 w-12" />
            </div>
            <div className="relative flex h-full items-end gap-4">
              <div className="grid h-20 w-20 place-items-center rounded-full bg-white/20">
                <Car className="h-12 w-12" />
              </div>
              <Fuel className="mb-2 h-16 w-16 rotate-45 text-black" />
            </div>
          </div>
          <SummaryCard
            title="Distance driven with FuelMate"
            value={`${stats.distance.toLocaleString(undefined, { maximumFractionDigits: 1 })} km`}
          />
          <MetricCard
            title="Last odo counter value"
            value={`${stats.lastOdo.toLocaleString()} km`}
            metrics={[
              { icon: Gauge, value: `${stats.thisYearDistance.toFixed(1)} km`, label: "This year" },
              {
                icon: Gauge,
                value: `${stats.thisMonthDistance.toFixed(1)} km`,
                label: "This month",
              },
              { value: `${stats.previousYearDistance.toFixed(1)} km`, label: "Previous year" },
              { value: `${stats.previousMonthDistance.toFixed(1)} km`, label: "Previous month" },
            ]}
          />
          <MetricCard
            title=""
            value=""
            metrics={[
              {
                icon: Car,
                value: `${stats.avgDaily.toFixed(1)} km`,
                label: "AVG MILEAGE PER DAY",
                labelFirst: true,
              },
              {
                icon: Car,
                value: `${stats.avgMonthly.toFixed(1)} km`,
                label: "AVG MILEAGE PER MONTH",
                labelFirst: true,
              },
            ]}
          />
        </div>
      )}
    </div>
  );
}

type Metric = {
  icon?: LucideIcon;
  value: string;
  label: string;
  heading?: string;
  tone?: "purple" | "green" | "red";
  labelFirst?: boolean;
};

function SummaryCard({ title, value }: { title: string; value: string }) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-[0_12px_35px_oklch(0_0_0/0.08)]">
      <p className="text-xl text-slate-400">{title}</p>
      <p className="mt-4 text-3xl font-bold">{value}</p>
    </section>
  );
}

function MetricCard({
  title,
  value,
  metrics,
  dividerAt,
}: {
  title: string;
  value: string;
  metrics: Metric[];
  dividerAt?: number;
}) {
  const topMetrics = dividerAt === undefined ? metrics : metrics.slice(0, dividerAt);
  const bottomMetrics = dividerAt === undefined ? [] : metrics.slice(dividerAt);

  return (
    <section className="rounded-2xl bg-white p-6 shadow-[0_12px_35px_oklch(0_0_0/0.08)]">
      {title && <p className="text-xl text-slate-400">{title}</p>}
      {value && <p className="mt-3 text-3xl font-bold">{value}</p>}
      <div className="mt-6 grid grid-cols-2 gap-x-10 gap-y-7">
        {topMetrics.map((metric, index) => (
          <MetricItem key={`${metric.label}-${index}`} metric={metric} />
        ))}
        {bottomMetrics.length > 0 && (
          <div className="col-span-2 grid grid-cols-2 gap-x-10 border-t border-slate-200 pt-6">
            {bottomMetrics.map((metric, index) => (
              <MetricItem key={`${metric.label}-${index}`} metric={metric} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function MetricItem({ metric }: { metric: Metric }) {
  const Icon = metric.icon;
  const tone =
    metric.tone === "green"
      ? "text-[oklch(0.72_0.18_150)]"
      : metric.tone === "red"
        ? "text-[oklch(0.64_0.24_25)]"
        : purple;

  return (
    <div>
      {metric.heading && (
        <p className="mb-5 text-sm font-medium tracking-wide text-slate-400">{metric.heading}</p>
      )}
      {metric.labelFirst && (
        <p className="mb-4 text-sm font-medium tracking-wide text-slate-400">{metric.label}</p>
      )}
      <p className="flex items-center gap-2 text-2xl font-semibold">
        {Icon && <Icon className={`h-6 w-6 ${tone}`} />}
        {metric.value}
      </p>
      {!metric.labelFirst && <p className="mt-4 text-lg text-slate-400">{metric.label}</p>}
    </div>
  );
}
