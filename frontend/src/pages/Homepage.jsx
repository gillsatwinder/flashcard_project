/*  
Latest update: 10/21/25
*/
import React from "react";
import {useNavigate } from "react-router-dom"; //delete unused imports
import "../styles/Homepage.css"; //change the path as needed

const Homepage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="homepage">
      {/* Top bar */}
      <header className="top-bar">
        <div className="brand-name">BrainFlip</div>
        <button className="login-btn" onClick={()=> navigate("/signin")}>Login</button>
      </header>

      {/* Center content */}
      <main className="main-content">
        <h1>BrainFlip: Flip Your Way to A's</h1>
        <p>Master your learning with AI-powered tools and progress tracking.</p>

        {/* Feature boxes */}
        <div className="features">
          <div className="feature-box">AI Learning</div>
          <div className="feature-box">Progress Tracking</div>
          <div className="feature-box">Smart Study Topics</div>
        </div>
      </main>
    </div>
  );
};

export default Homepage;
