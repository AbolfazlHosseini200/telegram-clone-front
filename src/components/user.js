import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import "./user.css"
function User() {
    const [userData, setUserData] = useState({
        firstname: '',
        lastname: '',
        username: '',
        bio: '',
    });
    const [inputValue, setInputValue] = useState('');
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };
    const authToken = localStorage.getItem('authToken');
    const { username } = useParams();
    const navigate = useNavigate()
    const handleAddToContact = async () => {
        await axios.post("http://localhost:8888/add-contact", {
            username,
            "name":inputValue
        },{
            headers:{
                'Authorization': `bearer ${authToken}`
            }
        }
        )
        navigate("/chats")
    }
    const handleStartChat = async () => {
        const chatResponse = await axios.post('http://localhost:8888/start-chat',{
                "receiver":username
            }, {
            headers: {
                'Authorization': `bearer ${authToken}`
            }
        });
        navigate("/chats")
    }
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Replace 'your-endpoint-url' with the actual endpoint URL
                const response = await axios.post('http://localhost:8888/search',{
                    username
                },{
                    headers: {
                        'Authorization': `bearer ${authToken}`
                    }
                });
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
        }, []);

    // Replace 'path-to-profile-picture' with the actual path or URL to the user's profile picture

    return (
        <div className="user-profile">
            <img src={`http://localhost:8888/get-profile-pic/${username}-profilePic.jpg`} alt="User Profile" className="profile-picture" />
            <h1>{userData.username}</h1>
            <p><b>First Name:</b> {userData.firstname}</p>
            <p><b>Last Name:</b> {userData.lastname}</p>
            <p><b>Bio:</b> {userData.bio}</p>
            <button onClick={handleStartChat}>Start New Conversation</button>
            <input
                type="text"
                placeholder="contact name"
                className="search-input"
                value={inputValue}
                onChange={handleInputChange}
            />
            <button onClick={handleAddToContact}>Add to Contacts</button>
        </div>
        );
}

export default User;
