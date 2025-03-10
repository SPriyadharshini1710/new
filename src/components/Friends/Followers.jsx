import React from "react";

const Followers = () => {
  const followers = ["Eve", "Frank", "Grace", "Hannah"];

  return (
    <div style={{ padding: "20px", border: "1px solid #ddd", marginBottom: "10px" }}>
      <h3>Followers</h3>
      <ul>
        {followers.map((follower, index) => (
          <li key={index}>{follower}</li>
        ))}
      </ul>
    </div>
  );
};

export default Followers;
