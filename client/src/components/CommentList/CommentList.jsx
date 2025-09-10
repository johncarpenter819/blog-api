import React from "react";
import "../../pages/Post/Post.css";

const CommentList = ({ comments, user, onCommentDeleted }) => {
  if (!comments || comments.length === 0) return <p>No Comments</p>;

  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <div key={comment.id} className="comment-item">
          <p>
            <strong>{comment.username}</strong>: {comment.content}
          </p>
          {user?.username === comment.username && onCommentDeleted && (
            <button
              className="delete-comment-btn"
              onClick={() => onCommentDeleted(comment.id)}
            >
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentList;
