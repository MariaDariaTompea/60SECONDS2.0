const express = require('express')
const router = express.Router()
const communityController = require('../controllers/communityController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/posts', authMiddleware, communityController.createPost)
router.get('/posts', communityController.getPosts)
router.get('/posts/:id', communityController.getPostById)

router.post('/posts/:id/comments', authMiddleware, communityController.createComment)
router.get('/posts/:id/comments', communityController.getComments)

module.exports = router