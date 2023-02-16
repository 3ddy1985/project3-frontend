import React, { useState, useEffect } from "react";
import { findMyPosts, findPosts } from "../users/api";
import Post from "../posts/Post";
import CreatePost from "../posts/CreatePost"

const Feed = ( {currentUser, profilePage} ) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (currentUser.id) {
      profilePage ? findMyPosts(currentUser.id)
        .then((response) => {
          setPosts(response.data.posts);
        })
        .catch((error) => {
          console.error("Error fetching posts:", error);
        })     
      
      : findPosts()
        .then((response) => {
          setPosts(response.data.posts.map((post) => post._id));
        })
        .catch((error) => {
          console.error("Error fetching posts:", error);
        });
      }
  }, []);

  return (
    <div>
      <h1>My Blog Posts</h1>
      {posts.map((postId) => (
        <Post key={postId} postId={postId} />                
      ))}
      {profilePage && <CreatePost currentUser={currentUser}/>}      

    </div>
  );
};

export default Feed;