<template>
  <div class="details-view">
    <div class="back-button ma-2 position-absolute" style="left: 0; top: 0">
      <v-btn icon @click="router.back()" elevation="0">
        <v-icon color="icon_color">mdi-arrow-left</v-icon>
      </v-btn>
    </div>

    <v-container class="d-flex justify-center">
      <div v-if="isLoading">
        <v-skeleton-loader type="image, article" />
      </div>

      <div v-else-if="data">
        <v-card
          class="pa-4 rounded-xl d-flex"
          elevation="0"
          style="background-color: rgb(var(--v-theme-characters_panel))"
        >
          <div style="width: 30%">
            <div class="d-flex justify-center align-center" style="width: 14em">
              <h2 class="my-0 text-center">{{ data.name }}</h2>
            </div>
            <div style="width: 14em" class="d-flex justify-center align-center">
              <v-img :src="data.photo" cover />
            </div>
          </div>

          <div>
            <div v-if="data.data?.story">
              <h3>Story</h3>
              <p>
                <template v-for="(token, i) in storyTokens" :key="i">
                  <span v-if="token.type === 'text'">{{ token.content }}</span>
                  <a
                    v-else
                    class="mention-link"
                    @click="
                      router.push({
                        name: 'details',
                        params: {
                          type: token.targetType,
                          id: token.targetId,
                        },
                      })
                    "
                    >{{ token.name }}</a
                  >
                </template>
              </p>
            </div>

            <v-divider></v-divider>

            <div v-if="data.data?.stats">
              <h3>Statisztikák</h3>
              <div v-for="(value, key) in data.data.stats" :key="key">
                <p>{{ key }} : {{ value }}</p>
              </div>
            </div>

            <v-divider></v-divider>

            <div v-if="data.data?.perks?.length || data.data?.tags?.length">
              <h3>{{ data.data?.perks ? 'Perk' : 'Tulajdonságok' }}</h3>
              <v-chip v-for="tag in data.data.perks || data.data.tags" :key="tag" class="mx-2">
                {{ tag }}
              </v-chip>
            </div>
          </div>
        </v-card>
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useGetCharacter, useGetAllNames } from '@/api/characters/charactersQuery'
import { useGetItem } from '@/api/items/itemsQuery'
import router from '@/router'

const route = useRoute()
const targetId = computed(() => Number(route.params.id))
const targetType = computed(() => route.params.type as string)

const isCharacter = computed(() => targetType.value === 'character')
const isItem = computed(() => targetType.value === 'item')

const { data: character, isLoading: charLoading } = useGetCharacter(targetId, isCharacter)
const { data: item, isLoading: itemLoading } = useGetItem(targetId, isItem)

const data = computed(() => (isCharacter.value ? character.value : item.value))
const isLoading = computed(() => (isCharacter.value ? charLoading.value : itemLoading.value))

const { data: names } = useGetAllNames()

const storyTokens = computed(() => {
  const story = data.value?.data?.story
  if (!story) return []
  if (!names.value) return [{ type: 'text', content: story }]

  const tokens = []
  const regex = /@(\w+)/g
  let lastIndex = 0
  let match

  while ((match = regex.exec(story)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: 'text', content: story.slice(lastIndex, match.index) })
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

  if (lastIndex < story.length) {
    tokens.push({ type: 'text', content: story.slice(lastIndex) })
  }

  return tokens
})
</script>

<style scoped>
.mention-link {
  color: rgb(var(--v-theme-icon_color));
  cursor: pointer;
  font-weight: 500;
}
.mention-link:hover {
  text-decoration: underline;
}
</style>
