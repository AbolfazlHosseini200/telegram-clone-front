import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'
import './Register.css'; // You should create a corresponding CSS file for styling

function Register() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        bio: '',
        phone: '',
        username: '',
        password: '',
        image: null
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };
    
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create an instance of FormData
        const dataToSend = new FormData();
        for (const key in formData) {
            dataToSend.append(key, formData[key]);
        }

        // Check if an image was added and append it to FormData
        if (formData.image) {
            dataToSend.append('file', formData.image, formData.image.name);
        }

        // Use axios to send a POST request
        try {
            const response = await axios.post('http://localhost:8888/register', dataToSend);

            console.log('Success:', response.data);
            navigate('/login')
            // Handle success, perhaps redirect to login or clear form
        } catch (error) {
            console.error('Error during registration:', error.response ? error.response.data : error.message);
            // Handle errors, show user feedback
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="First Name"
                    required
                />
                <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Last Name"
                    required
                />
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Username"
                    required
                />
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    required
                />
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone"
                />
                <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Bio"
                />
                <input
                    type="file"
                    name="image"
                    onChange={handleImageChange}
                    accept="image/*"
                />
                <button type="submit" className='register-button'>Register</button>
            </form>
            <div className="login-button-container">
                <Link to="/login">Login</Link>
            </div>
        </div>
        );
}

export default Register;
