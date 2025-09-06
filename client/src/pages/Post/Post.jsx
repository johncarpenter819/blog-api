import React, { useEffect, useState } from "react";
import { fetchComments, createPost } from "../../services/api";
import PostList from "../../components/PostList/PostList";
import "../../components/PostList/PostList";
import "./Post.css";

const PostPage = ({ posts, user, onPostCreated }) => {
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
      const postWithAuthor = {
        ...newPost,
        author: { username: user.username },
      };

      setTitle("");
      setContent("");

      if (onPostCreated && newPost.id) onPostCreated(postWithAuthor);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="post-page">
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

        <PostList posts={posts} comments={comments} />
      </div>
    </main>
  );
};

export default PostPage;
