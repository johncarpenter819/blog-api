const { prismaClient, PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.create({
    data: {
      username: "player1",
      email: "player1@none.com",
      password: "password123",
    },
  });
  const user2 = await prisma.user.create({
    data: {
      username: "player2",
      email: "player2@none.com",
      password: "password123",
    },
  });

  const post1 = await prisma.post.create({
    data: {
      title: "Top 5 Indie Gems",
      content: "Check out these amazing indie games",
      rating: 4.8,
      editorsPick: true,
      category: "Indie Gems",
      authorId: user1.id,
      createdAt: new Date(),
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: "RPGs You Should not miss",
      content: "Will keep you busy for hours",
      rating: 4.8,
      editorsPick: false,
      category: "RPG",
      authorId: user2.id,
      createdAt: new Date(),
    },
  });

  await prisma.comment.createMany({
    data: [
      { content: "Great list", postId: post1.id, userId: user2.id },
      { content: "Love these games", postId: post1.id, userId: user1.id },
      { content: "Can not wait to try!", postId: post2.id, userId: user1.id },
    ],
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
