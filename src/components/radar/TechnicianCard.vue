<template>
  <!-- ─── Security badge modal ───────────────────────────────────────────── -->
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="showSecurityModal"
        class="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm"
        @click.self="showSecurityModal = false"
      >
        <div class="bg-white w-full max-w-md rounded-t-3xl p-6 shadow-2xl animate-slide-up">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span class="material-icons text-blue-600">verified_user</span>
            </div>
            <div>
              <h2 class="font-bold text-slate-800 text-base">Verificación de Seguridad</h2>
              <p class="text-xs text-slate-500">Filtros aplicados por el administrador</p>
            </div>
          </div>
          <div class="space-y-3">
            <div v-for="check in securityChecks" :key="check.label"
              class="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <span class="material-icons text-emerald-600 text-xl">check_circle</span>
              <div>
                <p class="text-sm font-semibold text-slate-800">{{ check.label }}</p>
                <p class="text-xs text-slate-500">{{ check.detail }}</p>
              </div>
            </div>
          </div>
          <button
            @click="showSecurityModal = false"
            class="mt-5 w-full py-3 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200 transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- ─── Main card ─────────────────────────────────────────────────────── -->
  <div
    class="relative flex gap-4 p-4 bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden"
    :class="visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
    style="transition: opacity 500ms ease, transform 500ms ease;"
  >
    <!-- Avatar -->
    <div class="shrink-0 relative">
      <img
        :src="technician.avatarUrl"
        :alt="technician.name"
        class="w-14 h-14 rounded-2xl object-cover shadow-sm"
      />
      <!-- Online indicator -->
      <span class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white"></span>
    </div>

    <!-- Info -->
    <div class="flex-1 min-w-0">
      <div class="flex items-start justify-between gap-2">
        <div class="min-w-0">
          <p class="font-bold text-slate-800 text-sm truncate">{{ technician.name }}</p>
          <p class="text-xs text-slate-500 truncate">{{ technician.specialty }}</p>
        </div>
        <!-- Price -->
        <div class="shrink-0 text-right">
          <p class="text-xl font-extrabold text-teal-600 leading-none">S/. {{ technician.price }}</p>
          <p class="text-[10px] text-slate-400 mt-0.5">tarifa base</p>
        </div>
      </div>

      <!-- Stars + jobs -->
      <div class="flex items-center gap-2 mt-1.5">
        <div class="flex items-center">
          <span
            v-for="i in 5"
            :key="i"
            class="material-icons text-sm"
            :class="i <= Math.round(technician.rating) ? 'text-amber-400' : 'text-slate-200'"
          >star</span>
        </div>
        <span class="text-xs text-slate-500 font-medium">{{ technician.rating }}</span>
        <span class="text-slate-300 text-xs">·</span>
        <span class="text-xs text-slate-500">{{ technician.jobsCompleted }} trabajos</span>
        <span class="text-slate-300 text-xs">·</span>
        <span class="text-xs text-slate-500">
          <span class="material-icons text-xs align-middle">near_me</span>
          {{ technician.distance }}
        </span>
      </div>

      <!-- Security badge (interactive) -->
      <button
        @click="showSecurityModal = true"
        class="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-semibold hover:bg-blue-100 transition-colors"
      >
        <span class="material-icons text-sm">verified</span>
        Identidad Verificada
        <span class="material-icons text-xs ml-0.5 opacity-60">info</span>
      </button>

      <!-- Action buttons -->
      <div class="flex gap-2 mt-3">
        <button
          @click="$emit('rejected', technician)"
          class="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-1"
        >
          <span class="material-icons text-base">close</span>
          Rechazar
        </button>
        <button
          @click="$emit('accepted', technician)"
          class="flex-1 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-bold hover:opacity-90 transition-opacity shadow-md shadow-teal-200 flex items-center justify-center gap-1"
        >
          <span class="material-icons text-base">check</span>
          Aceptar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Technician } from '@/store/state'

// ─── Props / emits ───────────────────────────────────────────────────────────
const props = defineProps<{ technician: Technician }>()
defineEmits<{
  (e: 'accepted', tech: Technician): void
  (e: 'rejected', tech: Technician): void
}>()

// ─── Entrance animation ──────────────────────────────────────────────────────
const visible = ref(false)
onMounted(() => {
  requestAnimationFrame(() => { visible.value = true })
})

// ─── Security modal ──────────────────────────────────────────────────────────
const showSecurityModal = ref(false)

const securityChecks = [
  { label: 'DNI Verificado', detail: 'Documento de identidad validado con RENIEC' },
  { label: 'Antecedentes Penales Limpios', detail: 'Consulta realizada en el sistema SIAGE' },
  { label: 'Evaluación Técnica Aprobada', detail: 'Prueba práctica superada con nota 18/20' },
]
</script>

<style>
@keyframes slide-up {
  from { transform: translateY(100%); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}
.animate-slide-up { animation: slide-up 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
