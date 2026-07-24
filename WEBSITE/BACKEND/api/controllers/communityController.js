const communityService = require('../services/communityService')

async function createPost(req, res) {
  try {
    const { title, description, content } = req.body
    const userId = req.user.id

    if (!title || !content) {
      return res.status(400).json({ message: 'Cím és tartalom kötelező' })
    }

    const post = await communityService.createPost({
      userId,
      title,
      description,
      content,
    })

    res.status(201).json(post)
  } catch (error) {
    res.status(500).json({ message: 'Hiba a poszt létrehozásakor' })
  }
}

async function getPosts(req, res) {
  try {
    const posts = await communityService.getPosts()
    res.json(posts)
  } catch (error) {
    res.status(500).json({ message: 'Hiba a posztok lekérésekor' })
  }
}

async function getPostById(req, res) {
  try {
    const post = await communityService.getPostById(req.params.id)
    if (!post) {
      return res.status(404).json({ message: 'A topic nem található' })
    }
    res.json(post)
  } catch (error) {
    res.status(500).json({ message: 'Hiba a poszt lekérésekor' })
  }
}

async function createComment(req, res) {
  try {
    const { content, parentCommentId } = req.body
    const userId = req.user.id
    const postId = req.params.id

    if (!content) {
      return res.status(400).json({ message: 'A komment tartalma kötelező' })
    }

    const comment = await communityService.createComment({
      postId,
      userId,
      content,
      parentCommentId: parentCommentId || null,
    })

    res.status(201).json(comment)
  } catch (error) {
    res.status(500).json({ message: 'Hiba a komment létrehozásakor' })
  }
}

async function getComments(req, res) {
  try {
    const comments = await communityService.getComments(req.params.id)
    res.json(comments)
  } catch (error) {
    res.status(500).json({ message: 'Hiba a kommentek lekérésekor' })
  }
}

module.exports = { createPost, getPosts, getPostById, createComment, getComments }