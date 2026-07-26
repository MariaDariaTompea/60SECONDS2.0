<template>
  <v-card
    elevation="0"
    :class="['pa-3', 'pa-sm-4', { 'rounded-ts-xl': !isMobile }]"
    :rounded="isMobile ? '0' : undefined"
  >
    <v-btn variant="text" prepend-icon="mdi-arrow-left" class="mb-3 mb-sm-4" @click="router.back()">
      Vissza
    </v-btn>

    <v-skeleton-loader v-if="isPostPending" type="article" />

    <v-alert v-else-if="isPostError || !topic" type="error" variant="tonal">
      Nem sikerült betölteni a topicot.
    </v-alert>

    <template v-else>
      <div class="mb-4">
        <h1 class="text-h5 text-sm-h4 mb-2 wrap-anywhere">{{ topic.title }}</h1>
        <div class="d-flex align-center ga-2 text-caption text-medium-emphasis mb-4 flex-wrap">
          <v-avatar size="24">
            <v-img v-if="topic.User?.avatar" :src="topic.User.avatar" />
            <v-icon v-else icon="mdi-account" size="18" />
          </v-avatar>
          <span>{{ topic.User?.username ?? 'Unknow' }}</span>
          <span>•</span>
          <span>{{ formatRelativeTime(topic.createdAt) }}</span>
        </div>

        <p v-if="topic.description" class="text-body-2 text-medium-emphasis mb-3 wrap-anywhere">
          {{ topic.description }}
        </p>

        <p class="text-body-1 topic-content">{{ postContent }}</p>

        <div class="d-flex align-center ga-2 ga-sm-4 mt-4">
          <v-btn
            variant="tonal"
            :size="isMobile ? 'small' : undefined"
            :prepend-icon="topic.myVote === 'like' ? 'mdi-arrow-up-bold' : 'mdi-arrow-up-bold-outline'"
            :color="topic.myVote === 'like' ? 'icon_color' : undefined"
            :disabled="!isLoggedIn"
            @click="handleVote('like')"
          >
            {{ topic.likeCount }}
          </v-btn>
          <v-btn
            variant="tonal"
            :size="isMobile ? 'small' : undefined"
            :prepend-icon="topic.myVote === 'dislike' ? 'mdi-arrow-down-bold' : 'mdi-arrow-down-bold-outline'"
            :color="topic.myVote === 'dislike' ? 'error' : undefined"
            :disabled="!isLoggedIn"
            @click="handleVote('dislike')"
          >
            {{ topic.dislikeCount }}
          </v-btn>
        </div>
      </div>

      <v-divider class="my-4" />

      <h2 class="text-subtitle-1 text-sm-h6 mb-3">Kommentek ({{ comments?.length ?? 0 }})</h2>

      <template v-if="isLoggedIn">
        <v-alert v-if="isCommentError" type="error" variant="tonal" density="compact" class="mb-3">
          Nem sikerült elküldeni a kommentet.
        </v-alert>

        <v-textarea
          v-model="newComment"
          label="Írj egy kommentet..."
          variant="outlined"
          density="comfortable"
          :rows="isMobile ? 2 : 3"
          class="mb-2"
          :disabled="isSending"
        />
        <div class="d-flex justify-end mb-4">
          <v-btn
            color="primary"
            :block="isMobile"
            :loading="isSending"
            :disabled="!newComment.trim()"
            @click="handleSubmitComment"
          >
            Küldés
          </v-btn>
        </div>
      </template>

      <v-alert v-else type="info" variant="tonal" density="compact" class="mb-4">
        Jelentkezz be, hogy kommentelni tudj.
      </v-alert>

      <v-skeleton-loader v-if="isCommentsPending" type="paragraph" />

      <div v-else-if="!comments?.length" class="text-body-2 text-medium-emphasis py-2">
        Még nincs egy komment sem.
      </div>

      <template v-else>
        <div v-for="comment in comments" :key="comment.id" class="comment-item mb-2 mb-sm-3 pa-3">
          <div class="d-flex align-center ga-2 text-caption text-medium-emphasis mb-1 flex-wrap">
            <v-avatar size="20">
              <v-img v-if="comment.User?.avatar" :src="comment.User.avatar" />
              <v-icon v-else icon="mdi-account" size="16" />
            </v-avatar>
            <span class="font-weight-bold">{{ comment.User?.username ?? 'Ismeretlen' }}</span>
            <span>•</span>
            <span>{{ formatRelativeTime(comment.createdAt) }}</span>
          </div>
          <p class="text-body-2 topic-content">{{ extractPlainText(comment.content) }}</p>
        </div>
      </template>
    </template>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  useGetPost,
  useGetComments,
  useCreateComment,
  useToggleVote,
} from '@/api/community/communityQuery'
import { formatRelativeTime } from '@/lib/time'
import { extractPlainText } from '@/lib/richText'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { mobile } = useDisplay()
const isMobile = computed(() => mobile.value)

const isLoggedIn = computed(() => authStore.isLoggedIn)
const topicId = computed(() => Number(route.params.id))
const isValidId = computed(() => Number.isInteger(topicId.value) && topicId.value > 0)

const newComment = ref('')

const {
  data: topic,
  isPending: isPostPending,
  isError: isPostError,
} = useGetPost(topicId, isValidId)

const { data: comments, isPending: isCommentsPending } = useGetComments(topicId, isValidId)

const {
  mutate: createComment,
  isPending: isSending,
  isError: isCommentError,
} = useCreateComment()

const postContent = computed(() => extractPlainText(topic.value?.content))

const { mutate: toggleVote } = useToggleVote()

function handleVote(likeType: 'like' | 'dislike') {
  if (!isLoggedIn.value) return
  toggleVote({ entityId: topicId.value, entityType: 'post', likeType })
}

function handleSubmitComment() {
  const content = newComment.value.trim()
  if (!content) return

  createComment(
    { postId: topicId.value, content },
    {
      onSuccess: () => {
        newComment.value = ''
      },
    },
  )
}
</script>

<style scoped>
.comment-item {
  background-color: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
}

.topic-content {
  white-space: pre-line;
  overflow-wrap: anywhere;
}

.wrap-anywhere {
  overflow-wrap: anywhere;
}
</style>
