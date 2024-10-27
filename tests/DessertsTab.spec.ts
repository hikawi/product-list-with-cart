import DessertsTab from "@/components/DessertsTab.vue";
import data from "@/data.json";
import { $cart } from "@/stores/cart";
import {
  cleanTestStorage,
  getTestStorage,
  setTestStorageKey,
  useTestStorageEngine,
} from "@nanostores/persistent";
import userEvent from "@testing-library/user-event";
import { cleanup, render } from "@testing-library/vue";
import { allTasks, cleanStores, keepMount } from "nanostores";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("DessertsTab", () => {
  const testData = data[0];

  beforeAll(() => {
    useTestStorageEngine();
  });

  beforeEach(() => {
    keepMount($cart);
  });

  afterEach(() => {
    cleanTestStorage();
    cleanup();
    cleanStores($cart);
  });

  it("should add to cart when click", async () => {
    const comp = render(DessertsTab, { props: testData });
    const addToCart = comp.getByRole("button", { name: "Add To Cart" });

    expect(getTestStorage()).toEqual({});
    expect(addToCart).toBeVisible();

    const user = userEvent.setup();
    await user.hover(addToCart);
    await user.click(addToCart);
    expect(getTestStorage()).toEqual({ "cart:waffle-with-berries": "1" });
  });

  it("should remove from cart when click decrement", async () => {
    const comp = render(DessertsTab, { props: testData });
    setTestStorageKey("cart:waffle-with-berries", "1");
    await allTasks();
    const element = comp.getByRole("button", { name: "Decrement" });

    expect(element).toBeVisible();

    const user = userEvent.setup();
    await user.hover(element);
    await user.click(element);

    expect(getTestStorage()).toEqual({});
    expect(element).not.toBeVisible();
  });

  it("should add to cart when click increment", async () => {
    const comp = render(DessertsTab, { props: testData });
    setTestStorageKey("cart:waffle-with-berries", "1");
    await allTasks();
    const element = comp.getByRole("button", { name: "Increment" });

    expect(element).toBeVisible();

    const user = userEvent.setup();
    await user.hover(element);
    await user.click(element);
    await user.click(element);

    expect(getTestStorage()).toEqual({ "cart:waffle-with-berries": "3" });
    expect(comp.getByText("3")).toBeVisible();
  });

  it("should increment/decrement with keyboard", async () => {
    const user = userEvent.setup();

    const comp = render(DessertsTab, { props: testData });
    const container = comp.getByTestId("container");

    await user.keyboard("{Tab}");
    expect(container).toHaveFocus();

    await user.keyboard("{+}{-}{+}{+}{+}{+}{-}{-}");
    expect(comp.getByText("2")).toBeVisible();
    expect(getTestStorage()).toEqual({ "cart:waffle-with-berries": "2" });
  });
});
