<template>
  <div class="d-flex justify-center align-center" style="height: 100vh">
    <v-progress-circular indeterminate color="primary" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  await authStore.fetchUser()
  router.push({ name: 'home' })
})
</script>
