<template>
  <v-dialog
    :model-value="modelValue"
    :fullscreen="isMobile"
    :max-width="isMobile ? undefined : 600"
    :transition="isMobile ? 'dialog-bottom-transition' : 'dialog-top-transition'"
    :persistent="isPending"
    scrollable
    @update:model-value="handleDialogToggle"
  >
    <v-card class="d-flex flex-column">
      <div class="d-flex justify-space-between align-center pa-3 pa-sm-4 pb-0">
        <h2 class="text-subtitle-1 text-sm-h6">Új topic létrehozása</h2>
        <v-btn icon="mdi-close" variant="text" size="small" :disabled="isPending" @click="close" />
      </div>

      <v-card-text class="pt-3">
        <v-alert v-if="isError" type="error" variant="tonal" density="compact" class="mb-3">
          Nem sikerült létrehozni a topicot.
        </v-alert>

        <v-text-field
          v-model="title"
          label="Cím"
          variant="outlined"
          density="comfortable"
          class="mb-3"
          :disabled="isPending"
        />

        <v-text-field
          v-model="description"
          label="Rövid leírás"
          variant="outlined"
          density="comfortable"
          class="mb-3"
          hint="Ez jelenik meg a cím alatt a listában"
          persistent-hint
          :disabled="isPending"
        />

        <v-textarea
          v-model="content"
          label="Tartalom"
          variant="outlined"
          density="comfortable"
          :rows="isMobile ? 5 : 8"
          class="mt-3"
          :disabled="isPending"
        />
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-3 pa-sm-4">
        <v-spacer />
        <v-btn variant="text" :disabled="isPending" @click="close">Mégse</v-btn>
        <v-btn color="primary" :loading="isPending" :disabled="!canSubmit" @click="handleSubmit">
          Közzététel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useCreatePost } from '@/api/community/communityQuery'

defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const { mobile } = useDisplay()
const isMobile = computed(() => mobile.value)

const title = ref('')
const description = ref('')
const content = ref('')

const { mutate: createPost, isPending, isError, reset } = useCreatePost()

const canSubmit = computed(() => title.value.trim().length > 0 && content.value.trim().length > 0)

function resetForm() {
  title.value = ''
  description.value = ''
  content.value = ''
  reset()
}

function close() {
  emit('update:modelValue', false)
  resetForm()
}

function handleDialogToggle(value: boolean) {
  if (!value) {
    close()
  }
}

function handleSubmit() {
  if (!canSubmit.value) return

  createPost(
    {
      title: title.value.trim(),
      description: description.value.trim(),
      content: content.value.trim(),
    },
    {
      onSuccess: () => {
        close()
      },
    },
  )
}
</script>
