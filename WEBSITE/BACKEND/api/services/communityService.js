const communityRepository = require('../repositories/communityRepository')

class communityService
{
    async createPost({ userId, title, description, content }) {
        return await communityRepository.createPost({ userId, title, description, content })
    }

    async getPosts() {
        return await communityRepository.getPosts()
    }

    async getPostById(id) {
        return await communityRepository.getPostById(id)
    }

    async createComment({ postId, userId, content, parentCommentId }) {
        return await communityRepository.createComment({ postId, userId, content, parentCommentId })
    }

    async getComments(postId) {
        return await communityRepository.getComments(postId)
    }
}
module.exports = new communityService();