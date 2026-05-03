import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Save, MapPin, Sun, Coffee, Moon, Loader as Loader2 } from "lucide-react";
import { useTripStore } from "../store/tripStore.js";
import type { DayPlan, Activity } from "../store/tripStore.js";

const periodIcons = {
  morning: Coffee,
  afternoon: Sun,
  evening: Moon,
};

const periodLabels = {
  morning: "Утро",
  afternoon: "День",
  evening: "Вечер",
};

export default function Results() {
  const navigate = useNavigate();
  const { currentPlan, formData, selectedHotel } = useTripStore();
  const [activeDay, setActiveDay] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!currentPlan) {
    navigate("/planner");
    return null;
  }

  const day = currentPlan.days[activeDay] as DayPlan | undefined;

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${formData.origin} → ${currentPlan.destination}`,
          origin: formData.origin ?? "",
          destination: currentPlan.destination,
          plan: { ...currentPlan, selectedHotel },
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setSaved(true);
      setTimeout(() => navigate("/saved-trips"), 1500);
    } catch (err) {
      alert("Ошибка сохранения: " + (err instanceof Error ? err.message : "Неизвестная ошибка"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-slate-50">
      {/* Sticky header */}
      <div className="sticky top-16 z-40 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
          <button
            onClick={() => navigate("/details")}
            className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад к деталям
          </button>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <MapPin className="w-4 h-4 text-blue-600" />
            {formData.origin} → {currentPlan.destination}
          </div>
          <button
            onClick={handleSave}
            disabled={saving || saved}
            className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saved ? "Сохранено!" : "Сохранить"}
          </button>
        </div>
      </div>

      {/* Day picker */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
            {currentPlan.days.map((d: DayPlan, i: number) => {
              const date = new Date(d.date);
              return (
                <button
                  key={i}
                  onClick={() => setActiveDay(i)}
                  className={`flex-shrink-0 flex flex-col items-center px-4 py-2.5 rounded-xl text-sm transition-all ${
                    activeDay === i
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span className="font-bold text-lg leading-none">{date.getDate()}</span>
                  <span className="text-xs opacity-80 mt-0.5">
                    {date.toLocaleDateString("ru", { weekday: "short" })}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timeline */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {day && (
                <motion.div
                  key={activeDay}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  {(["morning", "afternoon", "evening"] as const).map((period) => {
                    const activities = day[period] as Activity[];
                    if (!activities?.length) return null;
                    const Icon = periodIcons[period];
                    return (
                      <div key={period}>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                            <Icon className="w-4 h-4 text-blue-600" />
                          </div>
                          <h3 className="font-semibold text-slate-700">{periodLabels[period]}</h3>
                        </div>
                        <div className="space-y-3 ml-10">
                          {activities.map((act) => (
                            <div key={act.title} className="bg-white rounded-xl border border-slate-100 p-4 hover:shadow-sm transition-shadow">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-semibold text-slate-900 text-sm">{act.title}</h4>
                                <span className="flex-shrink-0 text-sm font-semibold text-slate-900">
                                  {act.cost === 0 ? "Бесплатно" : `${act.cost.toLocaleString("ru")} ₽`}
                                </span>
                              </div>
                              {act.address && (
                                <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {act.address}
                                </p>
                              )}
                              {act.description && (
                                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{act.description}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Budget sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-100 p-5 sticky top-36">
              <h3 className="font-semibold text-slate-900 mb-4">Бюджет поездки</h3>
              <div className="space-y-3">
                {[
                  { label: "Проживание", value: selectedHotel?.totalPrice ?? currentPlan.budgetBreakdown.accommodation },
                  { label: "Питание", value: currentPlan.budgetBreakdown.food },
                  { label: "Транспорт", value: currentPlan.budgetBreakdown.transport },
                  { label: "Активности", value: currentPlan.budgetBreakdown.activities },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">{item.label}</span>
                    <span className="font-medium text-slate-900">{item.value.toLocaleString("ru")} ₽</span>
                  </div>
                ))}
                <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
                  <span className="font-semibold text-slate-900">Итого</span>
                  <span className="font-bold text-lg text-blue-600">
                    {(
                      (selectedHotel?.totalPrice ?? currentPlan.budgetBreakdown.accommodation) +
                      currentPlan.budgetBreakdown.food +
                      currentPlan.budgetBreakdown.transport +
                      currentPlan.budgetBreakdown.activities
                    ).toLocaleString("ru")} ₽
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile save button */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4">
        <button
          onClick={handleSave}
          disabled={saving || saved}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold py-3.5 rounded-xl transition-colors"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saved ? "Сохранено!" : "Сохранить маршрут"}
        </button>
      </div>
    </div>
  );
}
