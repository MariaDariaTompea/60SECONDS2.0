<template>
  <v-container style="background-color: transparent; color: rgb(var(--v-theme-text_color))">
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

    <v-row justify="center" class="mt-10">
      <template v-if="isLoading">
        <v-col v-for="n in 8" :key="n" cols="6" sm="4" md="3" lg="2">
          <v-card><v-skeleton-loader type="image, text" /></v-card>
        </v-col>
      </template>

      <template v-else>
        <v-col v-for="char in characters" :key="char.id" cols="6" sm="4" md="3" lg="2">
          <v-card
            class="character-card"
            style="background-color: rgb(var(--v-theme-characters_panel))"
            @click="router.push({ name: 'details', params: { type: 'character', id: char.id } })"
          >
            <div class="pa-5 d-flex justify-center align-center" style="height: 13em">
              <v-img style="width: 100%" :src="char.photo" />
            </div>
            <v-divider></v-divider>
            <v-card-title class="text-center text-body-2">{{ char.name }}</v-card-title>
          </v-card>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useGetAllCharacter } from '@/api/characters/charactersQuery'

const router = useRouter()
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

function triggerSearch() {
  clearTimeout(debounceTimer)
  activeSearch.value = search.value || ''
}
</script>

<style scoped>
.character-card {
  transition: transform 0.2s ease;
  cursor: pointer;
}
.character-card:hover {
  transform: scale(1.05);
}
</style>
