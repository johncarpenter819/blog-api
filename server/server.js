const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const userRoutes = require("./routes/userRoutes");
const reactionRoutes = require("./routes/reactionRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes, reactionRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/users", userRoutes);

app.listen(5000, () => console.log(`Server is running on port 5000`));
