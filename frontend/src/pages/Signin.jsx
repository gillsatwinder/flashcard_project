import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "../styles/Signin.css";//change the path as needed

const Signin = ( { onLogin }) => {


  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });



  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({ email: formData.email, password: formData.password })

      });

      const data = await response.json();

      if (response.ok) { navigate('/dashboard');  console.log("Signed in successfully!: ", data);
        onLogin({ email: formData.email });  }

      else { alert(data.message || 'Incorrect login credentials.'); }

    }
    catch (error) {
      console.error('Error:', error);

    }
  }




  return (
    <div className="signin-page">
      <div className="signin-box">
        <h1 className="brand-name">BRAINFLIP</h1>
        <form className="signin-form" onSubmit={handleSubmit}>

          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />

          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />

          <button type="submit">Sign In</button>
        </form>
        <p className="signup-text">
          Don’t have an account? <button type="button" onClick={() => navigate("/signup")}>Signup</button>
        </p>
      </div>
    </div>
  );
};

export default Signin;
