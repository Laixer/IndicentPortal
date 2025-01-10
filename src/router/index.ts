import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FinishView from '@/views/FinishView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:vendor?',
      name: 'start',
      beforeEnter(to) {
        if (!to.params.vendor) {
          return {
            path: to.path,
            name: to.name,
            params: {
              ...to.params,
              vendor: `${import.meta.env.VITE_DEFAULT_APP_ID || 'incident'}`
            }
          }
        }

        return true
      },
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView
        },
        {
          path: 'finish',
          name: 'finish',
          component: FinishView
        },
        {
          path: 'address',
          name: 'address',
          component: () => import('@/views/survey/Address.vue'),
          meta: { survey: true }
        },
        {
          path: 'feedback-characteristics',
          name: 'feedback-characteristics',
          component: () => import('@/views/survey/FeedbackCharacteristics.vue'),
          meta: { survey: true }
        },
        {
          path: 'foundation-damage-cause',
          name: 'foundation-damage-cause',
          component: () => import('@/views/survey/FoundationDamageCause.vue'),
          meta: { survey: true }
        },
        {
          path: 'foundation-damage-characteristics',
          name: 'foundation-damage-characteristics',
          component: () => import('@/views/survey/FoundationDamageCharacteristics.vue'),
          meta: { survey: true }
        },
        {
          path: 'address-characteristics',
          name: 'address-characteristics',
          component: () => import('@/views/survey/AddressCharacteristics.vue'),
          meta: { survey: true }
        },
        {
          path: 'foundation-type',
          name: 'foundation-type',
          component: () => import('@/views/survey/FoundationType.vue'),
          meta: { survey: true }
        },
        {
          path: 'environment-damage-characteristics',
          name: 'environment-damage-characteristics',
          component: () => import('@/views/survey/EnvironmentDamageCharacteristics.vue'),
          meta: { survey: true }
        },
        {
          path: 'upload',
          name: 'upload',
          component: () => import('@/views/survey/Upload.vue'),
          meta: { survey: true }
        },
        {
          path: 'note',
          name: 'note',
          component: () => import('@/views/survey/Note.vue'),
          meta: { survey: true }
        },
        {
          path: 'contact',
          name: 'contact',
          component: () => import('@/views/survey/Contact.vue'),
          meta: { survey: true }
        }
      ]
    }
  ]
})

export default router
