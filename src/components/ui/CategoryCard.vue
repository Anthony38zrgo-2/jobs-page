<template>
  <button
    class="flex flex-col items-center justify-center p-4 rounded-2xl border border-gray-200 hover:bg-gray-50 transition"
    @click="$emit('select', category)">
    <span class="material-icons text-3xl text-gray-700 mb-2">{{ category.icon }}</span>
    <span class="text-sm font-medium text-gray-800">{{ category.name }}</span>
  </button>
</template>

<script setup lang="ts">

interface Category { name: string; icon: string }
const props = defineProps<{ category: Category }>();
const emit = defineEmits<{ (e: 'select', cat: Category): void }>();
</script>

<style scoped>
/* Tailwind handles styling */
</style>
