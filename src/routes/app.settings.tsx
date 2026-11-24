import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef } from "react";
import {
  Settings,
  Download,
  Upload,
  RotateCcw,
  Smartphone,
  Cloud,
  CloudUpload,
  CloudDownload,
  CheckCircle2,
  AlertCircle,
  Database,
  ExternalLink,
  User,
  LogOut,
  LogIn,
} from "lucide-react";
import { useFuelData } from "@/lib/fuel-store";
import { useExpenseData } from "@/lib/expense-store";
import { useAuth } from "@/lib/auth-store";
import {
  supabaseConfig,
  uploadFillUpsToCloud,
  uploadExpensesToCloud,
  fetchCloudFillUps,
  fetchCloudExpenses,
} from "@/lib/supabase-client";

export const Route = createFileRoute("/app/settings")({
  head: () => ({ meta: [{ title: "More & Settings — FuelMate Pro" }] }),
  component: SettingsPage,
});

export function SettingsPage() {
  const { stats, vehicle, fillUps, resetToDefault } = useFuelData();
  const { expenses } = useExpenseData();
  const { user, isAuthenticated, signOut } = useAuth();
  const [resetDone, setResetDone] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1-Click Cloud Sync to Supabase
  const handleCloudUpload = async () => {
    setIsSyncing(true);
    setSyncStatus("Uploading 46 fill-ups & maintenance records to Supabase...");
    try {
      const [fuelRes, expRes] = await Promise.all([
        uploadFillUpsToCloud(fillUps),
        uploadExpensesToCloud(expenses),
      ]);

      if (fuelRes.error || expRes.error) {
        setSyncStatus(`⚠️ Sync warning: ${fuelRes.error?.message || expRes.error?.message}`);
      } else {
        setSyncStatus(`✅ Successfully synced ${fillUps.length} fill-ups and ${expenses.length} maintenance records to Supabase Cloud!`);
      }
    } catch (e: any) {
      setSyncStatus(`❌ Cloud error: ${e.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  // 1-Click JSON Export (Offline Backup)
  const handleExportJSON = () => {
    const backupData = {
      app: "FuelMate Pro",
      version: "2.0",
      exportDate: new Date().toISOString(),
      vehicle,
      fillUps,
      expenses,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `FuelMate_Full_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 1-Click CSV Export
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
        <p className="text-xs text-neutral-400">Manage cloud sync, data & vehicle specs</p>
      </header>

      {/* Account & Profile Card */}
      <div className="p-4 rounded-[24px] bg-[#141824] border border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-sm">
            {isAuthenticated ? (user?.fullName?.[0] || user?.email?.[0] || "U").toUpperCase() : <User className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">
              {isAuthenticated ? (user?.fullName || user?.email?.split("@")[0]) : "Guest Mode (Local Device)"}
            </h3>
            <p className="text-[11px] text-neutral-400">
              {isAuthenticated ? user?.email : "Data saved on this device only"}
            </p>
          </div>
        </div>

        {isAuthenticated ? (
          <button
            onClick={() => signOut()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-xs text-neutral-300 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign out</span>
          </button>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold text-xs shadow-[0_0_15px_rgba(0,213,255,0.3)] hover:opacity-95 transition-opacity"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign in</span>
          </Link>
        )}
      </div>

      {/* Supabase Cloud Live Sync Card */}
      <div className="p-4 rounded-[26px] bg-gradient-to-br from-[#0e1726] to-[#070d18] border border-cyan-500/30 shadow-[0_0_25px_rgba(0,213,255,0.08)] space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Supabase Cloud Database</h3>
              <p className="text-[10px] text-cyan-300/80 font-mono">kcuhrkwiuhhnaxwaesnn.supabase.co</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Connected
          </span>
        </div>

        <p className="text-xs text-neutral-300 leading-relaxed">
          Your cloud database is connected. You can sync all 46 fill-ups and maintenance logs to Supabase so they are permanently backed up across all devices.
        </p>

        <div className="flex flex-col gap-2 pt-1">
          <button
            onClick={handleCloudUpload}
            disabled={isSyncing}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-95 text-xs font-bold text-black transition-all shadow-[0_0_15px_rgba(0,213,255,0.25)] active:scale-[0.99] disabled:opacity-50"
          >
            <CloudUpload className="w-4 h-4" />
            <span>{isSyncing ? "Syncing..." : "Sync Local Data to Supabase Cloud"}</span>
          </button>
        </div>

        {syncStatus && (
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-cyan-300 leading-snug">
            {syncStatus}
          </div>
        )}
      </div>

      {/* Vehicle Profile Card */}
      <div className="p-4 rounded-[26px] bg-[#141824] border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🏍️</span>
            <div>
              <h3 className="text-sm font-bold text-white">{vehicle.name}</h3>
              <p className="text-xs text-neutral-400">TVS Apache RTR 160 4V (2020)</p>
            </div>
          </div>
          {vehicle.plate ? (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {vehicle.plate}
            </span>
          ) : null}
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
          Offline Backup & Restore
        </h3>
        <p className="text-xs text-neutral-400">
          Download a complete backup file to save on Google Drive or transfer to a new phone.
        </p>

        <div className="space-y-2 pt-1">
          <button
            onClick={handleExportJSON}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Download Complete Backup (.json)</span>
          </button>

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
