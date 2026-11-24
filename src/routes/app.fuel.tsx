import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Fuel,
  Search,
  Plus,
  Droplets,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Banknote,
  MapPin,
  Image as ImageIcon,
  X,
  Sparkles,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { useFuelData, FillUpRecord } from "@/lib/fuel-store";
import { AddFillUpModal } from "@/components/AddFillUpModal";

export const Route = createFileRoute("/app/fuel")({
  head: () => ({ meta: [{ title: "Fill-ups — FuelMate Pro" }] }),
  component: FuelPage,
});

export function FuelPage() {
  const { fillUps, sortedDescending, stats, addFillUp, deleteFillUp } = useFuelData();
  const [q, setQ] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<FillUpRecord | null>(null);

  // Group by month
  const grouped = useMemo(() => {
    const filtered = sortedDescending.filter((log) => {
      const text = `${log.stationName} ${log.city} ${log.notes || ""} ${log.fuelTypeName}`.toLowerCase();
      return text.includes(q.toLowerCase());
    });

    return filtered.reduce<Record<string, FillUpRecord[]>>((acc, log) => {
      const month = format(parseISO(log.date), "MMMM yyyy");
      acc[month] = [...(acc[month] || []), log];
      return acc;
    }, {});
  }, [sortedDescending, q]);

  return (
    <div className="space-y-4 pb-12 text-white">
      {/* Top Header */}
      <header className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <span>Fill-ups</span>
            <span className="text-xs font-mono font-medium text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
              {fillUps.length} logs
            </span>
          </h1>
          <p className="text-[11px] text-neutral-400 mt-0.5">
            Mileage under 40 km/L is highlighted in <span className="text-red-400 font-semibold">Red</span>
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#141824] border border-white/10 shadow-lg">
          <button
            onClick={() => setIsSearchOpen((v) => !v)}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 text-neutral-300 hover:text-white transition-colors"
            title="Search logs"
          >
            {isSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 text-black flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.4)] hover:scale-105 active:scale-95 transition-all"
            title="Add fill-up"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </header>

      {/* Search Bar */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="relative">
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search station, city, or fuel type..."
                className="w-full h-11 px-4 pl-10 rounded-2xl bg-[#141824] border border-cyan-500/30 text-white text-xs placeholder:text-neutral-500 focus:outline-none shadow-inner"
                autoFocus
              />
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-cyan-400" />
              {q && (
                <button
                  onClick={() => setQ("")}
                  className="absolute right-3.5 top-3.5 text-xs text-neutral-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Monthly Grouped List */}
      <div className="space-y-6">
        {Object.entries(grouped).map(([month, logs]) => {
          const monthTotalCost = logs.reduce((s, l) => s + l.cost, 0);
          const monthTotalLiters = logs.reduce((s, l) => s + l.liters, 0);

          return (
            <section key={month} className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  {month}
                </h2>
                <span className="text-[11px] font-mono text-cyan-300">
                  {monthTotalCost.toFixed(2)} ৳ · {monthTotalLiters.toFixed(2)} L
                </span>
              </div>

              <div className="space-y-3">
                {logs.map((log) => {
                  const price = log.fuelPricePerLiter;
                  const dist = log.distanceSinceLast || 0;
                  const costPerKm = dist > 0 ? (log.cost / dist).toFixed(3) : "—";

                  // Condition: Mileage under 40 km/l turns RED!
                  const isLowMileage = log.mileage > 0 && log.mileage < 40;
                  const isSuperbMileage = log.mileage >= 45;

                  return (
                    <motion.article
                      key={log.id}
                      onClick={() => setSelectedRecord(log)}
                      className={`p-4 rounded-[24px] bg-[#141824] border transition-all cursor-pointer shadow-lg space-y-3 hover:translate-y-[-1px] ${
                        isLowMileage
                          ? "border-red-500/30 hover:border-red-500/50"
                          : "border-white/5 hover:border-cyan-500/30"
                      }`}
                    >
                      {/* Top row: Date + Cost, Odometer + Trip */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-11 h-11 rounded-2xl border flex items-center justify-center shadow-inner ${
                              isLowMileage
                                ? "bg-red-500/10 border-red-500/30 text-red-400"
                                : "bg-white/5 border-white/10 text-cyan-400"
                            }`}
                          >
                            <Fuel className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-white">
                              {format(parseISO(log.date), "dd MMM, yyyy")}
                            </p>
                            <p className="text-base font-extrabold text-white mt-0.5 tracking-tight">
                              {log.cost.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}{" "}
                              <span className="text-xs font-normal text-cyan-300">৳</span>
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-xs font-bold text-neutral-200 font-mono">
                            {log.odometer.toLocaleString(undefined, { minimumFractionDigits: 1 })} km
                          </p>
                          <p className="text-[11px] text-cyan-400 font-mono mt-0.5">
                            +{dist > 0 ? dist.toFixed(1) : "—"} km
                          </p>
                        </div>
                      </div>

                      {/* Middle row: Liters -> Price/L + Fuel Type */}
                      <div className="pt-2.5 border-t border-white/5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-neutral-300">
                          <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                          <span>
                            {log.liters} L → {price.toFixed(2)} ৳/L
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/5 text-neutral-400 font-medium">
                            {log.fuelTypeName || "Octane"}
                          </span>
                        </div>
                      </div>

                      {/* Mileage & Cost per km Badges */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {log.mileage > 0 ? (
                          isLowMileage ? (
                            /* RED BADGE when mileage < 40 km/l */
                            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/15 text-red-400 border border-red-500/35 text-[11px] font-bold shadow-[0_0_12px_rgba(239,68,68,0.2)]">
                              <TrendingDown className="w-3.5 h-3.5 stroke-[2.5]" />
                              <span>{log.mileage.toFixed(2)} km/L (Low)</span>
                            </div>
                          ) : isSuperbMileage ? (
                            /* CYAN BADGE when mileage >= 45 km/l */
                            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/35 text-[11px] font-bold shadow-[0_0_12px_rgba(0,229,255,0.2)]">
                              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                              <span>{log.mileage.toFixed(2)} km/L</span>
                            </div>
                          ) : (
                            /* EMERALD GREEN BADGE when mileage >= 40 */
                            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold">
                              <TrendingUp className="w-3 h-3" />
                              <span>{log.mileage.toFixed(2)} km/L</span>
                            </div>
                          )
                        ) : (
                          <span className="text-[10px] text-neutral-500 italic">
                            Partial fill (No mileage)
                          </span>
                        )}

                        {dist > 0 && (
                          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 text-neutral-300 border border-white/10 text-[11px] font-mono">
                            <Banknote className="w-3 h-3 text-cyan-400" />
                            <span>{costPerKm} ৳/km</span>
                          </div>
                        )}
                      </div>

                      {/* Bottom row: Station name & pictures counter */}
                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-neutral-400">
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3 h-3 text-red-400 shrink-0" />
                          <span className="truncate">{log.stationName || log.city}</span>
                        </div>
                        {log.pictureCount > 0 && (
                          <div className="flex items-center gap-1 text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20 shrink-0">
                            <ImageIcon className="w-3 h-3" />
                            <span>{log.pictureCount}</span>
                          </div>
                        )}
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>



      {/* Detail / View Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-[#0e111a] border border-white/10 rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl relative text-white space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h3 className="text-base font-bold text-white">Fill-up Details</h3>
              <button
                onClick={() => setSelectedRecord(null)}
                className="w-7 h-7 rounded-full bg-white/5 grid place-items-center text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">Date</span>
                <span className="text-xs font-semibold text-white">
                  {format(parseISO(selectedRecord.date), "dd MMMM, yyyy")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">Total Bill</span>
                <span className="text-base font-black text-cyan-300">
                  {selectedRecord.cost.toFixed(2)} ৳
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">Odometer</span>
                <span className="text-xs font-mono font-bold text-white">
                  {selectedRecord.odometer} km
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">Fuel & Rate</span>
                <span className="text-xs text-white">
                  {selectedRecord.liters} L @ {selectedRecord.fuelPricePerLiter} ৳/L
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">Fuel Mileage</span>
                <span
                  className={`text-xs font-bold ${
                    selectedRecord.mileage > 0 && selectedRecord.mileage < 40
                      ? "text-red-400"
                      : "text-emerald-400"
                  }`}
                >
                  {selectedRecord.mileage > 0
                    ? `${selectedRecord.mileage.toFixed(2)} km/L ${
                        selectedRecord.mileage < 40 ? "(Under 40)" : ""
                      }`
                    : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">Station</span>
                <span className="text-xs text-white truncate max-w-[200px]">
                  {selectedRecord.stationName}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                deleteFillUp(selectedRecord.id);
                setSelectedRecord(null);
              }}
              className="w-full py-2.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition-colors"
            >
              Delete this log
            </button>
          </motion.div>
        </div>
      )}

      {/* Add Modal */}
      <AddFillUpModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSave={addFillUp}
        lastOdo={stats.latestOdometer}
      />
    </div>
  );
}
