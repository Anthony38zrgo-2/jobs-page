<template>
  <div class="relative h-48 bg-gradient-to-b from-blue-100 to-blue-200 rounded-lg overflow-hidden">
    <!-- Mock pins -->
    <span
      v-for="(pin, idx) in pins"
      :key="idx"
      class="absolute material-icons text-2xl"
      :class="pin.color"
      :style="{ left: pin.x + 'px', top: pin.y + 'px' }"
    >location_on</span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

// Generate three random pin positions within the container (0‑100% offset).
const pins = ref([
  { x: 30, y: 20, color: 'text-red-500 animate-bounce' },
  { x: 120, y: 80, color: 'text-blue-500 animate-pulse' },
  { x: 200, y: 40, color: 'text-green-500 animate-bounce' },
]);

onMounted(() => {
  // No real map; pins are static for mock.
});
</script>

<style scoped>
/* Keep container size responsive – using fixed height 12rem (h-48) */
</style>
