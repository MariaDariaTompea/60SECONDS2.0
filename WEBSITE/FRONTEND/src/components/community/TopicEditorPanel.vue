<!-- src/components/community/TopicEditorPanel.vue -->
<template>
  <v-dialog
    :model-value="modelValue"
    max-width="600"
    transition="dialog-top-transition"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card class="pa-4">
      <div class="d-flex justify-space-between align-center mb-4">
        <h2 class="text-h6">Új topic létrehozása</h2>
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          @click="$emit('update:modelValue', false)"
        />
      </div>

      <v-text-field
        v-model="title"
        label="Cím"
        variant="outlined"
        density="comfortable"
        class="mb-3"
      />

      <v-text-field
        v-model="description"
        label="Rövid leírás"
        variant="outlined"
        density="comfortable"
        class="mb-3"
        hint="Ez jelenik meg a cím alatt a listában"
        persistent-hint
      />

      <v-textarea
        v-model="content"
        label="Tartalom"
        variant="outlined"
        density="comfortable"
        rows="8"
        class="mt-3"
      />

      <div class="d-flex justify-end ga-2 mt-4">
        <v-btn variant="text" @click="$emit('update:modelValue', false)"> Mégse </v-btn>
        <v-btn color="primary" @click="handleSubmit"> Közzététel </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const title = ref('')
const description = ref('')
const content = ref('')

function handleSubmit() {
  // később: API hívás a backendhez
  console.log('Submit:', {
    title: title.value,
    description: description.value,
    content: content.value,
  })
  emit('update:modelValue', false)
}
</script>
