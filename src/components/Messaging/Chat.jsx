import React, { useState } from "react";

const Chat = () => {
  const [messages, setMessages] = useState([
    { sender: "Alice", text: "Hey, how are you?" },
    { sender: "You", text: "I'm good! How about you?" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages([...messages, { sender: "You", text: newMessage }]);
      setNewMessage("");
    }
  };

  return (
    <div style={{ padding: "20px", border: "1px solid #ddd", maxWidth: "400px" }}>
      <h3>Chat</h3>
      <div style={{ height: "200px", overflowY: "auto", border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
        {messages.map((msg, index) => (
          <p key={index} style={{ textAlign: msg.sender === "You" ? "right" : "left" }}>
            <strong>{msg.sender}:</strong> {msg.text}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
        style={{ width: "70%", padding: "5px" }}
      />
      <button onClick={sendMessage} style={{ padding: "5px 10px", marginLeft: "5px" }}>Send</button>
    </div>
  );
};

export default Chat;
