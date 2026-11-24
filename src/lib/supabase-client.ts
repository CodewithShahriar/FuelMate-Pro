// Lightweight, zero-dependency Supabase REST Client
// Connects directly to PostgREST with instant sync & offline resilience

const SUPABASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_URL) ||
  "https://kcuhrkwiuhhnaxwaesnn.supabase.co";

const SUPABASE_ANON_KEY =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  "sb_publishable_uAGeAYK0cdLTiXaX6C7lOA_mLqElc0x";

export const supabaseConfig = {
  url: SUPABASE_URL,
  key: SUPABASE_ANON_KEY,
  isConfigured: Boolean(SUPABASE_URL && SUPABASE_ANON_KEY),
};

export async function supabaseFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: T | null; error: Error | null }> {
  if (!supabaseConfig.isConfigured) {
    return { data: null, error: new Error("Supabase is not configured") };
  }

  const cleanBase = SUPABASE_URL.replace(/\/$/, "");
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${cleanBase}/rest/v1${cleanEndpoint}`;

  const headers: HeadersInit = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errText = await res.text();
      return { data: null, error: new Error(`Supabase Error (${res.status}): ${errText}`) };
    }

    if (res.status === 204) {
      return { data: null, error: null };
    }

    const data = await res.json();
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

// Map local fill-up to Supabase `fuel_logs` row
export function mapToSupabaseFuelLog(record: any) {
  return {
    date: record.date ? record.date.split("T")[0] : new Date().toISOString().split("T")[0],
    liters: Number(record.fuelAmount || record.liters || 0),
    cost: Number(record.totalCost || record.cost || 0),
    station: record.station || "Sylhet",
    odometer: Math.round(Number(record.odometer || 0)),
    mileage: record.consumption ? Number(record.consumption) : null,
  };
}

// Map local expense to Supabase `expenses` row
export function mapToSupabaseExpense(item: any) {
  return {
    category: item.category || "Other",
    amount: Number(item.amount || 0),
    date: item.date ? item.date.split("T")[0] : new Date().toISOString().split("T")[0],
    notes: `${item.notes || ""} ${item.vendor ? `(${item.vendor})` : ""} [Odo: ${item.odometer || 0}]`.trim(),
  };
}

// Bulk upload fill-ups to cloud
export async function uploadFillUpsToCloud(records: any[]) {
  const rows = records.map(mapToSupabaseFuelLog);
  return supabaseFetch("/fuel_logs", {
    method: "POST",
    headers: {
      Prefer: "resolution=merge-duplicates",
    },
    body: JSON.stringify(rows),
  });
}

// Bulk upload expenses to cloud
export async function uploadExpensesToCloud(items: any[]) {
  const rows = items.map(mapToSupabaseExpense);
  return supabaseFetch("/expenses", {
    method: "POST",
    headers: {
      Prefer: "resolution=merge-duplicates",
    },
    body: JSON.stringify(rows),
  });
}

// Fetch all fill-ups from cloud
export async function fetchCloudFillUps() {
  return supabaseFetch<any[]>("/fuel_logs?select=*&order=date.desc");
}

// Fetch all expenses from cloud
export async function fetchCloudExpenses() {
  return supabaseFetch<any[]>("/expenses?select=*&order=date.desc");
}
