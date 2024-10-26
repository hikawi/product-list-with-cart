<script setup lang="ts">
import { $cart, addToCart } from "@/stores/cart";
import { useStore } from "@nanostores/vue";
import IconDecrement from "./icons/IconDecrement.vue";
import IconIncrement from "./icons/IconIncrement.vue";

defineProps<{ id: string }>();

const cart = useStore($cart);
</script>

<template>
  <div
    class="relative z-[1] -mt-5 flex h-[2.75rem] w-40 flex-row items-center justify-between gap-2 rounded-full bg-red p-3"
  >
    <button
      class="group size-5"
      aria-label="Decrement"
      @click="() => addToCart(id, -1)"
    >
      <IconDecrement />
    </button>

    <span class="text-preset-4-bold text-white">{{ cart[id] }}</span>

    <button
      class="group size-5"
      aria-label="Increment"
      @click="() => addToCart(id, 1)"
    >
      <IconIncrement />
    </button>
  </div>
</template>
