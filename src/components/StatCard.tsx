import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  accent = "primary",
  index = 0,
}: {
  label: string;
  value: string;
  delta?: number;
  icon: LucideIcon;
  accent?: "primary" | "success" | "warning" | "info";
  index?: number;
}) {
  const up = (delta ?? 0) >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="relative glass rounded-2xl p-5 shadow-card overflow-hidden group"
    >
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-primary opacity-[0.06] group-hover:opacity-[0.12] transition-opacity blur-2xl" />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-display font-semibold tracking-tight">{value}</p>
        </div>
        <div className={`h-10 w-10 rounded-xl grid place-items-center bg-gradient-primary text-primary-foreground shadow-glow`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {delta !== undefined && (
        <div className="mt-3 flex items-center gap-1 text-xs">
          {up ? (
            <TrendingUp className="h-3.5 w-3.5 text-[oklch(0.78_0.16_155)]" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-destructive" />
          )}
          <span className={up ? "text-[oklch(0.78_0.16_155)]" : "text-destructive"}>
            {up ? "+" : ""}{delta}%
          </span>
          <span className="text-muted-foreground">vs last month</span>
        </div>
      )}
    </motion.div>
  );
}