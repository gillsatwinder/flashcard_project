import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "./Signin.css";

const Signin = () => {
    const navigate = useNavigate();
  return (
    <div className="signin-page">
      <div className="signin-box">
        <h1 className="brand-name">BRAINFLIP</h1>
        <form className="signin-form">
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button type="button" onClick={() => navigate("/dashboard")}>Sign In</button>
        </form>
        <p className="signup-text">
          Don’t have an account? <button type="button" onClick={() => navigate("/signup")}>Signup</button>
        </p>
      </div>
    </div>
  );
};

export default Signin;
