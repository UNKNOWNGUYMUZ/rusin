import { create } from "zustand";

interface TripPlan {
  destination: string;
  totalDays: number;
  summary: string;
  cityPhoto?: string;
  days: DayPlan[];
  hotels: Hotel[];
  transport: Transport;
  attractions: Attraction[];
  budgetBreakdown: BudgetBreakdown;
}

interface DayPlan {
  day: number;
  date: string;
  morning: Activity[];
  afternoon: Activity[];
  evening: Activity[];
}

interface Activity {
  title: string;
  address: string;
  cost: number;
  description: string;
}

interface Hotel {
  name: string;
  stars: number;
  pricePerNight: number;
  totalPrice: number;
  amenities: string[];
  pros: string[];
  bookingUrl: string;
  type: "budget" | "mid" | "premium";
}

interface Transport {
  type: string;
  options: TransportOption[];
}

interface TransportOption {
  title: string;
  duration: string;
  price: number;
  description: string;
}

interface Attraction {
  title: string;
  description: string;
  cost: number;
  bookingUrl: string;
}

interface BudgetBreakdown {
  accommodation: number;
  food: number;
  transport: number;
  activities: number;
  total: number;
}

interface TripFormData {
  origin: string;
  destination: string;
  transportType: "car" | "plane" | "train" | "bus";
  travelType: "educational" | "beach" | "gastronomic" | "ecological" | "business" | "extreme" | "event";
  startDate: string;
  endDate: string;
  budget: number;
  currency: "RUB" | "USD" | "EUR";
  adults: number;
  children: number;
  accommodationType?: "hotel" | "hostel" | "apartment" | "resort";
  accommodationStars?: number;
  notes?: string;
}

interface TripStore {
  formData: Partial<TripFormData>;
  currentPlan: TripPlan | null;
  selectedHotel: Hotel | null;
  isGenerating: boolean;
  setFormData: (data: Partial<TripFormData>) => void;
  setCurrentPlan: (plan: TripPlan) => void;
  setSelectedHotel: (hotel: Hotel | null) => void;
  setIsGenerating: (v: boolean) => void;
  reset: () => void;
}

export const useTripStore = create<TripStore>((set) => ({
  formData: {},
  currentPlan: null,
  selectedHotel: null,
  isGenerating: false,
  setFormData: (data) => set((s) => ({ formData: { ...s.formData, ...data } })),
  setCurrentPlan: (plan) => set({ currentPlan: plan }),
  setSelectedHotel: (hotel) => set({ selectedHotel: hotel }),
  setIsGenerating: (v) => set({ isGenerating: v }),
  reset: () => set({ formData: {}, currentPlan: null, selectedHotel: null }),
}));

export type { TripPlan, DayPlan, Activity, Hotel, Transport, Attraction, BudgetBreakdown, TripFormData };
