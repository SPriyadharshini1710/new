import React from "react";
import { useParams } from "react-router-dom";

const PostDetails = () => {
  const { id } = useParams(); // Get post ID from URL

  return (
    <div style={{ padding: "20px", border: "1px solid #ddd" }}>
      <h3>Post Details</h3>
      <p>Viewing details for post ID: {id}</p>
      <p>This is where post details and comments would appear.</p>
    </div>
  );
};

export default PostDetails;
