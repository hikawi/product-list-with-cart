import Cart from "@/components/Cart.vue";
import data from "@/data.json";
import { $cart, normalize } from "@/stores/cart";
import { cleanTestStorage, getTestStorage, setTestStorageKey, useTestStorageEngine } from "@nanostores/persistent";
import userEvent from "@testing-library/user-event";
import { cleanup, render, within } from "@testing-library/vue";
import { allTasks, cleanStores, keepMount } from "nanostores";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Cart.vue", () => {
  const testSample = data.slice(0, 6);

  beforeAll(() => {
    useTestStorageEngine();
  });

  beforeEach(() => {
    keepMount($cart);
    for (const item of testSample) {
      const id = normalize(item.name);
      const num = Math.round(Math.random() * 10);
      setTestStorageKey(`cart:${id}`, num.toString());
    }
  });

  afterEach(() => {
    cleanStores($cart);
    cleanup();
    cleanTestStorage();
  });

  it("should display correct keys length", async () => {
    const keysLength = Object.keys(getTestStorage()).length;
    const comp = render(Cart);
    await allTasks();
    expect(comp.findByText(keysLength)).toBeDefined();
  });

  it("should display correct items, at correct prices", async () => {
    const comp = render(Cart);
    await allTasks();

    const ul = comp.getByRole("list");
    for (const item of testSample) {
      const name = within(ul).getByText(item.name);
      const id = normalize(item.name);

      const parent = name.parentElement!;
      const amount = within(parent).getByText(`${getTestStorage()[`cart:${id}`]}x`);
      const price = within(parent).getByText(`@ $${item.price.toFixed(2)}`);
      const total = within(parent).getByText(`$${(item.price * parseInt(getTestStorage()[`cart:${id}`])).toFixed(2)}`);

      expect(name).toBeInTheDocument();
      expect(amount).toBeInTheDocument();
      expect(price).toBeInTheDocument();
      expect(total).toBeInTheDocument();
    }
  });

  it("should delete from storage if click remove", async () => {
    const comp = render(Cart);
    await allTasks();

    const element = comp.getByRole("listitem", { name: testSample[0].name });
    const button = within(element).getByRole("button", { name: "Remove from cart" });

    await userEvent.click(button);
    await allTasks();

    expect(Object.hasOwn(getTestStorage(), normalize(testSample[0].name))).toBeFalsy();
    expect(comp.queryByText(testSample[0].name)).not.toBeInTheDocument();
  });

  it("should decode correctly", async () => {
    setTestStorageKey("cart:a", "notanumber");
    expect(Object.keys($cart.get())).not.toContain("a");
  });
})
