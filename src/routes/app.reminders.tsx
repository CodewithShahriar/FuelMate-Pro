import { createFileRoute } from "@tanstack/react-router";
import { reminders, vehicles } from "@/lib/mock-data";
import { Plus, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, parseISO, differenceInDays } from "date-fns";

export const Route = createFileRoute("/app/reminders")({
  head: () => ({ meta: [{ title: "Reminders — FuelMate Pro" }] }),
  component: Page,
});

function Page() {
  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Maintenance</p>
          <h1 className="mt-1 text-3xl font-display font-semibold tracking-tight">
            Service reminders
          </h1>
        </div>
        <Button className="bg-gradient-primary text-primary-foreground rounded-xl shadow-glow hover:opacity-90">
          <Plus className="h-4 w-4 mr-1" /> New reminder
        </Button>
      </header>

      <div className="space-y-3">
        {reminders.map((r) => {
          const v = vehicles.find((v) => v.id === r.vehicleId)!;
          const days = differenceInDays(parseISO(r.dueDate), new Date());
          const color =
            r.priority === "high"
              ? "bg-destructive/20 text-destructive border-destructive/30"
              : r.priority === "medium"
                ? "bg-[oklch(0.82_0.16_70_/_0.18)] text-[oklch(0.82_0.16_70)] border-[oklch(0.82_0.16_70_/_0.3)]"
                : "bg-[oklch(0.78_0.16_155_/_0.18)] text-[oklch(0.78_0.16_155)] border-[oklch(0.78_0.16_155_/_0.3)]";
          return (
            <div key={r.id} className="glass rounded-2xl p-5 shadow-card flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-primary/15 grid place-items-center">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium">{r.title}</p>
                  <span
                    className={`text-[10px] uppercase tracking-wider rounded-full px-2 py-0.5 border ${color}`}
                  >
                    {r.priority}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {v.brand} {v.model} · {r.type}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-display font-semibold">
                  {format(parseISO(r.dueDate), "MMM d")}
                </p>
                <p className="text-xs text-muted-foreground">in {days} days</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
