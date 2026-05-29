import { addDays, format, parseISO } from "date-fns";
import { fuelioFillUps, fuelioVehicle } from "./fuelio-seed";

export type Vehicle = {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  fuelType: "Petrol" | "Diesel" | "Electric" | "Hybrid";
  plate: string;
  odometer: number;
  image: string;
  color: string;
  healthScore: number;
  tankCapacityLiters?: number;
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
};

export type Expense = {
  id: string;
  vehicleId: string;
  category: "Maintenance" | "Insurance" | "Parking" | "Toll" | "Repairs" | "Car Wash" | "Other";
  amount: number;
  date: string;
  notes: string;
};

export type Reminder = {
  id: string;
  vehicleId: string;
  title: string;
  type: "Oil Change" | "Tire Replacement" | "Engine Service" | "Insurance Renewal" | "Inspection";
  dueDate: string;
  priority: "low" | "medium" | "high";
};

const latestSeed = fuelioFillUps[fuelioFillUps.length - 1];
const validEfficiencyLogs = fuelioFillUps.filter((log) => log.mileage > 0);

function stationName(city: string, stationId: string) {
  if (city) return city;
  if (stationId !== "0") return `Station ${stationId}`;
  return "Fuelio Station";
}

function monthKey(date: string) {
  return format(parseISO(date), "yyyy-MM");
}

function monthLabel(key: string) {
  return format(parseISO(`${key}-01`), "MMM yyyy");
}

export const vehicles: Vehicle[] = [
  {
    id: fuelioVehicle.id,
    name: fuelioVehicle.name,
    brand: fuelioVehicle.name.split(" ")[0] || "Apache",
    model: fuelioVehicle.name.split(" ").slice(1).join(" ") || fuelioVehicle.model,
    year: fuelioVehicle.year,
    fuelType: "Petrol",
    plate: fuelioVehicle.plate,
    odometer: latestSeed.odometer,
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80",
    color: "Black",
    healthScore: 92,
    tankCapacityLiters: fuelioVehicle.tankCapacityLiters,
  },
];

export const fuelLogs: FuelLog[] = fuelioFillUps
  .slice()
  .reverse()
  .map((log) => ({
    ...log,
    vehicleId: fuelioVehicle.id,
    station: stationName(log.city, log.stationId),
  }));

export const expenses: Expense[] = [];

export const reminders: Reminder[] = [
  {
    id: "r1",
    vehicleId: fuelioVehicle.id,
    title: "Oil change due",
    type: "Oil Change",
    dueDate: format(addDays(parseISO(latestSeed.date), 14), "yyyy-MM-dd"),
    priority: "medium",
  },
  {
    id: "r2",
    vehicleId: fuelioVehicle.id,
    title: "Insurance renewal",
    type: "Insurance Renewal",
    dueDate: format(addDays(parseISO(latestSeed.date), 45), "yyyy-MM-dd"),
    priority: "low",
  },
];

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

export const efficiencyTrend = validEfficiencyLogs.slice(-8).map((log) => ({
  week: format(parseISO(log.date), "MMM d"),
  kmPerLiter: log.mileage,
}));

const totalFuelCost = fuelioFillUps.reduce((sum, log) => sum + log.cost, 0);
const totalLiters = fuelioFillUps.reduce((sum, log) => sum + log.liters, 0);
const averageEfficiency =
  validEfficiencyLogs.reduce((sum, log) => sum + log.mileage, 0) /
  Math.max(validEfficiencyLogs.length, 1);

export const expenseBreakdown = [
  { name: "Fuel", value: +totalFuelCost.toFixed(2), color: "oklch(0.55 0.22 305)" },
];

export const aiInsights = [
  {
    id: "ai1",
    type: "saving",
    title: "Best recent efficiency",
    body: `Your best recorded fill-up is ${Math.max(...validEfficiencyLogs.map((log) => log.mileage)).toFixed(2)} km/L from the Fuelio import.`,
  },
  {
    id: "ai2",
    type: "predict",
    title: "Tank capacity check",
    body: `Apache 4v tank capacity is ${fuelioVehicle.tankCapacityLiters} L. Recent fill-ups are staying within the expected range.`,
  },
  {
    id: "ai3",
    type: "alert",
    title: "Fuel price changed",
    body: `Latest fuel price is ৳${latestSeed.fuelPricePerLiter.toFixed(2)}/L, up from the early import price of ৳${fuelioFillUps[0].fuelPricePerLiter.toFixed(2)}/L.`,
  },
  {
    id: "ai4",
    type: "tip",
    title: "Imported Fuelio history",
    body: `${fuelioFillUps.length} fill-ups imported from Fuelio, covering ${format(parseISO(fuelioFillUps[0].date), "MMM yyyy")} to ${format(parseISO(latestSeed.date), "MMM yyyy")}.`,
  },
];

export const totals = {
  fuelCost: totalFuelCost,
  monthlyExpense: totalFuelCost,
  efficiency: +averageEfficiency.toFixed(2),
  mileage: latestSeed.odometer,
  health: vehicles[0].healthScore,
  liters: totalLiters,
  fillUps: fuelioFillUps.length,
};
