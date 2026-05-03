import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.js";
import Footer from "./components/Footer.js";
import Home from "./pages/Home.js";
import Planner from "./pages/Planner.js";
import Details from "./pages/Details.js";
import Results from "./pages/Results.js";
import SavedTrips from "./pages/SavedTrips.js";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/details" element={<Details />} />
          <Route path="/results" element={<Results />} />
          <Route path="/saved-trips" element={<SavedTrips />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
