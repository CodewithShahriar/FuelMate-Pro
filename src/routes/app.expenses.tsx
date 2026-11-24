import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wrench,
  Plus,
  Search,
  X,
  Droplet,
  Calendar,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Trash2,
  Edit2,
  Sparkles,
  ShieldCheck,
  Tag,
  Store,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { useExpenseData, ExpenseItem, ExpenseCategory } from "@/lib/expense-store";
import { useFuelData } from "@/lib/fuel-store";

export const Route = createFileRoute("/app/expenses")({
  head: () => ({ meta: [{ title: "Costs & Service — FuelMate Pro" }] }),
  component: ExpensesPage,
});

const categoryConfig: Record<
  ExpenseCategory,
  { label: string; icon: string; bg: string; text: string; border: string }
> = {
  "Engine Oil": {
    label: "Engine Oil",
    icon: "🛢️",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/30",
  },
  "Chain Lube": {
    label: "Chain Lube",
    icon: "⛓️",
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    border: "border-cyan-500/30",
  },
  "Periodic Service": {
    label: "Service & Tuning",
    icon: "🔧",
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/30",
  },
  Brakes: {
    label: "Brakes",
    icon: "🛑",
    bg: "bg-rose-500/10",
    text: "text-rose-400",
    border: "border-rose-500/30",
  },
  "Tire/Tube": {
    label: "Tire & Tube",
    icon: "💨",
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/30",
  },
  "Wash & Polish": {
    label: "Wash & Polish",
    icon: "🧼",
    bg: "bg-teal-500/10",
    text: "text-teal-400",
    border: "border-teal-500/30",
  },
  "Registration/Tax": {
    label: "BRTA & Papers",
    icon: "📄",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
  },
  Insurance: {
    label: "Insurance",
    icon: "🛡️",
    bg: "bg-indigo-500/10",
    text: "text-indigo-400",
    border: "border-indigo-500/30",
  },
  "Parts & Repairs": {
    label: "Parts & Fixes",
    icon: "🛠️",
    bg: "bg-orange-500/10",
    text: "text-orange-400",
    border: "border-orange-500/30",
  },
  Other: {
    label: "Other Cost",
    icon: "🏷️",
    bg: "bg-neutral-500/10",
    text: "text-neutral-400",
    border: "border-neutral-500/30",
  },
};

const allCategories: ExpenseCategory[] = [
  "Engine Oil",
  "Chain Lube",
  "Periodic Service",
  "Brakes",
  "Tire/Tube",
  "Wash & Polish",
  "Registration/Tax",
  "Insurance",
  "Parts & Repairs",
  "Other",
];

export function ExpensesPage() {
  const {
    expenses,
    totalSpent,
    lastOilChange,
    lastOilOdo,
    nextOilDueOdo,
    addExpense,
    updateExpense,
    deleteExpense,
  } = useExpenseData();

  const { stats } = useFuelData();

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseItem | null>(null);

  // Add Form state
  const [newCategory, setNewCategory] = useState<ExpenseCategory>("Engine Oil");
  const [newAmount, setNewAmount] = useState("");
  const [newOdometer, setNewOdometer] = useState("");
  const [newDate, setNewDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [newNotes, setNewNotes] = useState("");
  const [newVendor, setNewVendor] = useState("");
  const [formError, setFormError] = useState("");

  // Filtered expenses
  const filtered = useMemo(() => {
    return expenses.filter((item) => {
      const matchesCat = activeCategory === "All" || item.category === activeCategory;
      const matchesSearch =
        searchQuery === "" ||
        `${item.notes} ${item.category} ${item.vendor || ""}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [expenses, activeCategory, searchQuery]);

  // Quick preset loader for adding cost
  const applyPreset = (preset: {
    cat: ExpenseCategory;
    title: string;
    amt: string;
    vendor?: string;
  }) => {
    setNewCategory(preset.cat);
    setNewNotes(preset.title);
    setNewAmount(preset.amt);
    if (preset.vendor) setNewVendor(preset.vendor);
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amtNum = parseFloat(newAmount);
    const odoNum = parseFloat(newOdometer) || stats.latestOdometer;

    if (isNaN(amtNum) || amtNum <= 0) {
      setFormError("দয়া করে খরচের টাকা (Amount) লিখুন");
      return;
    }

    addExpense({
      category: newCategory,
      amount: amtNum,
      odometer: odoNum,
      date: newDate,
      notes: newNotes || `${newCategory} expense`,
      vendor: newVendor || "Local Shop",
    });

    // Reset form
    setNewAmount("");
    setNewOdometer("");
    setNewNotes("");
    setNewVendor("");
    setFormError("");
    setIsAddModalOpen(false);
  };

  // Remaining km till next oil change
  const currentOdo = stats.latestOdometer;
  const kmSinceLastOil = currentOdo - lastOilOdo;
  const kmTillNextOil = Math.max(0, nextOilDueOdo - currentOdo);
  const oilLifePercent = Math.min(100, Math.max(0, (kmSinceLastOil / 2500) * 100));

  return (
    <div className="space-y-4 pb-12 text-white">
      {/* Header */}
      <header className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <span>Costs & Service</span>
            <span className="text-xs font-mono font-medium text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
              {expenses.length} records
            </span>
          </h1>
          <p className="text-[11px] text-neutral-400 mt-0.5">
            Full bike maintenance, parts & service tracker
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#141824] border border-white/10 shadow-lg">
          <button
            onClick={() => setIsSearchOpen((v) => !v)}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 text-neutral-300 hover:text-white transition-colors"
            title="Search expenses"
          >
            {isSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 text-black flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.4)] hover:scale-105 active:scale-95 transition-all"
            title="Add New Expense"
          >
            <Plus className="w-5 h-5 stroke-[2.8]" />
          </button>
        </div>
      </header>

      {/* Search Input */}
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes, oil brand, or vendor..."
                className="w-full h-11 px-4 pl-10 rounded-2xl bg-[#141824] border border-cyan-500/30 text-white text-xs placeholder:text-neutral-500 focus:outline-none shadow-inner"
                autoFocus
              />
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-cyan-400" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OVERVIEW SUMMARY BANNER */}
      <div className="p-4 rounded-[28px] bg-gradient-to-br from-[#141824] via-[#10131d] to-[#0c0f16] border border-white/10 space-y-3.5 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">
              Total Non-Fuel Maintenance
            </span>
            <p className="text-3xl font-black text-white mt-0.5 tracking-tight font-mono">
              {totalSpent.toLocaleString(undefined, { maximumFractionDigits: 2 })}{" "}
              <span className="text-base font-normal text-cyan-300">৳</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(0,229,255,0.2)]">
            <Wrench className="w-6 h-6" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-xs">
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] text-neutral-400 uppercase">Fuel Total</span>
            <p className="font-mono font-bold text-neutral-200 mt-0.5">
              {stats.totalFuelCost.toLocaleString(undefined, { maximumFractionDigits: 0 })} ৳
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
            <span className="text-[10px] text-cyan-400 uppercase">Grand Ownership Total</span>
            <p className="font-mono font-bold text-cyan-300 mt-0.5">
              {(stats.totalFuelCost + totalSpent).toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}{" "}
              ৳
            </p>
          </div>
        </div>
      </div>

      {/* SMART ENGINE OIL SERVICE INTERVAL TRACKER */}
      <div className="p-4 rounded-[26px] bg-[#141824] border border-amber-500/20 space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛢️</span>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Engine Oil Service Interval
              </h2>
              <p className="text-[10px] text-neutral-400">
                Last changed at <span className="font-mono text-white">{lastOilOdo.toLocaleString()} km</span>
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono font-bold text-cyan-300">
            ~{kmTillNextOil.toFixed(0)} km left
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="w-full h-2.5 bg-neutral-800 rounded-full overflow-hidden p-0.5 border border-white/5">
            <div
              className={`h-full rounded-full transition-all ${
                oilLifePercent > 80 ? "bg-amber-500" : "bg-cyan-400"
              }`}
              style={{ width: `${oilLifePercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-neutral-400">
            <span>{kmSinceLastOil.toFixed(0)} km driven on current oil</span>
            <span>Next due: {nextOilDueOdo.toLocaleString()} km</span>
          </div>
        </div>
      </div>

      {/* CATEGORY FILTER CHIPS */}
      <div className="space-y-1.5">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveCategory("All")}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              activeCategory === "All"
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                : "bg-[#141824] text-neutral-400 border-white/5 hover:text-white"
            }`}
          >
            All ({expenses.length})
          </button>
          {allCategories.map((cat) => {
            const count = expenses.filter((e) => e.category === cat).length;
            if (count === 0 && activeCategory !== cat) return null;
            const cfg = categoryConfig[cat];
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  activeCategory === cat
                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold"
                    : "bg-[#141824] text-neutral-400 border-white/5 hover:text-white"
                }`}
              >
                <span>{cfg.icon}</span>
                <span>{cfg.label}</span>
                <span className="text-[10px] opacity-70">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* EXPENSES CARDS LIST */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-8 text-center rounded-[24px] bg-[#141824] border border-white/5 text-neutral-400 space-y-2">
            <p className="text-sm font-semibold text-neutral-300">কোনো খরচ রেকর্ড পাওয়া যায়নি</p>
            <p className="text-xs">নতুন সার্ভিস বা মেইনটেন্যান্স খরচ যোগ করতে উপরের (+) বাটনে ট্যাপ করুন।</p>
          </div>
        ) : (
          filtered.map((item) => {
            const cfg = categoryConfig[item.category] || categoryConfig.Other;

            return (
              <motion.article
                key={item.id}
                onClick={() => setSelectedExpense(item)}
                className="p-4 rounded-[24px] bg-[#141824] border border-white/5 hover:border-cyan-500/30 transition-all cursor-pointer shadow-lg space-y-3 hover:translate-y-[-1px]"
              >
                {/* Top Row: Category Pill & Amount */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-xl border flex items-center gap-1.5 ${cfg.bg} ${cfg.text} ${cfg.border}`}
                    >
                      <span>{cfg.icon}</span>
                      <span>{cfg.label}</span>
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      {format(parseISO(item.date), "dd MMM, yyyy")}
                    </span>
                  </div>

                  <div className="text-right">
                    <p className="text-base font-black text-white font-mono tracking-tight">
                      {item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}{" "}
                      <span className="text-xs font-normal text-cyan-300">৳</span>
                    </p>
                  </div>
                </div>

                {/* Notes & Description */}
                <p className="text-xs text-neutral-200 font-medium leading-relaxed">
                  {item.notes}
                </p>

                {/* Bottom Row: Odometer & Shop / Vendor */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-neutral-400">
                  <div className="flex items-center gap-1 font-mono">
                    <span className="text-neutral-500">Odo:</span>
                    <span className="text-neutral-300 font-semibold">{item.odometer.toLocaleString()} km</span>
                  </div>

                  {item.vendor && (
                    <div className="flex items-center gap-1 text-cyan-400">
                      <Store className="w-3 h-3" />
                      <span className="truncate max-w-[150px]">{item.vendor}</span>
                    </div>
                  )}
                </div>
              </motion.article>
            );
          })
        )}
      </div>



      {/* VIEW & EDIT MODAL (When clicking any expense card) */}
      {selectedExpense && (
        <EditExpenseModal
          expense={selectedExpense}
          onClose={() => setSelectedExpense(null)}
          onUpdate={(updated) => {
            updateExpense(selectedExpense.id, updated);
            setSelectedExpense(null);
          }}
          onDelete={() => {
            deleteExpense(selectedExpense.id);
            setSelectedExpense(null);
          }}
        />
      )}

      {/* ADD EXPENSE MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 120 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 120 }}
              className="w-full max-w-lg bg-[#0d1017] border border-white/10 rounded-t-[36px] sm:rounded-[36px] p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto text-white"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-xs font-semibold px-4 py-2 rounded-full bg-white/5 text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <h3 className="text-base font-bold text-white tracking-tight">Log Maintenance / Cost</h3>
                <button
                  type="button"
                  onClick={handleCreateExpense}
                  className="text-xs font-bold px-4 py-2 rounded-full bg-cyan-400 text-black hover:bg-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.4)]"
                >
                  Save
                </button>
              </div>

              {formError && (
                <div className="mt-3 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Quick Presets for Bike */}
              <div className="mt-4 space-y-1.5">
                <span className="text-[11px] font-semibold text-neutral-400">Bike Quick Presets:</span>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {[
                    { cat: "Engine Oil" as ExpenseCategory, title: "Motul 7100 10W40 + Filter", amt: "950", vendor: "Motul Point" },
                    { cat: "Chain Lube" as ExpenseCategory, title: "Motul Chain Cleaner & Lube", amt: "250", vendor: "Garage" },
                    { cat: "Wash & Polish" as ExpenseCategory, title: "Foam Wash with Degreaser", amt: "150", vendor: "Autoshine" },
                    { cat: "Brakes" as ExpenseCategory, title: "Front Disc Brake Pads", amt: "480", vendor: "TVS Center" },
                  ].map((p) => (
                    <button
                      key={p.title}
                      type="button"
                      onClick={() => applyPreset(p)}
                      className="shrink-0 px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-[11px] text-cyan-300 border border-white/5"
                    >
                      {p.title} (৳{p.amt})
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleCreateExpense} className="mt-4 space-y-4">
                {/* Category Picker */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                  <label className="text-xs text-neutral-400 font-medium">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ExpenseCategory)}
                    className="w-full h-11 px-3 rounded-xl bg-[#141824] border border-white/10 text-white text-xs font-semibold focus:border-cyan-400 focus:outline-none"
                  >
                    {allCategories.map((c) => (
                      <option key={c} value={c}>
                        {categoryConfig[c].icon} {categoryConfig[c].label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount & Odometer */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                    <label className="text-xs text-neutral-400 font-medium">Amount (৳)</label>
                    <div className="relative mt-1">
                      <input
                        type="number"
                        step="0.01"
                        value={newAmount}
                        onChange={(e) => {
                          setNewAmount(e.target.value);
                          setFormError("");
                        }}
                        placeholder="e.g. 950"
                        className="w-full h-11 px-3.5 pr-8 rounded-xl bg-[#141824] border border-cyan-500/30 text-cyan-300 font-bold text-base focus:border-cyan-400 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        required
                      />
                      <span className="absolute right-3 top-3 text-xs text-neutral-500 font-medium">৳</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                    <label className="text-xs text-neutral-400 font-medium">Odometer (km)</label>
                    <div className="relative mt-1">
                      <input
                        type="number"
                        step="0.1"
                        value={newOdometer}
                        onChange={(e) => setNewOdometer(e.target.value)}
                        placeholder={`e.g. ${stats.latestOdometer}`}
                        className="w-full h-11 px-3.5 pr-8 rounded-xl bg-[#141824] border border-white/10 text-white font-mono text-sm focus:border-cyan-400 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="absolute right-3 top-3 text-xs text-neutral-500 font-medium">km</span>
                    </div>
                  </div>
                </div>

                {/* Date & Vendor */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                    <label className="text-xs text-neutral-400 font-medium">Service Date</label>
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="mt-1 w-full h-11 px-3 rounded-xl bg-[#141824] border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                    <label className="text-xs text-neutral-400 font-medium">Workshop / Vendor</label>
                    <input
                      type="text"
                      value={newVendor}
                      onChange={(e) => setNewVendor(e.target.value)}
                      placeholder="e.g. Motul Point"
                      className="mt-1 w-full h-11 px-3 rounded-xl bg-[#141824] border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Description / Notes */}
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                  <label className="text-xs text-neutral-400 font-medium">Description & Parts Used</label>
                  <textarea
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="e.g. Changed engine oil Motul 7100 10W40, cleaned air filter"
                    rows={2}
                    className="w-full p-3 rounded-xl bg-[#141824] border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(0,229,255,0.4)] transition-all active:scale-[0.99]"
                >
                  SAVE EXPENSE {newAmount ? `(৳${newAmount})` : ""}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Edit / View Modal Component
function EditExpenseModal({
  expense,
  onClose,
  onUpdate,
  onDelete,
}: {
  expense: ExpenseItem;
  onClose: () => void;
  onUpdate: (updated: Partial<ExpenseItem>) => void;
  onDelete: () => void;
}) {
  const [amount, setAmount] = useState(expense.amount.toString());
  const [odometer, setOdometer] = useState(expense.odometer.toString());
  const [date, setDate] = useState(expense.date);
  const [notes, setNotes] = useState(expense.notes);
  const [vendor, setVendor] = useState(expense.vendor || "");
  const [category, setCategory] = useState<ExpenseCategory>(expense.category);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      amount: parseFloat(amount) || expense.amount,
      odometer: parseFloat(odometer) || expense.odometer,
      date,
      notes,
      vendor,
      category,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#0e111a] border border-white/10 rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl relative text-white space-y-4 max-h-[92vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <h3 className="text-base font-bold text-white">Edit Expense Details</h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/5 grid place-items-center text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-3.5">
          <div>
            <label className="text-xs text-neutral-400 font-medium">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className="mt-1 w-full h-10 px-3 rounded-xl bg-[#141824] border border-white/10 text-white text-xs font-semibold focus:border-cyan-400 focus:outline-none"
            >
              {allCategories.map((c) => (
                <option key={c} value={c}>
                  {categoryConfig[c].icon} {categoryConfig[c].label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-neutral-400 font-medium">Amount (৳)</label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 w-full h-10 px-3 rounded-xl bg-[#141824] border border-cyan-500/30 text-cyan-300 font-bold text-sm focus:border-cyan-400 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                required
              />
            </div>
            <div>
              <label className="text-xs text-neutral-400 font-medium">Odometer (km)</label>
              <input
                type="number"
                value={odometer}
                onChange={(e) => setOdometer(e.target.value)}
                className="mt-1 w-full h-10 px-3 rounded-xl bg-[#141824] border border-white/10 text-white font-mono text-sm focus:border-cyan-400 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-neutral-400 font-medium">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 w-full h-10 px-3 rounded-xl bg-[#141824] border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-400 font-medium">Vendor</label>
              <input
                type="text"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                className="mt-1 w-full h-10 px-3 rounded-xl bg-[#141824] border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-neutral-400 font-medium">Notes & Parts</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="mt-1 w-full p-3 rounded-xl bg-[#141824] border border-white/10 text-xs text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-cyan-400 text-black font-bold text-xs shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:bg-cyan-300"
            >
              Update Changes
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="px-4 py-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-semibold hover:bg-red-500/20"
              title="Delete this expense"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
