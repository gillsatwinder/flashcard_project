import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
    const navigate = useNavigate();
  return (
    <div className="signup-page">
      <div className="signup-box">
        <h1 className="brand-name">BRAINFLIP</h1>
        <form className="signup-form">
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <input type="password" placeholder="Confirm Password" />
          <button type="button" onClick={() => navigate("/dashboard")}>Sign Up</button>
        </form>
        <p className="signin-text">
          Already have an account? <button type= "button" onClick={() => navigate("/signin")}>Back to Sign In</button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
