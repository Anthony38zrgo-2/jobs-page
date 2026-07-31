<template>
  <div class="flex flex-col bg-white min-h-screen max-w-md mx-auto shadow-2xl overflow-hidden">
    <!-- Top bar -->
    <div class="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100 shrink-0">
      <button @click="router.back()" class="w-9 h-9 rounded-full hover:bg-slate-100 transition-colors flex items-center justify-center">
        <span class="material-icons text-slate-600 text-xl">arrow_back</span>
      </button>
      <div class="text-center">
        <p class="text-xs text-slate-400 uppercase tracking-widest font-medium">Solicitud enviada</p>
        <h1 class="text-sm font-bold text-slate-800">{{ selectedCategory?.name ?? 'Técnicos' }}</h1>
      </div>
      <div class="w-9 h-9"></div> <!-- spacer -->
    </div>

    <!-- Scrollable body -->
    <div class="flex-1 overflow-y-auto px-5 py-6 space-y-6">

      <!-- ── Radar animation ─────────────────────────────────────────── -->
      <div v-if="!selectedTechnician" class="flex flex-col items-center justify-center pt-2 pb-4">
        <div class="relative flex items-center justify-center w-40 h-40">
          <!-- Concentric wave rings with staggered animation delay -->
          <div class="absolute w-full h-full rounded-full border border-teal-300 animate-ping opacity-30"></div>
          <div class="absolute w-3/4 h-3/4 rounded-full border border-teal-400 animate-ping opacity-40"
            style="animation-delay: 0.4s;"></div>
          <div class="absolute w-1/2 h-1/2 rounded-full border border-teal-500 animate-ping opacity-50"
            style="animation-delay: 0.8s;"></div>
          <!-- Center icon -->
          <div class="relative z-10 w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-xl">
            <span class="material-icons text-white text-3xl">{{ selectedCategory?.icon ?? 'home_repair_service' }}</span>
          </div>
        </div>

        <p class="mt-4 text-base font-bold text-slate-800">Buscando profesionales…</p>
        <p class="text-sm text-slate-400 mt-1">Las ofertas aparecerán automáticamente</p>

        <!-- Progress dots -->
        <div class="flex gap-1.5 mt-3">
          <div
            v-for="i in 3"
            :key="i"
            class="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce"
            :style="{ animationDelay: `${(i - 1) * 0.2}s` }"
          ></div>
        </div>
      </div>

      <!-- ── Incoming bids ────────────────────────────────────────────── -->
      <div v-if="bids.length > 0" class="space-y-3">
        <div class="flex items-center gap-2 mb-1">
          <span class="material-icons text-teal-500 text-sm">notifications_active</span>
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {{ selectedTechnician ? 'Técnico elegido' : `${bids.length} oferta${bids.length !== 1 ? 's' : ''} recibida${bids.length !== 1 ? 's' : ''}` }}
          </p>
        </div>
        <TransitionGroup name="bid-list" tag="div" class="space-y-3">
          <TechnicianCard
            v-for="tech in bids"
            :key="tech.id"
            :technician="tech"
            :chosen-only="selectedTechnician !== null"
            @accepted="onAccept"
            @rejected="onReject(tech)"
          />
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppState } from '@/store/state'
import type { Technician } from '@/store/state'
import { MOCK_TECHNICIANS } from '@/data/categories'
import TechnicianCard from './TechnicianCard.vue'

const router = useRouter()
const { state, setTechnician, setViewState } = useAppState()

const selectedCategory = computed(() => state.selectedCategory)
const selectedTechnician = computed(() => state.selectedTechnician)
const bids = ref<Technician[]>([])
const timers: ReturnType<typeof setTimeout>[] = []

onMounted(() => {
  if (selectedTechnician.value) {
    bids.value = [selectedTechnician.value]
    return
  }
  // Staggered arrival: 1.5s and 3.5s
  timers.push(
    setTimeout(() => { bids.value.push(MOCK_TECHNICIANS[0]) }, 1500),
    setTimeout(() => { bids.value.push(MOCK_TECHNICIANS[1]) }, 3500),
  )
})

onUnmounted(() => { timers.forEach(clearTimeout) })

function onAccept(tech: Technician) {
  setTechnician(tech)
  setViewState('chat')
  router.push('/chat')
}

function onReject(tech: Technician) {
  bids.value = bids.value.filter(b => b.id !== tech.id)
}
</script>

<style>
/* Transition for list items */
.bid-list-enter-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.bid-list-leave-active {
  transition: all 0.3s ease;
}
.bid-list-enter-from {
  opacity: 0;
  transform: translateY(24px) scale(0.96);
}
.bid-list-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
