<template>
  <v-app elevation="0" style="color: rgb(var(--v-theme-text_color))">
    <v-app-bar
      elevation="0"
      position-relative
      d-flex
      style="background-color: rgb(var(--v-theme-nav))"
    >
      <div class="pl-2">
        <v-icon color="icon_color" size="45">mdi-car</v-icon>
      </div>
      <div style="width: 100%; position: absolute">
        <v-app-bar-title class="text-center">
          <h2>60 Seconds 2.0</h2>
        </v-app-bar-title>
      </div>
      <div style="right: 1em; position: absolute">
        <v-btn icon @click="HandleChangeDarkmode()">
          <v-icon color="icon_color">{{
            DarkmodeChange ? 'mdi-weather-sunny' : 'mdi-weather-night'
          }}</v-icon></v-btn
        >
      </div>
    </v-app-bar>
    <v-navigation-drawer
      position-relative
      permanent
      :rail="rail"
      border="0"
      width="220"
      rail-width="60"
      @mouseenter="rail = false"
      @mouseleave="handleMouseLeave"
      style="background-color: rgb(var(--v-theme-nav))"
    >
      <v-list
        density="compact"
        nav
        elevation="0"
        class="mt-4 position-relative d-flex flex-column"
        style="min-height: calc(100vh - 64px - 16px)"
      >
        <v-list-item
          value="home"
          class="pl-2"
          :to="{ name: 'home' }"
          exact
          @click="router.push({ name: 'home' })"
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
          @click="router.push({ name: 'characters' })"
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
          @click="router.push({ name: 'items' })"
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
          @click="router.push({ name: 'community' })"
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
          @click="router.push({ name: 'about' })"
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

        <v-menu v-if="authStore.isLoggedIn" v-model="menuOpen" location="end">
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
            <h2 style="font-weight: normal; color: rgb(var(--v-theme-text_color))">
              Steam belépés
            </h2>
          </template>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-card class="content-card rounded-ts-xl">
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
import { useRouter } from 'vue-router'
import { ref, computed, watch } from 'vue'
import { useDisplay, useTheme } from 'vuetify'
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()

const DarkmodeChange = ref(false)
DarkmodeChange.value = true

const rail = ref(true)
const { mobile } = useDisplay()
const isMobile = computed(() => mobile.value)
/*watch(isMobile, async (newValue) => {
  SettingsMenu.value = newValue;
});*/
const menuOpen = ref(false)
const router = useRouter()
const theme = useTheme()
theme.change('darkTheme')

const HandleChangeDarkmode = async () => {
  DarkmodeChange.value = !DarkmodeChange.value
  if (DarkmodeChange.value) theme.change('darkTheme')
  else theme.change('lightTheme')
}

function loginWithSteam() {
  window.location.href = `${window.location.protocol}//${window.location.hostname}:3000/auth/steam`
}

async function handleLogout() {
  await authStore.logout()
}

function handleMouseLeave() {
  if (!menuOpen.value) {
    rail.value = true
  }
}
</script>

<style scoped>
:deep(.v-list-item__prepend .v-icon) {
  opacity: 1 !important;
}
</style>
