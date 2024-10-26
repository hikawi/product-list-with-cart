import data from "./data.json";
import { normalize } from "./stores/cart";

const mappings = new Map<
  string,
  {
    image: {
      thumbnail: string;
      mobile: string;
      tablet: string;
      desktop: string;
    };
    name: string;
    category: string;
    price: number;
  }
>();

for (const item of data) {
  mappings.set(normalize(item.name), item);
}

export { data, mappings };

