// Lightweight, zero-dependency Supabase REST Client
// Connects directly to PostgREST with instant sync & offline resilience

function cleanHeaderValue(val: any): string {
  if (!val) return "";
  return String(val)
    .replace(/^["'\s]+|["'\s]+$/g, "") // strip surrounding quotes, spaces, newlines
    .replace(/[\r\n\t]/g, "")
    .trim();
}

function cleanBaseUrl(val: any): string {
  const cleaned = cleanHeaderValue(val);
  if (!cleaned) return "https://kcuhrkwiuhhnaxwaesnn.supabase.co";
  // Remove trailing slashes and /rest/v1 if inadvertently appended
  return cleaned.replace(/\/+$/, "").replace(/\/rest\/v1\/?$/, "");
}

const SUPABASE_URL = cleanBaseUrl(
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_URL) ||
  "https://kcuhrkwiuhhnaxwaesnn.supabase.co"
);

const SUPABASE_ANON_KEY = cleanHeaderValue(
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  "sb_publishable_uAGeAYK0cdLTiXaX6C7lOA_mLqElc0x"
);

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

  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${SUPABASE_URL}/rest/v1${cleanEndpoint}`;

  const cleanKey = cleanHeaderValue(SUPABASE_ANON_KEY);
  const headers: Record<string, string> = {
    apikey: cleanKey,
    Authorization: `Bearer ${cleanKey}`,
    "Content-Type": "application/json",
  };

  // Safely sanitize and merge any custom headers
  if (options.headers) {
    try {
      const extra = options.headers as Record<string, string>;
      for (const [k, v] of Object.entries(extra)) {
        headers[cleanHeaderValue(k)] = cleanHeaderValue(v);
      }
    } catch (e) {
      // Ignore header merge error
    }
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errText = await res.text();
      return { data: null, error: new Error(`Supabase Error (${res.status}): ${errText}`) };
    }

    const text = await res.text();
    let data = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }
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
