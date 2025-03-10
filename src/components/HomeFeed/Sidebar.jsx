import React from "react";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div style={{ width: "250px", padding: "20px", background: "#f4f4f4" }}>
      <h3>Sidebar</h3>
      <ul>
        <li>Home</li>
        <li>Trending</li>
        <li>Following</li>
      </ul>
    </div>
  );
};

export default Sidebar;
