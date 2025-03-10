import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from "./components/Authentication/Login";
import Signup from "./components/Authentication/Signup";
import ForgotPassword from "./components/Authentication/ForgotPassword";
import Profile from "./components/Profile/Profile";
import Settings from "./components/Profile/Settings";
import HomeFeed from "./components/HomeFeed/HomeFeed";
import CreatePost from "./components/Posts/CreatePost";
import PostDetails from "./components/Posts/PostDetails";
import Stories from "./components/Stories/Stories";
import Reels from "./components/Stories/Reels";
import LiveStream from "./components/Stories/LiveStream";
import FriendsList from "./components/Friends/FriendsList";
import Followers from "./components/Friends/Followers";
import Chat from "./components/Messaging/Chat";
import MessageList from "./components/Messaging/MessageList";
import Notifications from "./components/Notifications/Notifications";
import Payments from "./components/Monetization/Payments";
import Subscriptions from "./components/Monetization/Subscriptions";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import Department from "./components/Department/Department";
import Role from "./components/Role/Role";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api"; // Change to your Django server URL

export const registerUser = async (email, password) => {
    return axios.post(`${API_URL}/register/`, { email, password });
};

export const loginUser = async (email, password) => {
    return axios.post(`${API_URL}/login/`, { email, password });
};

export const getHomePage = async (token) => {
    return axios.get(`${API_URL}/home/`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/home" element={<HomeFeed />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/post/:id" element={<PostDetails />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/reels" element={<Reels />} />
        <Route path="/live" element={<LiveStream />} />
        <Route path="/friends" element={<FriendsList />} />
        <Route path="/followers" element={<Followers />} />
        <Route path="/messages" element={<MessageList />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/department" element={<Department />} />  
        <Route path="/role" element={<Role />} />
      </Routes>
    </Router>
  );
}

export default App;
