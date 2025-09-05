import React from "react";


const UserList = ({ users }) => {
    if(!users || users.length === 0) return <p>No users found</p>;

    return(
        <div className="user-list">
            <h2>Users</h2>
            {users.map((user) => (
                <p key={user.id}>{user.username}</p>
            ))}
        </div>
    );
};

export default UserList;