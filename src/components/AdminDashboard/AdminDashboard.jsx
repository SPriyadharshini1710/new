import React from "react";

const AdminDashboard = () => {
  const stats = {
    users: 1200,
    posts: 3400,
    reports: 45,
    revenue: "$15,000",
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", border: "1px solid #ddd" }}>
      <h2>Admin Dashboard</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
        <div style={{ padding: "10px", background: "#f8f9fa", borderRadius: "5px" }}>
          <h4>Total Users</h4>
          <p>{stats.users}</p>
        </div>
        <div style={{ padding: "10px", background: "#f8f9fa", borderRadius: "5px" }}>
          <h4>Total Posts</h4>
          <p>{stats.posts}</p>
        </div>
        <div style={{ padding: "10px", background: "#f8f9fa", borderRadius: "5px" }}>
          <h4>Reports</h4>
          <p>{stats.reports}</p>
        </div>
        <div style={{ padding: "10px", background: "#f8f9fa", borderRadius: "5px" }}>
          <h4>Revenue</h4>
          <p>{stats.revenue}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
