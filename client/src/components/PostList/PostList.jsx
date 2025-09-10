import React, { useState } from "react";
import CommentList from "../CommentList/CommentList";
import {
  FaThumbsUp,
  FaHeart,
  FaThumbsDown,
  FaShare,
  FaComment,
} from "react-icons/fa";
import "../../pages/Post/Post.css";
import { reactToPost } from "../../services/api";

const PostList = ({
  posts = [],
  comments = {},
  user,
  onPostUpdated,
  onPostDeleted,
  onPostReacted,
  onCommentAdded,
  onCommentDeleted,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [commentInputs, setCommentInputs] = useState({});

  const handleEdit = (post) => {
    const newTitle = prompt("Edit title:", post.title);
    const newContent = prompt("Edit content:", post.content);

    if (newTitle !== null && newContent !== null) {
      const updatedPost = { ...post, title: newTitle, content: newContent };
      onPostUpdated(updatedPost);
    }
  };

  const handleDelete = (post) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      onPostDeleted(post.id);
    }
  };

  const handleReact = async (post, reactionType) => {
    if (!user || isLoading) return;

    setIsLoading(true);

    try {
      const response = await reactToPost(post.id, reactionType, user.token);
      if (onPostReacted && response.post) {
        onPostReacted(response.post);
      }
    } catch (err) {
      console.error("Failed to react:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = (postId) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    onCommentAdded(postId, text);
    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
  };

  const handleDeleteComment = async (commentId, postId) => {
    if (!window.confirm("Are you sure you want to delete this comment")) return;
    try {
      await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setCommentInputs((prev) => ({ ...prev }));
      if (onCommentDeleted) onCommentDeleted(postId, commentId);
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  const getUserReaction = (post) => {
    return (post.reactions || []).find(
      (reaction) => reaction.userId === user?.id
    );
  };

  const hasUserReacted = (post, reactionType) => {
    const userReaction = getUserReaction(post);
    return userReaction?.type === reactionType;
  };

  const countReactions = (post) => {
    const counts = { like: 0, love: 0, hate: 0, repost: 0 };
    (post.reactions || []).forEach((reaction) => {
      if (counts[reaction.type] !== undefined) {
        counts[reaction.type]++;
      }
    });
    return counts;
  };

  return (
    <section className="all-post-section">
      {posts.map((post) => {
        const counts = countReactions(post);
        const postComments = comments?.[post.id] || [];

        return (
          <div key={post.id} className="post">
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <p>
              <em>Author: {post.author?.username}</em>
            </p>

            {user && user.username === post.author?.username && (
              <div className="post-actions">
                <button onClick={() => handleEdit(post)}>Edit</button>
                <button onClick={() => handleDelete(post)}>Delete</button>
              </div>
            )}

            {user && (
              <div className="post-reactions">
                <button
                  onClick={() => handleReact(post, "like")}
                  disabled={isLoading}
                  className={hasUserReacted(post, "like") ? "active" : ""}
                >
                  <FaThumbsUp
                    size={20}
                    color={hasUserReacted(post, "like") ? "blue" : "#888"}
                  />{" "}
                  {counts.like}
                </button>
                <button
                  onClick={() => handleReact(post, "love")}
                  disabled={isLoading}
                  className={hasUserReacted(post, "love") ? "active" : ""}
                >
                  <FaHeart
                    size={20}
                    color={hasUserReacted(post, "love") ? "red" : "#888"}
                  />{" "}
                  {counts.love}
                </button>
                <button
                  onClick={() => handleReact(post, "hate")}
                  disabled={isLoading}
                  className={hasUserReacted(post, "hate") ? "active" : ""}
                >
                  <FaThumbsDown
                    size={20}
                    color={hasUserReacted(post, "hate") ? "black" : "#888"}
                  />{" "}
                  {counts.hate}
                </button>
                <button
                  onClick={() => handleReact(post, "repost")}
                  disabled={isLoading}
                  className={hasUserReacted(post, "repost") ? "active" : ""}
                >
                  <FaShare
                    size={20}
                    color={hasUserReacted(post, "repost") ? "green" : "#888"}
                  />{" "}
                  {counts.repost}
                </button>
              </div>
            )}
            <div className="post-comments">
              {user && (
                <div className="add-comment">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentInputs[post.id] || ""}
                    onChange={(e) =>
                      setCommentInputs((prev) => ({
                        ...prev,
                        [post.id]: e.target.value,
                      }))
                    }
                  />
                  <button onClick={() => handleAddComment(post.id)}>
                    Post
                  </button>
                </div>
              )}
              {postComments.length > 0 && <hr style={{ margin: "10px 0" }} />}
              <h4>
                <FaComment style={{ marginRight: "5px" }} />
                Comments ({postComments.length})
              </h4>
              <CommentList
                comments={postComments}
                user={user}
                onCommentDeleted={(commentId) =>
                  handleDeleteComment(commentId, post.id)
                }
              />
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default PostList;
