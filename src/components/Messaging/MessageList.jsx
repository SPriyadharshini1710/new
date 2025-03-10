import React from "react";

const MessageList = () => {
  const conversations = [
    { name: "Alice", lastMessage: "Hey, how are you?" },
    { name: "Bob", lastMessage: "Are you free today?" },
    { name: "Charlie", lastMessage: "Check out this cool post!" },
  ];

  return (
    <div style={{ padding: "20px", border: "1px solid #ddd", maxWidth: "300px" }}>
      <h3>Messages</h3>
      <ul style={{ listStyle: "none", padding: "0" }}>
        {conversations.map((chat, index) => (
          <li key={index} style={{ padding: "10px", borderBottom: "1px solid #ccc", cursor: "pointer" }}>
            <strong>{chat.name}</strong>
            <p style={{ margin: "5px 0", color: "#555" }}>{chat.lastMessage}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessageList;
