import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Settings,
  Download,
  RotateCcw,
  Smartphone,
  Shield,
  Bell,
  Trash2,
  CheckCircle2,
  Info,
} from "lucide-react";
import { useFuelData } from "@/lib/fuel-store";

export const Route = createFileRoute("/app/settings")({
  head: () => ({ meta: [{ title: "More & Settings — FuelMate Pro" }] }),
  component: SettingsPage,
});

export function SettingsPage() {
  const { stats, vehicle, fillUps, resetToDefault } = useFuelData();
  const [resetDone, setResetDone] = useState(false);

  const handleExportCSV = () => {
    const headers = "Date,Odo (km),Fuel (l),Full,Price,km/l,Station,FuelType\n";
    const rows = fillUps
      .map(
        (f) =>
          `"${f.date}","${f.odometer}","${f.liters}","${f.full ? 1 : 0}","${f.cost}","${f.mileage}","${f.stationName}","${f.fuelTypeName}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `FuelMate_Apache4v_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    if (confirm("Reset data back to original 46 Fuelio logs?")) {
      resetToDefault();
      setResetDone(true);
      setTimeout(() => setResetDone(false), 3000);
    }
  };

  return (
    <div className="space-y-4 pb-12 text-white">
      <header className="pt-1">
        <h1 className="text-xl font-black tracking-tight">More & Settings</h1>
        <p className="text-xs text-neutral-400">Manage data, vehicle & preferences</p>
      </header>

      {/* Vehicle Profile Card */}
      <div className="p-4 rounded-[26px] bg-[#141824] border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-2xl">
              🏍️
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{vehicle.name}</h3>
              <p className="text-xs text-neutral-400">TVS Apache RTR 160 4V (2020)</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            {vehicle.plate}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-center">
          <div className="p-2 rounded-xl bg-white/[0.03]">
            <span className="text-[10px] text-neutral-500 uppercase">Odo</span>
            <p className="font-mono text-xs font-bold text-white mt-0.5">
              {(stats.latestOdometer / 1000).toFixed(1)}k km
            </p>
          </div>
          <div className="p-2 rounded-xl bg-white/[0.03]">
            <span className="text-[10px] text-neutral-500 uppercase">Tank</span>
            <p className="font-mono text-xs font-bold text-cyan-300 mt-0.5">12.0 L</p>
          </div>
          <div className="p-2 rounded-xl bg-white/[0.03]">
            <span className="text-[10px] text-neutral-500 uppercase">Reserve</span>
            <p className="font-mono text-xs font-bold text-amber-300 mt-0.5">2.5 L</p>
          </div>
        </div>
      </div>

      {/* App Preferences */}
      <div className="p-4 rounded-[24px] bg-[#141824] border border-white/5 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
          Units & Localization
        </h3>
        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between py-1">
            <span className="text-neutral-300">Currency</span>
            <span className="font-bold text-cyan-300 font-mono">BDT (৳)</span>
          </div>
          <div className="flex items-center justify-between py-1 border-t border-white/5">
            <span className="text-neutral-300">Distance Unit</span>
            <span className="font-bold text-neutral-200">Kilometers (km)</span>
          </div>
          <div className="flex items-center justify-between py-1 border-t border-white/5">
            <span className="text-neutral-300">Consumption Format</span>
            <span className="font-bold text-emerald-400">km/L (Bangladesh Standard)</span>
          </div>
          <div className="flex items-center justify-between py-1 border-t border-white/5">
            <span className="text-neutral-300">Theme</span>
            <span className="font-bold text-purple-400">Obsidian OLED Dark</span>
          </div>
        </div>
      </div>

      {/* Data Backup & Restore */}
      <div className="p-4 rounded-[24px] bg-[#141824] border border-white/5 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
          Backup & Data
        </h3>
        <p className="text-xs text-neutral-400">
          All your 46 fill-ups are stored in local storage and persist automatically.
        </p>

        <div className="space-y-2 pt-1">
          <button
            onClick={handleExportCSV}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-colors"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export CSV Backup</span>
          </button>

          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-neutral-300 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>Reset to Fuelio Seed (46 logs)</span>
          </button>

          {resetDone && (
            <p className="text-xs text-emerald-400 text-center font-medium flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Data reset successfully!
            </p>
          )}
        </div>
      </div>

      {/* PWA / Mobile Experience Info */}
      <div className="p-4 rounded-[24px] bg-gradient-to-br from-cyan-950/40 to-black border border-cyan-500/20 space-y-2">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-cyan-300">Install as Phone App (PWA)</h3>
        </div>
        <p className="text-[11px] text-neutral-400 leading-relaxed">
          Open this web address on your phone's Chrome or Safari browser, tap <strong>Share / Menu</strong>, then select <strong>"Add to Home Screen"</strong> to run it full-screen just like Fuelio!
        </p>
      </div>
    </div>
  );
}
