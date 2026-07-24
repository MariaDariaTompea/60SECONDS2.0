<template>
  <div class="home-view">
    <!-- HERO -->
    <v-card
      class="hero pa-6 mb-4 rounded-xl"
      elevation="0"
      style="
        background-color: rgb(var(--v-theme-characters_panel));
        border-top: 3px solid rgb(var(--v-theme-icon_color));
      "
    >
      <div class="d-flex align-center flex-column flex-md-row" style="gap: 1.5rem">
        <div class="hero-logo d-flex align-center justify-center">
          <v-icon size="48" color="primary">mdi-shield-home</v-icon>
        </div>
        <div>
          <h1 class="text-h4 mb-2">60 Seconds 2.0</h1>
          <p class="mb-4" style="color: rgb(var(--v-theme-text_color)); opacity: 0.8">
            Túléld az atomcsapást a bunkeredben. Ismerd meg a családot, a tárgyakat és a döntéseket,
            amiken az életed múlik.
          </p>
          <v-btn color="primary" href="https://store.steampowered.com" target="_blank">
            Steam
            <v-icon end>mdi-open-in-new</v-icon>
          </v-btn>
        </div>
      </div>
    </v-card>

    <!-- HÍREK -->
    <div class="d-flex align-center ga-2">
      <h2 class="text-h6" style="color: rgb(var(--v-theme-home_titles))">Hírek</h2>
      <v-btn icon @click="router.push({ name: 'news' })" elevation="0">
        <v-icon size="30">mdi-arrow-right-drop-circle-outline</v-icon>
      </v-btn>
    </div>
    <v-row class="mb-4">
      <template v-if="isLoading">
        <v-col v-for="n in 2" :key="n" cols="12" sm="6">
          <v-card
            class="pa-4 rounded-lg"
            elevation="0"
            style="background-color: rgb(var(--v-theme-characters_panel))"
          >
            <v-skeleton-loader type="article" />
          </v-card>
        </v-col>
      </template>

      <template v-else>
        <v-col v-for="news in News" :key="news.id" cols="12" sm="6">
          <v-card
            class="pa-4 rounded-lg"
            elevation="0"
            style="background-color: rgb(var(--v-theme-characters_panel)); cursor: pointer"
            @click="router.push({ name: 'news', query: { open: news.id } })"
          >
            <div class="d-flex ga-2 align-center">
              <h3 class="text-subtitle-1">{{ news.title }}</h3>
              <h5 class="text-caption" style="opacity: 0.6; font-weight: normal">
                {{ formatDate(news.createdAt, news.updatedAt) }}
              </h5>
            </div>
            <p class="text-body-2 ma-0" style="opacity: 0.8">{{ news.excerpt }}</p>
          </v-card>
        </v-col>
      </template>
    </v-row>

    <!-- KIEMELT -->
    <h2 class="text-h6 mb-3" style="color: rgb(var(--v-theme-home_titles))">Kiemelt</h2>
    <v-row>
      <v-col cols="12" sm="6">
        <v-card
          class="pa-4 rounded-lg d-flex align-center"
          elevation="0"
          style="
            background-color: rgb(var(--v-theme-characters_panel));
            border-top: 2px solid rgb(var(--v-theme-icon_color));
            gap: 12px;
            cursor: pointer;
          "
        >
          <v-avatar size="48" rounded="lg" color="surface">
            <v-icon color="primary">mdi-account</v-icon>
          </v-avatar>
          <div>
            <h3
              class="text-caption ma-0"
              style="opacity: 0.8; color: rgb(var(--v-theme-home_titles)); font-weight: 500"
            >
              A hét karaktere
            </h3>
            <p class="text-subtitle-1 ma-0">Dolores</p>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6">
        <v-card
          class="pa-4 rounded-lg d-flex align-center"
          elevation="0"
          style="
            background-color: rgb(var(--v-theme-characters_panel));
            border-top: 2px solid rgb(var(--v-theme-icon_color));
            gap: 12px;
            cursor: pointer;
          "
        >
          <v-avatar size="48" rounded="lg" color="surface">
            <v-icon color="primary">mdi-tools</v-icon>
          </v-avatar>
          <div>
            <h3
              class="text-caption ma-0"
              style="opacity: 0.8; color: rgb(var(--v-theme-home_titles)); font-weight: 500"
            >
              A hét itemje
            </h3>
            <p class="text-subtitle-1 ma-0">Axe</p>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { useGetNews } from '@/api/news/newsQuery'
import { useRouter } from 'vue-router'

const router = useRouter()

const { data: News, isLoading } = useGetNews()

function formatDate(createdAt: string, updatedAt: string): string {
  const relevantDate = updatedAt && updatedAt !== createdAt ? updatedAt : createdAt

  const date = new Date(relevantDate)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()

  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMinutes < 1) {
    return 'most'
  }
  if (diffHours < 1) {
    return `${diffMinutes} perce`
  }
  if (diffDays < 2) {
    return `${diffHours} órája`
  }
  if (diffDays < 14) {
    return `${diffDays} napja`
  }

  return date.toLocaleDateString('hu-HU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<style scoped>
.home-view {
  padding: 1rem;
}
.hero-logo {
  width: 90px;
  height: 90px;
  border-radius: 12px;
  background-color: rgb(var(--v-theme-icon_color));
  flex-shrink: 0;
}
</style>
