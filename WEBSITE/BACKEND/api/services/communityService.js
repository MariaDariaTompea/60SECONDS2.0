const communityRepository = require('../repositories/communityRepository')

class communityService
{
    async createPost({ userId, title, description, content }) {
        return await communityRepository.createPost({ userId, title, description, content })
    }

    async getPosts(userId) {
        return await communityRepository.getPosts(userId)
    }

    async getPostById(id, userId) {
        return await communityRepository.getPostById(id, userId)
    }

    async createComment({ postId, userId, content, parentCommentId }) {
        return await communityRepository.createComment({ postId, userId, content, parentCommentId })
    }

    async getComments(postId) {
        return await communityRepository.getComments(postId)
    }

    async toggleVote({ userId, entityId, entityType, likeType }) {
        const existing = await communityRepository.findVote({ userId, entityId, entityType })

        let myVote = likeType

        if (!existing) {
            await communityRepository.createVote({ userId, entityId, entityType, likeType })
        } else if (existing.like_type === likeType) {
            await communityRepository.deleteVote(existing.id)
            myVote = null
        } else {
            await communityRepository.updateVote(existing.id, likeType)
        }

        const counts = await communityRepository.getVoteCounts({ entityId, entityType })

        return { ...counts, myVote }
    }
}
module.exports = new communityService();