import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react"; 
import Homepage from "./pages/Homepage.jsx";
import Signin from "./pages/Signin.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AllDecksView from "./pages/AllDecksView.jsx";
import DeckPage from "./pages/DeckPage.jsx";



function App() {
  const [currentUser, setCurrentUser] = useState(null);


  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');


    if (savedUser) {  setCurrentUser(JSON.parse(savedUser)); }
  }, []);

  
  const loginUser = (userData) => {   setCurrentUser(userData);   localStorage.setItem('currentUser', JSON.stringify(userData));  };

  
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/signin" element={<Signin onLogin={loginUser} />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/dashboard" element={<Dashboard currentUser={currentUser} />}>
        <Route index element={<AllDecksView />} />
        <Route path="deck/:deckId" element={<DeckPage currentUser={currentUser} />} />
      </Route>
    </Routes>
  );
}

export default App;
