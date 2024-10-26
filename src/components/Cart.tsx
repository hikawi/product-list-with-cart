import data from "@/data.json";
import { $cart, normalize, removeFromCart } from "@/stores/cart";
import { useStore } from "@nanostores/solid";
import {
  createMemo,
  createSignal,
  For,
  Match,
  onMount,
  Switch,
} from "solid-js";
import { isServer } from "solid-js/web";
import IconCarbonNeutral from "./icons/IconCarbonNeutral";
import IconClose from "./icons/IconClose";
import IllustrationEmpty from "./icons/IllustrationEmpty";

const mappings = new Map<
  string,
  {
    image: {
      thumbnail: string;
      mobile: string;
      tablet: string;
      desktop: string;
    };
    name: string;
    category: string;
    price: number;
  }
>();

for (const item of data) {
  mappings.set(normalize(item.name), item);
}

export default function Cart() {
  const cart = useStore($cart);
  const [mounted, setMounted] = createSignal(false);
  const keys = createMemo(() => (mounted() ? Object.keys(cart()) : []));

  onMount(() => {
    if (isServer) return;
    setMounted(true);
  });

  return (
    <div class="flex flex-col gap-6 rounded-xl bg-white p-6">
      <h2 class="text-preset-2 text-red">Your Cart ({keys().length})</h2>

      <Switch>
        <Match when={keys().length === 0}>
          <div class="flex flex-col items-center justify-center gap-4 py-4">
            <IllustrationEmpty />
            <span class="text-preset-4-bold text-rose-500">
              Your added items will appear here
            </span>
          </div>
        </Match>

        <Match when={keys().length > 0}>
          <div class="flex flex-col gap-6">
            <div class="flex flex-col gap-4">
              <For each={keys()}>
                {(key) => (
                  <>
                    <div class="flex flex-row items-center justify-between">
                      <div class="flex flex-col gap-2">
                        <span class="text-preset-4-bold">
                          {mappings.get(key)?.name}
                        </span>
                        <div class="flex flex-row items-center gap-2">
                          <span class="text-preset-4-bold text-red">
                            {cart()[key]}x
                          </span>
                          <span class="text-preset-4 text-rose-500">
                            @ ${mappings.get(key)?.price?.toFixed(2)}
                          </span>
                          <span class="text-preset-4-bold text-rose-500">
                            $
                            {(cart()[key]! * mappings.get(key)!.price).toFixed(
                              2,
                            )}
                          </span>
                        </div>
                      </div>

                      <button
                        class="size-5 shrink-0"
                        aria-label="Close"
                        onClick={() => removeFromCart(normalize(key))}
                      >
                        <IconClose />
                      </button>
                    </div>
                  </>
                )}
              </For>
            </div>

            <hr class="border-rose-100" />

            <div class="flex flex-row items-center justify-between">
              <span class="text-preset-4">Order Total</span>
              <span class="text-preset-2">
                $
                {keys()
                  .map((k) => mappings.get(k)!.price * cart()[k]!)
                  .reduce((acc, cur) => acc + cur)
                  .toFixed(2)}
              </span>
            </div>

            <div class="flex flex-row items-center justify-center gap-4 rounded-lg bg-rose-50 p-4">
              <IconCarbonNeutral />
              <p class="text-preset-4">
                This is a <span class="text-preset-4-bold">carbon-neutral</span>{" "}
                delivery.
              </p>
            </div>

            <button class="text-preset-3 rounded-full bg-red px-6 py-4 text-white">
              Confirm Order
            </button>
          </div>
        </Match>
      </Switch>
    </div>
  );
}
