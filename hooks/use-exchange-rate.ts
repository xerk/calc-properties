"use client";

import { useState, useEffect } from "react";

const FALLBACK_RATE = 50;
const API_URL = "https://open.er-api.com/v6/latest/USD";

export function useExchangeRate() {
  const [rate, setRate] = useState(FALLBACK_RATE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchRate() {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch rate");
        const data = await res.json();
        if (!cancelled && data?.rates?.EGP) {
          setRate(Math.round(data.rates.EGP * 100) / 100);
          setError(null);
        }
      } catch {
        if (!cancelled) {
          setError("Could not fetch live rate");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchRate();
    return () => { cancelled = true; };
  }, []);

  return { rate, setRate, loading, error };
}
