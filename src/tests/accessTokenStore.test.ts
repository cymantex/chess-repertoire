import { expect, test } from "vitest";

import { hasExpired } from "@/stores/utils.ts";

test("hasExpired", () => {
  expect(
    hasExpired({
      issued_at: Date.now(),
      expires_in: 3600,
    }),
  ).toBe(false);
  expect(
    hasExpired({
      issued_at: Date.now() - 3601 * 1000,
      expires_in: 3600,
    }),
  ).toBe(true);
});
