import React from "react";

const Stories = () => {
  return (
    <div style={{ padding: "20px", border: "1px solid #ddd", marginBottom: "10px" }}>
      <h3>Stories</h3>
      <p>View recent stories from your friends.</p>
      <div style={{ display: "flex", gap: "10px" }}>
        <div style={{ width: "80px", height: "80px", background: "#eee", borderRadius: "50%" }}></div>
        <div style={{ width: "80px", height: "80px", background: "#eee", borderRadius: "50%" }}></div>
        <div style={{ width: "80px", height: "80px", background: "#eee", borderRadius: "50%" }}></div>
      </div>
    </div>
  );
};

export default Stories;
