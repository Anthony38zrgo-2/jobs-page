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
        <p class="text-xs font-medium text-teal-600">Confianza antes del servicio</p>
        <h1 class="text-lg font-bold text-slate-800">Especialistas verificados</h1>
      </div>
    </header>

    <main class="flex-1 space-y-4 overflow-y-auto p-4">
      <section class="rounded-2xl bg-teal-700 p-4 text-white">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-sm font-bold">Revisamos cada perfil</p>
            <p class="mt-1 text-xs leading-relaxed text-teal-100">
              DNI, antecedentes, historial y certificaciones visibles antes de contratar.
            </p>
          </div>
          <div class="flex -space-x-3">
            <img
              v-for="profile in profiles.slice(0, 3)"
              :key="profile.id"
              :src="profile.avatarUrl"
              :alt="profile.name"
              class="h-12 w-12 rounded-full border-2 border-teal-700 object-cover"
            />
          </div>
        </div>
      </section>

      <label class="relative block">
        <span class="material-icons absolute left-3 top-2.5 text-lg text-slate-400">search</span>
        <input
          v-model="query"
          type="search"
          placeholder="Buscar por nombre o especialidad"
          class="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-teal-500"
        />
      </label>

      <div class="flex gap-2 overflow-x-auto pb-1">
        <button
          v-for="filter in filters"
          :key="filter"
          class="shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold"
          :class="activeFilter === filter
            ? 'border-teal-600 bg-teal-600 text-white'
            : 'border-slate-200 bg-white text-slate-600'"
          @click="updateFilter(filter)"
        >
          {{ filter }}
        </button>
      </div>

      <p v-if="filteredProfiles.length === 0" class="rounded-xl bg-white p-6 text-center text-sm text-slate-500">
        No encontramos especialistas con ese filtro.
      </p>

      <article
        v-for="profile in filteredProfiles"
        :key="profile.id"
        class="rounded-2xl border border-slate-200 bg-white p-4"
      >
        <div class="flex gap-3">
          <img
            :src="profile.avatarUrl"
            :alt="profile.name"
            class="h-16 w-16 rounded-xl object-cover"
          />
          <div class="min-w-0 flex-1">
            <div class="flex items-start justify-between gap-2">
              <div>
                <h2 class="font-bold text-slate-800">{{ profile.name }}</h2>
                <p class="text-xs text-slate-500">{{ profile.specialty }}</p>
              </div>
              <span class="flex items-center gap-1 text-xs font-bold text-amber-600">
                <span class="material-icons text-sm">star</span>{{ profile.rating }}
              </span>
            </div>
            <p class="mt-2 text-xs text-slate-500">
              {{ profile.jobsCompleted }} servicios · {{ profile.experience }} de experiencia
            </p>
          </div>
        </div>

        <div class="mt-3 grid grid-cols-3 gap-2 text-center">
          <div class="rounded-lg bg-emerald-50 p-2">
            <span class="material-icons text-base text-emerald-600">badge</span>
            <p class="text-[10px] font-semibold text-emerald-800">DNI validado</p>
          </div>
          <div class="rounded-lg bg-emerald-50 p-2">
            <span class="material-icons text-base text-emerald-600">gavel</span>
            <p class="text-[10px] font-semibold text-emerald-800">Sin antecedentes</p>
          </div>
          <div class="rounded-lg bg-blue-50 p-2">
            <span class="material-icons text-base text-blue-600">workspace_premium</span>
            <p class="text-[10px] font-semibold text-blue-800">Certificado</p>
          </div>
        </div>

        <div class="mt-3 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
          <p class="font-semibold text-slate-700">{{ profile.certificate }}</p>
          <p class="mt-1">Última revisión de identidad: {{ profile.lastReview }}</p>
        </div>

        <button
          class="mt-3 w-full rounded-xl bg-teal-600 py-2.5 text-sm font-bold text-white"
          @click="requestProfile(profile)"
        >
          Solicitar este especialista
        </button>
      </article>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppState, type Technician } from '@/store/state'
import { CATEGORIES, MOCK_TECHNICIANS } from '@/data/categories'

type SpecialistProfile = Technician & {
  category: string
  experience: string
  certificate: string
  lastReview: string
}

const router = useRouter()
const route = useRoute()
const { setCategory, setTechnician } = useAppState()
const query = ref('')
const activeFilter = ref('Todos')
const filters = ['Todos', ...CATEGORIES.map((category) => category.name)]

watch(
  () => route.query.specialty,
  (specialty) => {
    activeFilter.value = typeof specialty === 'string' && filters.includes(specialty)
      ? specialty
      : 'Todos'
  },
  { immediate: true },
)

const profiles: SpecialistProfile[] = [
  {
    ...MOCK_TECHNICIANS[0],
    category: 'Electricistas',
    experience: '8 años',
    certificate: 'Certificación técnica SENATI · vigente',
    lastReview: 'junio 2026',
  },
  {
    ...MOCK_TECHNICIANS[1],
    category: 'Gasfiteros',
    specialty: 'Gasfitero certificado',
    experience: '6 años',
    certificate: 'Instalaciones sanitarias SENCICO · vigente',
    lastReview: 'mayo 2026',
  },
  {
    id: 3,
    name: 'María Torres',
    category: 'Carpinteros',
    specialty: 'Carpintera especialista',
    rating: 4.9,
    jobsCompleted: 224,
    avatarUrl: 'https://i.pravatar.cc/100?img=47',
    price: 60,
    distance: '2.0 km',
    experience: '10 años',
    certificate: 'Carpintería y acabados CAPECO · vigente',
    lastReview: 'julio 2026',
  },
  {
    id: 4,
    name: 'Luis Mendoza',
    category: 'Albañiles',
    specialty: 'Albañil especialista',
    rating: 4.7,
    jobsCompleted: 146,
    avatarUrl: 'https://i.pravatar.cc/100?img=11',
    price: 55,
    distance: '1.4 km',
    experience: '7 años',
    certificate: 'Construcción civil SENCICO · vigente',
    lastReview: 'julio 2026',
  },
  {
    id: 5,
    name: 'Ana Rojas',
    category: 'Melamina',
    specialty: 'Diseño e instalación en melamina',
    rating: 4.8,
    jobsCompleted: 119,
    avatarUrl: 'https://i.pravatar.cc/100?img=44',
    price: 65,
    distance: '2.3 km',
    experience: '5 años',
    certificate: 'Diseño de mobiliario técnico · vigente',
    lastReview: 'junio 2026',
  },
  {
    id: 6,
    name: 'Diego Salazar',
    category: 'Vidrios',
    specialty: 'Instalador de vidrios',
    rating: 4.6,
    jobsCompleted: 98,
    avatarUrl: 'https://i.pravatar.cc/100?img=15',
    price: 48,
    distance: '2.7 km',
    experience: '4 años',
    certificate: 'Instalación y seguridad en vidrio · vigente',
    lastReview: 'mayo 2026',
  },
]

const filteredProfiles = computed(() => {
  const normalizedQuery = query.value.trim().toLowerCase()
  return profiles.filter((profile) => {
    const matchesQuery = !normalizedQuery
      || `${profile.name} ${profile.specialty}`.toLowerCase().includes(normalizedQuery)
    const matchesFilter = activeFilter.value === 'Todos'
      || profile.category === activeFilter.value
    return matchesQuery && matchesFilter
  })
})

function updateFilter(filter: string) {
  const nextQuery = { ...route.query }
  if (filter === 'Todos') delete nextQuery.specialty
  else nextQuery.specialty = filter
  router.replace({ query: nextQuery })
}

function requestProfile(profile: SpecialistProfile) {
  setTechnician(profile)
  const category = CATEGORIES.find((item) => item.name === profile.category)
  setCategory(category ?? {
    name: profile.category,
    icon: 'home_repair_service',
    placeholder: `Describe el trabajo que quieres solicitar a ${profile.name}...`,
  })
  router.push('/request')
}
</script>
