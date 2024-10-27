<script setup lang="ts">
import { $history } from "@/stores/history";
import { useStore } from "@nanostores/vue";
import { onMounted, ref } from "vue";

const history = useStore($history);
const mounted = ref(false);

onMounted(() => {
  mounted.value = true;
});
</script>

<template>
  <button
    class="text-preset-4-bold h-fit w-fit rounded-full bg-red px-8 py-4 text-white hover:bg-gradient-to-r hover:from-black/25 hover:to-black/25 focus:bg-gradient-to-r focus:from-black/25 focus:to-black/25 disabled:cursor-not-allowed disabled:opacity-50"
    @click="() => $history.set({})"
    :disabled="mounted && Object.keys(history).length === 0"
  >
    Clear
  </button>
</template>
