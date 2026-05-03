import { z } from "zod";

export const generateTripSchema = z.object({
  origin: z.string().min(1),
  destination: z.string().min(1),
  transportType: z.enum(["car", "plane", "train", "bus"]),
  travelType: z.enum(["educational", "beach", "gastronomic", "ecological", "business", "extreme", "event"]),
  startDate: z.string(),
  endDate: z.string(),
  budget: z.number().positive(),
  currency: z.enum(["RUB", "USD", "EUR"]).default("RUB"),
  adults: z.number().int().min(1).default(1),
  children: z.number().int().min(0).default(0),
  accommodationType: z.enum(["hotel", "hostel", "apartment", "resort"]).optional(),
  accommodationStars: z.number().int().min(1).max(5).optional(),
  dietaryPreferences: z.array(z.string()).optional(),
  activities: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export const saveTripSchema = z.object({
  title: z.string().min(1),
  origin: z.string().min(1),
  destination: z.string().min(1),
  plan: z.unknown(),
});

export const tripSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  origin: z.string(),
  destination: z.string(),
  plan: z.unknown(),
  createdAt: z.string(),
});

export type GenerateTripInput = z.infer<typeof generateTripSchema>;
export type SaveTripInput = z.infer<typeof saveTripSchema>;
export type TripResponse = z.infer<typeof tripSchema>;
