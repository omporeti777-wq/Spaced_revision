const ENV = import.meta.env || {};
const SUPABASE_URL = ENV.VITE_SUPABASE_URL?.replace(/\/$/, "");
const SUPABASE_KEY = ENV.VITE_SUPABASE_PUBLISHABLE_KEY || ENV.VITE_SUPABASE_ANON_KEY;

export function getSupabaseConfig() {
  return {
    url: SUPABASE_URL || "",
    publishableKey: SUPABASE_KEY || "",
    configured: Boolean(SUPABASE_URL && SUPABASE_KEY),
  };
}

export function isSupabaseConfigured() {
  return getSupabaseConfig().configured;
}

/**
 * Small PostgREST client used by the sync service. It deliberately uses the
 * browser's fetch API so the app remains dependency-light. The access token is
 * supplied by the Auth module in Phase 4; the publishable key alone never
 * bypasses the RLS policies in the database migration.
 */
export function createSupabaseRestClient(accessToken) {
  const config = getSupabaseConfig();
  if (!config.configured) {
    throw new Error("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env.local.");
  }
  if (!accessToken) {
    throw new Error("A signed-in Supabase session is required before cloud sync can run.");
  }

  const request = async (path, { method = "GET", body, headers = {} } = {}) => {
    const response = await fetch(`${config.url}/rest/v1/${path}`, {
      method,
      headers: {
        apikey: config.publishableKey,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    if (!response.ok) {
      const details = await response.text();
      throw new Error(`Supabase request failed (${response.status}): ${details || response.statusText}`);
    }

    const contentType = response.headers.get("content-type") || "";
    return contentType.includes("application/json") ? response.json() : null;
  };

  return {
    select: (table, query) => request(`${table}?${query}`),
    upsert: (table, rows, conflictColumn = "id") => (
      rows.length
        ? request(`${table}?on_conflict=${encodeURIComponent(conflictColumn)}`, {
          method: "POST",
          body: rows,
          headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
        })
        : Promise.resolve(null)
    ),
    deleteByIds: (table, ids) => (
      ids.length
        ? request(`${table}?id=in.(${ids.map(encodeURIComponent).join(",")})`, { method: "DELETE" })
        : Promise.resolve(null)
    ),
  };
}
