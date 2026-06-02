import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import StylePage from "./pages/StylePage";
import MapPage from "./pages/MapPage";
import ProfilePage from "./pages/ProfilePage";

function LogbookPage() {
  return <h1 className="text-2xl font-semibold text-stone-800">Logbook</h1>;
}

function FavoritesPage() {
  return <h1 className="text-2xl font-semibold text-stone-800">Favorites</h1>;
}

function App() {
  return (
    <main className="mx-auto flex h-screen w-full flex-col overflow-hidden">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="/logbook" element={<LogbookPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/styleguide" element={<StylePage />} />
        </Routes>
      </div>
      <Navbar />
    </main>
  );
}

export default App;
