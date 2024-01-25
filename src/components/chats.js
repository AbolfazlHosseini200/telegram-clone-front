import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "./chats.css"
const ChatList = () => {
    const [chats, setChats] = useState([]);
    const authToken = localStorage.getItem('authToken');
    const username = localStorage.getItem('username');
    const navigate = useNavigate()
    useEffect(() => {
        const fetchChats = async () => {
            try {
                // Fetch the list of chats
                const chatResponse = await axios.get('http://localhost:8888/get-chats',{
                    headers: {
                        'Authorization': `bearer ${authToken}`
                    }
                });
                const chatData = chatResponse.data.chats;
                // Fetch user pictures for each chat
                const chatsWithPictures = await Promise.all(chatData.map(async (chat) => {
                    const users = chat.Users.split("&")
                    let contact
                    if (users[0] == username){
                        contact = users[1]
                    }else {
                        contact = users[0]
                    }
                    const pictureResponse = await axios.get(`http://localhost:8888/get-profile-pic/${contact}-profilePic.jpg`);
                    return { ...chat, userPicture: pictureResponse.data.picture, contact };
                }));

                setChats(chatsWithPictures);
            } catch (error) {
                console.error('Failed to fetch chats:', error);
            }
        };

        fetchChats();
        }, []);

    return (
        <div className="chat-list">
            <div className="chat-header">
                <span className="header-title">Chats</span>
                <div className="search-container">
                    <input type="text" placeholder="Search user" className="search-input" />
                    <button className="search-button">🔍</button>
                </div>
                <div className="header-buttons">
                    <button className="header-button">Contacts👥</button>
                    <button  className="new-conversation-button">start new conversation</button>
                </div>
            </div>
            {chats.map((chat) => (
                <div key={chat.contact} className="chat-item" onClick={() => {navigate("/chats/"+chat.ID)}}>
                    <img src={`http://localhost:8888/get-profile-pic/${chat.contact}-profilePic.jpg`} className="user-picture" />
                    <div className="user-info">
                        <div className="user-name">{chat.contact}</div>
                        <div className={`user-status ${chat.online ? 'online' : 'offline'}`}>
                            {chat.online ? 'online' : 'offline'}
                        </div>
                    </div>
                    {/* Add red notification dot here if there are unread messages */}
                    {/*{chat.unread && <div className="unread-dot"></div>}*/}
                </div>
                ))}
        </div>
        );
};

export default ChatList;

