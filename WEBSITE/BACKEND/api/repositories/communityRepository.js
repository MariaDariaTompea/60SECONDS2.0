const db = require("../database/dbContext");
const { Op } = require('sequelize')

class communityRepository
{
    constructor(db)
    {
        this.community_posts = db.community_posts;
        this.community_likes = db.community_likes;
        this.community_comments = db.community_comments;
        this.Users = db.Users;
    }

    async createPost({ userId, title, description, content }) {
        return this.community_posts.create({
            user_id: userId,
            title,
            description,
            content,
        });
    }

    async getPosts() {
        return this.community_posts.findAll({
            include: [
                {
                    model: this.Users,
                    attributes: ['id', 'username', 'avatar'],
                },
            ],
            order: [['pinned', 'DESC'], ['createdAt', 'DESC']],
        });
    }

    async getPostById(id) {
        return this.community_posts.findByPk(id, {
            include: [
                {
                    model: this.Users,
                    attributes: ['id', 'username', 'avatar'],
                },
            ],
        });
    }

    async createComment({ postId, userId, content, parentCommentId }) {
        return this.community_comments.create({
            post_id: postId,
            user_id: userId,
            content,
            parent_comment_id: parentCommentId,
        });
    }

    async getComments(postId) {
        return this.community_comments.findAll({
            where: { post_id: postId },
            include: [
                {
                    model: this.Users,
                    attributes: ['id', 'username', 'avatar'],
                },
            ],
            order: [['createdAt', 'ASC']],
        });
    }
}

module.exports = new communityRepository(db);