"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { fetchMedia, deleteMedia, type OyMedia } from "@/features/oy-admin/api";

function formatDate(iso: string | null): string {
  return iso ? new Date(iso).toLocaleDateString() : "—";
}

function fileName(url: string): string {
  try {
    const path = new URL(url).pathname;
    return decodeURIComponent(path.split("/").pop() || url);
  } catch {
    return url;
  }
}

export default function MediaList() {
  const [media, setMedia] = useState<OyMedia[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    fetchMedia()
      .then(setMedia)
      .catch(() => setError("Couldn't load media."));
  }, []);

  async function remove(id: string) {
    if (!media) return;
    if (!window.confirm("Delete this media asset? This can't be undone.")) return;
    const prev = media;
    setBusy(id);
    setError(null);
    setMedia((list) => (list ?? []).filter((m) => m.media_asset_id !== id));
    try {
      await deleteMedia(id);
    } catch {
      setMedia(prev);
      setError("Delete failed. Please try again.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Media</h1>
        <p className="text-sm text-muted-foreground">
          Uploaded assets across all institutions.
        </p>
      </div>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      {media === null ? (
        <p className="text-sm text-muted-foreground">Loading media…</p>
      ) : media.length === 0 ? (
        <p className="text-sm text-muted-foreground">No media assets yet.</p>
      ) : (
        <div className="overflow-auto rounded-lg border bg-white shadow-sm">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-2">File</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Visibility</th>
                <th className="px-4 py-2">Owner</th>
                <th className="px-4 py-2">Institution</th>
                <th className="px-4 py-2">Uploaded</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {media.map((m) => (
                <tr key={m.media_asset_id} className="hover:bg-gray-50">
                  <td className="max-w-xs px-4 py-3">
                    <a
                      href={m.url}
                      target="_blank"
                      rel="noreferrer"
                      className="truncate text-sm font-medium text-primary hover:underline"
                    >
                      {fileName(m.url)}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{m.asset_type}</td>
                  <td className="px-4 py-3 text-sm capitalize text-gray-600">
                    {m.visibility_scope}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {m.owner?.email ?? m.owner?.username ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {m.institutions?.abbreviated_name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {formatDate(m.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busy === m.media_asset_id}
                        onClick={() => remove(m.media_asset_id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
