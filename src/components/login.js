import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import './Login.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Hook to redirect after successful login

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // Replace 'https://your-api-domain.com/api/login' with your API endpoint
            const response = await axios.post('http://localhost:8888/login', {
                username,
                password
            });

            // If your API returns the token as part of the response body
            const token = response.data.token;

            // Store the token in localStorage or handle it the way you need
            localStorage.setItem('authToken', token);
            localStorage.setItem('username', username)
            // Redirect to another route upon successful login
            navigate('/chats'); // Replace '/home' with the path you want to redirect to
        } catch (error) {
            console.error('Login error:', error.response ? error.response.data : error.message);
            // Here you could set an error message in state and display it to the user
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Username:
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Password:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>
                </div>
                <button type="submit">Login</button>
            </form>
            <div className="register-button-container">
                <Link to="/register">Register</Link>
            </div>
        </div>
        );
}

export default Login;
