import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPostById } from "../../services/api";
import "./PostDetail.css";

const PostDetail = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const getPost = async () => {
      try {
        const fetchedPost = await fetchPostById(id);
        setPost(fetchedPost);
      } catch (err) {
        setError("Failed to fetch post.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getPost();
  }, [id]);

  if (loading) {
    return <div>Loading post...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!post) {
    return <div>Post not found.</div>;
  }

  return (
    <div className="post-detail-container">
      <h2>{post.title}</h2>
      <p>
        <strong>Author:</strong> {post.author?.username}
      </p>
      <p>{post.content}</p>
    </div>
  );
};

export default PostDetail;
