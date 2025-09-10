import React from "react";
import "./Home.css";

const Home = ({ posts }) => {
  const mostDiscussed = [...posts]
    .sort((a, b) => b.comments?.length - a.comments?.length)
    .slice(0, 4);

  const highestRated = [...posts]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  const newPosts = [...posts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  return (
    <main className="home-page">
      <section className="trending">
        <h2>Trending</h2>
        <TrendingSubsection title="Most Discussed" posts={mostDiscussed} />
        <TrendingSubsection title="Highest Rated" posts={highestRated} />
        <TrendingSubsection title="New & Noteworthy" posts={newPosts} />
      </section>
      <CategoriesSection posts={posts} />
    </main>
  );
};

const TrendingSubsection = ({ title, posts }) => {
  return (
    <div className="trending-subsection">
      <h3>{title}</h3>
      <div className="trending-cards">
        {posts.map((post) => (
          <a key={post.id} href={`/posts/${post.id}`} className="trending-card">
            <h4>{post.title}</h4>
            <p className="card-author">By: {post.author?.username}</p>
            <p className="card-content">{post.content.substring(0, 80)}...</p>
          </a>
        ))}
      </div>
    </div>
  );
};

const CategoriesSection = ({ posts }) => {
  const categories = [...new Set(posts.map((p) => p.category))];

  return (
    <section className="categories">
      <h2>Categories</h2>
      <div className="category-cards">
        {categories.map((cat) => (
          <a key={cat} href={`/categories/${cat}`} className="category-card">
            {cat}
          </a>
        ))}
      </div>
    </section>
  );
};

export default Home;
