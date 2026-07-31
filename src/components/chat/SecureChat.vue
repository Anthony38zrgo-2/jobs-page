<template>
  <!-- ─── Block alert toast ─────────────────────────────────────────────── -->
  <Teleport to="body">
    <Transition name="toast">
      <div
        v-if="showBlockAlert"
        class="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-rose-600 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 max-w-xs"
      >
        <span class="material-icons text-base">shield</span>
        <span>Mensaje bloqueado por políticas de seguridad</span>
      </div>
    </Transition>
  </Teleport>

  <Teleport to="body">
    <div
      v-if="activeSafetyTool"
      class="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
      @click.self="activeSafetyTool = null"
    >
      <div class="w-full max-w-md rounded-t-2xl bg-white p-5">
        <template v-if="activeSafetyTool === 'location'">
          <span class="material-icons text-3xl text-blue-600"
            >share_location</span
          >
          <h2 class="mt-2 text-lg font-bold text-slate-800">
            Compartir ubicación
          </h2>
          <p class="mt-1 text-sm text-slate-500">
            Envía a un familiar un enlace simulado con el seguimiento de este
            servicio.
          </p>
          <input
            v-model="familyContact"
            type="text"
            placeholder="Nombre o teléfono del familiar"
            class="mt-4 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"
          />
          <button
            class="mt-3 w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white disabled:bg-slate-300"
            :disabled="!familyContact.trim()"
            @click="shareLocation"
          >
            Compartir seguimiento
          </button>
        </template>

        <template v-else-if="activeSafetyTool === 'qr'">
          <div class="text-center">
            <span class="material-icons text-3xl text-teal-600">qr_code_2</span>
            <h2 class="mt-2 text-lg font-bold text-slate-800">
              Validar al técnico
            </h2>
            <p class="mt-1 text-sm text-slate-500">
              Escanea el código y compara el nombre antes de permitir el
              ingreso.
            </p>
            <img
              :src="qrImage"
              alt="Código QR de validación del técnico"
              class="mx-auto mt-4 h-40 w-40 rounded-xl border border-slate-200 p-2"
            />
            <p class="mt-3 text-sm font-bold text-slate-800">
              {{ tech?.name }}
            </p>
            <p class="text-xs text-emerald-600">
              Identidad verificada · ID JP-{{ tech?.id ?? "00" }}
            </p>
          </div>
        </template>

        <template v-else>
          <span class="material-icons text-4xl text-rose-600">emergency</span>
          <h2 class="mt-2 text-lg font-bold text-slate-800">
            Botón de emergencia
          </h2>
          <p class="mt-1 text-sm text-slate-500">
            Esta acción avisará a tu contacto de confianza y a soporte con la
            ubicación del servicio.
          </p>
          <button
            class="mt-4 w-full rounded-xl bg-rose-600 py-3 text-sm font-bold text-white"
            @click="sendEmergency"
          >
            Confirmar alerta
          </button>
        </template>

        <button
          class="mt-2 w-full rounded-xl bg-slate-100 py-3 text-sm font-semibold text-slate-600"
          @click="activeSafetyTool = null"
        >
          Cerrar
        </button>
      </div>
    </div>
  </Teleport>

  <div
    class="flex flex-col bg-white min-h-screen max-w-md mx-auto shadow-2xl overflow-hidden"
  >
    <!-- ── Fixed security banner ────────────────────────────────────────── -->
    <div
      class="shrink-0 bg-amber-50 text-amber-900 border-b border-amber-200 p-3 text-xs flex items-center gap-2"
    >
      <span class="material-icons text-amber-600 text-base shrink-0"
        >warning</span
      >
      <span>
        Por tu seguridad, <strong>no compartas</strong> teléfonos, tarjetas, ni
        hagas pagos fuera de la plataforma.
      </span>
    </div>

    <!-- ── Chat header ───────────────────────────────────────────────────── -->
    <div
      class="shrink-0 flex items-center gap-3 px-4 py-3 border-b border-slate-100 bg-white"
    >
      <button
        @click="router.back()"
        class="w-8 h-8 rounded-full hover:bg-slate-100 transition-colors flex items-center justify-center"
      >
        <span class="material-icons text-slate-500 text-lg">arrow_back</span>
      </button>
      <div class="relative shrink-0">
        <img
          :src="tech?.avatarUrl"
          :alt="tech?.name"
          class="w-10 h-10 rounded-full object-cover"
        />
        <span
          class="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white"
        ></span>
      </div>
      <div class="flex-1 min-w-0">
        <p class="font-bold text-slate-800 text-sm truncate">
          {{ tech?.name ?? "Técnico" }}
        </p>
        <p class="text-xs text-emerald-500 font-medium">
          En línea · S/. {{ tech?.price.toFixed(2) }}
        </p>
      </div>
      <div class="shrink-0 flex items-center gap-1 text-blue-600 text-xs">
        <span class="material-icons text-base">verified</span>
        <span class="hidden sm:inline font-semibold">Verificado</span>
      </div>
    </div>

    <div
      class="grid shrink-0 grid-cols-3 gap-2 border-b border-slate-100 bg-white px-4 py-3"
    >
      <button
        class="rounded-xl bg-blue-50 p-2 text-center text-blue-700"
        @click="activeSafetyTool = 'location'"
      >
        <span class="material-icons block text-xl">share_location</span>
        <span class="text-[10px] font-bold">Compartir ubicación</span>
      </button>
      <button
        class="rounded-xl bg-teal-50 p-2 text-center text-teal-700"
        @click="activeSafetyTool = 'qr'"
      >
        <span class="material-icons block text-xl">qr_code_2</span>
        <span class="text-[10px] font-bold">Validar QR</span>
      </button>
      <button
        class="rounded-xl bg-rose-50 p-2 text-center text-rose-700"
        @click="activeSafetyTool = 'emergency'"
      >
        <span class="material-icons block text-xl">emergency</span>
        <span class="text-[10px] font-bold">Emergencia</span>
      </button>
    </div>

    <div
      v-if="safetyNotice"
      class="shrink-0 border-b px-4 py-2 text-center text-xs font-semibold"
      :class="
        emergencySent
          ? 'border-rose-200 bg-rose-100 text-rose-800'
          : 'border-blue-200 bg-blue-100 text-blue-800'
      "
    >
      {{ safetyNotice }}
    </div>

    <!-- ── Messages ──────────────────────────────────────────────────────── -->
    <div
      ref="messagesContainer"
      class="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50"
    >
      <!-- Welcome message -->
      <div class="flex justify-center">
        <span
          class="text-[11px] text-slate-400 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100"
        >
          Conversación segura iniciada
        </span>
      </div>

      <TransitionGroup name="msg">
        <div
          v-for="msg in messages"
          :key="msg.id"
          class="flex"
          :class="msg.from === 'user' ? 'justify-end' : 'justify-start'"
        >
          <!-- Tech avatar (only for tech messages) -->
          <img
            v-if="msg.from === 'tech'"
            :src="tech?.avatarUrl"
            class="w-7 h-7 rounded-full object-cover mr-2 self-end shrink-0"
            alt="tech"
          />

          <div
            class="max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed"
            :class="[
              msg.from === 'user'
                ? 'bg-teal-600 text-white rounded-br-sm'
                : 'bg-white text-slate-800 shadow-sm border border-slate-100 rounded-bl-sm',
              msg.blocked
                ? 'bg-rose-100 text-rose-700 border border-rose-200'
                : '',
            ]"
          >
            <span v-if="msg.blocked" class="flex items-center gap-1.5">
              <span class="material-icons text-sm text-rose-500">block</span>
              <em>{{ msg.content }}</em>
            </span>
            <span v-else>{{ msg.content }}</span>
            <p
              class="text-[10px] mt-1 opacity-60 text-right"
              :class="msg.from === 'user' ? 'text-teal-100' : 'text-slate-400'"
            >
              {{ formatTime(msg.timestamp) }}
            </p>
          </div>
        </div>
      </TransitionGroup>

      <!-- Typing indicator -->
      <div v-if="techTyping" class="flex justify-start">
        <div
          class="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-slate-100 flex gap-1"
        >
          <span
            v-for="i in 3"
            :key="i"
            class="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
            :style="{ animationDelay: `${(i - 1) * 0.15}s` }"
          ></span>
        </div>
      </div>
    </div>

    <!-- ── Input bar ─────────────────────────────────────────────────────── -->
    <div
      class="shrink-0 bg-white border-t border-slate-100 px-4 py-3 flex items-center gap-2"
    >
      <input
        v-model="draft"
        @keydown.enter.prevent="send"
        type="text"
        placeholder="Escribe un mensaje…"
        class="flex-1 bg-slate-100 rounded-full px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-teal-400 transition-shadow"
      />
      <button
        @click="send"
        :disabled="!draft.trim()"
        class="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0 hover:bg-teal-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <span class="material-icons text-lg">send</span>
      </button>
    </div>

    <!-- ── Finish button ─────────────────────────────────────────────────── -->
    <div class="shrink-0 px-4 pb-5 pt-2 bg-white">
      <button
        @click="finish"
        class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 text-white font-bold text-sm shadow-lg shadow-rose-200 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
      >
        <span class="material-icons text-base">home</span>
        Técnico en Casa · Finalizar y Validar
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAppState } from "@/store/state";
import type { Message } from "@/store/state";

const router = useRouter();
const { state, addMessage, setViewState } = useAppState();

const tech = computed(() => state.selectedTechnician);
const messages = computed(() => state.messages);
const draft = ref("");
const techTyping = ref(false);
const showBlockAlert = ref(false);
const messagesContainer = ref<HTMLElement | null>(null);
const activeSafetyTool = ref<null | "location" | "qr" | "emergency">(null);
const familyContact = ref("");
const safetyNotice = ref("");
const emergencySent = ref(false);
let alertTimer: ReturnType<typeof setTimeout>;
let sentCount = 0;

const qrImage = computed(() => {
  const validationData = encodeURIComponent(
    `Plataforma de Confianza   - Tecnicos del Hogar  - ConfiaHogar|tecnico:${tech.value?.id ?? 0}|verificado`,
  );
  return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${validationData}`;
});

function shareLocation() {
  safetyNotice.value = `Seguimiento compartido con ${familyContact.value.trim()}.`;
  emergencySent.value = false;
  activeSafetyTool.value = null;
}

function sendEmergency() {
  safetyNotice.value = "Alerta enviada a soporte y a tu contacto de confianza.";
  emergencySent.value = true;
  activeSafetyTool.value = null;
}

// ─── Anti-bypass filter ──────────────────────────────────────────────────────
const BLOCKED_WORDS = [
  "celular",
  "mi número",
  "número",
  "yape",
  "plin",
  "efectivo",
  "bcp",
  "llámame",
  "llama",
  "whatsapp",
  "tarjeta",
  "interbank",
  "bbva",
];
const PHONE_REGEX = /\b\d[\d\s\-]{6,}\d\b/g;

function filterMessage(content: string): {
  filtered: string;
  blocked: boolean;
} {
  let blocked = false;
  let filtered = content;

  // Phone numbers
  if (PHONE_REGEX.test(content)) {
    blocked = true;
    filtered = "[CONTENIDO BLOQUEADO POR POLÍTICAS DE SEGURIDAD]";
    return { filtered, blocked };
  }
  PHONE_REGEX.lastIndex = 0;

  // Prohibited words
  for (const word of BLOCKED_WORDS) {
    if (content.toLowerCase().includes(word)) {
      blocked = true;
      filtered = "[CONTENIDO BLOQUEADO POR POLÍTICAS DE SEGURIDAD]";
      return { filtered, blocked };
    }
  }

  return { filtered, blocked };
}

// ─── Send message ─────────────────────────────────────────────────────────────
async function send() {
  const raw = draft.value.trim();
  if (!raw) return;
  draft.value = "";

  const { filtered, blocked } = filterMessage(raw);

  addMessage({
    from: "user",
    content: filtered,
    blocked,
    timestamp: new Date(),
  });

  if (blocked) {
    showBlockAlert.value = true;
    clearTimeout(alertTimer);
    alertTimer = setTimeout(() => {
      showBlockAlert.value = false;
    }, 3500);
  }

  sentCount += 1;
  await scrollBottom();

  // Auto-reply after 2 user messages
  if (
    sentCount >= 2 &&
    messages.value.filter((m) => m.from === "tech").length === 0
  ) {
    techTyping.value = true;
    await scrollBottom();
    setTimeout(async () => {
      techTyping.value = false;
      addMessage({
        from: "tech",
        content:
          "Listo, ya voy en camino. Por favor ingresa el código cuando llegue.",
        blocked: false,
        timestamp: new Date(),
      });
      await scrollBottom();
    }, 2000);
  }
}

async function scrollBottom() {
  await nextTick();
  if (messagesContainer.value)
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
}

function formatTime(d: Date) {
  return new Date(d).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function finish() {
  setViewState("validation");
  router.push("/validation");
}

onUnmounted(() => {
  clearTimeout(alertTimer);
});
</script>

<style>
/* Message transition */
.msg-enter-active {
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.msg-enter-from {
  opacity: 0;
  transform: translateY(16px) scale(0.95);
}

/* Toast transition */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-12px);
}
</style>
