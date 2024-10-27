import { persistentMap } from "@nanostores/persistent";

const $cart = persistentMap<{ [id: string]: number }>(
  "cart:",
  {},
  {
    encode(val) {
      return val.toString();
    },
    decode(val) {
      const num = parseInt(val);
      if (isNaN(num) || num <= 0) return undefined!;
      else return num;
    },
    listen: true,
  },
);

function addToCart(id: string, amount: number) {
  const amt = id in $cart.get() ? $cart.get()[id]! : 0;
  const total = amt + amount;

  if (total <= 0) {
    removeFromCart(id);
    return;
  }

  $cart.setKey(id, amt + amount);
}

function removeFromCart(id: string) {
  $cart.setKey(id, undefined!);
}

function normalize(name: string) {
  return name.toLowerCase().replaceAll(/\s+/g, "-");
}

export { $cart, addToCart, normalize, removeFromCart };

