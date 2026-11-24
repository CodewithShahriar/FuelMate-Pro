import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calculator,
  Sparkles,
  MapPin,
  TrendingUp,
  Droplet,
  Fuel,
  Navigation,
  ArrowRight,
  Check,
  ChevronDown,
} from "lucide-react";
import { useFuelData } from "@/lib/fuel-store";

export const Route = createFileRoute("/app/calculator")({
  head: () => ({ meta: [{ title: "Trip & Fuel Calculator — FuelMate Pro" }] }),
  component: CalculatorPage,
});

type Mode = "trip_cost" | "budget_distance" | "mileage_check" | "tank_range";

export function CalculatorPage() {
  const { stats, vehicle } = useFuelData();
  const [mode, setMode] = useState<Mode>("trip_cost");

  // Inputs
  const [distance, setDistance] = useState("100");
  const [pricePerLiter, setPricePerLiter] = useState(stats.lastFuelPrice.toString() || "165.0");
  const [mileage, setMileage] = useState(stats.avgEfficiency.toString() || "42.29");
  const [budget, setBudget] = useState("500");
  const [litersUsed, setLitersUsed] = useState("7.5");

  // Presets
  const popularTrips = [
    { label: "City Daily", km: 25 },
    { label: "Sylhet - Jaflong", km: 58 },
    { label: "Sylhet - Sreemangal", km: 85 },
    { label: "Sylhet - Dhaka", km: 245 },
  ];

  // Calculations:
  const distNum = parseFloat(distance) || 0;
  const priceNum = parseFloat(pricePerLiter) || 165;
  const mileageNum = parseFloat(mileage) || 42.29;
  const budgetNum = parseFloat(budget) || 0;
  const litersNum = parseFloat(litersUsed) || 0;

  // 1. Trip cost
  const requiredLiters = mileageNum > 0 ? distNum / mileageNum : 0;
  const tripCost = requiredLiters * priceNum;
  const costPerKm = distNum > 0 ? tripCost / distNum : 0;

  // 2. Budget distance
  const litersFromBudget = priceNum > 0 ? budgetNum / priceNum : 0;
  const distanceCoverable = litersFromBudget * mileageNum;

  // 3. Mileage check
  const calculatedMileage = litersNum > 0 ? distNum / litersNum : 0;

  // 4. Tank range for Apache 4v (12L, reserve 2.5L)
  const fullTankRange = 12.0 * mileageNum;
  const reserveRange = 2.5 * mileageNum;
  const mainTankRange = (12.0 - 2.5) * mileageNum;

  return (
    <div className="space-y-4 pb-12 text-white">
      {/* Header */}
      <header className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
            <span>Fuel & Trip Calculator</span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              SMART
            </span>
          </h1>
          <p className="text-xs text-neutral-400">Estimate trip expenses, required fuel & range</p>
        </div>
        <button
          onClick={() => {
            setPricePerLiter(stats.lastFuelPrice.toString());
            setMileage(stats.avgEfficiency.toString());
          }}
          className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-[10px] font-medium text-cyan-400 hover:bg-white/10 transition-colors"
          title="Reset to bike stats"
        >
          <Sparkles className="w-3 h-3" />
          <span>Reset Stats</span>
        </button>
      </header>

      {/* Mode Switcher Tabs */}
      <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-[#141824] border border-white/10 text-xs font-semibold">
        <button
          onClick={() => setMode("trip_cost")}
          className={`py-2 rounded-xl transition-all ${
            mode === "trip_cost"
              ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30 font-bold"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          🚗 Trip Cost
        </button>
        <button
          onClick={() => setMode("budget_distance")}
          className={`py-2 rounded-xl transition-all ${
            mode === "budget_distance"
              ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30 font-bold"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          ⛽ Budget to Range
        </button>
        <button
          onClick={() => setMode("tank_range")}
          className={`py-2 rounded-xl transition-all ${
            mode === "tank_range"
              ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30 font-bold"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          🏍️ 12L Tank Range
        </button>
        <button
          onClick={() => setMode("mileage_check")}
          className={`py-2 rounded-xl transition-all ${
            mode === "mileage_check"
              ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30 font-bold"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          📈 Check Mileage
        </button>
      </div>

      {/* Mode 1: Trip Cost Estimator */}
      {mode === "trip_cost" && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Quick Route Presets */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-medium text-neutral-400">Quick Destination Presets:</span>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {popularTrips.map((p) => (
                <button
                  key={p.label}
                  onClick={() => setDistance(p.km.toString())}
                  className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                    distance === p.km.toString()
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                      : "bg-[#141824] text-neutral-300 border-white/5 hover:border-white/20"
                  }`}
                >
                  {p.label} ({p.km} km)
                </button>
              ))}
            </div>
          </div>

          {/* Inputs */}
          <div className="p-4 rounded-[26px] bg-[#141824] border border-white/10 space-y-3.5">
            <div>
              <label className="text-xs text-neutral-400 font-medium">Trip Distance (km)</label>
              <div className="relative mt-1">
                <input
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  placeholder="e.g. 100"
                  className="w-full h-11 px-4 pr-10 rounded-xl bg-black/40 border border-white/10 text-white font-bold text-base focus:border-cyan-400 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="absolute right-3.5 top-3 text-xs text-neutral-500 font-medium select-none pointer-events-none">km</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-neutral-400 font-medium">Fuel Rate (৳/L)</label>
                <div className="relative mt-1">
                  <input
                    type="number"
                    value={pricePerLiter}
                    onChange={(e) => setPricePerLiter(e.target.value)}
                    placeholder="165.0"
                    className="w-full h-11 px-3.5 pr-8 rounded-xl bg-black/40 border border-white/10 text-white font-medium text-sm focus:border-cyan-400 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="absolute right-3 top-3 text-xs text-neutral-500 select-none pointer-events-none">৳</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-neutral-400 font-medium">Bike Mileage (km/L)</label>
                <div className="relative mt-1">
                  <input
                    type="number"
                    value={mileage}
                    onChange={(e) => setMileage(e.target.value)}
                    placeholder="42.29"
                    className="w-full h-11 px-3.5 pr-12 rounded-xl bg-black/40 border border-white/10 text-white font-medium text-sm focus:border-cyan-400 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="absolute right-3 top-3 text-xs text-neutral-500 select-none pointer-events-none">km/L</span>
                </div>
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="p-5 rounded-[26px] bg-gradient-to-br from-cyan-950/60 to-black border border-cyan-500/30 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  Estimated Trip Cost
                </span>
                <p className="text-3xl font-black text-white mt-0.5 tracking-tight">
                  {tripCost.toFixed(2)} <span className="text-base font-normal text-cyan-300">৳</span>
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-neutral-400 uppercase">Fuel Needed</span>
                <p className="text-lg font-bold text-white font-mono mt-0.5">
                  {requiredLiters.toFixed(2)} L
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2 text-xs">
              <p className="text-neutral-400">
                Rate per km: <span className="text-cyan-300 font-mono font-bold">{costPerKm.toFixed(3)} ৳/km</span>
              </p>
              <p className="text-neutral-400 text-right">
                Tank refill:{" "}
                <span className="text-emerald-400 font-bold">
                  {(requiredLiters / 12.0).toFixed(1)} tank
                </span>
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Mode 2: Budget to Distance */}
      {mode === "budget_distance" && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="p-4 rounded-[26px] bg-[#141824] border border-white/10 space-y-3.5">
            <div>
              <label className="text-xs text-neutral-400 font-medium">Your Fuel Budget (৳ টাকা)</label>
              <div className="relative mt-1">
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="500"
                  className="w-full h-11 px-4 pr-10 rounded-xl bg-black/40 border border-cyan-500/30 text-cyan-300 font-bold text-lg focus:border-cyan-400 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="absolute right-3.5 top-3 text-xs text-neutral-500 font-medium select-none pointer-events-none">৳</span>
              </div>
              <div className="flex gap-2 pt-2">
                {["200", "500", "1000", "1500"].map((b) => (
                  <button
                    key={b}
                    onClick={() => setBudget(b)}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-neutral-300 border border-white/5"
                  >
                    ৳{b}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-neutral-400 font-medium">Fuel Rate (৳/L)</label>
                <input
                  type="number"
                  value={pricePerLiter}
                  onChange={(e) => setPricePerLiter(e.target.value)}
                  className="mt-1 w-full h-11 px-3.5 rounded-xl bg-black/40 border border-white/10 text-white font-medium text-sm focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-neutral-400 font-medium">Bike Mileage (km/L)</label>
                <input
                  type="number"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                  className="mt-1 w-full h-11 px-3.5 rounded-xl bg-black/40 border border-white/10 text-white font-medium text-sm focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="p-5 rounded-[26px] bg-gradient-to-br from-emerald-950/60 to-black border border-emerald-500/30 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Estimated Distance
                </span>
                <p className="text-3xl font-black text-white mt-0.5 tracking-tight">
                  {distanceCoverable.toFixed(1)} <span className="text-base font-normal text-emerald-300">km</span>
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-neutral-400 uppercase">You Get</span>
                <p className="text-lg font-bold text-white font-mono mt-0.5">
                  {litersFromBudget.toFixed(2)} Liters
                </p>
              </div>
            </div>
            <p className="text-xs text-neutral-300 pt-2 border-t border-white/10">
              With ৳{budgetNum}, your Apache 4v can run approx <strong>{distanceCoverable.toFixed(0)} kilometers</strong> safely.
            </p>
          </div>
        </motion.div>
      )}

      {/* Mode 3: Tank Range & Reserve Breakdown */}
      {mode === "tank_range" && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="p-4 rounded-[26px] bg-[#141824] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏍️</span>
                <div>
                  <h3 className="text-sm font-bold text-white">Apache 4v Fuel Tank</h3>
                  <p className="text-xs text-neutral-400">12L Full Capacity · 2.5L Reserve</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-300">
                {mileageNum} km/L
              </span>
            </div>
          </div>

          {/* Visual Tank Breakdown Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 space-y-1">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                Full 12L Tank Range
              </span>
              <p className="text-2xl font-black text-white tracking-tight">
                {fullTankRange.toFixed(0)} km
              </p>
              <p className="text-[10px] text-neutral-400">Total range from 100% full to dry</p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 space-y-1">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                2.5L Reserve Range
              </span>
              <p className="text-2xl font-black text-amber-300 tracking-tight">
                {reserveRange.toFixed(0)} km
              </p>
              <p className="text-[10px] text-neutral-400">Distance when fuel reserve light turns on</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#141824] border border-white/5 space-y-2 text-xs">
            <p className="font-semibold text-white">💡 Pro Riding Advice:</p>
            <p className="text-neutral-400 leading-relaxed">
              When your Apache 4v enters fuel reserve (2.5L remaining), you have roughly{" "}
              <strong className="text-amber-300">{reserveRange.toFixed(0)} km</strong> of safe riding before the engine stalls. It is recommended to refuel within <strong>70–80 km</strong> of entering reserve.
            </p>
          </div>
        </motion.div>
      )}

      {/* Mode 4: Mileage Check */}
      {mode === "mileage_check" && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="p-4 rounded-[26px] bg-[#141824] border border-white/10 space-y-3.5">
            <div>
              <label className="text-xs text-neutral-400 font-medium">Distance Traveled (km)</label>
              <input
                type="number"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="320"
                className="mt-1 w-full h-11 px-4 rounded-xl bg-black/40 border border-white/10 text-white font-bold text-base focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-neutral-400 font-medium">Fuel Consumed (Liters)</label>
              <input
                type="number"
                value={litersUsed}
                onChange={(e) => setLitersUsed(e.target.value)}
                placeholder="7.5"
                className="mt-1 w-full h-11 px-4 rounded-xl bg-black/40 border border-white/10 text-white font-bold text-base focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-5 rounded-[26px] bg-gradient-to-br from-purple-950/60 to-black border border-purple-500/30 space-y-2 shadow-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
              Calculated Efficiency
            </span>
            <p className="text-3xl font-black text-white tracking-tight">
              {calculatedMileage.toFixed(2)}{" "}
              <span className="text-base font-normal text-purple-300">km/L</span>
            </p>
            <p className="text-xs text-neutral-300 pt-1">
              {calculatedMileage < 40 ? (
                <span className="text-red-400 font-semibold">⚠️ Under 40 km/L (Low efficiency)</span>
              ) : calculatedMileage >= 45 ? (
                <span className="text-cyan-300 font-semibold">⚡ Superb efficiency (Above 45 km/L)</span>
              ) : (
                <span className="text-emerald-400 font-semibold">✅ Good average mileage</span>
              )}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
