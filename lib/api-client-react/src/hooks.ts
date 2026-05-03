import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { GenerateTripInput, SaveTripInput, TripResponse } from "@workspace/api-zod";

const BASE_URL = typeof window !== "undefined"
  ? (import.meta as unknown as { env: { VITE_API_URL?: string } }).env?.VITE_API_URL ?? ""
  : "";

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}

export function useGenerateTrip() {
  return useMutation({
    mutationFn: (input: GenerateTripInput) =>
      post<{ plan: unknown }>("/api/trips/generate", input),
  });
}

export function useSaveTrip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: SaveTripInput) =>
      post<TripResponse>("/api/trips", input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["trips"] }),
  });
}

export function useTrips() {
  return useQuery({
    queryKey: ["trips"],
    queryFn: () => get<TripResponse[]>("/api/trips"),
  });
}

export function useTrip(id: string) {
  return useQuery({
    queryKey: ["trips", id],
    queryFn: () => get<TripResponse>(`/api/trips/${id}`),
    enabled: !!id,
  });
}
