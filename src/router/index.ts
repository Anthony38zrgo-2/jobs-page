// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import CategorySelector   from '@/components/ui/CategorySelector.vue'
import JobRequestForm     from '@/components/forms/JobRequestForm.vue'
import BiddingRadar       from '@/components/radar/BiddingRadar.vue'
import SecureChat         from '@/components/chat/SecureChat.vue'
import ServiceValidation  from '@/components/validation/ServiceValidation.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/',           component: CategorySelector  },
    { path: '/request',    component: JobRequestForm    },
    { path: '/radar',      component: BiddingRadar      },
    { path: '/chat',       component: SecureChat        },
    { path: '/validation', component: ServiceValidation },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

export default router
