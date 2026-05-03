import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
                <MapPin className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-display text-lg font-semibold text-white">RUseen</span>
            </div>
            <p className="text-sm leading-relaxed">
              AI-планировщик путешествий по России. Создавайте идеальные маршруты за минуты.
            </p>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Навигация</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Главная</Link></li>
              <li><Link to="/planner" className="hover:text-white transition-colors">Планировщик</Link></li>
              <li><Link to="/saved-trips" className="hover:text-white transition-colors">Мои поездки</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Популярные направления</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white transition-colors cursor-pointer">Санкт-Петербург</li>
              <li className="hover:text-white transition-colors cursor-pointer">Казань</li>
              <li className="hover:text-white transition-colors cursor-pointer">Сочи</li>
              <li className="hover:text-white transition-colors cursor-pointer">Байкал</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-6 text-xs text-center">
          © {new Date().getFullYear()} RUseen. Все права защищены.
        </div>
      </div>
    </footer>
  );
}
