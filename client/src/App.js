import React, { useEffect, useState } from "react";
import { fetchUsers, fetchPosts } from "./services/api";
import PostPage from "./pages/Post/Post";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Home from "./pages/Home/Home";
import Users from "./pages/User/Users";
import PostDetail from "./pages/Post/PostDetail";
import "@fontsource/libertinus-keyboard";
import { Route, Routes, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([fetchUsers(), fetchPosts()])
      .then(([userData, postData]) => {
        console.log("Fetched posts", postData);
        setUsers(userData.users || []);
        setPosts(postData || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setUsers([]);
        setPosts([]);
        setLoading(false);
      });

    const token = sessionStorage.getItem("token");
    const storedUser = sessionStorage.getItem("user");
    if (token && storedUser) {
      setUser({ token, ...JSON.parse(storedUser) });
    }
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        setUser(null);
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        navigate("/login");
        return;
      }

      const timeUntilExpiration = (decodedToken.exp - currentTime) * 1000;

      const timer = setTimeout(() => {
        setUser(null);
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        navigate("/login");
        console.log("Session expired. Redirecting to login.");
      }, timeUntilExpiration);

      return () => clearTimeout(timer);
    } catch (error) {
      console.error("Failed to decode token", error);
      setUser(null);
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);

  // useEffect(() => {
  //   const handleTabClose = () => {
  //     sessionStorage.removeItem("token");
  //     sessionStorage.removeItem("user");
  //     setUser(null);
  //   };

  //   window.addEventListener("unload", handleTabClose);

  //   return () => window.removeEventListener("unload", handleTabClose);
  // }, []);

  const handlePostCreated = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
    );
  };

  const handlePostDeleted = (postId) =>
    setPosts((prev) => prev.filter((p) => p.id !== postId));

  const handleCommentAdded = (postId, newComment) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...(post.comments || []), newComment] }
          : post
      )
    );
  };

  const handlePostReacted = (updatedPost) => {
    setPosts((prevPost) =>
      prevPost.map((p) =>
        p.id === updatedPost.id
          ? { ...updatedPost, comments: p.comments || [] }
          : p
      )
    );
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Navbar user={user} setUser={setUser} />
      {/* <div className="page-content"> */}
      <Routes>
        <Route path="/" element={<Home posts={posts} />} />
        <Route
          path="/posts"
          element={
            <PostPage
              posts={posts}
              user={user}
              onPostCreated={handlePostCreated}
              onPostUpdated={handlePostUpdate}
              onPostDeleted={handlePostDeleted}
              onCommentAdded={handleCommentAdded}
              setPosts={setPosts}
            />
          }
        />
        <Route
          path="/users"
          element={
            <Users
              users={users}
              posts={posts}
              user={user}
              onPostUpdated={handlePostUpdate}
              onPostDeleted={handlePostDeleted}
              onPostReacted={handlePostReacted}
              onCommentAdded={handleCommentAdded}
            />
          }
        />
        <Route path="/login" element={<Login setUser={setUser} />} />
        {/* <Route path="/about" element={<About />} /> */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/posts/:id" element={<PostDetail />} />
      </Routes>
      {/* </div> */}
      <Footer />
    </>
  );
}
export default App;
