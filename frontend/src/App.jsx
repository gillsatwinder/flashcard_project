import React from "react";
import { Routes, Route } from "react-router-dom";
import Homepage from "./homepage/Homepage.jsx";
import Signin from "./pages/signin/Signin.jsx";
import Signup from "./pages/signup/Signup.jsx";
import Dashboard from "./dashboard/Dashboard.jsx";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/signin" element={<Signin />} />
       <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
