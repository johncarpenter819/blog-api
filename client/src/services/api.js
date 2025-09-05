const API_URL = "/api";

export const fetchUsers = async () =>{
    const res = await fetch(`${API_URL}/users`);
    if(!res.ok) throw new Error("Failed to fetch users");
    return res.json();
};

export const fetchPosts = async () =>{
    const res = await fetch(`${API_URL}/post`);
    if(!res.ok) throw new Error("Failed to fetch posts");
    return res.json();
};

export const fetchComments = async (postId) =>{
    const res = await fetch(`${API_URL}/comments/${postId}`);
    if(!res.ok) throw new Error("Failed to fetch comments");
    return res.json();
}

export const fetchProtectedData = async () =>{
    const token = localStorage.getItem("token");
    const res = await fetch("/api/protected", {
        headers: { Authorization: `Bearer ${token}`},
    });
    return res.json();
};