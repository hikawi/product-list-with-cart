import { persistentMap } from "@nanostores/persistent";
import { $cart } from "./cart";

type Cart = {
  [id: string]: number
};

const $history = persistentMap<{ [time: string]: Cart }>("history:", {}, {
  encode(val) {
    return JSON.stringify(val);
  },
  decode(val) {
    try {
      return JSON.parse(val);
    } catch (e) {
      return {};
    }
  },
  listen: false,
});

function pushHistory() {
  const date = new Date(Date.now());
  $history.setKey(date.getTime(), $cart.get());
}

export { $history, pushHistory };
