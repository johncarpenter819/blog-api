const prisma = require("../prismaClient");

const reactToPost = async (req, res) => {
  const { postId } = req.params;
  const { type } = req.body;
  const userId = parseInt(req.user.id, 10);
  const postIdInt = parseInt(postId, 10);

  try {
    const postExists = await prisma.post.findUnique({
      where: { id: postIdInt },
      include: { reactions: true },
    });

    if (!postExists) {
      return res.status(404).json({ message: "Post not found" });
    }

    const existingReaction = await prisma.reaction.findUnique({
      where: { userId_postId: { userId, postId: postIdInt } },
    });

    if (existingReaction) {
      if (existingReaction.type === type) {
        await prisma.reaction.delete({ where: { id: existingReaction.id } });
      } else {
        await prisma.reaction.update({
          where: { id: existingReaction.id },
          data: { type },
        });
      }
    } else {
      await prisma.reaction.create({
        data: { type, userId, postId: postIdInt },
      });
    }

    // Fetch the updated post with reactions
    const updatedPost = await prisma.post.findUnique({
      where: { id: postIdInt },
      include: { reactions: true },
    });

    return res.json({ message: "Reaction updated", post: updatedPost });
  } catch (error) {
    console.error("Prisma error in reactToPost:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getReactionsByPost = async (req, res) => {
  const { postId } = req.params;
  try {
    const reactions = await prisma.reaction.findMany({
      where: { postId: parseInt(postId, 10) },
      select: { type: true, userId: true },
    });
    res.json(reactions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { reactToPost, getReactionsByPost };
