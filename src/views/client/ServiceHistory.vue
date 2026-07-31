<template>
  <div class="flex min-h-screen w-full max-w-md flex-col bg-slate-50 shadow-xl">
    <header class="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-4">
      <button
        class="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100"
        aria-label="Volver"
        @click="router.back()"
      >
        <span class="material-icons text-lg text-slate-600">arrow_back</span>
      </button>
      <div>
        <p class="text-xs font-medium text-teal-600">Confianza después del servicio</p>
        <h1 class="text-lg font-bold text-slate-800">Historial de servicios</h1>
      </div>
    </header>

    <main class="flex-1 space-y-4 overflow-y-auto p-4">
      <section class="grid grid-cols-2 gap-3">
        <div class="rounded-xl border border-slate-200 bg-white p-3">
          <p class="text-2xl font-extrabold text-slate-800">{{ services.length }}</p>
          <p class="text-xs text-slate-500">Servicios registrados</p>
        </div>
        <div class="rounded-xl border border-slate-200 bg-white p-3">
          <p class="flex items-center gap-1 text-2xl font-extrabold text-amber-500">
            {{ averageRating }} <span class="material-icons text-xl">star</span>
          </p>
          <p class="text-xs text-slate-500">Calificación promedio</p>
        </div>
      </section>

      <article
        v-for="service in services"
        :key="service.id"
        class="rounded-2xl border border-slate-200 bg-white p-4"
      >
        <div class="flex gap-3">
          <img
            :src="service.technicianAvatar"
            :alt="service.technician"
            class="h-12 w-12 rounded-xl object-cover"
          />
          <div class="flex-1">
            <div class="flex items-start justify-between gap-2">
              <div>
                <h2 class="text-sm font-bold text-slate-800">{{ service.category }}</h2>
                <p class="text-xs text-slate-500">{{ service.technician }} · {{ service.date }}</p>
              </div>
              <span class="text-sm font-bold text-teal-700">S/. {{ service.price.toFixed(2) }}</span>
            </div>
            <div class="mt-2 flex">
              <span
                v-for="star in 5"
                :key="star"
                class="material-icons text-sm"
                :class="star <= service.rating ? 'text-amber-400' : 'text-slate-200'"
              >star</span>
            </div>
          </div>
        </div>
        <div v-if="service.recommendation" class="mt-3 rounded-lg bg-slate-50 p-3">
          <p class="text-[10px] font-bold uppercase tracking-wide text-slate-400">Recomendación registrada</p>
          <p class="mt-1 text-xs text-slate-600">“{{ service.recommendation }}”</p>
        </div>
      </article>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppState } from '@/store/state'

const router = useRouter()
const { state } = useAppState()
const services = computed(() => state.completedServices)
const averageRating = computed(() => {
  if (!services.value.length) return '0.0'
  const total = services.value.reduce((sum, service) => sum + service.rating, 0)
  return (total / services.value.length).toFixed(1)
})
</script>
