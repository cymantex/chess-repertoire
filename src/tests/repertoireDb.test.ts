import { beforeEach, expect, test, vi } from "vitest";

const { openDB } = vi.hoisted(() => ({ openDB: vi.fn() }));
vi.mock("idb", () => ({ openDB, deleteDB: vi.fn() }));

beforeEach(() => {
  vi.resetModules();
  openDB.mockReset();
});

test("concurrent requests share a connection while separate repertoires stay separate", async () => {
  const first = { close: vi.fn() };
  const second = { close: vi.fn() };
  openDB.mockResolvedValueOnce(first).mockResolvedValueOnce(second);
  const { openRepertoireDb } = await import(
    "@/features/repertoire/database/repertoireDb.ts"
  );

  const requests = Array.from({ length: 1000 }, () =>
    openRepertoireDb("first"),
  );
  expect(openDB).toHaveBeenCalledTimes(1);
  for (const db of await Promise.all(requests)) expect(db).toBe(first);
  expect(await openRepertoireDb("second")).toBe(second);
  expect(await openRepertoireDb("first")).toBe(first);
  expect(openDB).toHaveBeenCalledTimes(2);
});

test("creating a repertoire leaves a usable connection for subsequent imports", async () => {
  const db = { close: vi.fn() };
  openDB.mockResolvedValue(db);
  const { openRepertoireDb, repertoireDb } = await import(
    "@/features/repertoire/database/repertoireDb.ts"
  );

  await repertoireDb.create("test");
  expect(await openRepertoireDb("user-repertoire-test")).toBe(db);
  expect(db.close).not.toHaveBeenCalled();
  expect(openDB).toHaveBeenCalledTimes(1);
});

test.each(["blocking", "terminated"])(
  "reopens the database after %s",
  async (event) => {
    const oldConnection = { close: vi.fn() };
    const newConnection = { close: vi.fn() };
    openDB
      .mockResolvedValueOnce(oldConnection)
      .mockResolvedValueOnce(newConnection);
    const { openRepertoireDb } = await import(
      "@/features/repertoire/database/repertoireDb.ts"
    );

    await openRepertoireDb("test");
    openDB.mock.calls[0][2][event]();
    expect(await openRepertoireDb("test")).toBe(newConnection);
    expect(oldConnection.close).toHaveBeenCalledTimes(
      event === "blocking" ? 1 : 0,
    );
    expect(openDB).toHaveBeenCalledTimes(2);
  },
);

test("a failed open can be retried", async () => {
  const db = { close: vi.fn() };
  openDB
    .mockRejectedValueOnce(new Error("Cannot open database"))
    .mockResolvedValueOnce(db);
  const { openRepertoireDb } = await import(
    "@/features/repertoire/database/repertoireDb.ts"
  );

  await expect(openRepertoireDb("test")).rejects.toThrow(
    "Cannot open database",
  );
  expect(await openRepertoireDb("test")).toBe(db);
  expect(openDB).toHaveBeenCalledTimes(2);
});
