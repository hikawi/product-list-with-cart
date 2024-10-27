import Cart from "@/components/Cart.vue";
import data from "@/data.json";
import { $cart } from "@/stores/cart";
import { $confirmModal } from "@/stores/confirm-modal";
import { $history } from "@/stores/history";
import { cleanTestStorage, getTestStorage, setTestStorageKey, useTestStorageEngine } from "@nanostores/persistent";
import userEvent from "@testing-library/user-event";
import { cleanup, render, within } from "@testing-library/vue";
import { allTasks, cleanStores, keepMount } from "nanostores";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Cart.vue", () => {
  const testSample = data.slice(0, 6);

  const testData = {
    "red-velvet-cake": 5,
    "vanilla-panna-cotta": 2,
    "pistachio-baklava": 1,
    "waffle-with-berries": 3,
    "vanilla-bean-crème-brûlée": 4,
  };

  beforeAll(() => {
    useTestStorageEngine();
  });

  beforeEach(() => {
    keepMount($cart);
    keepMount($confirmModal);

    for (const [item, amount] of Object.entries(testData)) {
      setTestStorageKey(`cart:${item}`, amount.toString());
    }
  });

  afterEach(() => {
    cleanStores($cart, $confirmModal);
    cleanup();
    cleanTestStorage();
  });

  it("should delete from storage if click remove", async () => {
    const comp = render(Cart);
    await allTasks();

    const name = "Red Velvet Cake";
    const element = comp.getByRole("listitem", { name });
    const button = within(element).getByRole("button", { name: "Remove from cart" });

    await userEvent.click(button);
    await allTasks();

    expect(getTestStorage()).not.toContainEqual({ "cart:red-velvet-cake": 5 });
    expect(Object.hasOwn(getTestStorage(), "cart:red-velvet-cake")).toBeFalsy();
    expect(comp.queryByText(name)).not.toBeInTheDocument();
  });

  it("should open confirm modal", async () => {
    const comp = render(Cart);
    await allTasks();

    const element = comp.getByRole("button", { name: "Confirm Order" });
    await userEvent.click(element);
    await allTasks();

    expect($confirmModal.get()).toBeTruthy();

    const history = $history.get()
    const keys = Object.keys(history);
    expect(keys.length).toBe(1);

    const node = history[keys[0]];
    expect(node).toEqual($cart.get());
  });
})
