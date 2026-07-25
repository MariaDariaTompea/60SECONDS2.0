<template>
  <v-card
    class="topic-card rounded-lg pa-3 pa-sm-4 mb-2 mb-sm-3"
    elevation="0"
    hover
    @click="$emit('click')"
  >
    <div class="d-flex justify-space-between align-start ga-2">
      <div class="flex-grow-1" style="min-width: 0">
        <div class="d-flex align-center ga-2 mb-1">
          <v-icon v-if="pinned" icon="mdi-pin" size="16" color="amber" />
          <h3 class="text-subtitle-1 text-sm-h6 topic-title">{{ title }}</h3>
        </div>
        <p v-if="description" class="text-body-2 text-medium-emphasis mb-2 topic-description">
          {{ description }}
        </p>
        <div class="d-flex align-center ga-2 text-caption text-medium-emphasis flex-wrap">
          <v-avatar size="20">
            <v-img v-if="authorAvatar" :src="authorAvatar" />
            <v-icon v-else icon="mdi-account" size="16" />
          </v-avatar>
          <span>{{ authorName }}</span>
          <span>•</span>
          <span>{{ createdAt }}</span>
        </div>
      </div>

      <div class="d-flex flex-column align-center ga-1 vote-column">
        <div class="d-flex align-center ga-1 vote-btn" @click.stop="$emit('vote', 'like')">
          <v-icon
            :icon="myVote === 'like' ? 'mdi-arrow-up-bold' : 'mdi-arrow-up-bold-outline'"
            :color="myVote === 'like' ? 'icon_color' : undefined"
            size="18"
          />
          <span class="text-caption">{{ likes }}</span>
        </div>
        <div class="d-flex align-center ga-1 vote-btn" @click.stop="$emit('vote', 'dislike')">
          <v-icon
            :icon="myVote === 'dislike' ? 'mdi-arrow-down-bold' : 'mdi-arrow-down-bold-outline'"
            :color="myVote === 'dislike' ? 'error' : undefined"
            size="18"
          />
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
withDefaults(
  defineProps<{
    title: string
    description?: string
    authorName: string
    authorAvatar?: string | null
    createdAt: string
    likes?: number
    dislikes?: number
    commentCount?: number
    pinned?: boolean
    myVote?: 'like' | 'dislike' | null
  }>(),
  {
    description: '',
    authorAvatar: null,
    likes: 0,
    dislikes: 0,
    commentCount: 0,
    pinned: false,
  },
)

defineEmits<{
  click: [],
  vote: [likeType: 'like' | 'dislike']
}>()
</script>

<style scoped>
.topic-card {
  background-color: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
}

.topic-title {
  overflow-wrap: anywhere;
}

.topic-description {
  overflow-wrap: anywhere;
}

.vote-column {
  flex-shrink: 0;
  min-width: 44px;
}

.vote-btn {
  cursor: pointer;
  border-radius: 4px;
  padding: 2px 4px;
}

@media (hover: hover) {
  .topic-card {
    transition: background-color 0.15s ease;
  }

  .topic-card:hover {
    background-color: rgba(255, 255, 255, 0.06);
  }

  .vote-btn:hover {
    background-color: rgba(255, 255, 255, 0.08);
  }
}
</style>
