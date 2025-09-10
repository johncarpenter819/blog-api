const prisma = require("../prismaClient");

const addComment = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  try {
    const comment = await prisma.comment.create({
      data: {
        content: text,
        postId: parseInt(id),
        userId: req.user?.id,
        username: req.user.username,
      },
      include: {
        user: true,
      },
    });
    res.json(comment);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to add comment", error: err.message });
  }
};

const deleteComment = async (req, res) => {
  const { id } = req.params;
  await prisma.comment.delete({ where: { id: parseInt(id) } });
  res.json({ message: "Comment deleted" });
};

const getCommentsForPost = async (req, res) => {
  const { id } = req.params;
  try {
    const comments = await prisma.comment.findMany({
      where: { postId: parseInt(id) },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(comments);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching comments", error: err.message });
  }
};

module.exports = { addComment, deleteComment, getCommentsForPost };
