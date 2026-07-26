<template>
  <RouterView></RouterView>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
authStore.fetchUser()
</script>
