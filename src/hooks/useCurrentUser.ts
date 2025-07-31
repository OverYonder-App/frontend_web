"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type User = {
  id: string;
  email: string;
  role_type: string;
  [key: string]: any;
};

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const { data, error } = await supabase.auth.getUser();
      console.log(data);
      if (error || !data?.user) {
        setUser(null);
        console.log(data.user);
      } else {
        const jwt = data.user;
        const role_type = jwt?.user_metadata?.role_type ?? "Pending";
        setUser({
          id: jwt.id,
          email: jwt.email!,
          role_type,
          ...jwt.user_metadata,
        });
      }

      setLoading(false);
    }

    loadUser();
  }, []);

  return { user, loading };
}
