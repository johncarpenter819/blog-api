const express = require("express");
const router = express.Router();
const {
  reactToPost,
  getReactionsByPost,
} = require("../controllers/reactionController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/:postId/react", authMiddleware, reactToPost);
router.get("/:postId/reactions", getReactionsByPost);

module.exports = router;
