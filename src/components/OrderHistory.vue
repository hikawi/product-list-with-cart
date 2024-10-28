<script setup lang="ts">
import { $history } from "@/stores/history";
import { useStore } from "@nanostores/vue";
import { computed, onMounted, ref } from "vue";
import ConfirmListing from "./ConfirmListing.vue";

const history = useStore($history);
const mounted = ref(false);
const keys = computed(() => {
  const historyKeys = Object.keys(history.value);
  if (historyKeys.length === 0) return [];
  if (historyKeys.length === 1) return historyKeys;
  return historyKeys.toSorted((a, b) => {
    return parseInt(b) - parseInt(a);
  });
});

onMounted(() => {
  mounted.value = true;
});
</script>

<template>
  <div
    class="flex min-h-96 items-center justify-center bg-white p-6 md:p-10"
    v-if="mounted && keys.length === 0"
  >
    <span class="text-preset-3 italic">crickets sounds</span>
  </div>

  <ul
    class="flex flex-col gap-8 rounded-xl bg-white p-6 md:p-10"
    v-else-if="mounted"
  >
    <template v-for="(key, idx) in keys" :key>
      <li class="flex flex-col gap-6">
        <h2 class="text-preset-2">
          {{ new Date(parseInt(key)).toLocaleString() }}
        </h2>

        <ConfirmListing :cart="history[key]" />
      </li>
    </template>
  </ul>
</template>
