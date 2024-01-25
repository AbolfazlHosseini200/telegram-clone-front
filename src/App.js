import Login from "./components/login";
import Register from "./components/register";
import ChatList from "./components/chats";
import ChatPage from "./components/chatpage"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                {/* Redirect to login by default */}
                <Route path="/" element={<Navigate replace to="/login" />} />
                <Route path="/chats" element={<ChatList />} />
                <Route path="/chats/:chatid" element={<ChatPage />} />
            </Routes>
        </Router>
    );
}

export default App;
