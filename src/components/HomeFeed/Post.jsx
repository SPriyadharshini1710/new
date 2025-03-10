import React from "react";
import "./Post.css";

const Post = ({ thumbnail, title, description }) => {
  return (
    <div className="post-card">
      <img src={thumbnail} alt="Post Thumbnail" className="post-thumbnail" />
      <div className="post-info">
        <h4 className="post-title">{title}</h4>
        <p className="post-description">{description}</p>
      </div>
    </div>
  );
};

export default Post;
