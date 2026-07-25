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
    const posts = await communityService.getPosts(req.user?.id ?? null)
    res.json(posts)
  } catch (error) {
    res.status(500).json({ message: 'Hiba a posztok lekérésekor' })
  }
}

async function getPostById(req, res) {
  try {
    const post = await communityService.getPostById(req.params.id, req.user?.id ?? null)
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

async function toggleVote(req, res) {
    const { entity_id, entity_type, like_type } = req.body

    if (!['post', 'comment'].includes(entity_type)) {
        return res.status(400).json({ message: 'Érvénytelen entity_type' })
    }

    if (!['like', 'dislike'].includes(like_type)) {
        return res.status(400).json({ message: 'Érvénytelen like_type' })
    }

    const entityId = Number(entity_id)

    if (!Number.isInteger(entityId) || entityId <= 0) {
        return res.status(400).json({ message: 'Érvénytelen entity_id' })
    }

    try {
        const result = await communityService.toggleVote({
            userId: req.user.id,
            entityId,
            entityType: entity_type,
            likeType: like_type,
        })
        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

module.exports = { createPost, getPosts, getPostById, createComment, getComments, toggleVote }