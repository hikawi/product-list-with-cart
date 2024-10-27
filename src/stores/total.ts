import { mappings } from "@/data";
import { computed } from "nanostores";
import { $cart } from "./cart";

const $total = computed($cart, (val) =>
  Object.entries(val)
    .map(([id, amount]) => mappings.get(id)!.price * amount)
    .reduce((acc, cur) => acc + cur, 0),
);

export { $total };
