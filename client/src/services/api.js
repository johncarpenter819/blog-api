const API_URL = "/api";

export const fetchUsers = async () => {
  const res = await fetch(`${API_URL}/users`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

export const fetchPosts = async () => {
  const res = await fetch(`${API_URL}/posts`);
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
};

export const fetchComments = async (postId) => {
  const res = await fetch(`${API_URL}/comments/${postId}`);
  if (!res.ok) throw new Error("Failed to fetch comments");
  return res.json();
};

export const fetchProtectedData = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch("/api/protected", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const createPost = async (postData, token) => {
  const res = await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(postData),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Failed to create post");
  }

  return res.json();
};

export const updatePost = async (postId, postData, token) => {
  const res = await fetch(`${API_URL}/posts/${postId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(postData),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Failed to update post. ");
  }
  return res.json();
};

export const deletePost = async (postId, token) => {
  const res = await fetch(`${API_URL}/posts/${postId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || " Failed to delete post.");
  }
  return res.json();
};

export const reactToPost = async (postId, reactionType, token) => {
  const res = await fetch(`${API_URL}/posts/${postId}/react`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ type: reactionType }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "failed to react to post.");
  }
  return res.json();
};

export const fetchPostById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/posts/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP Error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Could not fetch post:", error);
    throw error;
  }
};

export const createComment = async (postId, text, token) => {
  const res = await fetch(`${API_URL}/comments/${postId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) throw new Error("Failed to create comment");
  return res.json();
};
