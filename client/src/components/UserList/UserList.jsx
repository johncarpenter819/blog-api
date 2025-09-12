import React, { useState, useEffect } from "react";

const UserList = ({ users, onUserSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users || []);

  useEffect(() => {
    const filtered = users.filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  return (
    <div className="user-list">
      <input
        type="text"
        className="user-search"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredUsers.length === 0 ? (
        <p className="no-users"> No Users Found</p>
      ) : (
        filteredUsers.map((user) => (
          <p
            key={user.id}
            className="user-item"
            onClick={() => onUserSelect(user)}
          >
            {user.username}
          </p>
        ))
      )}
    </div>
  );
};

export default UserList;
