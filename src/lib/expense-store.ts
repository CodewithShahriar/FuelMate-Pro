import { useState, useEffect } from "react";
import { format } from "date-fns";

export type ExpenseCategory =
  | "Engine Oil"
  | "Chain Lube"
  | "Periodic Service"
  | "Brakes"
  | "Tire/Tube"
  | "Wash & Polish"
  | "Registration/Tax"
  | "Insurance"
  | "Parts & Repairs"
  | "Other";

export interface ExpenseItem {
  id: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  odometer: number;
  notes: string;
  vendor?: string;
}

const STORAGE_KEY = "fuelmate_pro_expenses_v2";

export const defaultExpenses: ExpenseItem[] = [
  {
    id: "exp_1",
    category: "Engine Oil",
    amount: 950,
    date: "2026-11-05",
    odometer: 37950,
    notes: "Motul 7100 10W40 Full Synthetic Oil + TVS OEM Oil Filter",
    vendor: "Motul Point, Sylhet",
  },
  {
    id: "exp_2",
    category: "Chain Lube",
    amount: 250,
    date: "2026-10-20",
    odometer: 37450,
    notes: "Motul C1 chain cleaner & C2 chain lube application",
    vendor: "Garage Point",
  },
  {
    id: "exp_3",
    category: "Brakes",
    amount: 480,
    date: "2026-09-15",
    odometer: 36800,
    notes: "Front disc brake pads replacement & caliper service",
    vendor: "TVS Authorized Service Center",
  },
  {
    id: "exp_4",
    category: "Periodic Service",
    amount: 650,
    date: "2026-08-01",
    odometer: 35900,
    notes: "Master tuning, FI throttle body clean & tappet adjustment",
    vendor: "TVS Service, Sylhet",
  },
  {
    id: "exp_5",
    category: "Wash & Polish",
    amount: 150,
    date: "2026-06-12",
    odometer: 34800,
    notes: "High-pressure foam wash with engine degreasing",
    vendor: "Autoshine Wash",
  },
  {
    id: "exp_6",
    category: "Tire/Tube",
    amount: 120,
    date: "2026-04-10",
    odometer: 33600,
    notes: "Rear tubeless tire puncture repair & nitrogen top-up",
    vendor: "Highway Tire Care",
  },
  {
    id: "exp_7",
    category: "Registration/Tax",
    amount: 4600,
    date: "2025-11-15",
    odometer: 30800,
    notes: "BRTA 2-Year Motorcycle Tax Token Renewal",
    vendor: "BRTA Sylhet",
  },
  {
    id: "exp_8",
    category: "Parts & Repairs",
    amount: 350,
    date: "2025-10-02",
    odometer: 29700,
    notes: "NGK Laser Iridium Spark Plug replacement",
    vendor: "Rider Parts Zone",
  },
];

export function getInitialExpenses(): ExpenseItem[] {
  if (typeof window === "undefined") return defaultExpenses;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error("Failed to load expenses from localStorage", e);
  }
  return defaultExpenses;
}

export function useExpenseData() {
  const [expenses, setExpenses] = useState<ExpenseItem[]>(getInitialExpenses);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    } catch (e) {
      console.error("Failed to save expenses to localStorage", e);
    }
  }, [expenses]);

  const addExpense = (newExpense: Omit<ExpenseItem, "id">) => {
    const item: ExpenseItem = {
      ...newExpense,
      id: `exp_${Date.now()}`,
    };
    setExpenses((prev) => [item, ...prev]);
  };

  const updateExpense = (id: string, updatedFields: Partial<ExpenseItem>) => {
    setExpenses((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  };

  const resetExpenses = () => {
    localStorage.removeItem(STORAGE_KEY);
    setExpenses(defaultExpenses);
  };

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);

  // Breakdown by category
  const categoryTotals = expenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  // Last Engine Oil change
  const lastOilChange = expenses.find((e) => e.category === "Engine Oil");
  const lastOilOdo = lastOilChange ? lastOilChange.odometer : 37950;
  const nextOilDueOdo = lastOilOdo + 2500; // 2,500 km interval for synthetic oil

  return {
    expenses,
    totalSpent,
    categoryTotals,
    lastOilChange,
    lastOilOdo,
    nextOilDueOdo,
    addExpense,
    updateExpense,
    deleteExpense,
    resetExpenses,
  };
}
