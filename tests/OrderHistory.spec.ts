import ClearHistoryButton from "@/components/ClearHistoryButton.vue";
import OrderHistory from "@/components/OrderHistory.vue";
import { mappings } from "@/data";
import { $history } from "@/stores/history";
import { cleanTestStorage, getTestStorage, setTestStorageKey, useTestStorageEngine } from "@nanostores/persistent";
import userEvent from "@testing-library/user-event";
import { cleanup, render, within } from "@testing-library/vue";
import { allTasks, cleanStores } from "nanostores";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("OrderHistory", () => {
  const testData = {
    "1000000": {
      "red-velvet-cake": 5,
      "vanilla-panna-cotta": 2,
      "pistachio-baklava": 1,
      "waffle-with-berries": 3,
      "vanilla-bean-crème-brûlée": 4,
    },
    "2000000": {
      "macaron-mix-of-five": 2,
      "classic-tiramisu": 1,
      "lemon-meringue-pie": 6,
    },
  };

  beforeAll(() => {
    useTestStorageEngine();
  });

  beforeEach(() => {
    for (const [item, node] of Object.entries(testData)) {
      setTestStorageKey(`history:${item}`, JSON.stringify(node));
    }
  });

  afterEach(() => {
    cleanStores($history);
    cleanup();
    cleanTestStorage();
  });

  it("should show message if history empty", async () => {
    cleanTestStorage();
    const comp = render(OrderHistory);
    await allTasks();
    expect(comp.queryByText("crickets sounds")).toBeInTheDocument();
  });

  it("should show accordingly if there's history", async () => {
    const comp = render(OrderHistory);
    await allTasks();

    for (const [item, node] of Object.entries(testData)) {
      const timeString = new Date(parseInt(item)).toLocaleString();
      const heading = comp.queryByRole("heading", { name: timeString });
      expect(heading).toBeInTheDocument();

      const outerLi = heading?.parentElement!;
      expect(outerLi.nodeName).toBe("LI");

      const innerUl = within(outerLi).getByRole("list");
      for (const [key, amount] of Object.entries(node)) {
        const obj = mappings.get(key)!;

        const nameElement = within(innerUl).queryByText(obj.name);
        expect(nameElement).toBeInTheDocument();

        const amountElement = within(innerUl).queryByText(`${amount}x`);
        expect(amountElement).toBeInTheDocument();

        const totalElement = within(innerUl).queryByText(`$${(amount * obj.price).toFixed(2)}`);
        expect(totalElement).toBeInTheDocument();
      }
    }
  });

  it("should clear history if clicked clear", async () => {
    const comp = render(ClearHistoryButton);
    await allTasks();

    expect(Object.keys(getTestStorage()).length).toBe(2);
    const button = comp.getByRole("button");
    await userEvent.click(button);
    await allTasks();

    expect(getTestStorage()).toEqual({});
  });

  it("should contain nothing if errors in localStorage", async () => {
    setTestStorageKey("history:3000000", "undefined"); // Bad data, it should ignore instead.
    await allTasks();
    expect($history.get()).toEqual(testData); // Completely ignore that bad node we added.
  });
});
