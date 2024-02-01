import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import "./chatpage.css"
function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [file, setFile] = useState(null);
    const { chatid } = useParams();
    const authToken = localStorage.getItem('authToken');
    const username = localStorage.getItem('username');
    const [imageUrls, setImageUrls] = useState({});
    

    // Function to fetch messages
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
    const fetchMessages = async () => {
        try {
            const response = await axios.get(`http://localhost:8888/get-messages/${chatid}`,{
                headers: {
                    'Authorization': `bearer ${authToken}`
                }
            });
            console.log(response.data)
            setMessages(response.data.messages);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const fetchImage = async (fileUrl, messageId) => {
        try {
            const response = await axios.get(`http://localhost:8888/get-file/${chatid}/${fileUrl.split("/")[1]}`, {
                headers: {
                    'Authorization': `bearer ${authToken}`
                },
                responseType: 'blob'
            });
            setImageUrls(prevUrls => ({ ...prevUrls, [messageId]: URL.createObjectURL(response.data) }));
        } catch (error) {
            console.error('Error fetching image:', error);
        }
    };
    useEffect(() => {
        messages.forEach(message => {
            if (message.File && !imageUrls[message.id]) {
                fetchImage(message.File, message.id);
            }
        });
        }, [messages, imageUrls]);
    // Function to send a new message
    const sendMessage = async () => {
        if (newMessage.trim() || file) {
            const formData = new FormData();
            if (file) {
                formData.append('file', file);
            } else {
                formData.append('text', newMessage);
            }

            try {
                await axios.post(`http://localhost:8888/send-message/${chatid}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `bearer ${authToken}`
                    }
                });
                setNewMessage('');
                setFile(null);
                fetchMessages(); // Fetch messages again to update the list
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };
    // Fetch messages when the component mounts or chatId changes
    useEffect(() => {
        fetchMessages();
        }, [chatid]);

    return (
        <div>
            <div>
                
            </div>
            <div className="messages-list">
                {messages.map((message, index) => (
                    <div>
                        <span>----------------------------{create_date(message.CreatedAt)}--------------------------------</span>
                    <div key={index}>
                        {message.Sender === username ? "You" : message.Sender}: {message.Text}
                        {message.File && imageUrls[message.id] && (
                            <img src={imageUrls[message.id]} alt="Chat Attachment" />
                            )}
                    </div>
                    </div>
                    ))}
            </div>
            <div className="message-input">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
        );
}

export default ChatPage;
