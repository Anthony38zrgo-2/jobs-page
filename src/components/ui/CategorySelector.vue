<template>
  <div
    class="flex flex-col bg-white min-h-screen max-w-md mx-auto shadow-2xl overflow-hidden"
  >
    <!-- ── Top header ────────────────────────────────────────────────────── -->
    <div
      class="shrink-0 px-5 pt-6 pb-4 bg-gradient-to-br from-teal-600 to-emerald-600"
    >
      <div class="flex items-center justify-between mb-4">
        <div>
          <p class="text-teal-200 text-xs font-medium">
            Bienvenido de vuelta 👋
          </p>
          <h1 class="text-white text-xl font-extrabold mt-0.5">
            Plataforma de Confianza <br />
            Tecnicos del Hogar - ConfiTec
          </h1>
        </div>
        <!-- Avatar mock -->
        <div class="flex items-center gap-2">
          <div
            class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center ring-2 ring-white/40"
          >
            <span class="material-icons text-white text-xl">person</span>
          </div>
        </div>
      </div>

      <!-- Security banner -->
      <div
        class="flex items-center gap-2 bg-white/10 rounded-2xl px-3.5 py-2.5 border border-white/20 backdrop-blur-sm"
      >
        <span class="material-icons text-emerald-300 text-base"
          >verified_user</span
        >
        <p class="text-white/90 text-xs font-medium leading-snug">
          Todos los técnicos están
          <strong class="text-emerald-300">verificados y auditados</strong> por
          nuestro equipo
        </p>
      </div>
    </div>

    <!-- ── Category label ─────────────────────────────────────────────────── -->
    <div class="shrink-0 px-5 pt-5 pb-2">
      <h2 class="text-base font-bold text-slate-800">
        ¿Qué servicio necesitas?
      </h2>
      <p class="text-xs text-slate-400 mt-0.5">
        Selecciona una categoría para comenzar
      </p>
    </div>

    <!-- ── Category grid ─────────────────────────────────────────────────── -->
    <div class="flex-1 overflow-y-auto px-5 pb-6">
      <div class="mb-4 grid grid-cols-3 gap-2">
        <button
          v-for="action in quickActions"
          :key="action.label"
          class="rounded-xl border border-slate-200 bg-white p-2.5 text-center"
          @click="router.push(action.path)"
        >
          <span class="material-icons text-xl text-teal-600">{{
            action.icon
          }}</span>
          <span
            class="mt-1 block text-[10px] font-semibold leading-tight text-slate-600"
            >{{ action.label }}</span
          >
        </button>
      </div>

      <div class="grid grid-cols-2 gap-3 mt-2">
        <button
          v-for="cat in categories"
          :key="cat.name"
          @click="select(cat)"
          class="group relative flex flex-col items-center justify-center p-5 rounded-2xl border border-slate-100 bg-slate-50 hover:border-teal-300 hover:bg-teal-50 active:scale-95 transition-all duration-150 shadow-sm hover:shadow-md hover:shadow-teal-100 overflow-hidden"
        >
          <!-- Subtle icon bg -->
          <div
            class="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-3 shadow-sm group-hover:bg-teal-100 transition-colors duration-150"
          >
            <span
              class="material-icons text-3xl text-slate-500 group-hover:text-teal-600 transition-colors duration-150"
            >
              {{ cat.icon }}
            </span>
          </div>
          <span
            class="text-sm font-semibold text-slate-700 group-hover:text-teal-700 transition-colors"
          >
            {{ cat.name }}
          </span>
          <!-- Arrow indicator on hover -->
          <span
            class="material-icons absolute bottom-2 right-2 text-sm text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          >
            arrow_forward
          </span>
        </button>

        <!-- Otros -->
        <button
          @click="
            select({
              name: 'Otros',
              icon: 'home_repair_service',
              placeholder: 'Ej: Describe el servicio que necesitas…',
            })
          "
          class="group relative flex flex-col items-center justify-center p-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 hover:border-teal-300 hover:bg-teal-50 active:scale-95 transition-all duration-150 shadow-sm"
        >
          <div
            class="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-3 shadow-sm group-hover:bg-teal-100 transition-colors duration-150"
          >
            <span
              class="material-icons text-3xl text-slate-400 group-hover:text-teal-600 transition-colors"
              >more_horiz</span
            >
          </div>
          <span
            class="text-sm font-semibold text-slate-500 group-hover:text-teal-700 transition-colors"
            >Otros</span
          >
        </button>
      </div>

      <!-- Trust indicators -->
      <div class="mt-6 grid grid-cols-3 gap-3">
        <div
          v-for="trust in trustItems"
          :key="trust.label"
          class="flex flex-col items-center text-center gap-1 p-3 bg-slate-50 rounded-xl border border-slate-100"
        >
          <span class="material-icons text-teal-500 text-xl">{{
            trust.icon
          }}</span>
          <p class="text-[10px] text-slate-500 font-medium leading-snug">
            {{ trust.label }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAppState } from "@/store/state";
import type { Category } from "@/store/state";
import { CATEGORIES } from "@/data/categories";

const router = useRouter();
const { setCategory } = useAppState();

const categories = CATEGORIES;
const quickActions = [
  { icon: "groups", label: "Ver especialistas", path: "/specialists" },
  { icon: "history", label: "Mi historial", path: "/history" },
  {
    icon: "engineering",
    label: "Quiero ser técnico",
    path: "/technician-registration",
  },
];

const trustItems = [
  { icon: "verified_user", label: "DNI Verificado" },
  { icon: "health_and_safety", label: "Técnico Seguro" },
  { icon: "fact_check", label: "Datos Validados" },
];

function select(cat: Category) {
  setCategory(cat);
  router.push({ path: "/specialists", query: { specialty: cat.name } });
}
</script>
