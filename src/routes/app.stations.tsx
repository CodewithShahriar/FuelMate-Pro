import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Navigation, Star, Fuel, ExternalLink, Search } from "lucide-react";

export const Route = createFileRoute("/app/stations")({
  head: () => ({ meta: [{ title: "Petrol Stations — FuelMate Pro" }] }),
  component: StationsPage,
});

const defaultStations = [
  {
    id: "s1",
    name: "Uttara Petroleum (সিলেট)",
    city: "Sylhet",
    distance: "800 m",
    octanePrice: 165.0,
    tag: "FAVORITE",
    tagColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    rating: 4.8,
    fullsCount: 38,
    lat: 24.91859,
    lng: 91.87442,
  },
  {
    id: "s2",
    name: "Bhuiyan Petrol Pump",
    city: "Sylhet Bypass",
    distance: "1.3 km",
    octanePrice: 165.0,
    tag: "TOP RATED",
    tagColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    rating: 4.9,
    fullsCount: 5,
    lat: 24.908,
    lng: 91.865,
  },
  {
    id: "s3",
    name: "Jalalabad Gas & Petrol",
    city: "Subidbazar, Sylhet",
    distance: "450 m",
    octanePrice: 165.0,
    tag: "BEST PRICE",
    tagColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    rating: 4.6,
    fullsCount: 3,
    lat: 24.925,
    lng: 91.86,
  },
  {
    id: "s4",
    name: "Biman Petrol Station",
    city: "Airport Road, Sylhet",
    distance: "1.5 km",
    octanePrice: 165.0,
    tag: "NEARBY",
    tagColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    rating: 4.5,
    fullsCount: 2,
    lat: 24.935,
    lng: 91.878,
  },
];

export function StationsPage() {
  const [q, setQ] = useState("");

  const filtered = defaultStations.filter((s) =>
    `${s.name} ${s.city}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-4 pb-12 text-white">
      <header className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-black tracking-tight">Petrol Stations</h1>
          <p className="text-xs text-neutral-400">Nearby fuel pumps in Sylhet</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          24 Stations
        </span>
      </header>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search pump name or location..."
          className="w-full h-11 px-4 pl-10 rounded-2xl bg-[#141824] border border-white/10 text-white text-xs placeholder:text-neutral-500 focus:outline-none"
        />
        <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-cyan-400" />
      </div>

      {/* Stations List */}
      <div className="space-y-3">
        {filtered.map((station) => (
          <article
            key={station.id}
            className="p-4 rounded-[24px] bg-[#141824] border border-white/5 space-y-3 shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${station.tagColor}`}
                  >
                    {station.tag}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-amber-400 font-bold">
                    <Star className="w-3 h-3 fill-amber-400" /> {station.rating}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mt-1">{station.name}</h3>
                <p className="text-xs text-neutral-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-red-400" /> {station.city} · {station.distance}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-neutral-500 uppercase">Octane</span>
                <p className="text-sm font-mono font-bold text-cyan-300">
                  {station.octanePrice.toFixed(2)} ৳
                </p>
                <p className="text-[10px] text-neutral-500">{station.fullsCount} fill-ups here</p>
              </div>
            </div>

            <div className="pt-2.5 border-t border-white/5 flex items-center justify-between text-xs">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(station.name + " " + station.city)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Directions</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <span className="text-[11px] text-emerald-400 font-medium">Open 24/7</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
