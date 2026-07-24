import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'default-layout',
      component: () => import('../layout/DefaultLayout.vue'),
      redirect: { name: 'home' },
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('../views/HomeView.vue'),
        },
        {
          path: '/about',
          name: 'about',
          component: () => import('../views/AboutView.vue'),
        },
        {
          path: '/characters',
          name: 'characters',
          component: () => import('../views/CharactersView.vue'),
        },
        {
          path: '/items',
          name: 'items',
          component: () => import('../views/ItemsView.vue'),
        },
        {
          path: '/community',
          name: 'community',
          component: () => import('../views/CommunityView.vue'),
        },
        {
          path: '/details/:type/:id',
          name: 'details',
          component: () => import('../views/DetailsView.vue'),
        },
        {
          path: '/news',
          name: 'news',
          component: () => import('../views/NewsView.vue'),
        },
        {
          path: '/auth/callback',
          name: 'auth-callback',
          component: () => import('../views/AuthCallback.vue'),
        },
        {
          path: '/community/:id',
          name: 'topic-detail',
          component: () => import('../views/TopicDetailView.vue'),
        },
      ],
    },
  ],
})

export default router
