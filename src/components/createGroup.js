import axios from 'axios';
import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom'

const CreateGroup = () => {
  const authToken = localStorage.getItem('authToken');
  const [usernames, setUsernames] = useState([]);
  const [chatName, setChatName] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const navigate = useNavigate()

  const handleAddUser = () => {
    if (usernameInput && !usernames.includes(usernameInput)) {
      setUsernames([...usernames, usernameInput]);
      setUsernameInput('');
    }
  };

  const handleRemoveUser = (index) => {
    const newUsernames = [...usernames];
    newUsernames.splice(index, 1);
    setUsernames(newUsernames);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let all_users = ""
    for (let i = 0 ; i < usernames.length ; i++){
        all_users = all_users + usernames[i] + "&"
    }
    axios.post("http://localhost:8888/create-group",{
        "receivers":all_users,
        "name":chatName
    },
    {
        headers:{
            'Authorization':`bearer ${authToken}`
        }
    })
    navigate("/chats")
  };

  return (
    <div>
      <h2>Create Chat Group</h2>
      <div>
        <input
          type="text"
          value={chatName}
          onChange={(e) => setChatName(e.target.value)}
          placeholder="Chat Name"
        />
      </div>
      <div>
        <input
          type="text"
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
          placeholder="Add Username"
        />
        <button onClick={handleAddUser}>Add User</button>
      </div>
      {usernames.length > 0 && (
        <ul>
          {usernames.map((username, index) => (
            <li key={index}>
              {username} <button onClick={() => handleRemoveUser(index)}>x</button>
            </li>
          ))}
        </ul>
      )}
      <button onClick={handleSubmit} disabled={!chatName || usernames.length === 0}>
        Create Group
      </button>
    </div>
  );
};

export default CreateGroup;
