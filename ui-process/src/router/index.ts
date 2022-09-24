import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/components/MainLayout.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/welcome',
      name: 'welcome',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: MainLayout,
      children: [{
        path: '',
        name: 'welcome-new',
        component: import("@/views/WelcomeView.vue")
      }]
    },
    {
      path: '/project',
      name: 'project',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: MainLayout,
      children: [{
        path: '',
        name: 'project-new',
        component: import("@/views/ProjectView.vue")
      }]
    },
    {
      path: '/',
      redirect: '/welcome'
    }
  ]
})

export default router
