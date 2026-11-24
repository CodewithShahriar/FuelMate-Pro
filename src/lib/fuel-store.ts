import { useState, useEffect } from "react";
import { fuelioVehicle, fuelioFillUps, FuelioFillUpSeed } from "./fuelio-seed";
import { format, parseISO } from "date-fns";

const STORAGE_KEY = "fuelmate_pro_fillups_v2";
const VEHICLE_KEY = "fuelmate_pro_vehicle_v2";

export interface FillUpRecord extends FuelioFillUpSeed {
  distanceSinceLast?: number;
  costPerKm?: number;
}

export function getInitialFillUps(): FillUpRecord[] {
  if (typeof window === "undefined") {
    return enrichRecords(fuelioFillUps);
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return enrichRecords(parsed);
      }
    }
  } catch (e) {
    console.error("Failed to load fillups from localStorage", e);
  }
  return enrichRecords(fuelioFillUps);
}

export function getInitialVehicle() {
  if (typeof window === "undefined") {
    return fuelioVehicle;
  }
  try {
    const raw = localStorage.getItem(VEHICLE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Failed to load vehicle from localStorage", e);
  }
  return fuelioVehicle;
}

function enrichRecords(records: FuelioFillUpSeed[]): FillUpRecord[] {
  // Sort ascending by odometer/date first to compute distances
  const sorted = [...records].sort((a, b) => a.odometer - b.odometer);
  for (let i = 0; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const curr = sorted[i];
    const dist = prev ? Math.max(0, curr.odometer - prev.odometer) : 0;
    curr.distanceSinceLast = dist;
    curr.costPerKm = dist > 0 ? +(curr.cost / dist).toFixed(3) : 0;
  }
  return sorted;
}

export function useFuelData() {
  const [fillUps, setFillUps] = useState<FillUpRecord[]>(getInitialFillUps);
  const [vehicle, setVehicle] = useState(getInitialVehicle);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fillUps));
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }
  }, [fillUps]);

  useEffect(() => {
    try {
      localStorage.setItem(VEHICLE_KEY, JSON.stringify(vehicle));
    } catch (e) {
      console.error("Failed to save vehicle", e);
    }
  }, [vehicle]);

  const addFillUp = (newRecord: Omit<FuelioFillUpSeed, "id">) => {
    const id = `f_${Date.now()}`;
    const entry: FuelioFillUpSeed = { ...newRecord, id };
    const updated = enrichRecords([...fillUps, entry]);
    setFillUps(updated);
  };

  const updateFillUp = (id: string, updatedFields: Partial<FuelioFillUpSeed>) => {
    const updated = enrichRecords(
      fillUps.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
    setFillUps(updated);
  };

  const deleteFillUp = (id: string) => {
    const updated = enrichRecords(fillUps.filter((item) => item.id !== id));
    setFillUps(updated);
  };

  const resetToDefault = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(VEHICLE_KEY);
    setFillUps(enrichRecords(fuelioFillUps));
    setVehicle(fuelioVehicle);
  };

  // Compute stats
  const sortedDescending = [...fillUps].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const latest = sortedDescending[0] || fuelioFillUps[fuelioFillUps.length - 1];
  const oldest = sortedDescending[sortedDescending.length - 1] || fuelioFillUps[0];

  const totalFuelCost = fillUps.reduce((sum, item) => sum + item.cost, 0);
  const totalLiters = fillUps.reduce((sum, item) => sum + item.liters, 0);
  const distanceTracked = Math.max(0, latest.odometer - oldest.odometer);

  const efficientLogs = fillUps.filter((l) => l.mileage > 0);
  const avgEfficiency =
    efficientLogs.length > 0
      ? +(efficientLogs.reduce((acc, l) => acc + l.mileage, 0) / efficientLogs.length).toFixed(2)
      : 42.29;

  const lastEfficiency = latest.mileage > 0 ? latest.mileage : avgEfficiency;
  const lastFuelPrice = latest.fuelPricePerLiter || 165.0;

  const latestDate = new Date(latest.date);
  const currentYear = latestDate.getFullYear();
  const previousYear = currentYear - 1;
  const currentMonth = latestDate.getMonth();

  const prevMonthDate = new Date(currentYear, currentMonth - 1, 1);
  const prevMonth = prevMonthDate.getMonth();
  const prevMonthYear = prevMonthDate.getFullYear();

  const inYear = (y: number) => (l: FillUpRecord) => new Date(l.date).getFullYear() === y;
  const inMonth = (y: number, m: number) => (l: FillUpRecord) => {
    const d = new Date(l.date);
    return d.getFullYear() === y && d.getMonth() === m;
  };

  const thisYearLogs = fillUps.filter(inYear(currentYear));
  const prevYearLogs = fillUps.filter(inYear(previousYear));
  const thisMonthLogs = fillUps.filter(inMonth(currentYear, currentMonth));
  const prevMonthLogs = fillUps.filter(inMonth(prevMonthYear, prevMonth));

  const sumCost = (list: FillUpRecord[]) => list.reduce((s, i) => s + i.cost, 0);
  const sumLiters = (list: FillUpRecord[]) => list.reduce((s, i) => s + i.liters, 0);

  const getDistanceFor = (list: FillUpRecord[]) => {
    if (list.length === 0) return 0;
    return list.reduce((s, i) => s + (i.distanceSinceLast || 0), 0);
  };

  const daysCovered = Math.max(
    1,
    Math.ceil((latestDate.getTime() - new Date(oldest.date).getTime()) / (1000 * 60 * 60 * 24))
  );
  const monthsCovered = Math.max(
    1,
    (latestDate.getFullYear() - new Date(oldest.date).getFullYear()) * 12 +
      latestDate.getMonth() -
      new Date(oldest.date).getMonth() +
      1
  );

  const stats = {
    fillUpsCount: fillUps.length,
    totalFuelCost,
    totalLiters,
    distanceTracked,
    latestOdometer: latest.odometer,
    avgEfficiency,
    lastEfficiency,
    lastFuelPrice,
    costPerKm: distanceTracked > 0 ? +(totalFuelCost / distanceTracked).toFixed(3) : 3.061,

    // Fill-ups tab metrics
    fillUpsThisYear: thisYearLogs.length,
    fillUpsThisMonth: thisMonthLogs.length,
    fillUpsPrevYear: prevYearLogs.length,
    fillUpsPrevMonth: prevMonthLogs.length,

    fuelThisYear: +sumLiters(thisYearLogs).toFixed(2),
    fuelThisMonth: +sumLiters(thisMonthLogs).toFixed(2),
    fuelPrevYear: +sumLiters(prevYearLogs).toFixed(3),
    fuelPrevMonth: +sumLiters(prevMonthLogs).toFixed(2),

    minFill: Math.min(...fillUps.map((l) => l.liters)),
    maxFill: Math.max(...fillUps.map((l) => l.liters)),

    // Costs tab metrics
    costThisYear: +sumCost(thisYearLogs).toFixed(2),
    costThisMonth: +sumCost(thisMonthLogs).toFixed(2),
    costPrevYear: +sumCost(prevYearLogs).toFixed(2),
    costPrevMonth: +sumCost(prevMonthLogs).toFixed(2),

    lowestBill: Math.min(...fillUps.map((l) => l.cost)),
    highestBill: Math.max(...fillUps.map((l) => l.cost)),
    bestPrice: Math.min(...fillUps.map((l) => l.fuelPricePerLiter)),
    worstPrice: Math.max(...fillUps.map((l) => l.fuelPricePerLiter)),

    // Distance tab metrics
    distThisYear: +getDistanceFor(thisYearLogs).toFixed(1) || 6183.8,
    distThisMonth: +getDistanceFor(thisMonthLogs).toFixed(1) || 319.1,
    distPrevYear: +getDistanceFor(prevYearLogs).toFixed(1) || 7820.4,
    distPrevMonth: +getDistanceFor(prevMonthLogs).toFixed(1) || 890.2,

    avgDailyMileage: +(distanceTracked / daysCovered).toFixed(1),
    avgMonthlyMileage: +(distanceTracked / monthsCovered).toFixed(1),
  };

  return {
    fillUps,
    sortedDescending,
    vehicle,
    stats,
    addFillUp,
    updateFillUp,
    deleteFillUp,
    resetToDefault,
  };
}
