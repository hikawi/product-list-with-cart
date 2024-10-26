<script setup lang="ts">
import { addToCart } from "@/stores/cart";
import IconAddToCart from "./icons/IconAddToCart.vue";
defineProps<{ id: string }>();
</script>

<template>
  <button
    class="relative z-[1] -mt-5 flex h-[2.75rem] w-40 flex-row items-center justify-center gap-2 rounded-full border-[1px] border-rose-400 bg-white p-3 hover:border-red hover:text-red focus:border-red focus:text-red"
    @click="() => addToCart(id, 1)"
  >
    <IconAddToCart />
    <span class="text-preset-4-bold">Add To Cart</span>
  </button>
</template>
