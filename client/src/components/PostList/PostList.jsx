import React, { useEffect, useState } from "react";
import CommentList from "../CommentList/CommentList";
import { fetchComments } from "../../services/api";


const PostList =({ posts }) => {
    const [comments, setComments] = useState({});

    useEffect(() => {
        if(!posts.length) return;
        posts.forEach((post) => {
            if(!comments[post.id]) {
            fetchComments(post.id)
            .then((data) => setComments((prev) => ({ ...prev, [post.id]: data })))
            .catch(console.error);
            }
        });
    }, [posts, comments]);

    return(
        <div className="post-list">
            <h2>Posts</h2>
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
        </div>
    );
};

export default PostList;