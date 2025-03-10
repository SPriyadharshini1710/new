import React, { useState } from "react";

const Subscriptions = () => {
  const [subscriptions] = useState([
    { id: 1, plan: "Basic", price: "$5/month", status: "Active" },
    { id: 2, plan: "Premium", price: "$15/month", status: "Inactive" },
  ]);

  return (
    <div style={{ padding: "20px", border: "1px solid #ddd", maxWidth: "400px" }}>
      <h3>Subscriptions</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {subscriptions.map((sub) => (
          <li
            key={sub.id}
            style={{
              padding: "10px",
              borderBottom: "1px solid #ccc",
              backgroundColor: sub.status === "Active" ? "#d4edda" : "#f8d7da",
            }}
          >
            <strong>{sub.plan}</strong> - {sub.price} ({sub.status})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Subscriptions;
