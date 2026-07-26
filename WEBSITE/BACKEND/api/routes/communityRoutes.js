const express = require('express')
const router = express.Router()
const communityController = require('../controllers/communityController')
const authMiddleware = require('../middleware/authMiddleware')
const optionalAuth = require('../middleware/optionalAuth')

router.post('/posts', authMiddleware, communityController.createPost)
router.get('/posts', optionalAuth, communityController.getPosts)
router.get('/posts/:id', optionalAuth, communityController.getPostById)

router.post('/posts/:id/comments', authMiddleware, communityController.createComment)
router.get('/posts/:id/comments', communityController.getComments)

router.post('/likes', authMiddleware, communityController.toggleVote)

module.exports = router