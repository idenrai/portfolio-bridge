// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import {
  formatBytes,
  calculateLocalStorageUsage,
} from "@/hooks/useStoragePersistence";
import { STORAGE_KEYS } from "@/constants";

describe("useStoragePersistence utilities", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("formatBytes", () => {
    it("formats 0 bytes correctly", () => {
      expect(formatBytes(0)).toBe("0 B");
      expect(formatBytes(-100)).toBe("0 B");
    });

    it("formats KB, MB, GB accurately", () => {
      expect(formatBytes(1024)).toBe("1 KB");
      expect(formatBytes(1024 * 1.5)).toBe("1.5 KB");
      expect(formatBytes(1024 * 1024 * 5)).toBe("5 MB");
      expect(formatBytes(1024 * 1024 * 1024 * 2)).toBe("2 GB");
    });
  });

  describe("calculateLocalStorageUsage", () => {
    it("returns 0 when storage is empty", () => {
      expect(calculateLocalStorageUsage()).toBe(0);
    });

    it("calculates bytes for portfolio-bridge keys", () => {
      const sampleVal = JSON.stringify({ test: "data", number: 12345 });
      localStorage.setItem(STORAGE_KEYS.ASSETS, sampleVal);

      const usage = calculateLocalStorageUsage();
      expect(usage).toBeGreaterThan(0);

      // key(STORAGE_KEYS.ASSETS.length) + val(sampleVal.length) * 2 bytes
      const expected = (STORAGE_KEYS.ASSETS.length + sampleVal.length) * 2;
      expect(usage).toBe(expected);
    });

    it("ignores unrelated localStorage keys", () => {
      localStorage.setItem("some-other-app-key", "random-data");
      expect(calculateLocalStorageUsage()).toBe(0);
    });
  });
});
