import React, { useState } from "react";

const CreatePost = () => {
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Post Created:", content);
    setContent(""); // Clear input after posting
  };

  return (
    <div style={{ padding: "20px", border: "1px solid #ddd", marginBottom: "10px" }}>
      <h3>Create a Post</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          rows="4"
          cols="50"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <br />
        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default CreatePost;
