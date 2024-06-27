import { expect, test } from "vitest";
import { parseVariation } from "@/utils/utils.ts";

test("parseVariation", () => {
  expect(parseVariation([])).toEqual([]);

  expect(parseVariation("1. e4 e5 2. Nf3 Nc6".split(" "))).toEqual([
    { san: "e4", moveNumber: "1.", id: 0 },
    { san: "e5", id: 1 },
    { san: "Nf3", moveNumber: "2.", id: 2 },
    { san: "Nc6", id: 3 },
  ]);

  expect(parseVariation("1... e5 2. Nf3".split(" "))).toEqual([
    { san: "e5", moveNumber: "1...", id: 0 },
    { san: "Nf3", moveNumber: "2.", id: 1 },
  ]);

  expect(parseVariation("1... e5 2. Nf3 3.".split(" "))).toEqual([
    { san: "e5", moveNumber: "1...", id: 0 },
    { san: "Nf3", moveNumber: "2.", id: 1 },
  ]);
});
