import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Calendar, Users, Wallet, ArrowRight, Loader as Loader2 } from "lucide-react";
import { useTripStore } from "../store/tripStore.js";

const transportTypes = [
  { value: "car", label: "Автомобиль" },
  { value: "plane", label: "Самолёт" },
  { value: "train", label: "Поезд" },
  { value: "bus", label: "Автобус" },
] as const;

const travelTypes = [
  { value: "educational", label: "Познавательный" },
  { value: "beach", label: "Пляжный" },
  { value: "gastronomic", label: "Гастрономический" },
  { value: "ecological", label: "Экологический" },
  { value: "business", label: "Деловой" },
  { value: "extreme", label: "Экстремальный" },
  { value: "event", label: "Событийный" },
] as const;

const accommodationTypes = [
  { value: "hotel", label: "Отель" },
  { value: "hostel", label: "Хостел" },
  { value: "apartment", label: "Апартаменты" },
  { value: "resort", label: "Курорт" },
] as const;

export default function Planner() {
  const navigate = useNavigate();
  const { formData, setFormData, setCurrentPlan, setIsGenerating, isGenerating } = useTripStore();

  const [form, setForm] = useState({
    origin: formData.origin ?? "",
    destination: formData.destination ?? "",
    transportType: formData.transportType ?? "train",
    travelType: formData.travelType ?? "educational",
    startDate: formData.startDate ?? "",
    endDate: formData.endDate ?? "",
    budget: formData.budget ?? 50000,
    currency: formData.currency ?? "RUB",
    adults: formData.adults ?? 2,
    children: formData.children ?? 0,
    accommodationType: formData.accommodationType ?? "hotel",
    accommodationStars: formData.accommodationStars ?? 3,
    notes: formData.notes ?? "",
  });

  const update = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormData(form as Parameters<typeof setFormData>[0]);
    setIsGenerating(true);
    try {
      const res = await fetch("/api/trips/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, budget: Number(form.budget) }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setCurrentPlan(data.plan);
      navigate("/details");
    } catch (err) {
      alert("Ошибка генерации маршрута: " + (err instanceof Error ? err.message : "Неизвестная ошибка"));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <h1 className="font-display text-4xl font-bold text-slate-900 mb-3">Планировщик поездки</h1>
          <p className="text-slate-500 text-lg">Заполните параметры — AI составит идеальный маршрут</p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-5"
          >
            <h2 className="flex items-center gap-2 font-semibold text-slate-900 mb-5">
              <MapPin className="w-5 h-5 text-blue-600" />
              Маршрут
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Откуда</label>
                <input
                  type="text"
                  value={form.origin}
                  onChange={(e) => update("origin", e.target.value)}
                  placeholder="Москва"
                  required
                  className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Куда</label>
                <input
                  type="text"
                  value={form.destination}
                  onChange={(e) => update("destination", e.target.value)}
                  placeholder="Санкт-Петербург"
                  required
                  className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">Транспорт</label>
              <div className="flex flex-wrap gap-2">
                {transportTypes.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => update("transportType", t.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                      form.transportType === t.value
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">Тип отдыха</label>
              <div className="flex flex-wrap gap-2">
                {travelTypes.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => update("travelType", t.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                      form.travelType === t.value
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-5"
          >
            <h2 className="flex items-center gap-2 font-semibold text-slate-900 mb-5">
              <Calendar className="w-5 h-5 text-blue-600" />
              Даты
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Дата начала</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => update("startDate", e.target.value)}
                  required
                  className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Дата окончания</label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => update("endDate", e.target.value)}
                  required
                  className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-5"
          >
            <h2 className="flex items-center gap-2 font-semibold text-slate-900 mb-5">
              <Users className="w-5 h-5 text-blue-600" />
              Путешественники
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Взрослых</label>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => update("adults", Math.max(1, form.adults - 1))}
                    className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors font-medium">−</button>
                  <span className="text-lg font-semibold text-slate-900 w-6 text-center">{form.adults}</span>
                  <button type="button" onClick={() => update("adults", form.adults + 1)}
                    className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors font-medium">+</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Детей</label>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => update("children", Math.max(0, form.children - 1))}
                    className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors font-medium">−</button>
                  <span className="text-lg font-semibold text-slate-900 w-6 text-center">{form.children}</span>
                  <button type="button" onClick={() => update("children", form.children + 1)}
                    className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors font-medium">+</button>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-5"
          >
            <h2 className="flex items-center gap-2 font-semibold text-slate-900 mb-5">
              <Wallet className="w-5 h-5 text-blue-600" />
              Бюджет и жильё
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Бюджет</label>
                <input
                  type="number"
                  value={form.budget}
                  onChange={(e) => update("budget", Number(e.target.value))}
                  min={1000}
                  required
                  className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Валюта</label>
                <select
                  value={form.currency}
                  onChange={(e) => update("currency", e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="RUB">₽ Рубль</option>
                  <option value="USD">$ Доллар</option>
                  <option value="EUR">€ Евро</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Тип жилья</label>
              <div className="flex flex-wrap gap-2">
                {accommodationTypes.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => update("accommodationType", t.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                      form.accommodationType === t.value
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Звёздность отеля: {form.accommodationStars}★
              </label>
              <input
                type="range"
                min={1}
                max={5}
                value={form.accommodationStars}
                onChange={(e) => update("accommodationStars", Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8"
          >
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Дополнительные пожелания</label>
            <textarea
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              placeholder="Например: хотим посетить театры, интересует местная кухня..."
              rows={3}
              className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </motion.div>

          <motion.button
            type="submit"
            disabled={isGenerating}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-blue-500/25"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Генерируем маршрут...
              </>
            ) : (
              <>
                Создать маршрут
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </form>
      </div>
    </div>
  );
}
