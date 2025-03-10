import React from "react";
import Sidebar from "./Sidebar";
import Post from "./Post";
import Explore from "./Explore";
import Header from "./Header";
import Footer from "./Footer";
import "./HomeFeed.css";

const dummyPosts = [
  {
    id: 1,
    thumbnail: "https://source.unsplash.com/300x180/?nature",
    title: "Amazing Nature View",
    description: "A beautiful scene of mountains and rivers.",
  },
  {
    id: 2,
    thumbnail: "https://source.unsplash.com/300x180/?tech",
    title: "Latest Tech Gadgets",
    description: "Exploring the newest innovations in technology.",
  },
  {
    id: 3,
    thumbnail: "https://source.unsplash.com/300x180/?city",
    title: "City Life Vibes",
    description: "Experience the hustle and bustle of urban life.",
  },
];

const HomeFeed = () => {
  return (
    <div className="home-container">
      {/* Header */}
      <Header />

      {/* Main content area */}
      <div className="content">
        <Sidebar />

        <div className="feed">
          <h2>Home Feed</h2>
          <div className="post-grid">
            {dummyPosts.map((post) => (
              <Post key={post.id} {...post} />
            ))}
          </div>
        </div>

        <Explore />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomeFeed;
