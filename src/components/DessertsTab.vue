<script setup lang="ts">
import { $cart, addToCart, normalize } from "@/stores/cart";
import { useStore } from "@nanostores/vue";
import { onMounted, onUnmounted, ref, useTemplateRef } from "vue";
import AddToCartButton from "./AddToCartButton.vue";
import AmountChangeButton from "./AmountChangeButton.vue";

const props = defineProps<{
  image: {
    mobile: string;
    desktop: string;
    tablet: string;
  };
  name: string;
  category: string;
  price: number;
}>();

const cart = useStore($cart);
const mounted = ref(false);
const id = normalize(props.name);
const container = useTemplateRef<HTMLDivElement>("container");

function keyboardHandler(e: KeyboardEvent) {
  switch (e.key) {
    case "-":
      addToCart(id, -1);
      break;
    case "+":
      addToCart(id, 1);
      break;
  }
}

onMounted(() => {
  mounted.value = true;
  container.value?.addEventListener("keydown", keyboardHandler);
});

onUnmounted(() => {
  container.value?.removeEventListener("keydown", keyboardHandler);
});
</script>

<template>
  <div
    class="flex w-full flex-col gap-4"
    tabindex="0"
    ref="container"
    data-testid="container"
  >
    <div class="flex w-full flex-col items-center">
      <picture class="relative z-0 h-[13.25rem] w-full rounded-lg xl:h-[15rem]">
        <source :srcset="props.image.desktop" media="(min-width: 1280px)" />
        <source :srcset="props.image.tablet" media="(min-width: 768px)" />
        <img
          :src="props.image.mobile"
          :alt="props.name"
          class="relative z-0 size-full rounded-lg object-cover"
        />
      </picture>

      <AmountChangeButton v-if="mounted && id in cart" :id />
      <AddToCartButton v-else :id />
    </div>

    <div class="flex flex-col">
      <span class="text-preset-4 text-rose-500">{{ category }}</span>
      <p class="text-preset-3">{{ name }}</p>
      <span class="text-preset-3 text-red">${{ price.toFixed(2) }}</span>
    </div>
  </div>
</template>
