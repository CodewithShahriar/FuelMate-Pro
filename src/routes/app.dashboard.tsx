import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Fuel,
  Droplet,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Settings,
  BarChart2,
  Calculator,
  Plus,
  Sparkles,
  Zap,
  ShieldAlert,
  Wrench,
  Navigation,
  ArrowRight,
  Gauge,
  Calendar,
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, Tooltip, XAxis, YAxis } from "recharts";
import { useFuelData } from "@/lib/fuel-store";
import { AddFillUpModal } from "@/components/AddFillUpModal";

export const Route = createFileRoute("/app/dashboard")({
  head: () => ({ meta: [{ title: "Cockpit — FuelMate Pro" }] }),
  component: DashboardPage,
});

export const tooltipStyle = {
  backgroundColor: "rgba(10, 13, 20, 0.95)",
  border: "1px solid rgba(0, 229, 255, 0.25)",
  borderRadius: "14px",
  color: "#ffffff",
  fontSize: "12px",
  padding: "8px 12px",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6)",
};

export function DashboardPage() {
  const { stats, vehicle, fillUps, sortedDescending, addFillUp } = useFuelData();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [quickTripKm, setQuickTripKm] = useState<number>(58);

  const latestLog = sortedDescending[0] || fillUps[fillUps.length - 1];

  // Estimated full tank range: 12L * avgEfficiency
  const fullTankRange = Math.round(12.0 * stats.avgEfficiency);
  const reserveRange = Math.round(2.5 * stats.avgEfficiency);

  // Quick trip estimate
  const estimatedTripCost = ((quickTripKm / stats.avgEfficiency) * stats.lastFuelPrice).toFixed(1);

  // Mileage curve for graph
  const trendData = fillUps
    .filter((l) => l.mileage > 0)
    .slice(-8)
    .map((l) => ({
      date: l.date.slice(5),
      kmPerLiter: l.mileage,
    }));

  return (
    <div className="space-y-4 pb-8 text-white">
      {/* Top Header: Futuristic HUD Brand */}
      <header className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.4)]">
              <Gauge className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0b0d14]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg font-black tracking-tight text-white">FuelMate</h1>
              <span className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 font-medium">TVS Apache RTR 160 4V</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddOpen(true)}
            className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 text-black flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.4)] hover:scale-105 active:scale-95 transition-all"
            title="Log New Fill-up"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
          </button>
          <Link
            to="/app/stats"
            className="w-9 h-9 rounded-full bg-[#141824] border border-white/10 flex items-center justify-center text-cyan-400 hover:text-white transition-colors"
            title="Stats"
          >
            <BarChart2 className="w-4 h-4" />
          </Link>
          <Link
            to="/app/settings"
            className="w-9 h-9 rounded-full bg-[#141824] border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* FUTURISTIC COCKPIT HERO HUD CARD */}
      <div className="relative overflow-hidden p-5 rounded-[32px] bg-gradient-to-b from-[#141824] via-[#10131d] to-[#0d1017] border border-cyan-500/25 shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_35px_rgba(0,229,255,0.1)]">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 inset-x-1/4 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          {/* Top row: Bike status & Plate */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏍️</span>
              <div>
                <span className="text-xs font-bold text-white tracking-wide">APACHE 4V</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              OPTIMAL
            </span>
          </div>

          {/* Center Digital Cockpit Gauge */}
          <div className="text-center py-2 space-y-1">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest">
              Average Fuel Efficiency
            </span>
            <div className="flex items-baseline justify-center gap-1.5">
              <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-cyan-400 tracking-tight font-mono">
                {stats.avgEfficiency}
              </span>
              <span className="text-sm font-bold text-cyan-400 tracking-wider">km/L</span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Last Fill-up: <strong className="text-emerald-400">{stats.lastEfficiency} km/L</strong> ·{" "}
              <span className="text-neutral-300">{stats.lastFuelPrice.toFixed(0)} ৳/L</span>
            </p>
          </div>

          {/* 12L Fuel Tank & Range Gauge Bar */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400 flex items-center gap-1.5">
                <Fuel className="w-3.5 h-3.5 text-cyan-400" />
                <span>12L Fuel Capacity</span>
              </span>
              <span className="font-mono text-cyan-300 font-bold">~{fullTankRange} km Range</span>
            </div>

            {/* Custom Tank Range Progress Bar */}
            <div className="w-full h-3 bg-neutral-800 rounded-full overflow-hidden flex p-0.5 border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                style={{ width: "79%" }}
              />
              <div
                className="h-full bg-amber-500/80 rounded-r-full"
                style={{ width: "21%" }}
                title="2.5L Reserve (~105 km)"
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-neutral-400">
              <span>Main Tank: ~{fullTankRange - reserveRange} km</span>
              <span className="text-amber-400 font-medium">Reserve (2.5L): ~{reserveRange} km</span>
            </div>
          </div>

          {/* Odometer Bar */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <div>
              <span className="text-[10px] text-neutral-400 uppercase">Odometer</span>
              <p className="text-sm font-bold font-mono text-white mt-0.5">
                {stats.latestOdometer.toLocaleString(undefined, { minimumFractionDigits: 1 })} km
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-neutral-400 uppercase">Tracked Driven</span>
              <p className="text-sm font-bold font-mono text-cyan-400 mt-0.5">
                {stats.distanceTracked.toLocaleString(undefined, { minimumFractionDigits: 1 })} km
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4 COCKPIT METRIC CARDS */}
      <div className="grid grid-cols-2 gap-3">
        {/* Cost per km */}
        <div className="p-3.5 rounded-2xl bg-[#141824] border border-white/5 space-y-1 shadow-lg">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
            Cost per KM
          </span>
          <p className="text-xl font-black text-cyan-300 tracking-tight font-mono">
            {stats.costPerKm.toFixed(3)} ৳
          </p>
          <p className="text-[10px] text-emerald-400">Very cost effective</p>
        </div>

        {/* Total Spent */}
        <div className="p-3.5 rounded-2xl bg-[#141824] border border-white/5 space-y-1 shadow-lg">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
            Total Fuel Bill
          </span>
          <p className="text-xl font-black text-white tracking-tight font-mono">
            {stats.totalFuelCost.toLocaleString(undefined, { maximumFractionDigits: 0 })} ৳
          </p>
          <p className="text-[10px] text-neutral-400">Across {stats.fillUpsCount} fill-ups</p>
        </div>

        {/* Total Liters */}
        <div className="p-3.5 rounded-2xl bg-[#141824] border border-white/5 space-y-1 shadow-lg">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
            Total Fuel Volume
          </span>
          <p className="text-xl font-black text-white tracking-tight font-mono">
            {stats.totalLiters.toFixed(1)} L
          </p>
          <p className="text-[10px] text-neutral-400">Octane pumped</p>
        </div>

        {/* Best Efficiency Record */}
        <div className="p-3.5 rounded-2xl bg-[#141824] border border-white/5 space-y-1 shadow-lg">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
            Peak Record
          </span>
          <p className="text-xl font-black text-emerald-400 tracking-tight font-mono">
            53.05 km/L
          </p>
          <p className="text-[10px] text-neutral-400">26 May 2026 record</p>
        </div>
      </div>

      {/* QUICK TRIP COST ESTIMATOR WIDGET */}
      <section className="p-4 rounded-[26px] bg-[#141824] border border-white/10 space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">
              Trip Fuel Cost Estimator
            </h2>
          </div>
          <Link to="/app/calculator" className="text-[11px] font-semibold text-cyan-400 hover:underline">
            Full Tool →
          </Link>
        </div>

        {/* Quick route chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { label: "Jaflong", km: 58 },
            { label: "Sreemangal", km: 85 },
            { label: "Bisanakandi", km: 45 },
            { label: "Dhaka", km: 245 },
          ].map((r) => (
            <button
              key={r.label}
              onClick={() => setQuickTripKm(r.km)}
              className={`px-2.5 py-1 rounded-xl text-xs font-medium border transition-colors ${
                quickTripKm === r.km
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                  : "bg-white/5 text-neutral-400 border-white/5 hover:text-white"
              }`}
            >
              {r.label} ({r.km} km)
            </button>
          ))}
        </div>

        <div className="p-3 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-neutral-400 uppercase">Trip: {quickTripKm} km</span>
            <p className="text-xl font-black text-cyan-300 font-mono mt-0.5">
              ~৳{estimatedTripCost}
            </p>
          </div>
          <div className="text-right text-[11px] text-neutral-400">
            <p>
              Fuel needed: <strong className="text-white">{(quickTripKm / stats.avgEfficiency).toFixed(2)} L</strong>
            </p>
            <p className="text-[10px] text-neutral-500">at ৳{stats.lastFuelPrice}/L</p>
          </div>
        </div>
      </section>

      {/* BIKE HEALTH & SERVICE REMINDER ALERT */}
      <section className="p-4 rounded-[26px] bg-gradient-to-r from-purple-950/40 to-black border border-purple-500/25 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-purple-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-purple-300">
              Apache 4v Maintenance
            </h2>
          </div>
          <span className="text-[10px] text-neutral-400">Interval alerts</span>
        </div>

        <div className="space-y-2">
          {/* Engine Oil */}
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs">
            <div>
              <p className="font-semibold text-white">Engine Oil Change (Motul 7100)</p>
              <p className="text-[10px] text-neutral-400">Due at 39,500 km (~1,020 km left)</p>
            </div>
            <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
              Upcoming
            </span>
          </div>

          {/* Chain Lube */}
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs">
            <div>
              <p className="font-semibold text-white">Chain Cleaning & Lubrication</p>
              <p className="text-[10px] text-neutral-400">Every 500 km (Recommended this weekend)</p>
            </div>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
              Check
            </span>
          </div>
        </div>
      </section>

      {/* LATEST FILL-UP SNIPPET */}
      {latestLog && (
        <section className="p-4 rounded-[26px] bg-[#141824] border border-white/10 space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Latest Fuel Entry
            </h2>
            <Link to="/app/fuel" className="text-[11px] font-semibold text-cyan-400 hover:underline">
              View All ({fillUps.length}) →
            </Link>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">{latestLog.date}</span>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  {latestLog.fuelTypeName || "Octane"}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                {latestLog.liters} L @ {latestLog.fuelPricePerLiter} ৳/L · {latestLog.stationName}
              </p>
            </div>
            <div className="text-right">
              <p className="text-base font-black text-white font-mono">{latestLog.cost.toFixed(2)} ৳</p>
              <span
                className={`text-[10px] font-bold ${
                  latestLog.mileage < 40 ? "text-red-400" : "text-emerald-400"
                }`}
              >
                {latestLog.mileage > 0 ? `${latestLog.mileage.toFixed(2)} km/L` : "Full Tank"}
              </span>
            </div>
          </div>
        </section>
      )}



      {/* Add Fill-up Modal */}
      <AddFillUpModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSave={addFillUp}
        lastOdo={stats.latestOdometer}
      />
    </div>
  );
}
