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

      <section class="rounded-2xl border-2 border-blue-200 bg-white p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wide text-blue-600">Servicio en curso</p>
            <h2 class="mt-1 text-base font-bold text-slate-800">{{ activeService.category }}</h2>
          </div>
          <span class="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">En proceso</span>
        </div>

        <div class="mt-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
          <img :src="activeService.avatarUrl" :alt="activeService.name" class="h-12 w-12 rounded-xl object-cover" />
          <div class="flex-1">
            <p class="text-sm font-bold text-slate-800">{{ activeService.name }}</p>
            <p class="text-xs text-slate-500">{{ activeService.specialty }}</p>
            <p class="mt-1 text-xs font-semibold text-emerald-600">Llegada estimada: 10:20 a. m.</p>
          </div>
        </div>

        <div class="mt-3 grid grid-cols-[1fr_116px] gap-3">
          <div class="relative min-h-36 overflow-hidden rounded-xl bg-slate-100">
            <div class="absolute left-0 right-0 top-1/3 h-px bg-white"></div>
            <div class="absolute bottom-1/4 left-0 right-0 h-px bg-white"></div>
            <div class="absolute bottom-[35%] left-[18%] h-1 w-[55%] -rotate-12 rounded bg-blue-500"></div>
            <img :src="activeService.avatarUrl" alt="Técnico en camino" class="absolute bottom-[22%] left-[12%] h-9 w-9 rounded-full border-2 border-white object-cover shadow" />
            <span class="material-icons absolute right-[15%] top-[16%] rounded-full bg-emerald-500 p-1.5 text-white">home</span>
            <p class="absolute left-3 top-3 text-[10px] font-bold text-slate-600">Ubicación en tiempo real</p>
          </div>
          <div class="rounded-xl border border-slate-200 p-2 text-center">
            <p class="text-[10px] font-bold text-slate-700">Código QR</p>
            <img :src="activeQrImage" alt="QR para validar al técnico" class="mx-auto mt-1 h-20 w-20" />
            <p class="mt-1 text-[9px] text-slate-500">Escanea para validar</p>
          </div>
        </div>

        <div class="mt-3 grid grid-cols-2 gap-2">
          <button class="rounded-xl bg-blue-50 px-2 py-2.5 text-xs font-bold text-blue-700" @click="locationShared = true">
            <span class="material-icons mr-1 align-middle text-base">{{ locationShared ? 'check_circle' : 'share_location' }}</span>
            {{ locationShared ? 'Compartida' : 'Compartir ubicación' }}
          </button>
          <button class="rounded-xl px-2 py-2.5 text-xs font-bold" :class="emergencySent ? 'bg-rose-100 text-rose-800' : 'bg-rose-600 text-white'" @click="emergencySent = true">
            <span class="material-icons mr-1 align-middle text-base">emergency</span>
            {{ emergencySent ? 'Alerta enviada' : 'Emergencia' }}
          </button>
        </div>
      </section>

      <div class="flex items-center justify-between pt-1">
        <h2 class="text-sm font-bold text-slate-800">Servicios cerrados</h2>
        <span class="text-xs text-slate-400">Solo lectura</span>
      </div>

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
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppState } from '@/store/state'

const router = useRouter()
const { state } = useAppState()
const services = computed(() => state.completedServices)
const locationShared = ref(false)
const emergencySent = ref(false)
const activeService = computed(() => state.selectedTechnician
  ? { ...state.selectedTechnician, category: state.selectedCategory?.name ?? 'Servicio técnico' }
  : {
      id: 1,
      name: 'Juan Pérez',
      specialty: 'Electricista certificado',
      category: 'Revisión eléctrica',
      avatarUrl: 'https://i.pravatar.cc/100?img=12',
    })
const activeQrImage = computed(() => {
  const data = encodeURIComponent(`Plataforma de Confianza   - Tecnicos del Hogar  - ConfiaHogar|tecnico:${activeService.value.id}|servicio-en-curso`)
  return `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${data}`
})
const averageRating = computed(() => {
  if (!services.value.length) return '0.0'
  const total = services.value.reduce((sum, service) => sum + service.rating, 0)
  return (total / services.value.length).toFixed(1)
})
</script>
