// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

describe("useNetworkStatus", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("initializes with navigator.onLine value", () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true } as Response);

    const { result } = renderHook(() => useNetworkStatus());
    expect(result.current.isOnline).toBe(true);
  });

  it("updates isOnline to false when offline event is dispatched", () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true } as Response);

    const { result } = renderHook(() => useNetworkStatus());

    act(() => {
      window.dispatchEvent(new Event("offline"));
    });

    expect(result.current.isOnline).toBe(false);
  });

  it("calls onReconnect when transitioning from offline to online", async () => {
    const onReconnect = vi.fn();
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true } as Response);

    const { result } = renderHook(() => useNetworkStatus({ onReconnect }));

    // 먼저 offline 전환
    act(() => {
      window.dispatchEvent(new Event("offline"));
    });
    expect(result.current.isOnline).toBe(false);
    expect(onReconnect).not.toHaveBeenCalled();

    // 다시 online 전환
    await act(async () => {
      window.dispatchEvent(new Event("online"));
      await new Promise((r) => setTimeout(r, 10));
    });

    expect(result.current.isOnline).toBe(true);
    expect(onReconnect).toHaveBeenCalledTimes(1);
  });
});
