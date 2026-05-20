import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Car,
  Fuel,
  Receipt,
  BarChart3,
  Bell,
  Sparkles,
  Settings,
  User,
  Search,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";

const nav = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/vehicles", label: "Vehicles", icon: Car },
  { to: "/app/fuel", label: "Fuel Logs", icon: Fuel },
  { to: "/app/expenses", label: "Expenses", icon: Receipt },
  { to: "/app/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/app/reminders", label: "Reminders", icon: Bell },
  { to: "/app/assistant", label: "AI Assistant", icon: Sparkles },
] as const;

const secondary = [
  { to: "/app/settings", label: "Settings", icon: Settings },
  { to: "/app/profile", label: "Profile", icon: User },
] as const;

export function AppShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border/60 bg-sidebar/80 backdrop-blur-xl">
        <div className="h-16 flex items-center px-6 border-b border-border/60">
          <Logo />
        </div>
        <SidebarNav pathname={pathname} />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm lg:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 24, stiffness: 220 }}
              className="fixed inset-y-0 left-0 z-50 w-72 flex flex-col bg-sidebar border-r border-border lg:hidden"
            >
              <div className="h-16 flex items-center justify-between px-5 border-b border-border/60">
                <Logo />
                <button onClick={() => setOpen(false)} className="p-2 rounded-lg hover:bg-accent/10">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <SidebarNav pathname={pathname} onNavigate={() => setOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 sticky top-0 z-30 flex items-center gap-3 px-4 sm:px-6 border-b border-border/60 bg-background/70 backdrop-blur-xl">
          <button
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-accent/10"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden md:flex items-center gap-2 glass rounded-xl px-3 py-2 flex-1 max-w-md">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground"
              placeholder="Search vehicles, logs, expenses…"
            />
            <kbd className="text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">⌘K</kbd>
          </div>
          <div className="flex-1 md:hidden" />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <Bell className="h-4 w-4" />
            </Button>
            <div className="h-9 w-9 rounded-xl bg-gradient-primary grid place-items-center text-primary-foreground font-semibold text-sm shadow-glow">
              AM
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
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
      </div>
    </div>
  );
}

function SidebarNav({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex flex-col flex-1 px-3 py-4 gap-1 overflow-y-auto">
      <p className="px-3 pb-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Workspace</p>
      {nav.map((item) => (
        <NavItem key={item.to} {...item} active={pathname.startsWith(item.to)} onClick={onNavigate} />
      ))}
      <div className="mt-auto pt-4">
        <p className="px-3 pb-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Account</p>
        {secondary.map((item) => (
          <NavItem key={item.to} {...item} active={pathname.startsWith(item.to)} onClick={onNavigate} />
        ))}
        <div className="mt-4 p-4 rounded-2xl glass relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-primary opacity-10" />
          <div className="relative">
            <Sparkles className="h-4 w-4 text-primary mb-2" />
            <p className="text-sm font-medium">Upgrade to Fleet</p>
            <p className="text-xs text-muted-foreground mt-0.5">Unlimited vehicles & AI insights</p>
            <Button size="sm" className="mt-3 w-full bg-gradient-primary text-primary-foreground hover:opacity-90">
              Upgrade
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavItem({
  to,
  label,
  icon: Icon,
  active,
  onClick,
}: {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
        active
          ? "text-foreground bg-accent/10"
          : "text-muted-foreground hover:text-foreground hover:bg-accent/5"
      }`}
    >
      {active && (
        <motion.div
          layoutId="nav-active"
          className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-gradient-primary"
          transition={{ type: "spring", damping: 24, stiffness: 240 }}
        />
      )}
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  );
}