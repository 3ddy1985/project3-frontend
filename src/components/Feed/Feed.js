import React, { useState, useEffect } from "react";
import { findPosts } from "../users/api";
import Post from "../posts/Post";

const Feed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    findPosts()
      .then((response) => {
        setPosts(response.data.posts);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }, [posts]);

  return (
    <div>
      <h1>My Blog Posts</h1>
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
};

export default Feed;