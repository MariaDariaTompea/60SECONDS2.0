<template>
  <div class="details-view">
    <v-btn variant="text" prepend-icon="mdi-arrow-left" class="mb-2" @click="router.back()">
      Vissza
    </v-btn>

    <v-container class="d-flex justify-center pa-0 pa-sm-3">
      <v-card
        v-if="isLoading"
        class="detail-card pa-3 pa-sm-4 rounded-xl"
        elevation="0"
        style="background-color: rgb(var(--v-theme-characters_panel))"
      >
        <v-skeleton-loader type="image, article" />
      </v-card>

      <v-alert v-else-if="!data" type="error" variant="tonal" class="detail-card">
        Nem található ez a bejegyzés.
      </v-alert>

      <v-card
        v-else
        class="detail-card pa-3 pa-sm-4 rounded-xl d-flex flex-column flex-sm-row ga-4"
        elevation="0"
        style="background-color: rgb(var(--v-theme-characters_panel))"
      >
        <div class="media-column">
          <h2 class="my-0 text-center text-h5 text-sm-h4">{{ data.name }}</h2>
          <div class="media-image mt-2">
            <v-img :src="data.photo" />
          </div>
        </div>

        <div class="flex-grow-1" style="min-width: 0">
          <template v-if="hasStory">
            <h3 class="text-subtitle-1 mb-1">Story</h3>
            <p class="text-body-2 mb-0">
              <template v-for="(token, i) in storyTokens" :key="i">
                <span v-if="token.type === 'text'">{{ token.content }}</span>
                <a v-else class="mention-link" @click="openMention(token)">{{ token.name }}</a>
              </template>
            </p>
          </template>

          <v-divider v-if="hasStory && (hasStats || hasTags)" class="my-3" />

          <template v-if="hasStats">
            <h3 class="text-subtitle-1 mb-1">Statisztikák</h3>
            <div
              v-for="(value, key) in stats"
              :key="key"
              class="stat-row d-flex justify-space-between text-body-2 py-1"
            >
              <span>{{ key }}</span>
              <span class="font-weight-medium">{{ value }}</span>
            </div>
          </template>

          <v-divider v-if="hasStats && hasTags" class="my-3" />

          <template v-if="hasTags">
            <h3 class="text-subtitle-1 mb-2">{{ tagLabel }}</h3>
            <div class="d-flex flex-wrap ga-2">
              <v-chip v-for="tag in tagList" :key="tag" size="small">{{ tag }}</v-chip>
            </div>
          </template>
        </div>
      </v-card>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import { useGetCharacter, useGetAllNames } from '@/api/characters/charactersQuery'
import { useGetItem } from '@/api/items/itemsQuery'

interface TextToken {
  type: 'text'
  content: string
}

interface MentionToken {
  type: 'mention'
  name: string
  targetType: string
  targetId: number
}

type StoryToken = TextToken | MentionToken

const route = useRoute()
const router = useRouter()

const targetId = computed(() => Number(route.params.id))
const targetType = computed(() => route.params.type as string)

const isCharacter = computed(() => targetType.value === 'character')
const isItem = computed(() => targetType.value === 'item')

const { data: character, isLoading: charLoading } = useGetCharacter(targetId, isCharacter)
const { data: item, isLoading: itemLoading } = useGetItem(targetId, isItem)

const data = computed(() => (isCharacter.value ? character.value : item.value))
const isLoading = computed(() => (isCharacter.value ? charLoading.value : itemLoading.value))

const story = computed(() => data.value?.data?.story ?? '')
const stats = computed(() => data.value?.data?.stats ?? null)
const perks = computed(() => data.value?.data?.perks ?? [])
const tags = computed(() => data.value?.data?.tags ?? [])

const hasStory = computed(() => story.value.length > 0)
const hasStats = computed(() => !!stats.value && Object.keys(stats.value).length > 0)
const tagList = computed(() => (perks.value.length ? perks.value : tags.value))
const hasTags = computed(() => tagList.value.length > 0)
const tagLabel = computed(() => (perks.value.length ? 'Perk' : 'Tulajdonságok'))

const { data: names } = useGetAllNames()

const storyTokens = computed<StoryToken[]>(() => {
  if (!story.value) return []
  if (!names.value) return [{ type: 'text', content: story.value }]

  const tokens: StoryToken[] = []
  const regex = /@(\w+)/g
  let lastIndex = 0
  let match

  while ((match = regex.exec(story.value)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: 'text', content: story.value.slice(lastIndex, match.index) })
    }

    const mention = match[1]
    const found = names.value.find((n) => n.mention === mention)

    if (found) {
      tokens.push({
        type: 'mention',
        name: found.name,
        targetType: found.type,
        targetId: found.id,
      })
    } else {
      tokens.push({ type: 'text', content: match[0] })
    }

    lastIndex = regex.lastIndex
  }

  if (lastIndex < story.value.length) {
    tokens.push({ type: 'text', content: story.value.slice(lastIndex) })
  }

  return tokens
})

function openMention(token: StoryToken) {
  if (token.type !== 'mention') return

  router.push({
    name: 'details',
    params: { type: token.targetType, id: token.targetId },
  })
}
</script>

<style scoped>
.details-view {
  padding: 0.75rem;
}

.detail-card {
  width: 100%;
  max-width: 1000px;
}

.media-column {
  flex-shrink: 0;
}

.media-image {
  max-width: 12em;
  margin: 0 auto;
}

.stat-row + .stat-row {
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.mention-link {
  color: rgb(var(--v-theme-icon_color));
  cursor: pointer;
  font-weight: 500;
}

.mention-link:hover {
  text-decoration: underline;
}

@media (min-width: 600px) {
  .details-view {
    padding: 1rem;
  }

  .media-column {
    width: 14em;
  }

  .media-image {
    max-width: none;
  }
}
</style>
