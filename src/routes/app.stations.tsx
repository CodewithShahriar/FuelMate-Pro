import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Navigation, Star } from "lucide-react";
import { fuelLogs } from "@/lib/mock-data";

export const Route = createFileRoute("/app/stations")({
  head: () => ({ meta: [{ title: "Petrol Stations — FuelMate Pro" }] }),
  component: StationsPage,
});

function StationsPage() {
  const stations = Array.from(
    fuelLogs.reduce((map, log) => {
      const key = log.stationId === "0" ? log.station : log.stationId;
      if (!map.has(key)) {
        map.set(key, {
          name: log.stationId === "0" ? log.station : `Station ${log.stationId}`,
          area: log.city || "Imported from Fuelio",
          distance: `${(log.odometer / 1000).toFixed(1)}k km odo`,
          rating: `${log.pictureCount} pics`,
        });
      }
      return map;
    }, new Map<string, { name: string; area: string; distance: string; rating: string }>()),
  ).map(([, station]) => station);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <header>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Nearby</p>
        <h1 className="mt-1 text-3xl font-display font-semibold tracking-tight">Petrol Stations</h1>
      </header>
      <div className="rounded-3xl bg-white p-5 text-slate-950 shadow-card">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[oklch(0.94_0.03_300)] text-[oklch(0.55_0.22_305)]">
            <MapPin className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold">Saved stations</h2>
            <p className="text-sm text-slate-500">Quick list for now, map can come later.</p>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {stations.map((station) => (
          <article
            key={station.name}
            className="rounded-3xl bg-white p-4 text-slate-950 shadow-card"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-lg font-semibold">{station.name}</h3>
                <p className="text-sm text-slate-500">{station.area}</p>
                <div className="mt-3 flex gap-3 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <Navigation className="h-3.5 w-3.5 text-[oklch(0.55_0.22_305)]" />{" "}
                    {station.distance}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-[oklch(0.55_0.22_305)]" /> {station.rating}
                  </span>
                </div>
              </div>
              <button className="rounded-full bg-[oklch(0.55_0.22_305)] px-4 py-2 text-xs font-semibold text-white">
                Open
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
