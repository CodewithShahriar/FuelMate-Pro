import { createFileRoute, redirect } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Fuel,
  BarChart3,
  Car,
  Bell,
  Shield,
  Zap,
  CheckCircle2,
  Star,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/app/dashboard" });
  },
  head: () => ({
    meta: [
      { title: "FuelMate Pro — AI-powered vehicle, fuel & expense management" },
      {
        name: "description",
        content:
          "Track fuel, expenses & vehicle performance like a pro. The modern AI-powered platform for smart drivers and fleet owners.",
      },
      { property: "og:title", content: "FuelMate Pro" },
      {
        property: "og:description",
        content: "Premium vehicle, fuel & expense management with AI insights.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen">
      <LandingNav />
      <Hero />
      <LogosStrip />
      <Features />
      <DashboardPreview />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}

function LandingNav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/60 border-b border-border/40">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground px-3 py-2">
            Sign in
          </Link>
          <Link to="/register">
            <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 grid-bg opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
      <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-24 lg:pt-28 lg:pb-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-muted-foreground"
        >
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          New: AI-powered maintenance predictions
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.6 }}
          className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-display font-semibold tracking-[-0.04em] leading-[1.05]"
        >
          Track Fuel, Expenses &{" "}
          <span className="text-gradient">Vehicle Performance</span>{" "}
          Like a Pro
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          The modern AI-powered vehicle management platform built for smart drivers and fleet owners.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <Link to="/register">
            <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow h-12 px-6 rounded-xl">
              Get Started <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
          <Link to="/app/dashboard">
            <Button size="lg" variant="outline" className="h-12 px-6 rounded-xl glass border-border/60">
              Live Demo
            </Button>
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
          className="mt-16 relative max-w-5xl mx-auto"
        >
          <div className="absolute -inset-4 bg-gradient-primary opacity-20 blur-3xl rounded-3xl" />
          <div className="relative glass-strong rounded-3xl p-2 shadow-elegant">
            <div className="rounded-2xl overflow-hidden border border-border/60 bg-card">
              <MiniDashboardPreview />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function MiniDashboardPreview() {
  return (
    <div className="p-5 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-muted-foreground">Fleet overview</p>
          <h3 className="text-lg font-display font-semibold">Good evening, Alex</h3>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-[oklch(0.78_0.16_155)] animate-pulse" />
          Live sync
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { l: "Fuel cost", v: "$2,184", d: "-8%" },
          { l: "Efficiency", v: "18.2 mpg", d: "+5%" },
          { l: "Vehicles", v: "3", d: "" },
          { l: "Health", v: "92", d: "+2" },
        ].map((s, i) => (
          <div key={i} className="glass rounded-xl p-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</p>
            <p className="text-lg font-display font-semibold mt-1">{s.v}</p>
            {s.d && <p className="text-[10px] text-[oklch(0.78_0.16_155)]">{s.d}</p>}
          </div>
        ))}
      </div>
      <div className="mt-5 h-32 glass rounded-xl p-3 relative overflow-hidden">
        <svg viewBox="0 0 400 100" className="w-full h-full">
          <defs>
            <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.84 0.17 88)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="oklch(0.84 0.17 88)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,80 C40,60 60,70 100,50 C140,30 180,55 220,40 C260,28 300,45 340,25 C370,12 400,20 400,20 L400,100 L0,100 Z"
            fill="url(#g1)"
          />
          <path
            d="M0,80 C40,60 60,70 100,50 C140,30 180,55 220,40 C260,28 300,45 340,25 C370,12 400,20 400,20"
            fill="none"
            stroke="oklch(0.84 0.17 88)"
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  );
}

function LogosStrip() {
  return (
    <div className="border-y border-border/40 bg-card/30">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-sm text-muted-foreground">
        <span className="text-xs uppercase tracking-[0.2em]">Trusted by drivers at</span>
        {["Tesla", "Uber", "Lyft", "FedEx", "DHL", "Bolt"].map((n) => (
          <span key={n} className="font-display font-semibold opacity-60 hover:opacity-100 transition-opacity">{n}</span>
        ))}
      </div>
    </div>
  );
}

const features = [
  { icon: Fuel, title: "Smart fuel logging", body: "Log fills in seconds. Auto-calculated mileage, cost-per-km, and consumption trends." },
  { icon: BarChart3, title: "Powerful analytics", body: "Beautiful charts and monthly reports that surface what actually matters." },
  { icon: Car, title: "Multi-vehicle fleet", body: "Manage personal cars or a full fleet with per-vehicle performance scoring." },
  { icon: Bell, title: "Service reminders", body: "Never miss oil changes, tire rotations, or insurance renewals again." },
  { icon: Sparkles, title: "AI insights", body: "Predictive maintenance and fuel-saving suggestions tailored to your driving." },
  { icon: Shield, title: "Private by design", body: "Your data stays yours. End-to-end encryption and zero ad-tracking." },
];

function Features() {
  return (
    <section id="features" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-[0.2em] text-primary">Features</p>
          <h2 className="mt-3 text-4xl sm:text-5xl font-display font-semibold tracking-tight">
            Everything you need to <span className="text-gradient">drive smarter</span>
          </h2>
          <p className="mt-4 text-muted-foreground">From quick fuel logs to AI predictions, FuelMate Pro is the complete toolkit for modern drivers.</p>
        </div>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="glass rounded-2xl p-6 hover:shadow-glow transition-shadow group"
            >
              <div className="h-11 w-11 rounded-xl bg-gradient-primary grid place-items-center shadow-glow mb-4">
                <f.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-display font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <section className="py-24 bg-gradient-surface">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-primary">Built for clarity</p>
          <h2 className="mt-3 text-4xl sm:text-5xl font-display font-semibold tracking-tight">
            A dashboard you'll actually open daily.
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Every metric is a glance away. Spot anomalies, celebrate savings, and plan ahead with confidence.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "Real-time fuel cost & efficiency",
              "Per-vehicle health scoring",
              "Predictive service reminders",
              "Export-ready monthly reports",
            ].map((l) => (
              <li key={l} className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                {l}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative">
          <div className="absolute -inset-6 bg-gradient-primary opacity-15 blur-3xl rounded-3xl" />
          <div className="relative glass-strong rounded-3xl p-2 shadow-elegant">
            <div className="rounded-2xl overflow-hidden border border-border/60 bg-card">
              <MiniDashboardPreview />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    { name: "Maria Chen", role: "Fleet manager, Bolt", body: "We replaced three spreadsheets and a clipboard with FuelMate. Our drivers love it." },
    { name: "James Patel", role: "Tesla owner", body: "Finally, charging costs that actually make sense. The AI tips paid for the plan in a week." },
    { name: "Sofia Rivera", role: "Rideshare driver", body: "I log a fuel-up in 8 seconds. The mileage graphs help me drive more efficiently." },
  ];
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-[0.2em] text-primary">Loved by drivers</p>
          <h2 className="mt-3 text-4xl sm:text-5xl font-display font-semibold tracking-tight">Don't take our word for it.</h2>
        </div>
        <div className="mt-14 grid md:grid-cols-3 gap-4">
          {items.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex gap-0.5 text-primary">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-sm">{t.body}</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-gradient-primary text-primary-foreground grid place-items-center text-xs font-semibold">
                  {t.name.split(" ").map((p) => p[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    { name: "Solo", price: "$0", period: "/mo", desc: "For one car.", features: ["1 vehicle", "Unlimited fuel logs", "Basic analytics"], cta: "Start free", featured: false },
    { name: "Pro", price: "$9", period: "/mo", desc: "For enthusiasts.", features: ["5 vehicles", "AI insights", "Advanced analytics", "Service reminders"], cta: "Start Pro", featured: true },
    { name: "Fleet", price: "$29", period: "/mo", desc: "For teams.", features: ["Unlimited vehicles", "Team access", "Export & API", "Priority support"], cta: "Contact us", featured: false },
  ];
  return (
    <section id="pricing" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-[0.2em] text-primary">Pricing</p>
          <h2 className="mt-3 text-4xl sm:text-5xl font-display font-semibold tracking-tight">Simple, transparent plans.</h2>
        </div>
        <div className="mt-14 grid md:grid-cols-3 gap-4">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative rounded-2xl p-6 ${t.featured ? "glass-strong shadow-glow border-primary/30" : "glass"}`}
            >
              {t.featured && (
                <span className="absolute -top-3 left-6 text-[10px] uppercase tracking-[0.2em] px-2 py-1 rounded-full bg-gradient-primary text-primary-foreground">
                  Most popular
                </span>
              )}
              <p className="text-sm text-muted-foreground">{t.desc}</p>
              <h3 className="mt-2 font-display text-2xl font-semibold">{t.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-5xl font-display font-semibold">{t.price}</span>
                <span className="text-muted-foreground">{t.period}</span>
              </div>
              <ul className="mt-6 space-y-2 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" /> {f}
                  </li>
                ))}
              </ul>
              <Button
                className={`mt-6 w-full rounded-xl ${
                  t.featured ? "bg-gradient-primary text-primary-foreground hover:opacity-90" : "glass"
                }`}
              >
                {t.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const items = [
    { q: "Do I need internet to log fuel?", a: "No — logs sync automatically when you're back online." },
    { q: "Can I import data from Fuelio?", a: "Yes, we support CSV imports from most popular trackers." },
    { q: "How does AI maintenance work?", a: "We analyze your service history and driving pattern to estimate component wear." },
    { q: "Is my data private?", a: "Always. We never sell data, and you can export or delete everything at any time." },
  ];
  return (
    <section id="faq" className="py-24 bg-gradient-surface">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-primary">FAQ</p>
          <h2 className="mt-3 text-4xl font-display font-semibold tracking-tight">Frequently asked questions</h2>
        </div>
        <div className="mt-10 space-y-3">
          {items.map((i) => (
            <details key={i.q} className="glass rounded-2xl p-5 group">
              <summary className="cursor-pointer list-none flex items-center justify-between font-medium">
                {i.q}
                <span className="text-primary group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{i.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="relative overflow-hidden rounded-3xl p-12 sm:p-16 glass-strong text-center">
          <div className="absolute inset-0 bg-gradient-primary opacity-10" />
          <div className="absolute inset-0 grid-bg opacity-20" />
          <div className="relative">
            <Zap className="h-10 w-10 text-primary mx-auto" />
            <h2 className="mt-4 text-4xl sm:text-5xl font-display font-semibold tracking-tight">
              Start driving smarter today.
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Join thousands of drivers using FuelMate Pro to save fuel, predict maintenance, and master their expenses.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/register">
                <Button size="lg" className="h-12 px-6 rounded-xl bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow">
                  Create free account <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/app/dashboard">
                <Button size="lg" variant="outline" className="h-12 px-6 rounded-xl glass border-border/60">
                  Try the demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/40 py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Logo />
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} FuelMate Pro. Built for drivers who care.</p>
      </div>
    </footer>
  );
}
