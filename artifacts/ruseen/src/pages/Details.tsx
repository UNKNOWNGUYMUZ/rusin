import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, MapPin, ArrowRight, ArrowLeft, ExternalLink } from "lucide-react";
import { useTripStore } from "../store/tripStore.js";
import type { Hotel, Attraction } from "../store/tripStore.js";

export default function Details() {
  const navigate = useNavigate();
  const { currentPlan, formData, selectedHotel, setSelectedHotel } = useTripStore();

  if (!currentPlan) {
    navigate("/planner");
    return null;
  }

  const total = selectedHotel
    ? selectedHotel.totalPrice + (currentPlan.budgetBreakdown.food + currentPlan.budgetBreakdown.transport + currentPlan.budgetBreakdown.activities)
    : currentPlan.budgetBreakdown.total;

  return (
    <div className="pt-16 pb-24 min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="relative h-72 md:h-96 bg-slate-800 overflow-hidden">
        <img
          src="https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt={currentPlan.destination}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
        <div className="absolute bottom-6 left-6 text-white">
          <div className="flex items-center gap-2 text-sm text-white/70 mb-1">
            <MapPin className="w-3.5 h-3.5" />
            {formData.origin} → {currentPlan.destination}
          </div>
          <h1 className="font-display text-4xl font-bold">{currentPlan.destination}</h1>
          <p className="text-white/80 mt-1">{currentPlan.summary}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Hotels */}
        <section className="mb-10">
          <h2 className="font-semibold text-xl text-slate-900 mb-4">Отели</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {currentPlan.hotels.map((hotel: Hotel) => (
              <motion.div
                key={hotel.name}
                whileHover={{ y: -2 }}
                onClick={() => setSelectedHotel(selectedHotel?.name === hotel.name ? null : hotel)}
                className={`flex-shrink-0 w-72 rounded-2xl border-2 cursor-pointer transition-all overflow-hidden ${
                  selectedHotel?.name === hotel.name
                    ? "border-blue-600 shadow-lg shadow-blue-100"
                    : "border-slate-100 bg-white hover:border-blue-200"
                }`}
              >
                <div className={`p-1.5 text-center text-xs font-semibold ${
                  hotel.type === "budget" ? "bg-emerald-100 text-emerald-700" :
                  hotel.type === "mid" ? "bg-blue-100 text-blue-700" :
                  "bg-amber-100 text-amber-700"
                }`}>
                  {hotel.type === "budget" ? "Эконом" : hotel.type === "mid" ? "Стандарт" : "Премиум"}
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-slate-900 text-sm leading-tight">{hotel.name}</h3>
                    <div className="flex items-center gap-0.5 ml-2">
                      {Array.from({ length: hotel.stars }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 mb-1">
                    {hotel.pricePerNight.toLocaleString("ru")} ₽
                    <span className="text-sm font-normal text-slate-500"> / ночь</span>
                  </p>
                  <p className="text-sm text-slate-500 mb-3">Итого: {hotel.totalPrice.toLocaleString("ru")} ₽</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {hotel.amenities.slice(0, 3).map((a) => (
                      <span key={a} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{a}</span>
                    ))}
                  </div>
                  <a
                    href={hotel.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Выбрать тариф <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Transport */}
        <section className="mb-10">
          <h2 className="font-semibold text-xl text-slate-900 mb-4">Транспорт</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentPlan.transport.options.map((opt) => (
              <div key={opt.title} className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-sm transition-shadow">
                <h3 className="font-semibold text-slate-900 mb-1">{opt.title}</h3>
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-2">
                  <span>{opt.duration}</span>
                  <span className="font-semibold text-slate-900">{opt.price.toLocaleString("ru")} ₽</span>
                </div>
                <p className="text-sm text-slate-500">{opt.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Attractions */}
        <section className="mb-10">
          <h2 className="font-semibold text-xl text-slate-900 mb-4">Экскурсии и достопримечательности</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {currentPlan.attractions.map((attr: Attraction) => (
              <div key={attr.title} className="flex-shrink-0 w-64 bg-white rounded-xl border border-slate-100 p-5 hover:shadow-sm transition-shadow">
                <h3 className="font-semibold text-slate-900 text-sm mb-2">{attr.title}</h3>
                <p className="text-xs text-slate-500 mb-3 leading-relaxed line-clamp-3">{attr.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">
                    {attr.cost === 0 ? "Бесплатно" : `${attr.cost.toLocaleString("ru")} ₽`}
                  </span>
                  {attr.bookingUrl && (
                    <a href={attr.bookingUrl} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                      Забронировать <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Fixed bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 shadow-xl px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={() => navigate("/planner")}
            className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад
          </button>
          <div className="text-center">
            <p className="text-xs text-slate-500">Итого</p>
            <p className="font-bold text-xl text-slate-900">{total.toLocaleString("ru")} ₽</p>
          </div>
          <button
            onClick={() => navigate("/results")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Продолжить
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
