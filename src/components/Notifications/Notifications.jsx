import React, { useState } from "react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Alice liked your post", read: false },
    { id: 2, message: "Bob started following you", read: false },
    { id: 3, message: "Charlie commented on your photo", read: true },
  ]);

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  return (
    <div style={{ padding: "20px", border: "1px solid #ddd", maxWidth: "400px" }}>
      <h3>Notifications</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {notifications.map((notif) => (
          <li
            key={notif.id}
            style={{
              padding: "10px",
              borderBottom: "1px solid #ccc",
              backgroundColor: notif.read ? "#f0f0f0" : "#fff",
              cursor: "pointer",
            }}
            onClick={() => markAsRead(notif.id)}
          >
            {notif.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
