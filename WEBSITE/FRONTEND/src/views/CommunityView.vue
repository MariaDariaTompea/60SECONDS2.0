<!-- src/views/CommunityView.vue -->
<template>
  <v-card elevation="0" class="rounded-ts-xl pa-4">
    <div class="d-flex justify-space-between align-center mb-4">
      <h1 class="text-h4">Community</h1>
      <v-btn v-if="isLoggedIn" icon="mdi-plus" color="primary" @click="isEditorOpen = true" />
    </div>

    <!-- Kitűzött topicok -->
    <div v-if="pinnedTopics.length" class="mb-6">
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
            v-bind="topic"
            @click="openTopic(topic.id)"
          />
        </div>
      </v-expand-transition>
    </div>

    <!-- Normál topicok -->
    <div>
      <h2 class="text-subtitle-1 font-weight-bold mb-2">Topicok</h2>
      <TopicCard
        v-for="topic in normalTopics"
        :key="topic.id"
        v-bind="topic"
        @click="openTopic(topic.id)"
      />
    </div>

    <!-- Topic létrehozó floating panel -->
    <TopicEditorPanel v-model="isEditorOpen" />
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import TopicCard from '@/components/community/TopicCard.vue'
import TopicEditorPanel from '@/components/community/TopicEditorPanel.vue'
import { useAuthStore } from '@/stores/auth'
import { mockTopics } from '@/mock/topics'

const router = useRouter()
const authStore = useAuthStore()
const isLoggedIn = computed(() => authStore.isLoggedIn)

const isEditorOpen = ref(false)
const showPinned = ref(true)

const pinnedTopics = computed(() => mockTopics.filter((t) => t.pinned))
const normalTopics = computed(() => mockTopics.filter((t) => !t.pinned))

function openTopic(id: number) {
  router.push({ name: 'topic-detail', params: { id } })
}
</script>

<style scoped>
.pinned-header {
  cursor: pointer;
  user-select: none;
}
</style>
