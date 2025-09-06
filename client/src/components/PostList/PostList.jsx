import React from "react";
import CommentList from "../CommentList/CommentList";

const PostList = ({ posts = [], comments = {} }) => {
  return (
    <section className="all-post-section">
      {posts.map((post) => (
        <div key={post.id} className="post">
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <p>
            <em>Author: {post.author?.username}</em>
          </p>
          <CommentList comments={comments[post.id] || []} />
        </div>
      ))}
    </section>
  );
};

export default PostList;
