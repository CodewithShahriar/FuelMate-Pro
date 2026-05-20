import { createFileRoute } from "@tanstack/react-router";
import { expenses, vehicles, expenseBreakdown, monthlyTrend } from "@/lib/mock-data";
import { Plus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { tooltipStyle } from "./app.dashboard";
import { format, parseISO } from "date-fns";

export const Route = createFileRoute("/app/expenses")({
  head: () => ({ meta: [{ title: "Expenses — FuelMate Pro" }] }),
  component: Page,
});

const categoryColors: Record<string, string> = {
  Maintenance: "oklch(0.84 0.17 88)",
  Insurance: "oklch(0.75 0.13 200)",
  Parking: "oklch(0.78 0.16 155)",
  Toll: "oklch(0.7 0.18 30)",
  Repairs: "oklch(0.65 0.2 300)",
  "Car Wash": "oklch(0.82 0.16 70)",
  Other: "oklch(0.7 0.02 250)",
};

function Page() {
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Spending</p>
          <h1 className="mt-1 text-3xl font-display font-semibold tracking-tight">Expenses</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="glass border-border/60 rounded-xl"><Download className="h-4 w-4 mr-1" /> Export</Button>
          <Button className="bg-gradient-primary text-primary-foreground rounded-xl shadow-glow hover:opacity-90"><Plus className="h-4 w-4 mr-1" /> New expense</Button>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-5 shadow-card">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Total this period</p>
          <p className="mt-2 text-4xl font-display font-semibold">${total.toFixed(2)}</p>
          <p className="text-xs text-[oklch(0.78_0.16_155)] mt-1">+4% vs last month</p>
          <div className="h-32 mt-4">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={expenseBreakdown} dataKey="value" innerRadius={36} outerRadius={56} stroke="none">
                  {expenseBreakdown.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="lg:col-span-2 glass rounded-2xl p-5 shadow-card">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Monthly breakdown</p>
          <h3 className="font-display text-lg font-semibold">Last 9 months</h3>
          <div className="h-56 mt-3">
            <ResponsiveContainer>
              <BarChart data={monthlyTrend}>
                <CartesianGrid stroke="oklch(1 0 0 / 0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="oklch(0.7 0.02 250)" fontSize={11} axisLine={false} tickLine={false} />
                <YAxis stroke="oklch(0.7 0.02 250)" fontSize={11} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="expenses" fill="oklch(0.75 0.13 200)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border/60">
            <tr>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-left px-4 py-3">Vehicle</th>
              <th className="text-left px-4 py-3">Notes</th>
              <th className="text-right px-4 py-3">Amount</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e) => {
              const v = vehicles.find((v) => v.id === e.vehicleId)!;
              return (
                <tr key={e.id} className="border-b border-border/40 hover:bg-accent/5">
                  <td className="px-4 py-3">{format(parseISO(e.date), "MMM d, yyyy")}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 glass rounded-full px-2.5 py-1 text-xs">
                      <span className="h-2 w-2 rounded-full" style={{ background: categoryColors[e.category] }} />
                      {e.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{v.brand} {v.model}</td>
                  <td className="px-4 py-3 text-muted-foreground">{e.notes}</td>
                  <td className="px-4 py-3 text-right font-display font-semibold">${e.amount.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}