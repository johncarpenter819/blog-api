const prisma = require('../prismaClient');

const addComment = async (req, res) =>{
    const { id } = req.params;
    const { username, content } = req.body;

    const comment = await prisma.comment.create({
        data: {
            username,
            content,
            postId: parseInt(id),
            userId: req.user?.id,
        },
    });
    res.json(comment);
};

const deleteComment = async(req, res) =>{
    const { id } = req.params;
    await prisma.comment.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Comment deleted' });
};

const getCommentsForPost = async (req, res) =>{
    const { id } = req.params;
    try{
        const comments = await prisma.comment.findMany({
            where: { postId: parseInt(id) },
            include: { user: true },
            orderBy: { createdAt: 'desc' },
        });
        res.json(comments);
    } catch (err){
        res.status(500).json({ message: 'Error fetching comments', error: err.message });
    }
};

module.exports = { addComment, deleteComment, getCommentsForPost };