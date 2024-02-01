import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "./contacts.css"
function Contacts() {
    const [contacts, setContacts] = useState([]);
    const authToken = localStorage.getItem('authToken');
    const navigate = useNavigate()
    // Function to fetch contacts from the endpoint
    const fetchContacts = async () => {
        try {
            const response = await axios.get('http://localhost:8888/get-contacts',{
                headers:{
                    'Authorization': `bearer ${authToken}`
                }
            });
            setContacts(response.data.contacts); // Assuming the data is an array of contacts
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    };
    const handleStartChat = async (username) => {
        const chatResponse = await axios.post('http://localhost:8888/start-chat',{
            "receiver":username
        }, {
            headers: {
                'Authorization': `bearer ${authToken}`
            }
        });
        navigate("/chats")
    }
    // Function to delete a contact
    const deleteContact = async (contactUsername) => {
        try {
            await axios.delete(`http://localhost:8888/delete-contact/${contactUsername}`,{
                headers:{
                    'Authorization': `bearer ${authToken}`
                }
            });
            // Refetch the contacts after deletion
            fetchContacts();
        } catch (error) {
            console.error('Error deleting contact:', error);
        }
    };

    // Fetch contacts on component mount
    useEffect(() => {
        fetchContacts();
        }, []);

    return (
        <div>
            <h1>Contacts</h1>
            <ul>
                {contacts.map((contact, index) => (
                    <li key={index}>
                        <img src={`http://localhost:8888/get-profile-pic/${contact.ContactUsername}-profilePic.jpg`} alt={contact.ContactName} onClick={() => navigate("/profile/"+contact.ContactUsername)}/>
                        <span>{contact.ContactName} ({contact.ContactUsername})</span>
                        <button onClick={() => handleStartChat(contact.ContactUsername)}>Start Conversation</button>
                        <button onClick={() => deleteContact(contact.ContactUsername)}>Delete</button>
                    </li>
                    ))}
            </ul>
        </div>
        );
}

export default Contacts;
