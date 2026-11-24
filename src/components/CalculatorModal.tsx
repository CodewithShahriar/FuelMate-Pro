import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, X, Sparkles, ChevronDown, Check } from "lucide-react";

type CalcMode = "Trip cost" | "Distance" | "Consumption" | "Required fuel";

export function CalculatorModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [mode, setMode] = useState<CalcMode>("Trip cost");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Inputs
  const [distance, setDistance] = useState<string>("100");
  const [pricePerLiter, setPricePerLiter] = useState<string>("165.0");
  const [consumption, setConsumption] = useState<string>("43.89");
  const [budget, setBudget] = useState<string>("500");
  const [fuelLiters, setFuelLiters] = useState<string>("10");

  const [result, setResult] = useState<{ primary: string; secondary: string } | null>({
    primary: "375.94 ৳",
    secondary: "2.28 L",
  });

  const modes: CalcMode[] = ["Trip cost", "Distance", "Consumption", "Required fuel"];

  const handleCalculate = () => {
    const distNum = parseFloat(distance) || 0;
    const priceNum = parseFloat(pricePerLiter) || 165;
    const consNum = parseFloat(consumption) || 43.89;
    const budgetNum = parseFloat(budget) || 0;
    const litersNum = parseFloat(fuelLiters) || 0;

    if (mode === "Trip cost") {
      // Liters needed = distance / consumption
      // Cost = liters * price
      if (consNum > 0) {
        const reqLiters = distNum / consNum;
        const totalCost = reqLiters * priceNum;
        setResult({
          primary: `${totalCost.toFixed(2)} ৳`,
          secondary: `${reqLiters.toFixed(2)} L needed`,
        });
      }
    } else if (mode === "Distance") {
      // Distance = liters * consumption
      if (priceNum > 0) {
        const litersFromBudget = budgetNum / priceNum;
        const possibleDistance = litersFromBudget * consNum;
        setResult({
          primary: `${possibleDistance.toFixed(1)} km`,
          secondary: `with ${litersFromBudget.toFixed(2)} L (৳${budgetNum})`,
        });
      }
    } else if (mode === "Consumption") {
      // km/L = distance / liters
      if (litersNum > 0) {
        const mileage = distNum / litersNum;
        const costPerKm = (litersNum * priceNum) / (distNum || 1);
        setResult({
          primary: `${mileage.toFixed(2)} km/L`,
          secondary: `৳${costPerKm.toFixed(2)}/km at ৳${priceNum}/L`,
        });
      }
    } else if (mode === "Required fuel") {
      // Liters = distance / consumption
      if (consNum > 0) {
        const needed = distNum / consNum;
        const cost = needed * priceNum;
        setResult({
          primary: `${needed.toFixed(2)} Liters`,
          secondary: `Cost: ${cost.toFixed(2)} ৳`,
        });
      }
    }
  };

  const autoFillBikeData = () => {
    setPricePerLiter("165.0");
    setConsumption("43.89");
    handleCalculate();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: "spring", damping: 26, stiffness: 300 }}
          className="w-full max-w-lg bg-[#0e111a] border border-white/10 rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 grid place-items-center text-cyan-400">
                <Calculator className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Fuel & Trip Calculator</h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 grid place-items-center text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Vehicle selector pill */}
          <div className="mt-4 flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center gap-3">
              <span className="text-lg">🏍️</span>
              <div>
                <p className="text-xs font-semibold text-white">Apache 4v</p>
                <p className="text-[10px] text-neutral-400">38,479.8 km · 12L Tank</p>
              </div>
            </div>
            <button
              onClick={autoFillBikeData}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              Use Current Stats
            </button>
          </div>

          {/* Mode Selector Dropdown */}
          <div className="mt-4 relative">
            <label className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
              Calculation Mode
            </label>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((v) => !v)}
              className="mt-1.5 w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-[#161a26] border border-white/10 text-white font-medium text-sm hover:border-cyan-500/40 transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                {mode}
              </span>
              <ChevronDown className="w-4 h-4 text-neutral-400" />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 z-20 bg-[#161a26] border border-white/10 rounded-2xl p-1.5 shadow-2xl backdrop-blur-xl">
                {modes.map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setMode(m);
                      setIsDropdownOpen(false);
                      setResult(null);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                      mode === m
                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                        : "text-neutral-300 hover:bg-white/5"
                    }`}
                  >
                    <span>{m}</span>
                    {mode === m && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input Fields depending on Mode */}
          <div className="mt-5 space-y-3.5">
            {(mode === "Trip cost" || mode === "Consumption" || mode === "Required fuel") && (
              <div>
                <label className="text-xs text-neutral-400">Distance (km)</label>
                <div className="relative mt-1">
                  <input
                    type="number"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    placeholder="100"
                    className="w-full h-11 px-4 rounded-xl bg-[#161a26] border border-white/10 text-white font-medium focus:border-cyan-400 focus:outline-none transition-colors"
                  />
                  <span className="absolute right-3 top-3 text-xs text-neutral-500">km</span>
                </div>
              </div>
            )}

            {(mode === "Trip cost" || mode === "Distance" || mode === "Required fuel") && (
              <div>
                <label className="text-xs text-neutral-400">Fuel Price per Liter (৳)</label>
                <div className="relative mt-1">
                  <input
                    type="number"
                    value={pricePerLiter}
                    onChange={(e) => setPricePerLiter(e.target.value)}
                    placeholder="165.0"
                    className="w-full h-11 px-4 rounded-xl bg-[#161a26] border border-white/10 text-white font-medium focus:border-cyan-400 focus:outline-none transition-colors"
                  />
                  <span className="absolute right-3 top-3 text-xs text-neutral-500">৳/L</span>
                </div>
              </div>
            )}

            {mode === "Distance" && (
              <div>
                <label className="text-xs text-neutral-400">Fuel Budget (৳)</label>
                <div className="relative mt-1">
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="500"
                    className="w-full h-11 px-4 rounded-xl bg-[#161a26] border border-white/10 text-white font-medium focus:border-cyan-400 focus:outline-none transition-colors"
                  />
                  <span className="absolute right-3 top-3 text-xs text-neutral-500">৳</span>
                </div>
              </div>
            )}

            {(mode === "Trip cost" || mode === "Distance" || mode === "Required fuel") && (
              <div>
                <label className="text-xs text-neutral-400">Bike Fuel Consumption (km/L)</label>
                <div className="relative mt-1">
                  <input
                    type="number"
                    value={consumption}
                    onChange={(e) => setConsumption(e.target.value)}
                    placeholder="43.89"
                    className="w-full h-11 px-4 rounded-xl bg-[#161a26] border border-white/10 text-white font-medium focus:border-cyan-400 focus:outline-none transition-colors"
                  />
                  <span className="absolute right-3 top-3 text-xs text-neutral-500">km/L</span>
                </div>
              </div>
            )}

            {mode === "Consumption" && (
              <div>
                <label className="text-xs text-neutral-400">Fuel Consumed (Liters)</label>
                <div className="relative mt-1">
                  <input
                    type="number"
                    value={fuelLiters}
                    onChange={(e) => setFuelLiters(e.target.value)}
                    placeholder="5.5"
                    className="w-full h-11 px-4 rounded-xl bg-[#161a26] border border-white/10 text-white font-medium focus:border-cyan-400 focus:outline-none transition-colors"
                  />
                  <span className="absolute right-3 top-3 text-xs text-neutral-500">Liters</span>
                </div>
              </div>
            )}
          </div>

          {/* Calculate Button */}
          <button
            onClick={handleCalculate}
            className="mt-6 w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(0,213,255,0.3)] transition-all active:scale-[0.99]"
          >
            CALCULATE
          </button>

          {/* Result Card */}
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-5 p-4 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 flex items-center justify-between"
            >
              <div>
                <span className="text-[11px] font-semibold tracking-wider text-cyan-400 uppercase">
                  Estimated Result
                </span>
                <p className="text-2xl font-black text-white mt-0.5 tracking-tight">
                  {result.primary}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/10 text-neutral-200">
                  {result.secondary}
                </span>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
