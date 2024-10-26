<script setup lang="ts">
import { mappings } from "@/data";
import { $cart } from "@/stores/cart";
import { useStore } from "@nanostores/vue";
import { computed, onMounted, ref } from "vue";

const cart = useStore($cart);
const mounted = ref(false);

const keys = computed(() => (mounted.value ? Object.keys(cart.value) : []));
const total = computed(() =>
  keys.value
    .map((k) => mappings.get(k)!.price * cart.value[k]!)
    .reduce((acc, cur) => acc + cur, 0)
    .toFixed(2),
);

onMounted(() => {
  mounted.value = true;
});
</script>

<template>
  <div class="flex flex-row items-center justify-between">
    <span class="text-preset-4">Order Total</span>
    <span class="text-preset-2">${{ total }}</span>
  </div>
</template>
