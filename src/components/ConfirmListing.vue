<script setup lang="ts">
import { mappings } from "@/data";
import { $cart } from "@/stores/cart";
import { useStore } from "@nanostores/vue";
import { computed, onMounted, ref } from "vue";

const cart = useStore($cart);
const mounted = ref(false);
const keys = computed(() => (mounted.value ? Object.keys(cart.value) : []));

onMounted(() => {
  mounted.value = true;
});
</script>

<template>
  <ul class="flex flex-col gap-4">
    <template v-for="(key, idx) in keys">
      <li
        class="flex flex-row items-center justify-between gap-2"
        :aria-label="mappings.get(key)?.name"
      >
        <div class="flex flex-row gap-4">
          <img
            :src="mappings.get(key)?.image.thumbnail"
            :alt="mappings.get(key)?.name"
            class="size-12 rounded"
          />

          <div class="flex min-w-0 flex-col gap-2">
            <span
              class="text-preset-4-bold overflow-hidden text-ellipsis whitespace-nowrap"
            >
              {{ mappings.get(key)?.name }}
            </span>
            <div class="flex flex-row items-center gap-2">
              <span class="text-preset-4-bold text-red">
                {{ cart[key] }}x
              </span>
              <span class="text-preset-4 text-rose-500">
                @ ${{ mappings.get(key)?.price?.toFixed(2) }}
              </span>
            </div>
          </div>
        </div>

        <span class="text-preset-3 shrink-0">
          ${{ (cart[key]! * mappings.get(key)!.price).toFixed(2) }}
        </span>
      </li>

      <hr
        aria-hidden="true"
        class="border-rose-100"
        v-if="idx !== keys.length - 1"
      />
    </template>
  </ul>
</template>
