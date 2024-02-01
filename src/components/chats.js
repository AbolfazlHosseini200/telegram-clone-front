import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "./chats.css"
const ChatList = () => {
    const [chats, setChats] = useState([]);
    const authToken = localStorage.getItem('authToken');
    const username = localStorage.getItem('username');
    const navigate = useNavigate()
    const [inputValue, setInputValue] = useState('');
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSearchClick = () => {
        navigate("/profile/" + inputValue);
    };
    const handleProfileClick = (contact) => {
        navigate("/profile/"+contact)
    }
    const create_date = (date) => {
        const dateObject = new Date(date);

        const humanReadableDate = dateObject.toLocaleString('en-US', {
            day: 'numeric', // numeric, 2-digit
            year: 'numeric', // numeric, 2-digit
            month: 'long', // numeric, 2-digit, long, short, narrow
            hour: 'numeric', // numeric, 2-digit
            minute: 'numeric', // numeric, 2-digit
            timeZone: 'Asia/Tehran', // Set the timezone to Tehran
            hour12: true // true for AM/PM, false for 24-hour clock
        });
        return humanReadableDate
    }
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
                    <input
                        type="text"
                        placeholder="Search user"
                        className="search-input"
                        value={inputValue}
                        onChange={handleInputChange}
                    />
                    <button className="search-button" onClick={handleSearchClick}>
                        🔍
                    </button>
                </div>
                <div className="header-buttons">
                    <button className="header-button" onClick={()=>navigate("/contacts")}>Contacts👥</button>
                    {/* <button  className="new-conversation-button">start new conversation</button> */}
                    <button className='new-conversation-button' onClick={()=>navigate("/create-group")}>Create New Group</button>
                </div>
            </div>
            {chats.map((chat) => (
                <div key={chat.contact} className="chat-item" >
                    <img src={`http://localhost:8888/get-profile-pic/${chat.contact}-profilePic.jpg`} className="user-picture" onClick={()=>handleProfileClick(chat.contact)}/>
                    <div className="user-info" onClick={() => {navigate("/chats/"+chat.ID)}}>
                        <div className="user-name">{chat.ChatName?chat.ChatName:chat.contact}</div>
                        <div className={`user-status ${chat.online ? 'online' : 'offline'}`}>
                            {chat.online ? 'online' : 'offline'}
                        </div>
                    </div>
                    <div>
                        {create_date(chat.CreatedAt)}
                    </div>
                    {/* Add red notification dot here if there are unread messages */}
                    {/*{chat.unread && <div className="unread-dot"></div>}*/}
                </div>
                ))}
        </div>
        );
};

export default ChatList;

