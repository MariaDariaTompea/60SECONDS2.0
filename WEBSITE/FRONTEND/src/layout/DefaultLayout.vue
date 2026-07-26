<template>
  <v-app elevation="0" style="color: rgb(var(--v-theme-text_color))">
    <v-app-bar
      elevation="0"
      position-relative
      d-flex
      style="background-color: rgb(var(--v-theme-nav))"
    >
      <div style="position: absolute; pointer-events: none; top:50%; left: 50%; transform: translate(-50%,-50%);" class="px-12">
        <v-app-bar-title class="text-center">
          <h2 v-if="!isMobile">Captian's Gamble</h2>
          <span v-else class="text-subtitle-1 font-weight-bold">Captian's Gamble</span>
        </v-app-bar-title>
      </div>

      <div
        class="d-flex align-center justify-space-between px-2"
        :class="{ 'flex-row-reverse': isMobile }"
        style="width: 100%"
      >
        <v-app-bar-nav-icon
          v-if="isMobile"
          color="icon_color"
          @click="drawerOpen = !drawerOpen"
        />
        <v-icon v-else color="icon_color" size="45">mdi-car</v-icon>

        <v-btn icon @click="HandleChangeDarkmode()">
          <v-icon color="icon_color">{{
            DarkmodeChange ? 'mdi-weather-sunny' : 'mdi-weather-night'
          }}</v-icon>
        </v-btn>
      </div>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawerOpen"
      :location="isMobile ? 'right' : 'left'"
      position-relative
      :permanent="!isMobile"
      :temporary="isMobile"
      :rail="!isMobile && rail"
      border="0"
      :width="isMobile ? 260 : 220"
      rail-width="60"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      style="background-color: rgb(var(--v-theme-nav))"
    >
      <v-list
        density="compact"
        nav
        elevation="0"
        class="pt-4 position-relative d-flex flex-column"
        :style="{ minHeight: isMobile ? '100%' : 'calc(100vh - 64px)' }"
      >
        <v-list-item
          value="home"
          class="pl-2"
          :to="{ name: 'home' }"
          exact
          @click="handleNavClick"
        >
          <template #prepend>
            <v-icon size="28" color="icon_color">mdi-home</v-icon>
          </template>
          <template #title>
            <h2 style="font-weight: normal; color: rgb(var(--v-theme-text_color))">Főoldal</h2>
          </template>
        </v-list-item>

        <v-list-item
          value="characters"
          class="pl-2"
          :to="{ name: 'characters' }"
          @click="handleNavClick"
        >
          <template #prepend>
            <v-icon size="28" color="icon_color">mdi-skull-crossbones</v-icon>
          </template>
          <template #title
            ><h2 style="font-weight: normal; color: rgb(var(--v-theme-text_color))">
              Karakterek
            </h2></template
          >
        </v-list-item>

        <v-list-item
          value="items"
          class="pl-2"
          :to="{ name: 'items' }"
          @click="handleNavClick"
        >
          <template #prepend>
            <v-icon size="28" color="icon_color">mdi-liquor</v-icon>
          </template>
          <template #title
            ><h2 style="font-weight: normal; color: rgb(var(--v-theme-text_color))">
              Tárgyak
            </h2></template
          >
        </v-list-item>

        <v-list-item
          value="community"
          class="pl-2"
          :to="{ name: 'community' }"
          @click="handleNavClick"
        >
          <template #prepend>
            <v-icon size="28" color="icon_color">mdi-account-group</v-icon>
          </template>
          <template #title
            ><h2 style="font-weight: normal; color: rgb(var(--v-theme-text_color))">
              Közösség
            </h2></template
          >
        </v-list-item>

        <v-list-item
          value="about"
          class="pl-2"
          :to="{ name: 'about' }"
          @click="handleNavClick"
        >
          <template #prepend>
            <v-icon size="28" color="icon_color">mdi-earth</v-icon>
          </template>
          <template #title
            ><h2 style="font-weight: normal; color: rgb(var(--v-theme-text_color))">
              Rólunk
            </h2></template
          >
        </v-list-item>

        <v-spacer></v-spacer>

        <v-divider></v-divider>

        <v-menu
          v-if="authStore.isLoggedIn"
          v-model="menuOpen"
          :location="isMobile ? 'top' : 'end'"
        >
          <template #activator="{ props }">
            <v-list-item v-bind="props" class="pl-2">
              <template #prepend>
                <v-avatar size="28">
                  <v-img :src="authStore.user?.avatar" />
                </v-avatar>
              </template>
              <template #title>
                <h2 style="font-weight: normal; color: rgb(var(--v-theme-text_color))">
                  {{ authStore.user?.username }}
                </h2>
              </template>
            </v-list-item>
          </template>

          <v-list>
            <v-list-item @click="handleLogout">
              <template #prepend>
                <v-icon>mdi-logout</v-icon>
              </template>
              <v-list-item-title>Kijelentkezés</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-list-item v-else class="pl-2" @click="loginWithSteam">
          <template #prepend>
            <v-icon size="28" color="icon_color">mdi-steam</v-icon>
          </template>
          <template #title>
            <h2
              class="text-truncate"
              style="font-weight: normal; color: rgb(var(--v-theme-text_color))"
            >
              Steam belépés
            </h2>
          </template>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-card :class="['content-card', { 'rounded-ts-xl': !isMobile }]" :rounded="isMobile ? '0' : undefined">
        <router-view v-slot="{ Component }" style="min-height: calc(100vh - 64px)">
          <v-fade-transition mode="out-in">
            <component :is="Component" />
          </v-fade-transition>
        </router-view>
      </v-card>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useDisplay, useTheme } from 'vuetify'
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()

const DarkmodeChange = ref(false)
DarkmodeChange.value = true

const rail = ref(true)
const { mobile } = useDisplay()
const isMobile = computed(() => mobile.value)
const menuOpen = ref(false)
const theme = useTheme()
const drawerOpen = ref(false)
theme.change('darkTheme')

const HandleChangeDarkmode = async () => {
  DarkmodeChange.value = !DarkmodeChange.value
  if (DarkmodeChange.value) theme.change('darkTheme')
  else theme.change('lightTheme')
}

watch(
  isMobile,
  (val) => {
    drawerOpen.value = !val
  },
  { immediate: true },
)

function handleMouseEnter() {
  if (isMobile.value) return
  rail.value = false
}

function handleMouseLeave() {
  if (isMobile.value) return
  if (!menuOpen.value) {
    rail.value = true
  }
}

function handleNavClick() {
  if (isMobile.value) {
    drawerOpen.value = false
  }
}

function loginWithSteam() {
  window.location.href = `${window.location.protocol}//${window.location.hostname}:3000/auth/steam`
}

async function handleLogout() {
  await authStore.logout()
}
</script>

<style scoped>
:deep(.v-list-item__prepend .v-icon) {
  opacity: 1 !important;
}
</style>
