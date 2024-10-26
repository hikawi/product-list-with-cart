<script setup lang="ts">
import { mappings } from "@/data";
import { $cart, normalize, removeFromCart } from "@/stores/cart";
import { useStore } from "@nanostores/vue";
import { computed, onMounted, ref } from "vue";
import IconClose from "./icons/IconClose.vue";

const cart = useStore($cart);
const mounted = ref(false);
const keys = computed(() => (mounted.value ? Object.keys(cart.value) : []));

onMounted(() => {
  mounted.value = true;
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-row items-center justify-between" v-for="key in keys">
      <div class="flex flex-col gap-2">
        <span class="text-preset-4-bold">
          {{ mappings.get(key)!.name }}
        </span>
        <div class="flex flex-row items-center gap-2">
          <span class="text-preset-4-bold text-red"> {{ cart[key] }}x </span>
          <span class="text-preset-4 text-rose-500">
            @ {{ mappings.get(key)?.price?.toFixed(2) }}
          </span>
          <span class="text-preset-4-bold text-rose-500">
            ${{ (cart[key]! * mappings.get(key)!.price).toFixed(2) }}
          </span>
        </div>
      </div>

      <button
        class="size-5 shrink-0"
        aria-label="Close"
        @click="() => removeFromCart(normalize(key))"
      >
        <IconClose />
      </button>
    </div>
  </div>
</template>
