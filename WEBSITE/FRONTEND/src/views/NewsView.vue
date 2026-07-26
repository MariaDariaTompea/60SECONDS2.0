<template>
  <div class="news-view">
    <v-container class="pa-3" style="max-width: 900px">
      <div class="d-flex align-center ga-2 mb-3">
        <v-btn icon variant="text" elevation="0" @click="router.back()">
          <v-icon color="icon_color">mdi-arrow-left</v-icon>
        </v-btn>

        <v-spacer />

        <v-text-field
          v-model="search"
          :loading="isLoading"
          append-inner-icon="mdi-magnify"
          density="compact"
          label="Keresés"
          variant="solo"
          hide-details
          single-line
          clearable
          bg-color="characters_panel"
          base-color="characters_panel"
          class="news-search"
          @click:append-inner="triggerSearch"
          @keyup.enter="triggerSearch"
        />
      </div>

      <h1
        class="text-h5 text-sm-h4 mb-1"
        style="color: rgb(var(--v-theme-home_titles)); font-weight: 600"
      >
        Hírek
      </h1>
      <p class="text-body-2 mb-4 mb-sm-6" style="opacity: 0.6">
        A legfrissebb fejlesztések és bejelentések a 60 Seconds 2.0 világából.
      </p>

      <div v-if="isLoading">
        <v-skeleton-loader v-for="n in 3" :key="n" type="article" class="mb-3 rounded-lg" />
      </div>

      <v-expansion-panels v-else v-model="openPanel" variant="accordion">
        <v-expansion-panel
          v-for="News in newsList"
          :key="News.id"
          :value="News.id"
          class="news-panel mb-3 rounded-lg"
          elevation="0"
        >
          <v-expansion-panel-title class="news-title">
            <div class="d-flex flex-column" style="min-width: 0">
              <span class="text-subtitle-1" style="font-weight: 500">{{ News.title }}</span>
              <span class="text-caption mt-1" style="opacity: 0.5">
                {{ formatDate(News.createdAt, News.updatedAt) }}
              </span>
            </div>
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <div class="news-content">
              <template v-for="(block, i) in News.content.blocks" :key="i">
                <h3
                  v-if="block.type === 'heading'"
                  class="text-subtitle-1 mb-2 mt-3"
                  style="color: rgb(var(--v-theme-icon_color)); font-weight: 500"
                >
                  {{ block.text }}
                </h3>
                <p
                  v-else-if="block.type === 'paragraph'"
                  class="mb-3 text-body-2"
                  style="line-height: 1.7; opacity: 0.9"
                >
                  <template
                    v-for="(token, k) in tokenizeParagraph(block.text || '', names ?? [])"
                    :key="k"
                  >
                    <span v-if="token.type === 'text'">{{ token.content }}</span>
                    <strong v-else-if="token.type === 'bold'">{{ token.content }}</strong>
                    <em v-else-if="token.type === 'italic'">{{ token.content }}</em>
                    <a
                      v-else-if="token.type === 'mention'"
                      class="mention-link"
                      @click="openMention(token)"
                      >{{ token.content }}</a
                    >
                  </template>
                </p>
                <ul v-else-if="block.type === 'list'" class="mb-3 news-list">
                  <li v-for="(li, j) in block.items" :key="j" class="text-body-2 mb-1">
                    {{ li }}
                  </li>
                </ul>
              </template>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <div v-if="isFetchingNextPage" class="text-center my-4">
        <v-progress-circular indeterminate color="icon_color" />
      </div>

      <div ref="loadMoreTrigger" style="height: 1px"></div>

      <p v-if="!hasNextPage" class="text-center text-caption my-4" style="opacity: 0.5">
        Nincs több hír.
      </p>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useGetAllNews } from '@/api/news/newsQuery'
import { useGetAllNames } from '@/api/characters/charactersQuery'

interface TextToken {
  type: 'text' | 'bold' | 'italic' | 'mention'
  content: string
  targetType?: string
  targetId?: number
}

interface NameEntry {
  id: number
  name: string
  mention: string
  type: string
}

let debounceTimer: ReturnType<typeof setTimeout>
const search = ref('')
const activeSearch = ref('')
const router = useRouter()
const route = useRoute()

const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
  useGetAllNews(activeSearch)

const newsList = computed(() => {
  return data.value?.pages.flatMap((page) => page.news) ?? []
})

const openPanel = ref<number | undefined>()
const loadMoreTrigger = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

watch(search, (val) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    activeSearch.value = val || ''
  }, 500)
})

function triggerSearch() {
  clearTimeout(debounceTimer)
  activeSearch.value = search.value || ''
}

const { data: names } = useGetAllNames()

onMounted(() => {
  if (route.query.open) {
    openPanel.value = Number(route.query.open)
  }

  observer = new IntersectionObserver((entries) => {
    if (entries[0]?.isIntersecting && hasNextPage.value && !isFetchingNextPage.value) {
      fetchNextPage()
    }
  })

  if (loadMoreTrigger.value) {
    observer.observe(loadMoreTrigger.value)
  }
})

onUnmounted(() => {
  clearTimeout(debounceTimer)
  observer?.disconnect()
  observer = null
})

function openMention(token: TextToken) {
  if (!token.targetType || !token.targetId) return

  router.push({
    name: 'details',
    params: { type: token.targetType, id: token.targetId },
  })
}

function tokenizeParagraph(text: string, namesList: NameEntry[]): TextToken[] {
  const tokens: TextToken[] = []
  const regex = /\*\*(.+?)\*\*|\*(.+?)\*|@(\w+)/g
  let lastIndex = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: 'text', content: text.slice(lastIndex, match.index) })
    }

    if (match[1] !== undefined) {
      tokens.push({ type: 'bold', content: match[1] })
    } else if (match[2] !== undefined) {
      tokens.push({ type: 'italic', content: match[2] })
    } else if (match[3] !== undefined) {
      const mention = match[3]
      const found = namesList?.find((n) => n.mention === mention)
      if (found) {
        tokens.push({
          type: 'mention',
          content: found.name,
          targetType: found.type,
          targetId: found.id,
        })
      } else {
        tokens.push({ type: 'text', content: match[0] })
      }
    }

    lastIndex = regex.lastIndex
  }

  if (lastIndex < text.length) {
    tokens.push({ type: 'text', content: text.slice(lastIndex) })
  }

  return tokens
}

function formatDate(createdAt: string, updatedAt: string): string {
  const relevantDate = updatedAt && updatedAt !== createdAt ? updatedAt : createdAt
  const date = new Date(relevantDate)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMinutes < 1) return 'most'
  if (diffHours < 1) return `${diffMinutes} perce`
  if (diffDays < 2) return `${diffHours} órája`
  if (diffDays < 14) return `${diffDays} napja`
  return date.toLocaleDateString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<style scoped>
.news-search {
  flex: 1 1 auto;
  min-width: 0;
  max-width: 400px;
}

.news-panel {
  background-color: rgb(var(--v-theme-characters_panel)) !important;
  border: 0.5px solid rgba(255, 182, 39, 0.15);
  overflow: hidden;
}

.news-panel :deep(.v-expansion-panel-title) {
  padding: 12px 14px;
}

.news-panel :deep(.v-expansion-panel-title--active) {
  border-bottom: 1px solid rgba(255, 182, 39, 0.15);
}

.news-content {
  padding: 4px 4px 4px 0;
}

.news-content :deep(strong) {
  color: rgb(var(--v-theme-icon_color));
  font-weight: 600;
}

.news-list {
  padding-left: 20px;
}

.news-list li::marker {
  color: rgb(var(--v-theme-icon_color));
}

.news-content::-webkit-scrollbar {
  width: 6px;
}

.news-content::-webkit-scrollbar-thumb {
  background-color: rgba(255, 182, 39, 0.3);
  border-radius: 3px;
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
  .news-panel :deep(.v-expansion-panel-title) {
    padding: 16px 20px;
  }

  .news-content {
    max-height: 400px;
    overflow-y: auto;
  }
}
</style>
