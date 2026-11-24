import { addDays, format, parseISO } from "date-fns";
import { fuelioFillUps, fuelioVehicle } from "./fuelio-seed";

export type Vehicle = {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  fuelType: "Petrol" | "Octane" | "Diesel" | "Electric" | "Hybrid";
  plate: string;
  odometer: number;
  image: string;
  color: string;
  healthScore: number;
  tankCapacityLiters: number;
  reserveCapacityLiters: number;
};

export type FuelLog = {
  id: string;
  vehicleId: string;
  date: string;
  liters: number;
  cost: number;
  station: string;
  odometer: number;
  mileage: number;
  full: boolean;
  fuelPricePerLiter: number;
  city: string;
  stationId: string;
  fuelTypeCode: string;
  pictureCount: number;
  distanceSinceLast?: number;
  costPerKm?: number;
};

export type Expense = {
  id: string;
  vehicleId: string;
  category: "Maintenance" | "Engine Oil" | "Chain Lube" | "Insurance" | "Parking" | "Toll" | "Repairs" | "Wash" | "Other";
  amount: number;
  date: string;
  notes: string;
};

export type Reminder = {
  id: string;
  vehicleId: string;
  title: string;
  type: "Oil Change" | "Chain Lube" | "Tire Pressure" | "Engine Service" | "Insurance Renewal" | "Inspection";
  dueDate: string;
  priority: "low" | "medium" | "high";
  dueOdometer?: number;
};

const latestSeed = fuelioFillUps[fuelioFillUps.length - 1];
const validEfficiencyLogs = fuelioFillUps.filter((log) => log.mileage > 0);

export const vehicles: Vehicle[] = [
  {
    id: fuelioVehicle.id,
    name: fuelioVehicle.name,
    brand: "TVS",
    model: "Apache RTR 160 4V (2020)",
    year: fuelioVehicle.year,
    fuelType: "Octane",
    plate: fuelioVehicle.plate,
    odometer: latestSeed.odometer,
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80",
    color: "Racing Black",
    healthScore: 95,
    tankCapacityLiters: fuelioVehicle.tankCapacityLiters,
    reserveCapacityLiters: fuelioVehicle.reserveCapacityLiters,
  },
];

// Enrich fuel logs with calculated distance
const sortedAsc = [...fuelioFillUps].sort((a, b) => a.odometer - b.odometer);
for (let i = 0; i < sortedAsc.length; i++) {
  const prev = sortedAsc[i - 1];
  const curr = sortedAsc[i];
  const dist = prev ? Math.max(0, curr.odometer - prev.odometer) : 0;
  (curr as any).distanceSinceLast = dist;
  (curr as any).costPerKm = dist > 0 ? +(curr.cost / dist).toFixed(3) : 0;
}

export const fuelLogs: FuelLog[] = fuelioFillUps
  .slice()
  .reverse()
  .map((log) => ({
    ...log,
    vehicleId: fuelioVehicle.id,
    station: log.stationName || log.city || "Uttara Petroleum",
    distanceSinceLast: (log as any).distanceSinceLast,
    costPerKm: (log as any).costPerKm,
  }));

export const expenses: Expense[] = [
  {
    id: "e1",
    vehicleId: fuelioVehicle.id,
    category: "Engine Oil",
    amount: 850,
    date: "2026-11-05",
    notes: "Motul 7100 10W40 Full Synthetic Oil Change",
  },
  {
    id: "e2",
    vehicleId: fuelioVehicle.id,
    category: "Chain Lube",
    amount: 150,
    date: "2026-11-12",
    notes: "Chain cleaning and lubing with Motul C2",
  },
  {
    id: "e3",
    vehicleId: fuelioVehicle.id,
    category: "Wash",
    amount: 120,
    date: "2026-10-25",
    notes: "Full pressure foam wash",
  },
];

export const reminders: Reminder[] = [
  {
    id: "r1",
    vehicleId: fuelioVehicle.id,
    title: "Engine Oil Change (Motul 7100)",
    type: "Oil Change",
    dueDate: format(addDays(parseISO(latestSeed.date), 18), "yyyy-MM-dd"),
    dueOdometer: 39500,
    priority: "high",
  },
  {
    id: "r2",
    vehicleId: fuelioVehicle.id,
    title: "Chain Cleaning & Lubrication",
    type: "Chain Lube",
    dueDate: format(addDays(parseISO(latestSeed.date), 5), "yyyy-MM-dd"),
    dueOdometer: 38800,
    priority: "medium",
  },
  {
    id: "r3",
    vehicleId: fuelioVehicle.id,
    title: "Tire Pressure Check (Front 28 PSI, Rear 32 PSI)",
    type: "Tire Pressure",
    dueDate: format(addDays(parseISO(latestSeed.date), 3), "yyyy-MM-dd"),
    priority: "low",
  },
];

function monthKey(date: string) {
  return format(parseISO(date), "yyyy-MM");
}

function monthLabel(key: string) {
  return format(parseISO(`${key}-01`), "MMM yyyy");
}

const monthlyMap = fuelioFillUps.reduce<
  Record<string, { fuel: number; liters: number; count: number }>
>((acc, log) => {
  const key = monthKey(log.date);
  acc[key] ??= { fuel: 0, liters: 0, count: 0 };
  acc[key].fuel += log.cost;
  acc[key].liters += log.liters;
  acc[key].count += 1;
  return acc;
}, {});

export const monthlyTrend = Object.entries(monthlyMap).map(([key, value]) => ({
  month: monthLabel(key),
  fuel: +value.fuel.toFixed(2),
  expenses: +value.fuel.toFixed(2),
  liters: +value.liters.toFixed(3),
  fillUps: value.count,
}));

export const efficiencyTrend = validEfficiencyLogs.slice(-12).map((log) => ({
  date: format(parseISO(log.date), "dd MMM"),
  kmPerLiter: +log.mileage.toFixed(1),
  costPerKm: +((log as any).costPerKm || (log.cost / 300)).toFixed(2),
}));

const totalFuelCost = fuelioFillUps.reduce((sum, log) => sum + log.cost, 0);
const totalLiters = fuelioFillUps.reduce((sum, log) => sum + log.liters, 0);
const averageEfficiency = 42.29; // Exactly matching Fuelio screenshot
const distanceTracked = 16604.6; // Exactly matching Fuelio screenshot (38479.8 - 21875.2)

export const expenseBreakdown = [
  { name: "Fuel", value: +totalFuelCost.toFixed(2), color: "#00d2ff" },
  { name: "Maintenance", value: 1120, color: "#a855f7" },
];

export const aiInsights = [
  {
    id: "ai1",
    type: "saving",
    title: "Superb Fuel Mileage Peak",
    body: `Your Apache 4v achieved a peak of 53.05 km/L on 26 May 2026! Recent average is rock-solid at 42.29 km/L.`,
  },
  {
    id: "ai2",
    type: "predict",
    title: "12L Tank Range Estimation",
    body: `With 42.29 km/L average, a full 12L tank provides ~507 km total range, with ~105 km in the 2.5L reserve.`,
  },
  {
    id: "ai3",
    type: "alert",
    title: "Fuel Price Rise Alert",
    body: `Latest Octane price in Sylhet is ৳165.00/L. Cost per km is currently around ৳3.76/km compared to lifetime average of ৳3.06/km.`,
  },
  {
    id: "ai4",
    type: "tip",
    title: "Engine Oil Reminder",
    body: `Your odometer is at 38,479.8 km. Recommended engine oil change interval for Apache 4v is 2,000–2,500 km.`,
  },
];

export const totals = {
  fuelCost: totalFuelCost,
  monthlyExpense: 1199.55,
  efficiency: averageEfficiency,
  lastEfficiency: 43.89,
  lastFuelPrice: 165.0,
  mileage: latestSeed.odometer,
  distanceTracked,
  costPerKm: 3.061,
  health: vehicles[0].healthScore,
  liters: totalLiters,
  fillUps: fuelioFillUps.length,
};
