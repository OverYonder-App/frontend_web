"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";

interface EventLocationMapProps {
  lat: number;
  lng: number;
  /** Shown in the marker popup. */
  label?: string;
}

const PIN_SVG = `
<svg width="34" height="34" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 2px 2px rgb(0 0 0 / 0.35))">
  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="var(--primary, #745296)" stroke="#fff" stroke-width="1.5"/>
  <circle cx="12" cy="9" r="2.6" fill="#fff"/>
</svg>`;

export default function EventLocationMap({
  lat,
  lng,
  label,
}: EventLocationMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, {
        center: { lat, lng },
        zoom: 16,
        scrollWheelZoom: false,
      });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const icon = L.divIcon({
        html: PIN_SVG,
        className: "",
        iconSize: [34, 34],
        iconAnchor: [17, 32],
        popupAnchor: [0, -30],
      });
      const marker = L.marker({ lat, lng }, { icon }).addTo(map);
      if (label) marker.bindPopup(label);

      mapRef.current = map;
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [lat, lng, label]);

  return (
    <div
      ref={containerRef}
      className="h-56 w-full rounded-lg border overflow-hidden z-0"
      aria-label={label ? `Map showing ${label}` : "Event location map"}
    />
  );
}
