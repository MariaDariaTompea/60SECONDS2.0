<!-- src/components/community/TopicCard.vue -->
<template>
  <v-card class="topic-card rounded-lg pa-4 mb-3" elevation="0" hover @click="$emit('click')">
    <div class="d-flex justify-space-between align-start">
      <div class="flex-grow-1">
        <div class="d-flex align-center ga-2 mb-1">
          <v-icon v-if="pinned" icon="mdi-pin" size="16" color="amber" />
          <h3 class="text-h6">{{ title }}</h3>
        </div>
        <p v-if="description" class="text-body-2 text-medium-emphasis mb-2">
          {{ description }}
        </p>
        <div class="d-flex align-center ga-2 text-caption text-medium-emphasis">
          <v-avatar size="20">
            <v-img v-if="authorAvatar" :src="authorAvatar" />
            <v-icon v-else icon="mdi-account" size="16" />
          </v-avatar>
          <span>{{ authorName }}</span>
          <span>•</span>
          <span>{{ createdAt }}</span>
        </div>
      </div>

      <div class="d-flex flex-column align-center ga-1 ml-4">
        <div class="d-flex align-center ga-1">
          <v-icon icon="mdi-arrow-up-bold-outline" size="18" />
          <span class="text-caption">{{ likes }}</span>
        </div>
        <div class="d-flex align-center ga-1">
          <v-icon icon="mdi-arrow-down-bold-outline" size="18" />
          <span class="text-caption">{{ dislikes }}</span>
        </div>
        <div class="d-flex align-center ga-1 mt-1">
          <v-icon icon="mdi-comment-outline" size="16" />
          <span class="text-caption">{{ commentCount }}</span>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  authorName: string
  authorAvatar?: string | null
  createdAt: string
  likes: number
  dislikes: number
  commentCount: number
  pinned?: boolean
}>()

defineEmits<{
  click: []
}>()
</script>

<style scoped>
.topic-card {
  background-color: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.topic-card:hover {
  background-color: rgba(255, 255, 255, 0.06);
}
</style>
