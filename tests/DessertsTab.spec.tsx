import DessertsTab from "@/components/DessertsTab";
import data from "@/data.json";
import { $cart, normalize } from "@/stores/cart";
import {
  cleanTestStorage,
  getTestStorage,
  setTestStorageKey,
  useTestStorageEngine,
} from "@nanostores/persistent";
import { render } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import { cleanStores, keepMount } from "nanostores";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

describe("DessertsTab", () => {
  const testData = data[0];
  const id = normalize(testData.name);

  beforeAll(() => {
    useTestStorageEngine();
  });

  afterAll(() => {
    cleanTestStorage();
  });

  beforeEach(() => {
    keepMount($cart);
  });

  afterEach(() => {
    cleanStores($cart);
  });

  it("should add to cart when click", async () => {
    const comp = render(() => <DessertsTab {...testData} />);
    const addToCart = comp.getByRole("button", { name: "Add To Cart" });

    expect(getTestStorage()).toEqual({});
    expect(addToCart).toBeVisible();

    const user = userEvent.setup();
    await user.hover(addToCart);
    await user.click(addToCart);
    expect(getTestStorage()).toEqual({ "cart:waffle-with-berries": "1" });
  });

  it("should remove from cart when click decrement", async () => {
    setTestStorageKey("cart:waffle-with-berries", "1");
    const comp = render(() => <DessertsTab {...testData} />);
    const element = comp.getByRole("button", { name: "Decrement" });

    expect(element).toBeVisible();

    const user = userEvent.setup();
    await user.hover(element);
    await user.click(element);
    expect(element).not.toBeVisible();
    expect(getTestStorage()).toEqual({});
  });
});
