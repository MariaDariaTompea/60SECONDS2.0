import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axiosClient from '@/lib/axios'

interface User {
  id: number
  username: string
  avatar: string
  role: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)

  async function fetchUser() {
    try {
      const response = await axiosClient.get('/auth/me')
      user.value = response.data
    } catch {
      user.value = null
    }
  }

  async function logout() {
    try {
      await axiosClient.post('/auth/logout')
    } catch (e) {
      // akkor is jelentkezz ki lokálisan
    }
    user.value = null   // mindenképp nullázd
  }

  const isLoggedIn = computed(() => !!user.value)

  return { user, fetchUser, logout, isLoggedIn }
})
