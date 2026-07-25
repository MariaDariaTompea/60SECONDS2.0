const db = require("../database/dbContext");
const { literal } = require('sequelize')

class communityRepository
{
    constructor(db)
    {
        this.community_posts = db.community_posts;
        this.community_likes = db.community_likes;
        this.community_comments = db.community_comments;
        this.Users = db.Users;
    }

    voteAttributes(userId) {
        const safeUserId = Number(userId)

        return [
            [
                literal(`(
                    SELECT COUNT(*) FROM community_likes AS cl
                    WHERE cl.entity_id = community_posts.id
                      AND cl.entity_type = 'post' AND cl.like_type = 'like'
                )`),
                'likeCount',
            ],
            [
                literal(`(
                    SELECT COUNT(*) FROM community_likes AS cl
                    WHERE cl.entity_id = community_posts.id
                      AND cl.entity_type = 'post' AND cl.like_type = 'dislike'
                )`),
                'dislikeCount',
            ],
            [
                literal(
                    Number.isInteger(safeUserId)
                        ? `(
                            SELECT cl.like_type FROM community_likes AS cl
                            WHERE cl.entity_id = community_posts.id
                              AND cl.entity_type = 'post' AND cl.user_id = ${safeUserId}
                            LIMIT 1
                          )`
                        : 'NULL',
                ),
                'myVote',
            ],
        ]
    }

    async createPost({ userId, title, description, content }) {
        return this.community_posts.create({
            user_id: userId,
            title,
            description,
            content,
        });
    }

    async getPosts(userId = null) {
        return await this.community_posts.findAll({
            attributes: {
                include: [
                    [
                        literal(`(
                            SELECT COUNT(*) FROM community_comments AS cc
                            WHERE cc.post_id = community_posts.id
                        )`),
                        'commentCount',
                    ],
                    ...this.voteAttributes(userId),
                ],
            },
            include: [{ model: this.Users, attributes: ['id', 'username', 'avatar'] }],
            order: [['createdAt', 'DESC']],
        })
    }

    async getPostById(id, userId = null) {
        return this.community_posts.findByPk(id, {
            attributes: {
                include: [
                    [
                        literal(`(
                            SELECT COUNT(*) FROM community_comments AS cc
                            WHERE cc.post_id = community_posts.id
                        )`),
                        'commentCount',
                    ],
                    ...this.voteAttributes(userId),
                ],
            },
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

    async findVote({ userId, entityId, entityType }) {
        return await this.community_likes.findOne({
            where: { user_id: userId, entity_id: entityId, entity_type: entityType },
        })
    }

    async createVote({ userId, entityId, entityType, likeType }) {
        return await this.community_likes.create({
            user_id: userId,
            entity_id: entityId,
            entity_type: entityType,
            like_type: likeType,
        })
    }

    async updateVote(id, likeType) {
        return await this.community_likes.update({ like_type: likeType }, { where: { id } })
    }

    async deleteVote(id) {
        return await this.community_likes.destroy({ where: { id } })
    }

    async getVoteCounts({ entityId, entityType }) {
        const likes = await this.community_likes.count({
            where: { entity_id: entityId, entity_type: entityType, like_type: 'like' },
        })
        const dislikes = await this.community_likes.count({
            where: { entity_id: entityId, entity_type: entityType, like_type: 'dislike' },
        })
        return { likes, dislikes }
    }
}

module.exports = new communityRepository(db);