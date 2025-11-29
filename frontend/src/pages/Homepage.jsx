import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "../styles/Homepage.css";
import Footer from "../components/Footer";

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      {/* Top bar */}
      <header className="top-bar">
        <div className="brand-name">
          <span className="brain-icon">🧠</span>
          BrainFlip
        </div>
        <button className="login-btn" onClick={() => navigate("/signin")}>Login</button>
      </header>

      {/* Center content */}
      <main className="main-content">
        <div className="hero-section">
          <h1 className="hero-title">
            Flip Your Way to <span className="highlight">A's</span>
          </h1>
          <p className="hero-description">
            Master your learning with AI-powered flashcards, intelligent study tools,
            and real-time progress tracking. Study smarter, not harder.
          </p>

          <button className="cta-button" onClick={() => navigate("/signup")}>
            Get Started Free
          </button>
        </div>

        {/* Feature boxes */}
        <div className="features">
          <div className="feature-box">
            <div className="feature-icon">🤖</div>
            <h3>AI-Powered Learning</h3>
            <p>Generate flashcards instantly from any text or topic using advanced AI</p>
          </div>
          <div className="feature-box">
            <div className="feature-icon">📊</div>
            <h3>Progress Tracking</h3>
            <p>Visualize your learning journey with detailed analytics and insights</p>
          </div>
          <div className="feature-box">
            <div className="feature-icon">🎯</div>
            <h3>Smart Study Topics</h3>
            <p>Adaptive learning system that focuses on what you need to improve</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Homepage;
