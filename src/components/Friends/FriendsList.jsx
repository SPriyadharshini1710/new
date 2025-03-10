import React from "react";

const FriendsList = () => {
  const friends = ["Alice", "Bob", "Charlie", "David"];

  return (
    <div style={{ padding: "20px", border: "1px solid #ddd", marginBottom: "10px" }}>
      <h3>Friends List</h3>
      <ul>
        {friends.map((friend, index) => (
          <li key={index}>{friend}</li>
        ))}
      </ul>
    </div>
  );
};

export default FriendsList;
