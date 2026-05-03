import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Calendar, ArrowRight, BookMarked, Loader as Loader2 } from "lucide-react";
import { useTrips } from "@workspace/api-client-react";
import { useTripStore } from "../store/tripStore.js";

export default function SavedTrips() {
  const navigate = useNavigate();
  const { data: trips, isLoading, error } = useTrips();
  const { setCurrentPlan } = useTripStore();

  const handleOpen = (trip: { plan?: unknown }) => {
    if (!trip.plan) return;
    setCurrentPlan(trip.plan as Parameters<typeof setCurrentPlan>[0]);
    navigate("/results");
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-10">
          <h1 className="font-display text-4xl font-bold text-slate-900 mb-2">Мои поездки</h1>
          <p className="text-slate-500">Сохранённые маршруты</p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-red-700 text-sm">
            Ошибка загрузки поездок. Проверьте подключение к серверу.
          </div>
        )}

        {!isLoading && !error && (!trips || trips.length === 0) && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookMarked className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Нет сохранённых поездок</h3>
            <p className="text-slate-500 mb-6">Создайте свой первый маршрут</p>
            <button
              onClick={() => navigate("/planner")}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Создать маршрут
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {trips?.map((trip, i) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => handleOpen(trip)}
              className="bg-white rounded-2xl border border-slate-100 p-6 cursor-pointer hover:shadow-md hover:border-blue-100 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">{trip.title}</h3>
              <p className="text-sm text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(trip.createdAt).toLocaleDateString("ru", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
