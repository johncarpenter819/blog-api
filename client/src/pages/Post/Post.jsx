import React, { useEffect, useState } from "react";

import {
  fetchComments,
  createPost,
  updatePost,
  deletePost,
  reactToPost,
  createComment,
} from "../../services/api";
import PostList from "../../components/PostList/PostList";
import "./Post.css";

const PostPage = ({ posts, user, onPostCreated, setPosts }) => {
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

  // Create a new post
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

  // Update a post
  const handlePostUpdated = async (updatedPost) => {
    try {
      const response = await updatePost(
        updatedPost.id,
        updatedPost,
        user.token
      );
      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.id === updatedPost.id ? { ...post, ...response } : post
        )
      );
    } catch (err) {
      console.error("Failed to update post", err);
    }
  };

  // Delete a post
  const handlePostDeleted = async (postId) => {
    try {
      await deletePost(postId, user.token);
      setPosts((currentPosts) =>
        currentPosts.filter((post) => post.id !== postId)
      );
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
  };

  // React to a post
  const handlePostReacted = (updatedPost) => {
    const postWithAuthor = {
      ...updatedPost,
      author:
        updatedPost.author ||
        posts.find((p) => p.id === updatedPost.id)?.author,
    };

    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === updatedPost.id ? postWithAuthor : post
      )
    );
  };

  const handleCommentAdded = async (postId, text) => {
    if (!user) return;

    try {
      const newComment = await createComment(postId, text, user.token);
      setComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newComment],
      }));
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  const handleCommentDeleted = (postId, commentId) => {
    setComments((prev) => {
      const existing = prev?.[postId] || [];
      const updated =
        prev[postId]?.filter((comment) => comment.id !== commentId) || [];
      return { ...prev, [postId]: updated };
    });
  };

  return (
    <main className="post-page">
      <div className="post-list">
        <h1>Posts</h1>

        {/* Create Post Form */}
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

        {/* Post List */}
        <PostList
          posts={posts}
          comments={comments}
          user={user}
          onPostUpdated={handlePostUpdated}
          onPostDeleted={handlePostDeleted}
          onPostReacted={handlePostReacted}
          onCommentAdded={handleCommentAdded}
          onCommentDeleted={handleCommentDeleted}
        />
      </div>
    </main>
  );
};

export default PostPage;
