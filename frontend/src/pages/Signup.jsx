import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import '../styles/Signup.css';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords don't match!");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();
            console.log("Server response:", data); // Add this debug line

            if (response.ok) {
                navigate('/signin');
                console.log("Account created!: ", data);
              
            } else {
                alert(data.message || 'Error creating account');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to create account');
        }
    };



    return (
        <div className="signup-page">
            <div className="signup-box">
                <h1 className="brand-name">BRAINFLIP</h1>
                <form className="signup-form" onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        name="username"
                        placeholder="Name" 
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    <input 
                        type="email" 
                        name="email"
                        placeholder="Email" 
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input 
                        type="password" 
                        name="password"
                        placeholder="Password" 
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <input 
                        type="password" 
                        name="confirmPassword"
                        placeholder="Confirm Password" 
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">Sign Up</button>
                </form>
                <p className="signin-text">
                    Already have an account? <button type="button" onClick={() => navigate("/signin")}>Back to Sign In</button>
                </p>
            </div>
        </div>
    );
};

export default Signup;