// src/api/community/communityQuery.ts
import axiosClient from '../../lib/axios'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { toValue, type MaybeRefOrGetter } from 'vue'

/* ---------- Types ---------- */

interface PostAuthor {
  id: number
  username: string
  avatar: string
}

// TipTap-compatible rich text document structure
interface RichTextNode {
  type: string
  text?: string
  content?: RichTextNode[]
  marks?: { type: string; attrs?: Record<string, unknown> }[]
  attrs?: Record<string, unknown>
}

interface RichTextDocument {
  type: 'doc'
  content: RichTextNode[]
}

// Plain strings are still possible from the early test posts
type PostContent = RichTextDocument | string

export interface Post {
  id: number
  user_id: number
  title: string
  description: string
  content: PostContent
  pinned: boolean
  gotEdit: boolean
  createdAt: string
  updatedAt: string
  User: PostAuthor | null
  commentCount: number
  likeCount: number
  dislikeCount: number
  myVote: 'like' | 'dislike' | null
}

interface Comment {
  id: number
  post_id: number
  user_id: number
  parent_comment_id: number | null
  content: PostContent
  gotEdit: boolean
  createdAt: string
  updatedAt: string
  User: PostAuthor | null
}

interface CreatePostPayload {
  title: string
  description: string
  content: PostContent
}

interface CreateCommentPayload {
  postId: number
  content: PostContent
}

interface ToggleVotePayload {
  entityId: number
  entityType: 'post' | 'comment'
  likeType: 'like' | 'dislike'
}

interface VoteResult {
  likes: number
  dislikes: number
  myVote: 'like' | 'dislike' | null
}


/* ---------- Helpers ---------- */

// Sequelize may return a JSON column as a raw string depending on the driver,
// so normalize it before it reaches the components
const parseContent = <T extends { content: PostContent }>(entity: T): T => {
  if (typeof entity.content === 'string') {
    try {
      entity.content = JSON.parse(entity.content)
    } catch {
      // Not valid JSON - keep it as plain text
    }
  }
  return entity
}

const normalizePost = (post: Post): Post => {
  parseContent(post)
  post.commentCount = Number(post.commentCount ?? 0)
  post.likeCount = Number(post.likeCount ?? 0)
  post.dislikeCount = Number(post.dislikeCount ?? 0)
  return post
}

/* ---------- Posts: list ---------- */

const getAllPost = async (): Promise<Post[]> => {
  const response = await axiosClient.get('community/posts')
  return response.data.map(normalizePost)
}

export const useGetAllPost = () => {
  return useQuery({
    queryKey: ['community-posts'],
    queryFn: () => getAllPost(),
  })
}

/* ---------- Posts: single ---------- */

const getPost = async (id: number): Promise<Post> => {
  const response = await axiosClient.get(`community/posts/${id}`)
  return parseContent(response.data)
}

export const useGetPost = (id: MaybeRefOrGetter<number>, enabled: MaybeRefOrGetter<boolean>) => {
  return useQuery({
    queryKey: ['community-post', id],
    queryFn: () => getPost(toValue(id)),
    enabled: enabled,
  })
}

/* ---------- Posts: create ---------- */

const createPost = async (payload: CreatePostPayload): Promise<Post> => {
  const response = await axiosClient.post('community/posts', payload)
  return response.data
}

export const useCreatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-posts'] })
    },
  })
}

/* ---------- Comments: list ---------- */

const getComments = async (postId: number): Promise<Comment[]> => {
  const response = await axiosClient.get(`community/posts/${postId}/comments`)
  return response.data.map(parseContent)
}

export const useGetComments = (
  postId: MaybeRefOrGetter<number>,
  enabled: MaybeRefOrGetter<boolean>,
) => {
  return useQuery({
    queryKey: ['community-comments', postId],
    queryFn: () => getComments(toValue(postId)),
    enabled: enabled,
  })
}

/* ---------- Comments: create ---------- */

const createComment = async ({ postId, content }: CreateCommentPayload): Promise<Comment> => {
  const response = await axiosClient.post(`community/posts/${postId}/comments`, { content })
  return response.data
}

export const useCreateComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createComment,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['community-comments', variables.postId] })
    },
  })
}

/* ---------- Vote: Like/Dislike ---------- */

const toggleVote = async ({
  entityId,
  entityType,
  likeType,
}: ToggleVotePayload): Promise<VoteResult> => {
  const response = await axiosClient.post('community/likes', {
    entity_id: entityId,
    entity_type: entityType,
    like_type: likeType,
  })
  return response.data
}

export const useToggleVote = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleVote,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['community-posts'] })

      if (variables.entityType === 'post') {
        queryClient.invalidateQueries({ queryKey: ['community-post', variables.entityId] })
      }
    },
  })
}
