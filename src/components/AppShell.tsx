import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Fuel, Home, Map, MoreHorizontal, Wrench } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";

const bottomNav = [
  { to: "/app/dashboard", label: "Home", icon: Home },
  { to: "/app/fuel", label: "Fuel", icon: Fuel },
  { to: "/app/expenses", label: "Costs", icon: Wrench },
  { to: "/app/stations", label: "Petrol stations", icon: Map },
  { to: "/app/settings", label: "More", icon: MoreHorizontal },
] as const;

export function AppShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen w-full bg-background">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/60 bg-background/70 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
        <Logo />
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <Bell className="h-4 w-4" />
          </Button>
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-sm font-semibold text-primary-foreground shadow-glow">
            AM
          </div>
        </div>
      </header>

      <main className="p-4 pb-28 sm:p-6 sm:pb-28 lg:p-8 lg:pb-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <nav className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl rounded-[2rem] border border-white/80 bg-white/90 px-2 py-2 shadow-[0_18px_50px_oklch(0_0_0/0.18)] backdrop-blur-2xl">
        <div className="grid grid-cols-5 gap-1">
          {bottomNav.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.to);

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-[1.5rem] px-1 py-2 text-[10px] font-medium transition-colors ${
                  active
                    ? "bg-[oklch(0.91_0.03_295)] text-[oklch(0.48_0.2_295)]"
                    : "text-slate-950 hover:bg-slate-100"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
