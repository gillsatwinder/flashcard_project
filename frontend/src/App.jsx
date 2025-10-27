import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage.jsx";
import Signin from "./pages/Signin.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AllDecksView from "./pages/AllDecksView.jsx"; 
import DeckPage from "./pages/DeckPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<AllDecksView />} /> 
        <Route path="deck/:deckId" element={<DeckPage />} /> 
      </Route>
    </Routes>
  );
}

export default App;
