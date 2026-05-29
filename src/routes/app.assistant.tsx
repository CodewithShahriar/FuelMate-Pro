import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { aiInsights } from "@/lib/mock-data";
import { Sparkles, Send, TrendingDown, Wrench, AlertTriangle, Lightbulb } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app/assistant")({
  head: () => ({ meta: [{ title: "AI Assistant — FuelMate Pro" }] }),
  component: Page,
});

const iconMap = {
  saving: TrendingDown,
  predict: Wrench,
  alert: AlertTriangle,
  tip: Lightbulb,
} as const;

function Page() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.18em] text-primary">FuelMate AI</p>
        <h1 className="mt-1 text-3xl font-display font-semibold tracking-tight">
          Your intelligent <span className="text-gradient">driving co-pilot</span>
        </h1>
      </header>

      <div className="relative overflow-hidden glass-strong rounded-3xl p-6 shadow-elegant">
        <div className="absolute inset-0 bg-gradient-primary opacity-[0.08]" />
        <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-gradient-primary opacity-30 blur-3xl" />
        <div className="relative flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-primary grid place-items-center shadow-glow">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Ask me anything</p>
            <h2 className="font-display text-2xl font-semibold mt-1">How can I help you drive smarter today?</h2>
            <form className="mt-5 flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <Input className="glass h-12 border-border/60" placeholder="e.g. Why did my fuel cost spike in August?" />
              <Button type="submit" className="h-12 px-5 rounded-xl bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow">
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Predict my next service", "Best km/L driver in the fleet", "Reduce monthly fuel cost"].map((s) => (
                <button key={s} className="text-xs glass rounded-full px-3 py-1.5 hover:bg-accent/10">{s}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {aiInsights.map((insight, i) => {
          const Icon = iconMap[insight.type as keyof typeof iconMap];
          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="relative overflow-hidden glass rounded-2xl p-5 shadow-card group hover:shadow-glow transition-shadow"
            >
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-primary opacity-[0.08] group-hover:opacity-[0.18] transition-opacity blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-primary">
                  <Icon className="h-3.5 w-3.5" />
                  {insight.type}
                </div>
                <h3 className="mt-2 font-display text-lg font-semibold">{insight.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{insight.body}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
