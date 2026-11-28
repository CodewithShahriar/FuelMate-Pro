import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Fuel,
  Home,
  MapPin,
  MoreHorizontal,
  Wrench,
  Smartphone,
  Maximize2,
  Calculator,
} from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";

const bottomNav = [
  { to: "/app/dashboard", label: "Home", icon: Home },
  { to: "/app/fuel", label: "Fuel", icon: Fuel },
  { to: "/app/calculator", label: "Calculator", icon: Calculator },
  { to: "/app/expenses", label: "Costs", icon: Wrench },
  { to: "/app/settings", label: "More", icon: MoreHorizontal },
] as const;

export function AppShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [isMobileFrameMode, setIsMobileFrameMode] = useState(true);

  return (
    <div className="h-[100dvh] sm:h-auto sm:min-h-screen w-full bg-[#07090e] text-foreground flex flex-col items-center justify-start antialiased relative selection:bg-cyan-500/30 selection:text-cyan-200 overflow-hidden sm:overflow-visible">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-cyan-500/8 rounded-full blur-[140px]" />
        <div className="absolute bottom-[5%] right-[15%] w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-[140px]" />
        <div className="absolute top-[40%] left-[-5%] w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Desktop Top Control Bar (Only visible on desktop sm+) */}
      <header className="hidden sm:flex z-40 w-full max-w-5xl items-center justify-between px-6 py-4 border-b border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            TVS Apache RTR 160 4V
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/app/stats"
            className="text-xs text-muted-foreground hover:text-cyan-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
          >
            📊 Stats & Charts
          </Link>
          <Link
            to="/app/fuel"
            className="text-xs text-muted-foreground hover:text-cyan-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
          >
            ⛽ Fill-ups (46)
          </Link>

          {/* Toggle between Mobile Simulator and Expanded Desktop view */}
          <button
            onClick={() => setIsMobileFrameMode((prev) => !prev)}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-cyan-400 transition-all shadow-sm cursor-pointer"
            title="Toggle Desktop / Mobile Screen Frame"
          >
            {isMobileFrameMode ? (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Expand Fullscreen</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile Frame View</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Container: Mobile Frame on Desktop or Fullscreen Mobile */}
      <div
        className={`relative z-10 w-full flex-1 flex flex-col min-h-0 transition-all duration-300 ${
          isMobileFrameMode
            ? "sm:my-6 sm:max-w-[430px] sm:h-[880px] sm:max-h-[92vh] sm:rounded-[36px] sm:border sm:border-white/10 sm:shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_40px_rgba(0,213,255,0.12)] sm:overflow-hidden sm:flex sm:flex-col bg-[#0b0d14]"
            : "w-full max-w-4xl p-2 sm:p-6 sm:h-auto sm:overflow-visible"
        }`}
      >
        {/* Scrollable Viewport with iOS safe-area insets & smooth momentum scroll */}
        <main
          className="flex-1 w-full overflow-y-auto overflow-x-hidden px-4 pt-[max(0.75rem,env(safe-area-inset-top,0px))] pb-[calc(5.75rem+env(safe-area-inset-bottom,0px))] scroll-smooth overscroll-contain"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Floating Bottom Navigation Bar (Elevated above iOS Home Indicator bar) */}
        <nav
          className="fixed sm:absolute bottom-[max(0.75rem,calc(env(safe-area-inset-bottom,0px)+0.25rem))] inset-x-3 z-50 mx-auto max-w-[400px] rounded-[28px] border border-white/10 bg-[#121622]/90 px-2 py-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(0,213,255,0.08)] backdrop-blur-2xl"
        >
          <div className="grid grid-cols-5 gap-1 items-center">
            {bottomNav.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.to || (item.to !== "/app/dashboard" && pathname.startsWith(item.to));

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`group relative flex flex-col items-center justify-center gap-1 rounded-2xl py-2 px-1 text-[10px] font-medium transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-b from-cyan-500/20 to-cyan-500/5 text-cyan-400 font-semibold shadow-[0_0_15px_rgba(0,213,255,0.25)] border border-cyan-500/30"
                      : "text-neutral-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 transition-transform duration-200 ${
                      active ? "scale-110 text-cyan-400 stroke-[2.3]" : "group-hover:scale-105"
                    }`}
                  />
                  <span className="truncate tracking-tight">{item.label}</span>
                  {active && (
                    <motion.span
                      layoutId="bottomNavDot"
                      className="absolute bottom-1 w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_6px_#00e5ff]"
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
