// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useMultiTabSync } from "@/hooks/useMultiTabSync";
import { STORAGE_KEYS } from "@/constants";
import { useAssetStore, useFireStore } from "@/stores";

describe("useMultiTabSync", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("triggers rehydrate on useAssetStore when assets storage event occurs", () => {
    const rehydrateSpy = vi.spyOn(useAssetStore.persist, "rehydrate");

    renderHook(() => useMultiTabSync());

    const event = new StorageEvent("storage", {
      key: STORAGE_KEYS.ASSETS,
      newValue: JSON.stringify({ state: { assets: [] }, version: 1 }),
    });
    window.dispatchEvent(event);

    expect(rehydrateSpy).toHaveBeenCalledTimes(1);
  });

  it("triggers rehydrate on useFireStore when fire storage event occurs", () => {
    const rehydrateSpy = vi.spyOn(useFireStore.persist, "rehydrate");

    renderHook(() => useMultiTabSync());

    const event = new StorageEvent("storage", {
      key: STORAGE_KEYS.FIRE,
      newValue: JSON.stringify({ state: { mode: "expense" }, version: 1 }),
    });
    window.dispatchEvent(event);

    expect(rehydrateSpy).toHaveBeenCalledTimes(1);
  });

  it("ignores unrelated storage events", () => {
    const assetSpy = vi.spyOn(useAssetStore.persist, "rehydrate");
    const fireSpy = vi.spyOn(useFireStore.persist, "rehydrate");

    renderHook(() => useMultiTabSync());

    const event = new StorageEvent("storage", {
      key: "unrelated-key",
      newValue: "value",
    });
    window.dispatchEvent(event);

    expect(assetSpy).not.toHaveBeenCalled();
    expect(fireSpy).not.toHaveBeenCalled();
  });
});
