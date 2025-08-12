"use client";

import { useEffect, useState } from "react";

interface Category {
  category_id: string;
  name: string;
}

interface Props {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
}

export default function ClubCategoryFilter({ value, onChange }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/categories", {
          credentials: "include",
        });
        const json = await res.json();
        setCategories(json.categories || []);
      } catch {
        // ignore
      }
    }
    load();
  }, []);

  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value || undefined)}
      className="border border-border rounded-md px-3 py-2 text-sm"
    >
      <option value="">All Categories</option>
      {categories.map((cat) => (
        <option key={cat.category_id} value={cat.category_id}>
          {cat.name}
        </option>
      ))}
    </select>
  );
}

