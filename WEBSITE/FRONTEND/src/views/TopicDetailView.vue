<!-- src/views/TopicDetailView.vue -->
<template>
  <v-card elevation="0" class="rounded-ts-xl pa-4">
    <v-btn variant="text" prepend-icon="mdi-arrow-left" class="mb-4" @click="router.back()">
      Vissza
    </v-btn>

    <div class="mb-4">
      <h1 class="text-h4 mb-2">{{ topic?.title }}</h1>
      <div class="d-flex align-center ga-2 text-caption text-medium-emphasis mb-4">
        <v-avatar size="24">
          <v-icon icon="mdi-account" size="18" />
        </v-avatar>
        <span>{{ topic?.authorName }}</span>
        <span>•</span>
        <span>{{ topic?.createdAt }}</span>
      </div>

      <p class="text-body-1">{{ topic?.content }}</p>

      <div class="d-flex align-center ga-4 mt-4">
        <v-btn variant="tonal" prepend-icon="mdi-arrow-up-bold-outline">
          {{ topic?.likes }}
        </v-btn>
        <v-btn variant="tonal" prepend-icon="mdi-arrow-down-bold-outline">
          {{ topic?.dislikes }}
        </v-btn>
      </div>
    </div>

    <v-divider class="my-4" />

    <h2 class="text-h6 mb-3">Kommentek ({{ mockComments.length }})</h2>

    <v-textarea
      v-model="newComment"
      label="Írj egy kommentet..."
      variant="outlined"
      density="comfortable"
      rows="3"
      class="mb-4"
    />
    <div class="d-flex justify-end mb-4">
      <v-btn color="primary">Küldés</v-btn>
    </div>

    <div v-for="comment in mockComments" :key="comment.id" class="comment-item mb-3 pa-3">
      <div class="d-flex align-center ga-2 text-caption text-medium-emphasis mb-1">
        <v-avatar size="20">
          <v-icon icon="mdi-account" size="16" />
        </v-avatar>
        <span class="font-weight-bold">{{ comment.authorName }}</span>
        <span>•</span>
        <span>{{ comment.createdAt }}</span>
      </div>
      <p class="text-body-2">{{ comment.content }}</p>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { mockTopics } from '@/mock/topics'

const router = useRouter()
const route = useRoute()
const newComment = ref('')

const topic = computed(() => mockTopics.find((t) => t.id === Number(route.params.id)))

const mockComments = ref([
  {
    id: 1,
    authorName: '_dennny',
    createdAt: '3 órája',
    content: 'Én inkább Dolores + Mary Jane-t javaslom, jobb a sebességük.',
  },
  {
    id: 2,
    authorName: 'BunkerBoss',
    createdAt: '2 órája',
    content: 'Szerintem a fegyverkészlet számít legjobban, nem a karakter.',
  },
])
</script>

<style scoped>
.comment-item {
  background-color: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
}
</style>
