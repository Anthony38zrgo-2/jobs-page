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
        <p class="text-xs font-medium text-teal-600">Nuevo técnico</p>
        <h1 class="text-lg font-bold text-slate-800">Postulación y filtro</h1>
      </div>
    </header>

    <main class="flex-1 overflow-y-auto p-4">
      <div v-if="submitted" class="rounded-2xl border border-emerald-200 bg-white p-6 text-center">
        <img
          src="https://i.pravatar.cc/160?img=13"
          alt="Foto referencial del postulante"
          class="mx-auto h-24 w-24 rounded-2xl object-cover"
        />
        <span class="material-icons mt-4 text-5xl text-emerald-500">task_alt</span>
        <h2 class="mt-2 text-xl font-bold text-slate-800">Registro enviado</h2>
        <p class="mt-2 text-sm text-slate-500">
          Revisaremos tu identidad, antecedentes y documentos antes de activar el perfil.
        </p>
        <div class="mt-4 rounded-xl bg-slate-50 p-4 text-left text-sm">
          <p><strong>Postulante:</strong> {{ form.name }}</p>
          <p class="mt-1"><strong>Especialidad:</strong> {{ form.specialty }}</p>
          <p class="mt-1"><strong>Calificación inicial estimada:</strong> {{ initialRating }}/5</p>
          <p class="mt-1 text-amber-700"><strong>Estado:</strong> En revisión</p>
        </div>
        <button class="mt-5 w-full rounded-xl bg-teal-600 py-3 font-bold text-white" @click="router.push('/')">
          Volver al inicio
        </button>
      </div>

      <form v-else class="space-y-4" @submit.prevent="submit">
        <section class="rounded-2xl border border-slate-200 bg-white p-4">
          <div class="mb-3 flex items-center gap-2">
            <span class="flex h-7 w-7 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">1</span>
            <h2 class="text-sm font-bold text-slate-800">Validación inicial</h2>
          </div>
          <label v-for="item in initialChecks" :key="item.key" class="mb-2 flex items-start gap-2 text-xs text-slate-600">
            <input v-model="checks[item.key]" type="checkbox" class="mt-0.5 accent-teal-600" />
            <span>{{ item.label }}</span>
          </label>
          <p class="mt-2 rounded-lg bg-amber-50 p-2 text-[11px] text-amber-800">
            La plataforma verificará antecedentes y reputación con fuentes autorizadas.
          </p>
        </section>

        <section class="rounded-2xl border border-slate-200 bg-white p-4">
          <div class="mb-3 flex items-center gap-2">
            <span class="flex h-7 w-7 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">2</span>
            <h2 class="text-sm font-bold text-slate-800">Registro del técnico</h2>
          </div>
          <div class="space-y-3">
            <label class="block text-xs font-semibold text-slate-600">
              Nombre completo
              <input v-model="form.name" required class="mt-1 w-full rounded-lg border border-slate-200 p-2.5 font-normal outline-none focus:border-teal-500" />
            </label>
            <label class="block text-xs font-semibold text-slate-600">
              DNI
              <input v-model="form.dni" required maxlength="8" inputmode="numeric" class="mt-1 w-full rounded-lg border border-slate-200 p-2.5 font-normal outline-none focus:border-teal-500" />
            </label>
            <label class="block text-xs font-semibold text-slate-600">
              Especialidad
              <select v-model="form.specialty" required class="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2.5 font-normal outline-none focus:border-teal-500">
                <option disabled value="">Selecciona una opción</option>
                <option>Electricidad</option>
                <option>Gasfitería</option>
                <option>Carpintería</option>
                <option>Albañilería</option>
              </select>
            </label>
          </div>
        </section>

        <section class="rounded-2xl border border-slate-200 bg-white p-4">
          <div class="mb-3 flex items-center gap-2">
            <span class="flex h-7 w-7 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">3</span>
            <h2 class="text-sm font-bold text-slate-800">Certificación y experiencia</h2>
          </div>
          <button
            type="button"
            class="flex w-full items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 text-left"
            @click="certificateUploaded = true"
          >
            <span class="material-icons text-2xl" :class="certificateUploaded ? 'text-emerald-600' : 'text-slate-400'">
              {{ certificateUploaded ? 'check_circle' : 'upload_file' }}
            </span>
            <span>
              <span class="block text-xs font-bold text-slate-700">
                {{ certificateUploaded ? 'certificado_tecnico.pdf' : 'Adjuntar certificado' }}
              </span>
              <span class="text-[11px] text-slate-400">Carga simulada para el mockup</span>
            </span>
          </button>
          <label class="mt-3 block text-xs font-semibold text-slate-600">
            Años de experiencia
            <input v-model.number="form.experience" required min="0" max="50" type="number" class="mt-1 w-full rounded-lg border border-slate-200 p-2.5 font-normal outline-none focus:border-teal-500" />
          </label>
          <label class="mt-3 block text-xs font-semibold text-slate-600">
            Experiencia laboral
            <textarea v-model="form.workHistory" required rows="3" placeholder="Empresa, trabajos realizados o referencias" class="mt-1 w-full resize-none rounded-lg border border-slate-200 p-2.5 font-normal outline-none focus:border-teal-500"></textarea>
          </label>
        </section>

        <section class="rounded-2xl border border-slate-200 bg-white p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-bold text-slate-800">Calificación inicial estimada</p>
              <p class="text-[11px] text-slate-500">Se confirma después de la evaluación técnica.</p>
            </div>
            <span class="flex items-center gap-1 text-xl font-extrabold text-amber-500">
              {{ initialRating }} <span class="material-icons">star</span>
            </span>
          </div>
        </section>

        <button
          type="submit"
          :disabled="!canSubmit"
          class="w-full rounded-xl py-3.5 font-bold text-white"
          :class="canSubmit ? 'bg-teal-600' : 'cursor-not-allowed bg-slate-300'"
        >
          Enviar postulación
        </button>
      </form>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const submitted = ref(false)
const certificateUploaded = ref(false)
const checks = reactive<Record<string, boolean>>({
  background: false,
  reputation: false,
  consent: false,
})
const initialChecks = [
  { key: 'background', label: 'Declaro no tener antecedentes incompatibles con el servicio.' },
  { key: 'reputation', label: 'Autorizo la revisión de referencias y reputación laboral.' },
  { key: 'consent', label: 'Autorizo la validación de mi identidad y documentos.' },
]
const form = reactive({
  name: '',
  dni: '',
  specialty: '',
  experience: 0,
  workHistory: '',
})

const initialRating = computed(() => {
  const score = 3 + (certificateUploaded.value ? 1 : 0) + (form.experience >= 2 ? 0.5 : 0)
  return score.toFixed(1)
})
const canSubmit = computed(() =>
  Object.values(checks).every(Boolean)
  && form.name.trim().length > 2
  && /^\d{8}$/.test(form.dni)
  && Boolean(form.specialty)
  && form.workHistory.trim().length > 5
  && certificateUploaded.value,
)

function submit() {
  if (canSubmit.value) submitted.value = true
}
</script>
