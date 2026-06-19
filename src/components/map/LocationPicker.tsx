"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import "leaflet/dist/leaflet.css";
import { searchAddress, reverseGeocode, type GeocodeResult } from "@/lib/geocode";

export interface LatLng {
  lat: number;
  lng: number;
}

interface LocationPickerProps {
  /** Current pin position. The map recenters when this changes. */
  location: LatLng | null;
  /** Current address text shown in the search box. */
  address: string;
  /**
   * Fired whenever the user picks a spot — via search, clicking the map, or
   * dragging the pin. The address is resolved through OpenStreetMap.
   */
  onChange: (location: LatLng, address: string) => void;
  /** Fired as the user types, so the form's address stays in sync. */
  onAddressChange?: (address: string) => void;
}

const PIN_SVG = `
<svg width="34" height="34" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 2px 2px rgb(0 0 0 / 0.35))">
  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="var(--primary, #745296)" stroke="#fff" stroke-width="1.5"/>
  <circle cx="12" cy="9" r="2.6" fill="#fff"/>
</svg>`;

const DEFAULT_CENTER: LatLng = { lat: 39.5, lng: -98.35 };

export default function LocationPicker({
  location,
  address,
  onChange,
  onAddressChange,
}: LocationPickerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const leafletRef = useRef<typeof import("leaflet") | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const [mapReady, setMapReady] = useState(false);
  const [query, setQuery] = useState(address);
  const [suggestions, setSuggestions] = useState<GeocodeResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [resolving, setResolving] = useState(false);
  const typedRef = useRef(false);
  // Last value the user typed; lets us ignore the form echoing it back via
  // the address prop, which would otherwise cancel the pending search.
  const lastTypedRef = useRef<string | null>(null);

  // Resolve the address for a pin the user just placed, then report both.
  const placePin = useCallback(async (loc: LatLng) => {
    markerRef.current?.setLatLng(loc);
    setResolving(true);
    const label = await reverseGeocode(loc.lat, loc.lng);
    setResolving(false);
    typedRef.current = false;
    setQuery(label);
    setSuggestions([]);
    onChangeRef.current(loc, label);
  }, []);

  // Create the map once. Leaflet touches `window`, so it is imported lazily
  // to keep this component safe to reference from server-rendered pages.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current || mapRef.current) return;
      leafletRef.current = L;

      const center = location ?? DEFAULT_CENTER;
      const map = L.map(containerRef.current, {
        center,
        zoom: location ? 16 : 4,
      });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      map.on("click", (e) => {
        placePin({ lat: e.latlng.lat, lng: e.latlng.lng });
      });

      mapRef.current = map;
      setMapReady(true);
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
      setMapReady(false);
    };
    // The map is created once; `location` only seeds the initial view.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placePin]);

  // Keep the pin and viewport in sync with the location prop.
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    if (!mapReady || !L || !map || !location) return;

    if (!markerRef.current) {
      const icon = L.divIcon({
        html: PIN_SVG,
        className: "", // no default divIcon styling
        iconSize: [34, 34],
        iconAnchor: [17, 32],
      });
      const marker = L.marker(location, { icon, draggable: true }).addTo(map);
      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        placePin({ lat: pos.lat, lng: pos.lng });
      });
      markerRef.current = marker;
    } else {
      markerRef.current.setLatLng(location);
    }
    map.setView(location, Math.max(map.getZoom(), 16));
  }, [mapReady, location, placePin]);

  // Sync the search box when the form's address changes from outside.
  useEffect(() => {
    if (address === lastTypedRef.current) return;
    typedRef.current = false;
    lastTypedRef.current = null;
    setQuery(address);
  }, [address]);

  // Debounced address search while the user types.
  useEffect(() => {
    if (!typedRef.current) return;
    if (query.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await searchAddress(query, controller.signal);
        setSuggestions(results);
      } catch {
        // aborted or offline — keep previous suggestions
      } finally {
        setSearching(false);
      }
    }, 450);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query]);

  const selectSuggestion = (s: GeocodeResult) => {
    typedRef.current = false;
    setQuery(s.label);
    setSuggestions([]);
    onChangeRef.current({ lat: s.lat, lng: s.lng }, s.label);
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            typedRef.current = true;
            lastTypedRef.current = e.target.value;
            setQuery(e.target.value);
            onAddressChange?.(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (suggestions[0]) selectSuggestion(suggestions[0]);
            }
            if (e.key === "Escape") setSuggestions([]);
          }}
          placeholder="Search for an address..."
          className="w-full border rounded p-2 pr-24 focus:outline-none focus:ring-2 focus:ring-primary/50"
          aria-label="Search for an address"
        />
        {(searching || resolving) && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            {searching ? "Searching..." : "Finding address..."}
          </span>
        )}
        {suggestions.length > 0 && (
          <ul className="absolute z-[1000] mt-1 w-full max-h-48 overflow-auto rounded-lg border bg-white shadow-lg">
            {suggestions.map((s) => (
              <li key={`${s.lat},${s.lng}`}>
                <button
                  type="button"
                  onClick={() => selectSuggestion(s)}
                  className="w-full text-left p-2 text-sm cursor-pointer hover:bg-gray-100"
                >
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div
        ref={containerRef}
        className="h-60 w-full rounded-lg border overflow-hidden z-0"
        aria-label="Map for choosing the event location"
      />
      <p className="text-xs text-muted-foreground">
        Search for an address, or click the map / drag the pin to set the
        exact spot.
      </p>
    </div>
  );
}
