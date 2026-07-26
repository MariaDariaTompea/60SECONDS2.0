<template>
  <v-container class="pa-2 pa-sm-4" style="background-color: transparent; color: rgb(var(--v-theme-text_color))">
    <div style="width: 100%" class="d-flex justify-center">
      <v-text-field
        v-model="search"
        :loading="isLoading"
        append-inner-icon="mdi-magnify"
        density="compact"
        label="Keresés"
        variant="solo"
        bg-color="characters_panel"
        base-color="characters_panel"
        hide-details
        single-line
        clearable
        class="ma-2"
        max-width="600"
        @click:append-inner="triggerSearch"
        @keyup.enter="triggerSearch"
      />
    </div>

    <v-row justify="center" class="mt-4 mt-sm-10" :dense="isMobile">
      <template v-if="isLoading">
        <v-col v-for="n in 8" :key="n" cols="6" sm="4" md="3" lg="2">
          <v-card style="background-color: rgb(var(--v-theme-characters_panel))">
            <div class="character-image">
              <v-skeleton-loader type="image" height="100%" />
            </div>
            <v-divider></v-divider>
            <v-skeleton-loader type="text" class="pa-2" />
          </v-card>
        </v-col>
      </template>

      <template v-else>
        <v-col v-for="char in characters" :key="char.id" cols="6" sm="4" md="3" lg="2">
          <v-card
            class="character-card"
            style="background-color: rgb(var(--v-theme-characters_panel))"
            @click="router.push({ name: 'details', params: { type: 'character', id: char.id } })"
          >
            <div class="character-image pa-3 pa-sm-5 d-flex justify-center align-center">
              <v-img style="width: 100%" :src="char.photo" />
            </div>
            <v-divider></v-divider>
            <v-card-title class="text-center text-body-2 pa-2 pa-sm-4">
              {{ char.name }}
            </v-card-title>
          </v-card>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch, computed, onUnmounted } from 'vue'
import { useDisplay } from 'vuetify'
import { useRouter } from 'vue-router'
import { useGetAllCharacter } from '@/api/characters/charactersQuery'

const router = useRouter()
const { mobile } = useDisplay()
const isMobile = computed(() => mobile.value)

const activeSearch = ref('')
let debounceTimer: ReturnType<typeof setTimeout>
const search = ref('')
const { data: characters, isLoading } = useGetAllCharacter(activeSearch)

watch(search, (val) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    activeSearch.value = val || ''
  }, 500)
})

onUnmounted(() => {
  clearTimeout(debounceTimer)
})

function triggerSearch() {
  clearTimeout(debounceTimer)
  activeSearch.value = search.value || ''
}
</script>

<style scoped>
.character-card {
  cursor: pointer;
}

.character-image {
  height: 9em;
}

.character-card :deep(.v-card-title) {
  white-space: normal;
  line-height: 1.2;
}

@media (hover: hover) {
  .character-card {
    transition: transform 0.2s ease;
  }

  .character-card:hover {
    transform: scale(1.05);
  }
}

@media (min-width: 600px) {
  .character-image {
    height: 13em;
  }
}
</style>
