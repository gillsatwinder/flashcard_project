import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import '../styles/Signup.css';
import Footer from "../components/Footer";

// Validation regex patterns
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

// Signup component
const Signup = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});

    const validate = () => {
        const e = {};
        if (!name.trim()) e.name = "Name is required.";
        if (!email.trim()) e.email = "Email is required.";
        else if (!emailRegex.test(email)) e.email = "Enter a valid email address.";
        if (!password) e.password = "Password is required.";
        else if (!passwordRegex.test(password)) e.password = "Password must include at least one uppercase, one lowercase letter, and one digit.";
        if (!confirmPassword) e.confirmPassword = "Please confirm your password.";
        else if (password !== confirmPassword) e.confirmPassword = "Passwords do not match.";

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    // handle form submission; local navigation for now
    const handleSubmit = async(e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const response = await fetch("http://localhost:5000/user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    username: name,   // backend expects username
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Signup failed");
                return;
            }

            alert("Account created!");
            navigate("/signin");
        } catch (err) {
            console.error(err);
            alert("Error connecting to server");
        }
};
 
// JSX for signup page
    return (
        <div className="signup-page">
            <header className="top-bar">
                <div className="brand-name">
                    <span className="brain-icon">🧠</span>
                    BrainFlip
                </div>
                <button className="login-btn" onClick={() => navigate("/")}>home</button>
            </header>
            <div className="signup-container">
                <div className="signup-card">
                    <h1 className="header">Create Account</h1>
                    <form className="signup-form" onSubmit={handleSubmit} noValidate>
                        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                        {errors.name && <div style={{ color: '#ff6666', fontSize: '0.9rem', marginTop: '0.1px' }}>{errors.name}</div>}

                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        {errors.email && <div style={{ color: '#ff6666', fontSize: '0.9rem', marginTop: '0.1px' }}>{errors.email}</div>}

                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        {errors.password && <div style={{ color: '#ff6666', fontSize: '0.9rem', marginTop: '0.1px' }}>{errors.password}</div>}

                        <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        {errors.confirmPassword && <div style={{ color: '#ff6666', fontSize: '0.9rem', marginTop: '0.1px' }}>{errors.confirmPassword}</div>}

                        <button className="submit-btn" type="submit">Sign Up</button>
                    </form>
                    <p className="signin-text">
                        Already have an account? <button className="submit-btn" type="button" onClick={() => navigate("/signin")}>Back to Sign In</button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
