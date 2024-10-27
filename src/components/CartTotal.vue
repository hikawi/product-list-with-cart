<script setup lang="ts">
import { $total } from "@/stores/total";
import { useStore } from "@nanostores/vue";
import { onMounted, ref } from "vue";

const total = useStore($total);
const mounted = ref(false);

onMounted(() => {
  mounted.value = true;
});
</script>

<template>
  <div class="flex flex-row items-center justify-between">
    <span class="text-preset-4">Order Total</span>
    <span class="text-preset-2">${{ (mounted ? total : 0).toFixed(2) }}</span>
  </div>
</template>
