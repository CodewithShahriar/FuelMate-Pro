import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Camera,
  Calendar,
  Clock,
  MapPin,
  ChevronDown,
  Sparkles,
  Check,
  Plus,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { FuelioFillUpSeed } from "@/lib/fuelio-seed";

interface AddFillUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: Omit<FuelioFillUpSeed, "id">) => void;
  lastOdo?: number;
}

export function AddFillUpModal({
  isOpen,
  onClose,
  onSave,
  lastOdo = 38479.8,
}: AddFillUpModalProps) {
  // Start with clean empty fields as requested!
  const [odometer, setOdometer] = useState<string>("");
  const [liters, setLiters] = useState<string>("");
  const [fuelPrice, setFuelPrice] = useState<string>("165.0"); // Default current market price
  const [totalCost, setTotalCost] = useState<string>("");
  const [fuelType, setFuelType] = useState<string>("Octane");
  const [fullTank, setFullTank] = useState<boolean>(true);
  const [stationName, setStationName] = useState<string>("");
  const [dateStr, setDateStr] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [notes, setNotes] = useState<string>("");
  const [hasPhoto, setHasPhoto] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Reactive calculations:
  const handleLitersChange = (val: string) => {
    setLiters(val);
    const l = parseFloat(val);
    const p = parseFloat(fuelPrice);
    if (!isNaN(l) && !isNaN(p) && p > 0) {
      setTotalCost((l * p).toFixed(2));
    }
  };

  const handlePriceChange = (val: string) => {
    setFuelPrice(val);
    const p = parseFloat(val);
    const l = parseFloat(liters);
    const c = parseFloat(totalCost);
    if (!isNaN(p) && !isNaN(l) && l > 0) {
      setTotalCost((l * p).toFixed(2));
    } else if (!isNaN(p) && !isNaN(c) && p > 0) {
      setLiters((c / p).toFixed(2));
    }
  };

  const handleCostChange = (val: string) => {
    setTotalCost(val);
    const c = parseFloat(val);
    const p = parseFloat(fuelPrice);
    if (!isNaN(c) && !isNaN(p) && p > 0) {
      setLiters((c / p).toFixed(2));
    }
  };

  const handleQuickStation = (name: string) => {
    setStationName(name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const odoNum = parseFloat(odometer);
    const litersNum = parseFloat(liters);
    const costNum = parseFloat(totalCost);
    const priceNum = parseFloat(fuelPrice) || 165.0;

    if (isNaN(odoNum) || odoNum <= 0) {
      setErrorMsg("দয়া করে বর্তমান ওডোমিটার রিডিং লিখুন");
      return;
    }
    if (isNaN(litersNum) || litersNum <= 0) {
      setErrorMsg("কত লিটার তেল নিয়েছেন তা লিখুন");
      return;
    }
    if (isNaN(costNum) || costNum <= 0) {
      setErrorMsg("মোট বিল বা তেলের দাম লিখুন");
      return;
    }

    const distanceSinceLast = Math.max(0, odoNum - lastOdo);
    const calculatedMileage =
      distanceSinceLast > 0 && litersNum > 0 ? +(distanceSinceLast / litersNum).toFixed(2) : 43.5;

    onSave({
      date: dateStr,
      odometer: odoNum,
      liters: litersNum,
      full: fullTank,
      cost: costNum,
      mileage: calculatedMileage,
      fuelPricePerLiter: priceNum,
      city: "সিলেট",
      stationId: "599700",
      stationName: stationName || "Uttara Petroleum",
      fuelTypeCode: "101",
      fuelTypeName: fuelType,
      pictureCount: hasPhoto ? 1 : 0,
      notes,
    });

    // Reset clean
    setOdometer("");
    setLiters("");
    setTotalCost("");
    setStationName("");
    setNotes("");
    setErrorMsg("");
    onClose();
  };

  if (!isOpen) return null;

  const currentOdoNum = parseFloat(odometer);
  const diffKm = !isNaN(currentOdoNum) ? (currentOdoNum - lastOdo).toFixed(1) : null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: 120 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 120 }}
          transition={{ type: "spring", damping: 28, stiffness: 280 }}
          className="w-full max-w-lg bg-[#0d1017] border border-white/10 rounded-t-[36px] sm:rounded-[36px] p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto text-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold px-4 py-2 rounded-full bg-white/5 text-neutral-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <h3 className="text-base font-bold text-white tracking-tight">New Fill-up Log</h3>
            <button
              type="button"
              onClick={handleSubmit}
              className="text-xs font-bold px-4 py-2 rounded-full bg-cyan-400 text-black hover:bg-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all"
            >
              Save
            </button>
          </div>

          {errorMsg && (
            <div className="mt-3 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* Vehicle Card */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="flex items-center gap-3">
                <span className="text-xl">🏍️</span>
                <div>
                  <p className="text-sm font-semibold text-white">Apache 4v</p>
                  <p className="text-[11px] text-neutral-400">12L Tank · Plate 11-5088</p>
                </div>
              </div>
              <span className="text-[11px] font-mono font-medium text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                Last Odo: {lastOdo.toLocaleString()} km
              </span>
            </div>

            {/* Odometer Section */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs text-neutral-300 font-medium">Odometer Counter (km)</label>
                {diffKm && parseFloat(diffKm) > 0 && (
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    +{diffKm} km driven
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={odometer}
                  onChange={(e) => {
                    setOdometer(e.target.value);
                    setErrorMsg("");
                  }}
                  placeholder={`Current km (e.g. ${(lastOdo + 320).toFixed(1)})`}
                  className="w-full h-12 px-4 pr-12 rounded-xl bg-[#141824] border border-white/10 text-white font-bold text-base placeholder:text-neutral-500 focus:border-cyan-400 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  required
                />
                <span className="absolute right-3.5 top-3.5 text-xs text-neutral-400 font-medium select-none pointer-events-none">
                  km
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Last recorded odometer was{" "}
                <span className="text-neutral-200 font-mono font-semibold">
                  {lastOdo.toLocaleString()} km
                </span>
              </p>
            </div>

            {/* Fuel & Cost 2x2 Grid with Auto-Calculation */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-neutral-300 font-medium">Fuel (Liters)</label>
                  <div className="relative mt-1">
                    <input
                      type="number"
                      step="0.01"
                      value={liters}
                      onChange={(e) => {
                        handleLitersChange(e.target.value);
                        setErrorMsg("");
                      }}
                      placeholder="e.g. 7.50"
                      className="w-full h-11 px-3.5 pr-8 rounded-xl bg-[#141824] border border-white/10 text-white font-bold text-base placeholder:text-neutral-500 focus:border-cyan-400 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      required
                    />
                    <span className="absolute right-3 top-3 text-xs text-neutral-500 select-none pointer-events-none">L</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-neutral-300 font-medium">Fuel type</label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value)}
                    className="mt-1 w-full h-11 px-3.5 rounded-xl bg-[#141824] border border-white/10 text-white font-medium text-sm focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="Octane">Octane (95+)</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-neutral-300 font-medium">Fuel price (৳/L)</label>
                  <div className="relative mt-1">
                    <input
                      type="number"
                      step="0.1"
                      value={fuelPrice}
                      onChange={(e) => {
                        handlePriceChange(e.target.value);
                        setErrorMsg("");
                      }}
                      placeholder="165.0"
                      className="w-full h-11 px-3.5 pr-8 rounded-xl bg-[#141824] border border-white/10 text-white font-medium focus:border-cyan-400 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      required
                    />
                    <span className="absolute right-3 top-3 text-xs text-neutral-500 select-none pointer-events-none">৳</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-neutral-300 font-medium">Total cost (৳)</label>
                  <div className="relative mt-1">
                    <input
                      type="number"
                      step="0.01"
                      value={totalCost}
                      onChange={(e) => {
                        handleCostChange(e.target.value);
                        setErrorMsg("");
                      }}
                      placeholder="e.g. 1200"
                      className="w-full h-11 px-3.5 pr-8 rounded-xl bg-[#141824] border border-cyan-500/30 text-cyan-300 font-bold text-base placeholder:text-neutral-500 focus:border-cyan-400 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      required
                    />
                    <span className="absolute right-3 top-3 text-xs text-neutral-500 select-none pointer-events-none">৳</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Date & Full Tank Toggle */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-neutral-300 font-medium">Date & Time</p>
                  <p className="text-xs font-semibold text-neutral-200 mt-0.5">
                    {format(new Date(), "dd MMMM, yyyy")}
                  </p>
                </div>
                <input
                  type="date"
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                  className="px-2.5 py-1 rounded-lg bg-[#141824] border border-white/10 text-xs text-neutral-200"
                />
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-white">Full Tank (ট্যাংক ফুল)</p>
                  <p className="text-[11px] text-neutral-400">Needed for precise km/L calculation</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFullTank((v) => !v)}
                  className={`w-12 h-6.5 rounded-full p-1 transition-colors ${
                    fullTank ? "bg-emerald-500" : "bg-neutral-700"
                  }`}
                >
                  <div
                    className={`w-4.5 h-4.5 rounded-full bg-white transition-transform ${
                      fullTank ? "translate-x-5.5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Petrol Station Picker */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-300 font-medium">Petrol Station</span>
                <span className="text-[10px] text-cyan-400 font-medium">Quick Pick</span>
              </div>
              <input
                type="text"
                value={stationName}
                onChange={(e) => setStationName(e.target.value)}
                placeholder="Station name (e.g. Uttara Petroleum, সিলেট)"
                className="w-full h-10 px-3.5 rounded-xl bg-[#141824] border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:border-cyan-400 focus:outline-none"
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  "সিলেট - Uttara Petroleum",
                  "Jalalabad Petrol Pump",
                  "Bhuiyan Petrol Pump",
                  "Biman Petrol Pump",
                ].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleQuickStation(s)}
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/5 active:bg-cyan-500/20"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Meter Photo / Receipt Attachment */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-semibold text-white">Meter Slip Photo</span>
                </div>
                <button
                  type="button"
                  onClick={() => setHasPhoto((v) => !v)}
                  className="text-[11px] font-medium text-cyan-400 hover:underline"
                >
                  {hasPhoto ? "Remove" : "+ Attach Picture"}
                </button>
              </div>
              {hasPhoto ? (
                <div className="mt-3 flex items-center gap-3 p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                  <div className="w-12 h-12 rounded-lg bg-black/50 border border-cyan-400/40 grid place-items-center text-cyan-300 text-xs font-mono">
                    📷 Attached
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-cyan-300">meter_reading_slip.jpg</p>
                    <p className="text-[10px] text-neutral-400">Ready to save</p>
                  </div>
                </div>
              ) : (
                <p className="mt-1 text-[11px] text-neutral-500">
                  Snap the petrol pump meter or bike odometer to keep visual proof.
                </p>
              )}
            </div>

            {/* Optional notes */}
            <div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional notes (e.g. Highway ride, tire air filled, rain)"
                rows={2}
                className="w-full p-3 rounded-xl bg-[#141824] border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold text-sm tracking-wide shadow-[0_0_30px_rgba(0,229,255,0.35)] transition-all active:scale-[0.99]"
            >
              SAVE FILL-UP {totalCost ? `(৳${totalCost})` : ""}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
