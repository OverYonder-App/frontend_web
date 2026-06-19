// Address <-> coordinates lookups via OpenStreetMap's Nominatim service.
// Free to use; their policy asks for light traffic (callers should debounce)
// so results are cached per session.

const NOMINATIM_URL = "https://nominatim.openstreetmap.org";

export interface GeocodeResult {
  lat: number;
  lng: number;
  label: string;
}

const searchCache = new Map<string, GeocodeResult[]>();
const reverseCache = new Map<string, string>();

export async function searchAddress(
  query: string,
  signal?: AbortSignal
): Promise<GeocodeResult[]> {
  const q = query.trim();
  if (q.length < 3) return [];
  const cached = searchCache.get(q);
  if (cached) return cached;

  const params = new URLSearchParams({
    format: "jsonv2",
    q,
    limit: "5",
  });
  const res = await fetch(`${NOMINATIM_URL}/search?${params}`, {
    signal,
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return [];
  const data: { lat: string; lon: string; display_name: string }[] =
    await res.json();
  const results = data.map((d) => ({
    lat: Number(d.lat),
    lng: Number(d.lon),
    label: d.display_name,
  }));
  searchCache.set(q, results);
  return results;
}

export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<string> {
  const key = `${lat.toFixed(6)},${lng.toFixed(6)}`;
  const cached = reverseCache.get(key);
  if (cached !== undefined) return cached;

  const params = new URLSearchParams({
    format: "jsonv2",
    lat: String(lat),
    lon: String(lng),
  });
  try {
    const res = await fetch(`${NOMINATIM_URL}/reverse?${params}`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return "";
    const data: { display_name?: string } = await res.json();
    const label = data.display_name ?? "";
    reverseCache.set(key, label);
    return label;
  } catch {
    return "";
  }
}
