import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Fuel,
  Droplet,
  Banknote,
  Navigation,
  Gauge,
  TrendingUp,
  TrendingDown,
  Calendar,
  Sparkles,
  Zap,
} from "lucide-react";
import { useFuelData } from "@/lib/fuel-store";

export const Route = createFileRoute("/app/stats")({
  head: () => ({ meta: [{ title: "Stats — FuelMate Pro" }] }),
  component: StatsPage,
});

type Tab = "Fill-ups" | "Costs" | "Distance";

export function StatsPage() {
  const [tab, setTab] = useState<Tab>("Fill-ups");
  const { stats, fillUps } = useFuelData();

  return (
    <div className="space-y-4 pb-12 text-white">
      {/* Header with back button */}
      <header className="flex items-center gap-3 pt-1">
        <Link
          to="/app/dashboard"
          className="w-9 h-9 rounded-full bg-[#141824] border border-white/10 flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-xl font-black tracking-tight">Stats & Analytics</h1>
      </header>

      {/* 3 Tabs (Fuelio Screenshots: [Fill-ups] [Costs] [Distance]) */}
      <div className="grid grid-cols-3 p-1 rounded-2xl bg-[#141824] border border-white/10 text-xs font-semibold">
        {(["Fill-ups", "Costs", "Distance"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`py-2 rounded-xl transition-all duration-200 ${
              tab === t
                ? "bg-gradient-to-b from-cyan-500/20 to-cyan-500/5 text-cyan-400 border border-cyan-500/30 shadow-sm"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab 1: Fill-ups */}
      {tab === "Fill-ups" && (
        <motion.div
          key="fillups"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Banner Illustration (Fuelio style) */}
          <div className="relative overflow-hidden p-5 rounded-[28px] bg-gradient-to-br from-cyan-950/60 to-blue-950/40 border border-cyan-500/20 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-cyan-400">
                Lifetime Fill-ups
              </span>
              <p className="text-3xl font-black text-white mt-0.5">{stats.fillUpsCount}</p>
              <p className="text-xs text-neutral-300 mt-1">Logs recorded for Apache 4v</p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-3xl shadow-[0_0_25px_rgba(0,229,255,0.25)]">
              ⛽
            </div>
          </div>

          {/* Section: Fill-ups breakdown */}
          <div className="p-4 rounded-[24px] bg-[#141824] border border-white/5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Fill-ups Frequency
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-[11px] text-neutral-400">This year</span>
                <p className="text-lg font-bold text-white mt-0.5 font-mono">
                  {stats.fillUpsThisYear}
                </p>
                <p className="text-[10px] text-neutral-500">Prev year: {stats.fillUpsPrevYear}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-[11px] text-neutral-400">This month</span>
                <p className="text-lg font-bold text-cyan-400 mt-0.5 font-mono">
                  {stats.fillUpsThisMonth}
                </p>
                <p className="text-[10px] text-neutral-500">Prev month: {stats.fillUpsPrevMonth}</p>
              </div>
            </div>
          </div>

          {/* Section: Fuel Volume */}
          <div className="p-4 rounded-[24px] bg-[#141824] border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Total Fuel Pumped
              </h3>
              <span className="text-xs font-mono font-bold text-cyan-300">
                {stats.totalLiters.toFixed(3)} L
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-[11px] text-neutral-400">This year</span>
                <p className="text-base font-bold text-white mt-0.5 font-mono">
                  {stats.fuelThisYear.toFixed(2)} L
                </p>
                <p className="text-[10px] text-neutral-500">
                  Prev year: {stats.fuelPrevYear.toFixed(2)} L
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-[11px] text-neutral-400">This month</span>
                <p className="text-base font-bold text-cyan-400 mt-0.5 font-mono">
                  {stats.fuelThisMonth.toFixed(2)} L
                </p>
                <p className="text-[10px] text-neutral-500">
                  Prev month: {stats.fuelPrevMonth.toFixed(2)} L
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-neutral-400" />
                <div>
                  <span className="text-[10px] text-neutral-400">Min fill-up</span>
                  <p className="font-mono font-bold text-neutral-200">{stats.minFill.toFixed(1)} L</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <div>
                  <span className="text-[10px] text-neutral-400">Max fill-up</span>
                  <p className="font-mono font-bold text-cyan-300">{stats.maxFill.toFixed(2)} L</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab 2: Costs */}
      {tab === "Costs" && (
        <motion.div
          key="costs"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Banner Illustration (Fuelio style) */}
          <div className="relative overflow-hidden p-5 rounded-[28px] bg-gradient-to-br from-purple-950/60 to-blue-950/40 border border-purple-500/20 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-purple-400">
                Total Fuel Expense
              </span>
              <p className="text-3xl font-black text-white mt-0.5 tracking-tight">
                {stats.totalFuelCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}{" "}
                <span className="text-base font-bold text-purple-300">৳</span>
              </p>
              <p className="text-xs text-neutral-300 mt-1">46 fill-ups across 2 years</p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-3xl shadow-[0_0_25px_rgba(168,85,247,0.25)]">
              💳
            </div>
          </div>

          {/* Section: Costs Year & Month breakdown */}
          <div className="p-4 rounded-[24px] bg-[#141824] border border-white/5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Spending Breakdown
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-[11px] text-neutral-400">This year</span>
                <p className="text-base font-bold text-white mt-0.5 font-mono">
                  {stats.costThisYear.toLocaleString(undefined, { maximumFractionDigits: 2 })} ৳
                </p>
                <p className="text-[10px] text-neutral-500">
                  Prev year: {stats.costPrevYear.toLocaleString(undefined, { maximumFractionDigits: 0 })} ৳
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-[11px] text-neutral-400">This month</span>
                <p className="text-base font-bold text-cyan-400 mt-0.5 font-mono">
                  {stats.costThisMonth.toFixed(2)} ৳
                </p>
                <p className="text-[10px] text-neutral-500">
                  Prev month: {stats.costPrevMonth.toFixed(2)} ৳
                </p>
              </div>
            </div>
          </div>

          {/* Section: Bills & Fuel Price (Fuelio Screenshot 3) */}
          <div className="p-4 rounded-[24px] bg-[#141824] border border-white/5 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  BILLS
                </span>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
                  <div>
                    <span className="text-[10px] text-emerald-400 font-medium">Lowest bill</span>
                    <p className="font-mono font-bold text-emerald-400 text-sm">
                      {stats.lowestBill.toFixed(2)} ৳
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-red-400 font-medium">Highest bill</span>
                    <p className="font-mono font-bold text-red-400 text-sm">
                      {stats.highestBill.toFixed(2)} ৳
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  FUEL PRICE
                </span>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
                  <div>
                    <span className="text-[10px] text-emerald-400 font-medium">Best price</span>
                    <p className="font-mono font-bold text-emerald-400 text-sm">
                      {stats.bestPrice.toFixed(2)} ৳
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-red-400 font-medium">Worst price</span>
                    <p className="font-mono font-bold text-red-400 text-sm">
                      {stats.worstPrice.toFixed(2)} ৳
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Average cost per kilometre */}
          <div className="p-4 rounded-[24px] bg-[#141824] border border-white/5 flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-400">Average cost per kilometre</p>
              <p className="text-xl font-black text-cyan-300 mt-0.5 tracking-tight">
                {stats.costPerKm.toFixed(3)} ৳/km
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-neutral-500 uppercase">Cost efficiency</span>
              <p className="text-xs font-semibold text-emerald-400">Optimal</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab 3: Distance */}
      {tab === "Distance" && (
        <motion.div
          key="distance"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Banner Illustration (Fuelio style) */}
          <div className="relative overflow-hidden p-5 rounded-[28px] bg-gradient-to-br from-emerald-950/60 to-cyan-950/40 border border-emerald-500/20 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-400">
                Tracked Distance
              </span>
              <p className="text-3xl font-black text-white mt-0.5 tracking-tight">
                {stats.distanceTracked.toLocaleString(undefined, { minimumFractionDigits: 1 })}{" "}
                <span className="text-base font-bold text-emerald-300">km</span>
              </p>
              <p className="text-xs text-neutral-300 mt-1">
                Last odo: {stats.latestOdometer.toLocaleString()} km
              </p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-3xl shadow-[0_0_25px_rgba(16,185,129,0.25)]">
              🏍️
            </div>
          </div>

          {/* Section: Yearly & Monthly Distance Grid */}
          <div className="p-4 rounded-[24px] bg-[#141824] border border-white/5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Odometer History
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-[11px] text-neutral-400">This year</span>
                <p className="text-base font-bold text-white mt-0.5 font-mono">
                  {stats.distThisYear.toLocaleString()} km
                </p>
                <p className="text-[10px] text-neutral-500">
                  Prev year: {stats.distPrevYear.toLocaleString()} km
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-[11px] text-neutral-400">This month</span>
                <p className="text-base font-bold text-cyan-400 mt-0.5 font-mono">
                  {stats.distThisMonth} km
                </p>
                <p className="text-[10px] text-neutral-500">Prev month: {stats.distPrevMonth} km</p>
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase">AVG MILEAGE PER DAY</span>
                <p className="font-mono font-bold text-white mt-0.5">{stats.avgDailyMileage} km</p>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase">AVG MILEAGE PER MONTH</span>
                <p className="font-mono font-bold text-cyan-300 mt-0.5">
                  {stats.avgMonthlyMileage} km
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
