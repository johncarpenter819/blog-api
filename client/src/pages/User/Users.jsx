import React, { useState } from "react";
import UserList from "../../components/UserList/UserList";
import PostList from "../../components/PostList/PostList";
import "./Users.css";

const Users = ({
  users,
  posts,
  user,
  onPostUpdated,
  onPostDeleted,
  onPostReacted,
  onCommentAdded,
  onCommentDeleted,
}) => {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <main className="users-page">
      <div className="user-page">
        {!selectedUser ? (
          <UserList users={users} onUserSelect={setSelectedUser} />
        ) : (
          <div className="user-post">
            <button className="back-btn" onClick={() => setSelectedUser(null)}>
              Back to Users
            </button>
            <h2 className="user-post-title">{selectedUser.username}'s Posts</h2>
            {posts.filter((post) => post.authorId === selectedUser.id)
              .length === 0 ? (
              <p className="no-posts">No post found for this user.</p>
            ) : (
              <PostList
                posts={posts.filter(
                  (post) => post.authorId === selectedUser.id
                )}
                user={user}
                onPostUpdated={onPostUpdated}
                onPostDeleted={onPostDeleted}
                onPostReacted={onPostReacted}
                onCommentAdded={onCommentAdded}
                onCommentDeleted={onCommentDeleted}
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default Users;
