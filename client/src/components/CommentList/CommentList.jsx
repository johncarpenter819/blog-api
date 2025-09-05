import React from "react";


const CommentList = ({ comments }) =>{
    if(!comments || comments.length === 0) return <p>No Comments</p>;

    return(
        <div className="comment list">
            {comments.map((comment) => (
                <p key={comment.id}>
                    {comment.username}: {comment.content}
                </p>
            ))}
        </div>
    );
};

export default CommentList;