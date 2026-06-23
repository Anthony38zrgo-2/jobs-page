<template>
  <div class="flex flex-col bg-white min-h-screen max-w-md mx-auto shadow-2xl overflow-hidden">
    <!-- Top bar -->
    <div class="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100 shrink-0">
      <div class="w-9 h-9"></div>
      <div class="text-center">
        <p class="text-xs text-slate-400 uppercase tracking-widest font-medium">Finalizar Servicio</p>
        <h1 class="text-sm font-bold text-slate-800">Código de Validación</h1>
      </div>
      <div class="w-9 h-9"></div>
    </div>

    <div class="flex-1 overflow-y-auto px-5 py-6 space-y-6">

      <!-- ── Technician summary ─────────────────────────────────────────── -->
      <div class="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <img :src="tech?.avatarUrl" alt="tech" class="w-12 h-12 rounded-xl object-cover shadow-sm" />
        <div class="flex-1 min-w-0">
          <p class="font-bold text-slate-800 text-sm">{{ tech?.name }}</p>
          <p class="text-xs text-slate-500">{{ tech?.specialty }}</p>
        </div>
        <div class="text-right shrink-0">
          <p class="text-lg font-extrabold text-teal-600">S/. {{ tech?.price.toFixed(2) }}</p>
          <p class="text-[10px] text-slate-400">oferta aceptada</p>
        </div>
      </div>

      <!-- ── OTP section ───────────────────────────────────────────────── -->
      <div>
        <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 text-center">
          Ingresa el código de 4 dígitos
        </p>
        <p class="text-xs text-slate-400 text-center mb-4">
          El técnico lo tiene en su dispositivo
        </p>

        <!-- 4 OTP boxes -->
        <div class="grid grid-cols-4 gap-2 max-w-xs mx-auto">
          <input
            v-for="(_, idx) in otpDigits"
            :key="idx"
            :ref="el => { if (el) inputRefs[idx] = el as HTMLInputElement }"
            v-model="otpDigits[idx]"
            @input="onOtpInput(idx)"
            @keydown.backspace="onBackspace(idx)"
            maxlength="1"
            inputmode="numeric"
            type="text"
            class="w-full aspect-square text-center text-2xl font-bold border-2 rounded-2xl outline-none transition-all duration-200 focus:border-teal-500 focus:shadow-md focus:shadow-teal-100"
            :class="[
              otpDigits[idx]
                ? 'border-teal-400 bg-teal-50 text-teal-700'
                : 'border-slate-200 bg-slate-50 text-slate-800',
              validated && otpDigits[idx] ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : '',
            ]"
          />
        </div>

        <!-- Error state -->
        <Transition name="fade">
          <p v-if="otpError" class="text-xs text-rose-600 text-center mt-3 flex items-center justify-center gap-1">
            <span class="material-icons text-sm">error</span>
            Código incorrecto. Inténtalo de nuevo.
          </p>
        </Transition>
      </div>

      <!-- ── Confirm button ─────────────────────────────────────────────── -->
      <button
        v-if="!validated"
        @click="confirm"
        :disabled="otpComplete === false"
        :class="[
          'w-full py-4 rounded-2xl font-bold text-white text-base transition-all duration-200',
          otpComplete
            ? 'bg-gradient-to-r from-teal-500 to-emerald-600 shadow-lg shadow-teal-200 hover:opacity-90 active:scale-95'
            : 'bg-slate-300 cursor-not-allowed',
        ]"
      >
        Confirmar Finalización
      </button>

      <!-- ── Commission breakdown (receipt style) ───────────────────────── -->
      <Transition name="receipt">
        <div
          v-if="validated"
          class="bg-white p-5 rounded-2xl border-2 border-dashed border-slate-300 shadow-sm space-y-3"
        >
          <!-- Receipt header -->
          <div class="flex items-center gap-2 mb-2">
            <span class="material-icons text-teal-600">receipt_long</span>
            <h3 class="font-bold text-slate-800 text-sm">Desglose del Pago</h3>
          </div>

          <div class="space-y-2 text-sm">
            <div class="flex justify-between items-center py-2 border-b border-slate-100">
              <span class="text-slate-600">Costo del Servicio</span>
              <span class="font-semibold text-slate-800">S/. {{ tech?.price.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-slate-100">
              <span class="text-slate-600 flex items-center gap-1">
                Comisión de la App
                <span class="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full font-medium">10%</span>
              </span>
              <span class="font-semibold text-rose-500">- S/. {{ commission.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between items-center py-2.5 bg-emerald-50 rounded-xl px-3 -mx-1">
              <span class="font-bold text-slate-800">Pago al Técnico</span>
              <span class="font-extrabold text-emerald-700 text-base">S/. {{ netAmount.toFixed(2) }}</span>
            </div>
          </div>

          <!-- Divider dots to simulate receipt tearing -->
          <div class="flex gap-1 justify-center mt-2">
            <div v-for="i in 20" :key="i" class="w-1 h-1 rounded-full bg-slate-200"></div>
          </div>
        </div>
      </Transition>

      <!-- ── Success screen ─────────────────────────────────────────────── -->
      <Transition name="success">
        <div v-if="showSuccess" class="flex flex-col items-center gap-3 py-4 text-center">
          <!-- Animated check -->
          <div class="relative w-20 h-20 flex items-center justify-center">
            <div class="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-50"></div>
            <div class="relative w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center shadow-xl shadow-emerald-200">
              <span class="material-icons text-4xl text-white">check</span>
            </div>
          </div>
          <h2 class="text-xl font-extrabold text-slate-800 mt-2">¡Servicio Completado!</h2>
          <p class="text-sm text-slate-500 max-w-xs">
            El pago fue procesado y S/. {{ netAmount.toFixed(2) }} fue transferido
            al monedero de <strong>{{ tech?.name }}</strong>.
          </p>
          <div class="flex items-center gap-1.5 text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-100 font-medium">
            <span class="material-icons text-sm">verified</span>
            Comisión de la plataforma registrada
          </div>

          <!-- Confetti dots (CSS only) -->
          <div class="relative w-full h-16 overflow-hidden pointer-events-none">
            <div
              v-for="(dot, i) in confettiDots"
              :key="i"
              class="absolute w-2 h-2 rounded-full"
              :class="dot.color"
              :style="{ left: dot.x, top: dot.y, animationDelay: dot.delay }"
              style="animation: confettiFall 1s ease-out forwards;"
            ></div>
          </div>

          <!-- Reset button -->
          <button
            @click="resetAndGoHome"
            class="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-bold text-base shadow-lg shadow-teal-200 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <span class="material-icons">home</span>
            Volver al Inicio
          </button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAppState } from '@/store/state'

const router = useRouter()
const { state, setOtp, setViewState, resetAll } = useAppState()

const tech = computed(() => state.selectedTechnician)

// ─── Commission calculations ──────────────────────────────────────────────────
const commission = computed(() => (tech.value?.price ?? 0) * 0.1)
const netAmount   = computed(() => (tech.value?.price ?? 0) - commission.value)

// ─── OTP logic ────────────────────────────────────────────────────────────────
const otpDigits = ref<string[]>(['', '', '', ''])
const inputRefs  = ref<HTMLInputElement[]>([])
const otpError   = ref(false)
const validated  = ref(false)
const showSuccess = ref(false)

const otpComplete = computed(() => otpDigits.value.every(d => d.length === 1))

function onOtpInput(idx: number) {
  const val = otpDigits.value[idx]
  // Keep only last digit (safety)
  if (val.length > 1) otpDigits.value[idx] = val.slice(-1)
  // Strip non-numeric
  otpDigits.value[idx] = otpDigits.value[idx].replace(/\D/, '')
  // Auto-advance
  if (otpDigits.value[idx] && idx < 3) {
    nextTick(() => inputRefs.value[idx + 1]?.focus())
  }
}

function onBackspace(idx: number) {
  if (!otpDigits.value[idx] && idx > 0) {
    nextTick(() => inputRefs.value[idx - 1]?.focus())
  }
}

function confirm() {
  if (!otpComplete.value) return
  const code = otpDigits.value.join('')
  setOtp(code)
  // Accept any 4-digit code (demo)
  otpError.value = false
  validated.value = true
  setTimeout(() => { showSuccess.value = true }, 600)
}

// ─── Confetti dots ────────────────────────────────────────────────────────────
const confettiColors = ['bg-teal-400','bg-emerald-400','bg-amber-400','bg-rose-400','bg-blue-400']
const confettiDots = Array.from({ length: 18 }, (_, i) => ({
  color: confettiColors[i % confettiColors.length],
  x: `${Math.random() * 100}%`,
  y: `${Math.random() * 40}%`,
  delay: `${Math.random() * 0.6}s`,
}))

// ─── Reset ────────────────────────────────────────────────────────────────────
function resetAndGoHome() {
  resetAll()
  router.push('/')
}
</script>

<style>
@keyframes confettiFall {
  0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
  100% { transform: translateY(60px) rotate(360deg); opacity: 0; }
}

/* Receipt reveal */
.receipt-enter-active { transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
.receipt-enter-from   { opacity: 0; transform: translateY(16px) scaleY(0.8); transform-origin: top; }

/* Success reveal */
.success-enter-active { transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
.success-enter-from   { opacity: 0; transform: translateY(32px) scale(0.9); }

/* Fade utility */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
