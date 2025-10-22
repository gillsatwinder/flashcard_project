import React from "react";
import { Routes, Route } from "react-router-dom";

import Homepage from "./pages/Homepage.jsx";
import Signin from "./pages/Signin.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AllCoursesView from "./pages/AllCoursesView.jsx";
import CoursePage from "./pages/CoursePage.jsx";
import DeckPage from "./pages/DeckPage.jsx";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />

      {/* merged parts */}
      <Route path="/dashboard" element={<Dashboard />} >
        <Route index element={<AllCoursesView />} /> {/* Default view for /courses */}
        <Route path="course/:courseId" element={<CoursePage />} /> {/* Course page */}
        <Route path="course/:courseId/deck/:deckId" element={<DeckPage />} /> {/* Deck page */}
      </Route>
    </Routes>
  );
}

export default App;