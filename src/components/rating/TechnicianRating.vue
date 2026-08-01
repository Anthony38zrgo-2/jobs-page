<template>
  <form
    class="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left"
    @submit.prevent="submitReview"
  >
    <div class="flex items-start gap-3">
      <span class="material-icons rounded-xl bg-amber-100 p-2 text-amber-600">reviews</span>
      <div>
        <h3 class="text-sm font-bold text-slate-800">Califica a {{ technicianName }}</h3>
        <p class="mt-1 text-xs text-slate-500">
          Tu opinión ayuda a otras personas a contratar con confianza.
        </p>
      </div>
    </div>

    <fieldset class="mt-4">
      <legend class="sr-only">Calificación del técnico</legend>
      <div class="flex justify-center gap-1" @mouseleave="hoveredRating = 0">
        <label
          v-for="star in 5"
          :key="star"
          class="cursor-pointer rounded-lg p-1 focus-within:ring-2 focus-within:ring-teal-500"
          :aria-label="`${star} ${star === 1 ? 'estrella' : 'estrellas'}`"
          @mouseenter="hoveredRating = star"
        >
          <input v-model.number="rating" class="sr-only" type="radio" name="rating" :value="star" />
          <span
            class="material-icons text-4xl transition-colors"
            :class="star <= visibleRating ? 'text-amber-400' : 'text-slate-300'"
          >star</span>
        </label>
      </div>
      <p class="mt-1 min-h-5 text-center text-xs font-semibold" :class="rating ? 'text-amber-700' : 'text-slate-400'">
        {{ ratingLabel }}
      </p>
    </fieldset>

    <label class="mt-3 block text-xs font-semibold text-slate-600">
      Cuéntanos más <span class="font-normal text-slate-400">(opcional)</span>
      <textarea
        v-model="recommendation"
        rows="3"
        maxlength="300"
        placeholder="Ej: Fue puntual y explicó el trabajo realizado."
        class="mt-1 w-full resize-none rounded-xl border border-slate-200 bg-white p-3 font-normal outline-none focus:border-teal-500"
      ></textarea>
    </label>
    <p class="mt-1 text-right text-[10px] text-slate-400">{{ recommendation.length }}/300</p>

    <p v-if="showRatingError" class="mt-2 text-center text-xs font-semibold text-rose-600" role="alert">
      Selecciona una calificación para continuar.
    </p>

    <button
      type="submit"
      class="mt-3 w-full rounded-xl py-3 text-sm font-bold text-white transition-colors"
      :class="rating ? 'bg-teal-600 hover:bg-teal-700' : 'bg-slate-300'"
    >
      Guardar calificación
    </button>
  </form>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { TechnicianReview } from '@/store/state'

defineProps<{ technicianName: string }>()
const emit = defineEmits<{ submitted: [review: TechnicianReview] }>()

const rating = ref(0)
const hoveredRating = ref(0)
const recommendation = ref('')
const showRatingError = ref(false)

const visibleRating = computed(() => hoveredRating.value || rating.value)
const ratingLabels = ['', 'Muy mala', 'Mala', 'Regular', 'Buena', 'Excelente']
const ratingLabel = computed(() => rating.value ? ratingLabels[rating.value] : 'Selecciona de 1 a 5 estrellas')

function submitReview() {
  if (!rating.value) {
    showRatingError.value = true
    return
  }

  showRatingError.value = false
  emit('submitted', {
    rating: rating.value,
    recommendation: recommendation.value.trim(),
  })
}
</script>
