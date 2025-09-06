import React, { useEffect, useState } from "react";
import { fetchUsers, fetchPosts } from "./services/api";
import UserList from "./components/UserList/UserList";
import PostList from "./components/PostList/PostList";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Home from "./components/Home/Home";
import "@fontsource/libertinus-keyboard";
import { Route, Routes } from "react-router-dom";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

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

    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setUser({ token, ...JSON.parse(storedUser) });
    }
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <div className="page-content">
        <Routes>
          <Route path="/" element={<Home posts={posts} />} />
          <Route
            path="/posts"
            element={
              <PostList
                posts={posts}
                user={user}
                onPostCreated={handlePostCreated}
              />
            }
          />
          <Route path="/users" element={<UserList users={users} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          {/* <Route path="/about" element={<About />} /> */}
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}
export default App;
