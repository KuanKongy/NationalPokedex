import { Routes, Route } from "react-router-dom";
import WildPokemon from "./pages/WildPokemon";
import TrainerProfile from "./pages/TrainerProfile";
import EvolutionChecker from "./pages/EvolutionChecker";
import Map from "./pages/RegionMap";
import PokemonInfo from "./pages/PokemonInfo";
import WildPokemonColumns from "./components/WildPokemonColumns";
import TrainerPage from "./pages/TrainerPage";


function App() {
  return (
    <Routes>
      <Route path="/" element={<WildPokemon />} /> 
      <Route path="/list" element={<WildPokemonColumns />} /> 
      <Route path="/trainer" element={<TrainerProfile />} />
      <Route path="/trainerpage" element={<TrainerPage />} />
      <Route path="/evolution" element={<EvolutionChecker />} />
      <Route path="/regionmap" element={<Map />} />
      <Route path="/statistics" element={<PokemonInfo />} />
    </Routes>
  );
}

export default App;
