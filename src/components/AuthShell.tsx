import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex relative overflow-hidden bg-gradient-surface items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative max-w-md">
          <Logo />
          <h2 className="mt-10 text-4xl font-display font-semibold tracking-tight leading-tight">
            Drive smarter with <span className="text-gradient">AI-powered</span> insights.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Track every drop, every kilometer, every dollar — beautifully.
          </p>
          <div className="mt-10 glass-strong rounded-2xl p-5 shadow-elegant">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted-foreground">This month</p>
              <span className="text-xs text-[oklch(0.78_0.16_155)]">-12%</span>
            </div>
            <p className="text-3xl font-display font-semibold">$1,284.50</p>
            <p className="text-xs text-muted-foreground mt-1">Total fuel + expenses</p>
            <div className="mt-4 h-16 flex items-end gap-1">
              {[40, 55, 35, 70, 48, 82, 65, 90, 58, 72, 60, 78].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-gradient-primary opacity-80"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col p-6 sm:p-10">
        <div className="lg:hidden">
          <Logo />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-sm"
          >
            <h1 className="text-3xl font-display font-semibold tracking-tight">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
            <div className="mt-8">{children}</div>
            {footer && <div className="mt-6 text-sm text-muted-foreground text-center">{footer}</div>}
          </motion.div>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          <Link to="/" className="hover:text-foreground">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}

export function SocialRow() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {[
        { name: "Google", svg: "M21.35 11.1H12v2.92h5.34c-.23 1.5-1.66 4.4-5.34 4.4-3.21 0-5.84-2.66-5.84-5.92S8.79 6.58 12 6.58c1.83 0 3.05.78 3.75 1.45l2.56-2.46C16.78 3.99 14.6 3 12 3 6.93 3 2.83 7.1 2.83 12.17S6.93 21.34 12 21.34c6.92 0 9.5-4.86 9.5-7.41 0-.5-.07-.88-.15-1.27z" },
        { name: "Apple", svg: "M16.36 12.42c-.02-2.4 1.96-3.55 2.05-3.6-1.12-1.64-2.86-1.86-3.48-1.89-1.48-.15-2.89.87-3.64.87-.76 0-1.92-.85-3.16-.83-1.62.02-3.13.95-3.96 2.4-1.69 2.93-.43 7.25 1.22 9.62.8 1.16 1.76 2.46 3.01 2.42 1.21-.05 1.67-.78 3.14-.78 1.46 0 1.88.78 3.16.76 1.31-.02 2.14-1.18 2.94-2.34.93-1.34 1.31-2.64 1.33-2.71-.03-.01-2.55-.98-2.6-3.9zM14.04 5.32c.67-.82 1.13-1.95.99-3.07-.96.04-2.13.64-2.83 1.45-.62.72-1.18 1.88-1.04 2.99 1.08.08 2.2-.55 2.88-1.37z" },
      ].map((p) => (
        <button
          key={p.name}
          className="glass rounded-xl py-2.5 flex items-center justify-center gap-2 text-sm hover:bg-accent/10 transition-colors"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d={p.svg} /></svg>
          {p.name}
        </button>
      ))}
    </div>
  );
}