import ConfirmOrder from "@/components/ConfirmOrder.vue";
import { $cart } from "@/stores/cart";
import { $confirmModal } from "@/stores/confirm-modal";
import { $total } from "@/stores/total";
import { cleanTestStorage, setTestStorageKey, useTestStorageEngine } from "@nanostores/persistent";
import userEvent from "@testing-library/user-event";
import { cleanup, render } from "@testing-library/vue";
import { allTasks, cleanStores } from "nanostores";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("ConfirmOrder.vue", () => {
  const testData = {
    "red-velvet-cake": 5,
    "vanilla-panna-cotta": 2,
  };
  const total = 35.5;

  beforeAll(() => {
    useTestStorageEngine();
  });

  beforeEach(() => {
    for (const [item, amount] of Object.entries(testData)) {
      setTestStorageKey(`cart:${item}`, amount.toString());
    }
    expect($total.get()).toBe(total);
    $confirmModal.set(true);
  });

  afterEach(() => {
    cleanup();
    cleanStores($cart);
    cleanTestStorage();
  });

  it("should not show dialog when modal is false", async () => {
    $confirmModal.set(false);
    const comp = render(ConfirmOrder);
    await allTasks();

    const dialog = comp.queryByRole("dialog");
    expect(dialog).not.toBeInTheDocument();
  });

  it("should show dialog when modal is true", async () => {
    const comp = render(ConfirmOrder);
    await allTasks();

    const dialog = comp.getByRole("dialog");
    expect(dialog).toBeVisible();
    expect(dialog).toHaveAccessibleName("Confirmation");
  });

  it("should close dialog when clicked", async () => {
    const comp = render(ConfirmOrder);
    await allTasks();

    const button = comp.getByRole("button", { name: "Start New Order" });
    await userEvent.click(button);
    await allTasks();

    expect(comp.queryByRole("dialog")).not.toBeInTheDocument();
    expect($confirmModal.get()).toBeFalsy();
    expect($cart.get()).toEqual({});
  })
})
