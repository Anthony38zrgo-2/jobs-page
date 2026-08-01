// src/router/index.ts
import { createRouter, createWebHashHistory } from 'vue-router'
import { useAppState } from '@/store/state'
import CategorySelector   from '@/components/ui/CategorySelector.vue'
import JobRequestForm     from '@/components/forms/JobRequestForm.vue'
import BiddingRadar       from '@/components/radar/BiddingRadar.vue'
import SecureChat         from '@/components/chat/SecureChat.vue'
import ServiceValidation  from '@/components/validation/ServiceValidation.vue'
import SpecialistCatalog  from '@/views/client/SpecialistCatalog.vue'
import ServiceHistory     from '@/views/client/ServiceHistory.vue'
import TechnicianRegistration from '@/views/tech/TechnicianRegistration.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: CategorySelector },
    { path: '/request', name: 'request', component: JobRequestForm, meta: { requiresTechnician: true } },
    { path: '/radar', name: 'radar', component: BiddingRadar, meta: { requiresRequest: true } },
    { path: '/chat', name: 'chat', component: SecureChat, meta: { requiresTechnician: true } },
    { path: '/validation', name: 'validation', component: ServiceValidation, meta: { requiresTechnician: true } },
    { path: '/specialists', name: 'specialists', component: SpecialistCatalog },
    { path: '/history', name: 'history', component: ServiceHistory },
    { path: '/technician-registration', name: 'technician-registration', component: TechnicianRegistration },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach((to) => {
  const { state } = useAppState()

  if (to.meta.requiresRequest && (!state.selectedCategory || !state.jobDescription.trim())) {
    if (state.selectedCategory && state.selectedTechnician) return { name: 'request', replace: true }
    return { name: 'home', replace: true }
  }

  if (to.meta.requiresTechnician && (!state.selectedCategory || !state.selectedTechnician)) {
    return state.selectedCategory
      ? { name: 'specialists', query: { specialty: state.selectedCategory.name }, replace: true }
      : { name: 'home', replace: true }
  }
})

export default router
