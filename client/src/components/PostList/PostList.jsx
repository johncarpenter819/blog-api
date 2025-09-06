import React, { useEffect, useState } from "react";
import CommentList from "../CommentList/CommentList";
import { fetchComments } from "../../services/api";
import { createPost } from "../../services/api";
import "./PostList.css";

const PostList = ({ posts, user, onPostCreated }) => {
  const [comments, setComments] = useState({});
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!posts.length) return;
    posts.forEach((post) => {
      if (!comments[post.id]) {
        fetchComments(post.id)
          .then((data) => setComments((prev) => ({ ...prev, [post.id]: data })))
          .catch(console.error);
      }
    });
  }, [posts, comments]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    setLoading(true);
    setError("");

    try {
      const newPost = await createPost({ title, content }, user.token);

      setTitle("");
      setContent("");

      if (onPostCreated && newPost.id) onPostCreated(newPost);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-list">
      <h1>Posts</h1>
      <section className="create-post-section">
        <h2>Create a Post</h2>
        {user ? (
          <form onSubmit={handleCreatePost} className="create-post-form">
            <input
              type="text"
              placeholder="Post Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Write your post..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Posting..." : "Create Post"}
            </button>
            {error && <p className="error">{error}</p>}
          </form>
        ) : (
          <p>You must be logged in to create a post.</p>
        )}
      </section>

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
    </div>
  );
};

export default PostList;
