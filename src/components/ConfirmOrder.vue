<script setup lang="ts">
import { $cart } from "@/stores/cart";
import { $confirmModal } from "@/stores/confirm-modal";
import { useStore } from "@nanostores/vue";
import { onMounted, useTemplateRef } from "vue";
import CartTotal from "./CartTotal.vue";
import ConfirmListing from "./ConfirmListing.vue";
import IconOrderConfirm from "./icons/IconOrderConfirm.vue";

const confirmModal = useStore($confirmModal);
const cart = useStore($cart);
const dialogRef = useTemplateRef<HTMLDivElement>("dialogDiv");

function confirm() {
  $cart.set({});
  $confirmModal.set(false);
}

onMounted(() => dialogRef.value?.focus());
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex w-full items-end bg-black/50 pt-10 md:items-center md:justify-center md:px-10 md:pb-10"
    aria-live="polite"
    v-if="confirmModal"
  >
    <div
      class="flex max-h-screen w-full flex-col gap-8 overflow-y-scroll rounded-t-xl bg-white p-6 pt-10 md:rounded-xl md:p-10 xl:max-w-[37rem]"
      role="dialog"
      aria-label="Confirmation"
      tabindex="-1"
      ref="dialogDiv"
    >
      <div class="flex flex-col gap-6">
        <IconOrderConfirm class="size-12" />
        <div>
          <h1 class="text-preset-1">Order Confirmed</h1>
          <p class="text-rose-500">We hope you enjoy your food!</p>
        </div>
      </div>

      <div class="flex flex-col gap-6 rounded-lg bg-rose-50 p-6">
        <ConfirmListing :cart />
        <hr class="border-rose-100" />
        <CartTotal />
      </div>

      <button
        class="text-preset-3 w-full rounded-full bg-red px-6 py-4 text-white hover:bg-gradient-to-r hover:from-black/25 hover:to-black/25"
        @click="confirm"
      >
        Start New Order
      </button>
    </div>
  </div>
</template>
