import React from "react";
import { Routes, Route } from "react-router-dom";
import Homepage from "./Homepage.jsx";
import Signin from "./Signin.jsx";
import Signup from "./Signup.jsx";
import Dashboard from "./Dashboard.jsx";


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
