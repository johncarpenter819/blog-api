const prisma = require('../prismaClient');

const getAllUsers = async(req, res) =>{
    try{
        const users = await prisma.user.findMany({
            select:{
                id: true,
                username: true,
                email: true,
                createdAt: true,
            },
        });
        res.json({ users });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
};

module.exports = { getAllUsers };