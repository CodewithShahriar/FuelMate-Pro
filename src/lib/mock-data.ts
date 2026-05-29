import { addDays, subDays, format } from "date-fns";

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

export const vehicles: Vehicle[] = [
  {
    id: "v1",
    name: "Daily Driver",
    brand: "Tesla",
    model: "Model 3",
    year: 2023,
    fuelType: "Electric",
    plate: "FUEL-001",
    odometer: 24560,
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80",
    color: "Pearl White",
    healthScore: 96,
  },
  {
    id: "v2",
    name: "Weekend Ride",
    brand: "BMW",
    model: "M340i",
    year: 2022,
    fuelType: "Petrol",
    plate: "FUEL-002",
    odometer: 38120,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
    color: "Alpine White",
    healthScore: 88,
  },
  {
    id: "v3",
    name: "Work Truck",
    brand: "Ford",
    model: "F-150 Lightning",
    year: 2024,
    fuelType: "Electric",
    plate: "FUEL-003",
    odometer: 9870,
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80",
    color: "Antimatter Blue",
    healthScore: 92,
  },
];

const stations = ["Shell V-Power", "Tesla Supercharger", "BP Ultimate", "Chevron", "EVgo Fast", "Mobil 1"];

export const fuelLogs: FuelLog[] = Array.from({ length: 18 }).map((_, i) => {
  const v = vehicles[i % vehicles.length];
  const liters = +(28 + Math.random() * 22).toFixed(1);
  const pricePerL = v.fuelType === "Electric" ? 0.32 : 1.65;
  return {
    id: `f${i + 1}`,
    vehicleId: v.id,
    date: format(subDays(new Date(), i * 4 + 1), "yyyy-MM-dd"),
    liters,
    cost: +(liters * pricePerL * (1 + Math.random() * 0.1)).toFixed(2),
    station: stations[i % stations.length],
    odometer: v.odometer - i * 420,
    mileage: +(14 + Math.random() * 6).toFixed(1),
  };
});

export const expenses: Expense[] = [
  { id: "e1", vehicleId: "v1", category: "Insurance", amount: 1240, date: format(subDays(new Date(), 12), "yyyy-MM-dd"), notes: "Annual premium" },
  { id: "e2", vehicleId: "v2", category: "Maintenance", amount: 380, date: format(subDays(new Date(), 6), "yyyy-MM-dd"), notes: "Oil + filters" },
  { id: "e3", vehicleId: "v1", category: "Car Wash", amount: 45, date: format(subDays(new Date(), 3), "yyyy-MM-dd"), notes: "Premium detail" },
  { id: "e4", vehicleId: "v3", category: "Toll", amount: 28, date: format(subDays(new Date(), 1), "yyyy-MM-dd"), notes: "Bay bridge" },
  { id: "e5", vehicleId: "v2", category: "Repairs", amount: 920, date: format(subDays(new Date(), 24), "yyyy-MM-dd"), notes: "Brake pads + rotors" },
  { id: "e6", vehicleId: "v3", category: "Parking", amount: 180, date: format(subDays(new Date(), 18), "yyyy-MM-dd"), notes: "Monthly garage" },
  { id: "e7", vehicleId: "v1", category: "Maintenance", amount: 220, date: format(subDays(new Date(), 40), "yyyy-MM-dd"), notes: "Tire rotation" },
];

export const reminders: Reminder[] = [
  { id: "r1", vehicleId: "v2", title: "Oil change due", type: "Oil Change", dueDate: format(addDays(new Date(), 4), "yyyy-MM-dd"), priority: "high" },
  { id: "r2", vehicleId: "v1", title: "Tire rotation", type: "Tire Replacement", dueDate: format(addDays(new Date(), 12), "yyyy-MM-dd"), priority: "medium" },
  { id: "r3", vehicleId: "v3", title: "Insurance renewal", type: "Insurance Renewal", dueDate: format(addDays(new Date(), 22), "yyyy-MM-dd"), priority: "medium" },
  { id: "r4", vehicleId: "v2", title: "Annual inspection", type: "Inspection", dueDate: format(addDays(new Date(), 45), "yyyy-MM-dd"), priority: "low" },
];

export const monthlyTrend = [
  { month: "Jan", fuel: 420, expenses: 280 },
  { month: "Feb", fuel: 510, expenses: 340 },
  { month: "Mar", fuel: 470, expenses: 220 },
  { month: "Apr", fuel: 620, expenses: 510 },
  { month: "May", fuel: 580, expenses: 380 },
  { month: "Jun", fuel: 660, expenses: 420 },
  { month: "Jul", fuel: 720, expenses: 290 },
  { month: "Aug", fuel: 690, expenses: 610 },
  { month: "Sep", fuel: 540, expenses: 330 },
];

export const efficiencyTrend = [
  { week: "W1", kmPerLiter: 16.2 },
  { week: "W2", kmPerLiter: 17.1 },
  { week: "W3", kmPerLiter: 15.8 },
  { week: "W4", kmPerLiter: 18.3 },
  { week: "W5", kmPerLiter: 17.9 },
  { week: "W6", kmPerLiter: 19.1 },
  { week: "W7", kmPerLiter: 18.7 },
  { week: "W8", kmPerLiter: 20.2 },
];

export const expenseBreakdown = [
  { name: "Maintenance", value: 600, color: "oklch(0.84 0.17 88)" },
  { name: "Insurance", value: 1240, color: "oklch(0.75 0.13 200)" },
  { name: "Parking", value: 180, color: "oklch(0.78 0.16 155)" },
  { name: "Toll", value: 28, color: "oklch(0.7 0.18 30)" },
  { name: "Repairs", value: 920, color: "oklch(0.65 0.2 300)" },
  { name: "Car Wash", value: 45, color: "oklch(0.82 0.16 70)" },
];

export const aiInsights = [
  {
    id: "ai1",
    type: "saving",
    title: "Save ~$48 / month on fuel",
    body: "Your BMW averages 14.2 km/L — driving below 70 mph on highway segments could improve efficiency by 12%.",
  },
  {
    id: "ai2",
    type: "predict",
    title: "Brake service likely in 6 weeks",
    body: "Based on your driving pattern and last service interval, the front pads will reach the 3mm threshold soon.",
  },
  {
    id: "ai3",
    type: "alert",
    title: "Unusual fuel cost spike",
    body: "August spending is 38% above your 6-month average. Three top-ups happened at premium stations.",
  },
  {
    id: "ai4",
    type: "tip",
    title: "Tesla tire pressure check",
    body: "Cold mornings detected — check pressure to maintain optimal range and tire life.",
  },
];

export const totals = {
  fuelCost: fuelLogs.reduce((s, l) => s + l.cost, 0),
  monthlyExpense: expenses.reduce((s, e) => s + e.amount, 0),
  efficiency: +(fuelLogs.reduce((s, l) => s + l.mileage, 0) / fuelLogs.length).toFixed(1),
  mileage: vehicles.reduce((s, v) => s + v.odometer, 0),
  health: Math.round(vehicles.reduce((s, v) => s + v.healthScore, 0) / vehicles.length),
};
