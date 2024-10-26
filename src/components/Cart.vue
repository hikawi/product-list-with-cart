<script setup lang="ts">
import { $cart } from "@/stores/cart";
import { useStore } from "@nanostores/vue";
import { computed, onMounted, ref } from "vue";
import CartListing from "./CartListing.vue";
import CartTotal from "./CartTotal.vue";
import EmptyCart from "./EmptyCart.vue";
import IconCarbonNeutral from "./icons/IconCarbonNeutral.vue";

const cart = useStore($cart);
const mounted = ref(false);
const keys = computed(() => (mounted.value ? Object.keys(cart.value) : []));

onMounted(() => {
  mounted.value = true;
});
</script>

<template>
  <div class="flex flex-col gap-6 rounded-xl bg-white p-6 xl:sticky xl:top-8">
    <h2 class="text-preset-2 text-red">Your Cart ({{ keys.length }})</h2>

    <EmptyCart v-if="keys.length === 0" />
    <div class="flex flex-col gap-6" v-else>
      <CartListing />
      <hr class="border-rose-100" />
      <CartTotal />

      <div
        class="flex flex-row items-center justify-center gap-4 rounded-lg bg-rose-50 p-4"
      >
        <IconCarbonNeutral />
        <p class="text-preset-4">
          This is a
          <span class="text-preset-4-bold">carbon-neutral</span> delivery.
        </p>
      </div>

      <button
        class="text-preset-3 rounded-full bg-red px-6 py-4 text-white hover:bg-gradient-to-r hover:from-black/25 hover:to-black/25"
      >
        Confirm Order
      </button>
    </div>
  </div>
</template>
