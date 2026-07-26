<template>
  <v-card
    elevation="0"
    :class="['pa-3', 'pa-sm-4', { 'rounded-ts-xl': !isMobile }]"
    :rounded="isMobile ? '0' : undefined"
  >
    <div class="d-flex justify-space-between align-center mb-3 mb-sm-4 ga-2">
      <h1 class="text-h5 text-sm-h4">Community</h1>
      <v-btn
        v-if="isLoggedIn"
        icon="mdi-plus"
        color="primary"
        :size="isMobile ? 'small' : undefined"
        @click="isEditorOpen = true"
      />
    </div>

    <div v-if="isPending" class="d-flex justify-center py-8">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <v-alert v-else-if="isError" type="error" variant="tonal">
      Nem sikerült betölteni a topicokat.
    </v-alert>

    <template v-else>
      <div v-if="pinnedTopics.length" class="mb-4 mb-sm-6">
        <div class="d-flex align-center ga-2 mb-2 pinned-header" @click="showPinned = !showPinned">
          <v-icon icon="mdi-pin" size="18" color="amber" />
          <h2 class="text-subtitle-1 font-weight-bold">Kitűzött topicok</h2>
          <v-icon :icon="showPinned ? 'mdi-chevron-up' : 'mdi-chevron-down'" size="20" />
        </div>
        <v-expand-transition>
          <div v-show="showPinned">
            <TopicCard
              v-for="topic in pinnedTopics"
              :key="topic.id"
              v-bind="toCardProps(topic)"
              @click="openTopic(topic.id)"
              @vote="handleVote(topic.id, $event)"
            />
          </div>
        </v-expand-transition>
      </div>

      <div>
        <h2 class="text-subtitle-1 font-weight-bold mb-2">Topicok</h2>
        <div v-if="!normalTopics.length" class="text-body-2 text-medium-emphasis py-4">
          Még nincs egy topic sem.
        </div>
        <TopicCard
          v-for="topic in normalTopics"
          :key="topic.id"
          v-bind="toCardProps(topic)"
          @click="openTopic(topic.id)"
          @vote="handleVote(topic.id, $event)"
        />
      </div>
    </template>

    <TopicEditorPanel v-model="isEditorOpen" />
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import TopicCard from '@/components/community/TopicCard.vue'
import TopicEditorPanel from '@/components/community/TopicEditorPanel.vue'
import { useAuthStore } from '@/stores/auth'
import { useGetAllPost, type Post, useToggleVote } from '@/api/community/communityQuery'
import { formatRelativeTime } from '@/lib/time'
import { useDisplay } from 'vuetify'

const router = useRouter()
const authStore = useAuthStore()
const isLoggedIn = computed(() => authStore.isLoggedIn)

const isEditorOpen = ref(false)
const showPinned = ref(true)

const { data: topics, isPending, isError } = useGetAllPost()

const pinnedTopics = computed(() => topics.value?.filter((t) => t.pinned) ?? [])
const normalTopics = computed(() => topics.value?.filter((t) => !t.pinned) ?? [])

const { mutate: toggleVote } = useToggleVote()

const { mobile } = useDisplay()
const isMobile = computed(() => mobile.value)

function toCardProps(topic: Post) {
  return {
    title: topic.title,
    description: topic.description,
    authorName: topic.User?.username ?? 'Ismeretlen',
    authorAvatar: topic.User?.avatar ?? null,
    createdAt: formatRelativeTime(topic.createdAt),
    likes: topic.likeCount,
    dislikes: topic.dislikeCount,
    myVote: topic.myVote,
    commentCount: topic.commentCount,
    pinned: topic.pinned,

  }
}

function openTopic(id: number) {
  router.push({ name: 'topic-detail', params: { id } })
}

function handleVote(postId: number, likeType: 'like' | 'dislike') {
  if (!isLoggedIn.value) return
  toggleVote({ entityId: postId, entityType: 'post', likeType })
}
</script>

<style scoped>
.pinned-header {
  cursor: pointer;
  user-select: none;
}
</style>
