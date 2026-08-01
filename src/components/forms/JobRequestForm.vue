<template>
  <!-- ─── Mobile shell ─────────────────────────────────────────────────── -->
  <div class="relative flex flex-col bg-white min-h-screen max-w-md mx-auto shadow-2xl overflow-hidden">
    <!-- Top status bar -->
    <div class="flex items-center justify-between px-5 pt-4 pb-2 bg-white border-b border-slate-100 shrink-0">
      <button
        @click="router.back()"
        class="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
      >
        <span class="material-icons text-slate-600 text-xl">arrow_back</span>
      </button>
      <div class="text-center">
        <p class="text-xs text-slate-400 font-medium uppercase tracking-widest">Solicitud</p>
        <h1 class="text-sm font-bold text-slate-800 leading-tight">
          {{ selectedCategory?.name ?? 'Servicio' }}
        </h1>
      </div>
      <div
        class="flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-semibold px-2 py-1 rounded-full border border-emerald-200"
      >
        <span class="material-icons text-xs">verified_user</span>
        Seguro
      </div>
    </div>

    <!-- Scrollable content -->
    <div class="flex-1 overflow-y-auto px-5 py-4 space-y-5">

      <!-- ── Textarea ──────────────────────────────────────────────────── -->
      <div>
        <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Describe el problema
        </label>
        <div
          class="relative rounded-2xl border-2 transition-colors duration-200"
          :class="textareaFocused ? 'border-teal-400 shadow-sm shadow-teal-100' : 'border-slate-200'"
        >
          <textarea
            v-model="description"
            rows="4"
            :placeholder="dynamicPlaceholder"
            @focus="textareaFocused = true"
            @blur="textareaFocused = false"
            class="w-full resize-none bg-transparent px-4 pt-4 pb-3 text-sm text-slate-800 placeholder-slate-400 outline-none rounded-2xl"
          ></textarea>
          <div class="absolute bottom-3 right-4 text-xs text-slate-300 select-none">
            {{ description.length }} / 500
          </div>
        </div>
      </div>

      <!-- ── File upload area ──────────────────────────────────────────── -->
      <div>
        <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Evidencia Fotográfica
        </label>

        <!-- Empty state -->
        <div
          v-if="!fileState"
          @click="triggerFileInput"
          @dragover.prevent="dragOver = true"
          @dragleave="dragOver = false"
          @drop.prevent="handleDrop"
          :class="[
            'relative flex flex-col items-center justify-center gap-2 h-32 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200',
            dragOver
              ? 'border-teal-400 bg-teal-50'
              : 'border-slate-300 bg-slate-50 hover:border-teal-300 hover:bg-teal-50/50',
          ]"
        >
          <span class="material-icons text-3xl text-slate-400">cloud_upload</span>
          <p class="text-sm text-slate-500 font-medium">Haz clic o arrastra tu foto aquí</p>
          <p class="text-xs text-slate-400">JPG, PNG hasta 10 MB</p>
          <input ref="fileInputRef" type="file" accept="image/*" class="hidden" @change="handleFileChange" />
        </div>

        <!-- Loading state -->
        <div
          v-else-if="fileState === 'loading'"
          class="flex items-center justify-center gap-3 h-32 rounded-2xl border border-slate-200 bg-slate-50"
        >
          <svg class="animate-spin h-6 w-6 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <span class="text-sm text-slate-600 font-medium">Cargando evidencia_error.jpg…</span>
        </div>

        <!-- Loaded state -->
        <div
          v-else-if="fileState === 'loaded'"
          class="relative flex items-center gap-4 h-32 rounded-2xl border border-slate-200 bg-slate-50 px-4 overflow-hidden"
        >
          <img
            src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200&q=80"
            alt="evidencia"
            class="h-20 w-20 object-cover rounded-xl shadow-sm shrink-0"
          />
          <div class="min-w-0">
            <p class="text-sm font-semibold text-slate-800 truncate">evidencia_error.jpg</p>
            <p class="text-xs text-slate-400 mt-0.5">2.4 MB · Imagen lista</p>
            <div class="flex items-center gap-1 mt-1.5 text-emerald-600 text-xs font-medium">
              <span class="material-icons text-sm">check_circle</span>
              Subido correctamente
            </div>
          </div>
          <!-- Delete button -->
          <button
            @click="clearFile"
            class="absolute top-2 right-2 w-7 h-7 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center hover:bg-rose-200 transition-colors"
          >
            <span class="material-icons text-sm">delete</span>
          </button>
        </div>
      </div>

      <!-- ── Selected technician location ─────────────────────────────── -->
      <div>
        <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Ubicación en tiempo real
        </label>
        <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div class="flex items-center gap-3 border-b border-slate-100 p-3">
            <img :src="selectedTechnician?.avatarUrl" :alt="selectedTechnician?.name" class="h-10 w-10 rounded-xl object-cover" />
            <div class="flex-1">
              <p class="text-sm font-bold text-slate-800">{{ selectedTechnician?.name ?? 'Técnico seleccionado' }}</p>
              <p class="text-xs text-emerald-600">En camino · llegada estimada 10:20 a. m.</p>
            </div>
            <span class="material-icons text-emerald-600">verified</span>
          </div>

          <div class="relative h-48 overflow-hidden bg-slate-100 select-none">
          <div class="absolute inset-0">
              <div class="absolute top-[28%] left-0 right-0 h-px bg-white"></div>
              <div class="absolute top-[62%] left-0 right-0 h-px bg-white"></div>
              <div class="absolute left-[28%] top-0 bottom-0 w-px bg-white"></div>
              <div class="absolute left-[68%] top-0 bottom-0 w-px bg-white"></div>
              <div class="absolute left-[18%] top-[64%] h-1 w-[48%] -rotate-12 rounded-full bg-blue-500"></div>
              <div class="absolute left-[60%] top-[43%] h-1 w-[20%] rotate-[-38deg] rounded-full bg-blue-500"></div>
            </div>

            <div class="absolute left-[15%] top-[58%] text-center">
              <img :src="selectedTechnician?.avatarUrl" alt="Ubicación del técnico" class="h-10 w-10 rounded-full border-2 border-white object-cover shadow" />
              <p class="mt-1 rounded bg-white px-1 text-[9px] font-bold text-blue-700">Técnico</p>
            </div>
            <div class="absolute right-[15%] top-[24%] text-center">
              <span class="material-icons rounded-full bg-emerald-500 p-2 text-white shadow">home</span>
              <p class="mt-1 rounded bg-white px-1 text-[9px] font-bold text-emerald-700">Tu domicilio</p>
            </div>
            <div class="absolute bottom-2 right-2 rounded bg-white/80 px-2 py-1 text-[9px] text-slate-400">
              Seguimiento simulado
            </div>
          </div>
          <button
            type="button"
            class="flex w-full items-center justify-center gap-2 border-t border-slate-100 px-3 py-3 text-sm font-bold"
            :class="locationShared ? 'bg-emerald-50 text-emerald-700' : 'text-blue-700'"
            @click="locationShared = true"
          >
            <span class="material-icons text-lg">{{ locationShared ? 'check_circle' : 'share_location' }}</span>
            {{ locationShared ? 'Ubicación compartida con familiares' : 'Compartir ubicación con familiares' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ── Submit button (fixed bottom) ────────────────────────────────── -->
    <div class="shrink-0 px-5 pb-6 pt-3 bg-white border-t border-slate-100">
      <button
        @click="submit"
        :disabled="!description.trim()"
        :class="[
          'w-full py-4 rounded-2xl font-bold text-white text-base transition-all duration-200 flex items-center justify-center gap-2',
          description.trim()
            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-teal-200 active:scale-95'
            : 'bg-slate-300 cursor-not-allowed',
        ]"
      >
        <span class="material-icons text-xl">send</span>
        Enviar a {{ selectedTechnician?.name ?? 'técnico elegido' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppState } from '@/store/state'

// ─── State ──────────────────────────────────────────────────────────────────
const router = useRouter()
const { state, setJobDescription, setUploadedFile } = useAppState()

const selectedCategory = computed(() => state.selectedCategory)
const selectedTechnician = computed(() => state.selectedTechnician)

const dynamicPlaceholder = computed(() => {
  return selectedCategory.value?.placeholder
    ?? 'Ej: Describe el problema con el mayor detalle posible...'
})

const description = ref(state.jobDescription)
const textareaFocused = ref(false)
const dragOver = ref(false)
const locationShared = ref(false)

// ─── File upload logic ───────────────────────────────────────────────────────
type FileState = null | 'loading' | 'loaded'
const fileState = ref<FileState>(state.uploadedFile ? 'loaded' : null)
const fileInputRef = ref<HTMLInputElement | null>(null)

function triggerFileInput() {
  fileInputRef.value?.click()
}

function simulateUpload() {
  fileState.value = 'loading'
  setTimeout(() => {
    fileState.value = 'loaded'
    setUploadedFile('evidencia_error.jpg')
  }, 1200)
}

function handleFileChange() {
  simulateUpload()
}

function handleDrop(e: DragEvent) {
  dragOver.value = false
  if (e.dataTransfer?.files.length) simulateUpload()
}

function clearFile() {
  fileState.value = null
  setUploadedFile(null)
  if (fileInputRef.value) fileInputRef.value.value = ''
}

// ─── Submit ──────────────────────────────────────────────────────────────────
function submit() {
  if (!description.value.trim()) return
  setJobDescription(description.value)
  router.push('/radar')
}
</script>
