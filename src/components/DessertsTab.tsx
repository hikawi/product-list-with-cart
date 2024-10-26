import { $cart, addToCart, normalize } from "@/stores/cart";
import { useStore } from "@nanostores/solid";
import { createSignal, Match, onCleanup, onMount, Switch } from "solid-js";
import { isServer } from "solid-js/web";
import IconAddToCart from "./icons/IconAddToCart";
import IconDecrement from "./icons/IconDecrement";
import IconIncrement from "./icons/IconIncrement";

export default function DessertsTab(props: {
  image: {
    mobile: string;
    desktop: string;
    tablet: string;
  };
  name: string;
  category: string;
  price: number;
}) {
  let container: HTMLDivElement | undefined;

  const cart = useStore($cart);
  const [mounted, setMounted] = createSignal(false);
  const id = normalize(props.name);

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

  onMount(() => {
    if (isServer) return;
    setMounted(true);
    container?.addEventListener("keydown", keyboardHandler);
  });

  onCleanup(() => {
    if (isServer) return;
    container?.removeEventListener("keydown", keyboardHandler);
  });

  return (
    <div class="flex w-full flex-col gap-4" tabindex="0" ref={container}>
      <div class="flex w-full flex-col items-center">
        <picture class="relative z-0 h-[13.25rem] w-full rounded-lg xl:h-[15rem]">
          <source srcset={props.image.desktop} media="(min-width: 1280px)" />
          <source srcset={props.image.tablet} media="(min-width: 768px)" />
          <img
            src={props.image.mobile}
            alt={props.name}
            class="relative z-0 size-full rounded-lg object-cover"
          />
        </picture>

        <Switch>
          <Match when={mounted() && id in cart()}>
            <div class="relative z-[1] -mt-5 flex h-[2.75rem] w-40 flex-row items-center justify-between gap-2 rounded-full bg-red p-3">
              <button
                class="group size-5"
                aria-label="Decrement"
                onClick={() => addToCart(id, -1)}
              >
                <IconDecrement />
              </button>

              <span class="text-preset-4-bold text-white">{cart()[id]}</span>

              <button
                class="group size-5"
                aria-label="Increment"
                onClick={() => addToCart(id, 1)}
              >
                <IconIncrement />
              </button>
            </div>
          </Match>
          <Match when={mounted() && !(id in cart())}>
            <button
              class="relative z-[1] -mt-5 flex h-[2.75rem] w-40 flex-row items-center justify-center gap-2 rounded-full border-[1px] border-rose-400 bg-white p-3 hover:border-red hover:text-red focus:border-red focus:text-red"
              onClick={() => addToCart(id, 1)}
            >
              <IconAddToCart />
              <span class="text-preset-4-bold">Add To Cart</span>
            </button>
          </Match>
        </Switch>
      </div>

      <div class="flex flex-col">
        <span class="text-preset-4 text-rose-500">{props.category}</span>
        <p class="text-preset-3">{props.name}</p>
        <span class="text-preset-3 text-red">${props.price.toFixed(2)}</span>
      </div>
    </div>
  );
}
