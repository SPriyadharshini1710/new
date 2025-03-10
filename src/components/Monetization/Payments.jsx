import React from "react";

const Payments = () => {
  const transactions = [
    { id: 1, amount: "$10.00", status: "Completed", date: "2025-02-15" },
    { id: 2, amount: "$25.00", status: "Pending", date: "2025-02-18" },
    { id: 3, amount: "$5.00", status: "Completed", date: "2025-02-12" },
  ];

  return (
    <div style={{ padding: "20px", border: "1px solid #ddd", maxWidth: "400px" }}>
      <h3>Payments</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #ccc" }}>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn) => (
            <tr key={txn.id} style={{ borderBottom: "1px solid #ccc" }}>
              <td>{txn.amount}</td>
              <td>{txn.status}</td>
              <td>{txn.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Payments;
