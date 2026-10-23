import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { GuruPromptCard } from "@/components/gurus/prompt/GuruPromptCard";
import { ko } from "@/i18n";

describe("GuruPromptCard component", () => {
  const defaultProps = {
    mode: "full" as const,
    onModeChange: vi.fn(),
    fullPromptText: "MOCK FULL PROMPT TEXT",
    followUpPromptText: "MOCK FOLLOWUP PROMPT TEXT",
    prevSessionDate: "2026-10-20",
    activeAssetsCount: 5,
    copied: false,
    onCopy: vi.fn(),
    onResetBaseline: vi.fn(),
    baselineResetFeedback: false,
    t: ko,
  };

  it("renders full prompt mode correctly with tabs and baseline indicator", () => {
    render(<GuruPromptCard {...defaultProps} />);

    // 01 tab should be selected
    const tab01 = screen.getByRole("tab", { name: /01: 전체 포트폴리오 분석/i });
    expect(tab01).toBeDefined();
    expect(tab01.getAttribute("aria-selected")).toBe("true");
    expect(tab01.getAttribute("aria-controls")).toBe("guru-prompt-panel");
    expect(tab01.id).toBe("guru-prompt-tab-full");

    // Tabpanel should be bound to 01 tab
    const tabpanel = screen.getByRole("tabpanel");
    expect(tabpanel).toBeDefined();
    expect(tabpanel.id).toBe("guru-prompt-panel");
    expect(tabpanel.getAttribute("aria-labelledby")).toBe("guru-prompt-tab-full");

    // Textarea should contain full prompt
    const textarea = screen.getByRole("textbox");
    expect((textarea as HTMLTextAreaElement).value).toBe("MOCK FULL PROMPT TEXT");

    // Baseline date should be visible
    expect(screen.getByText("2026-10-20")).toBeDefined();
    expect(screen.getByRole("button", { name: ko.guru_ai_baseline_reset })).toBeDefined();
  });

  it("calls onModeChange when clicking mode 02 tab", () => {
    const onModeChange = vi.fn();
    render(<GuruPromptCard {...defaultProps} onModeChange={onModeChange} />);

    const tab02 = screen.getByRole("tab", { name: /02: 변동사항 피드백/i });
    expect(tab02.getAttribute("aria-controls")).toBe("guru-prompt-panel");
    expect(tab02.id).toBe("guru-prompt-tab-followup");
    fireEvent.click(tab02);

    expect(onModeChange).toHaveBeenCalledWith("followup");
  });

  it("handles keyboard navigation between tabs (ArrowRight, ArrowLeft, Home, End)", () => {
    const onModeChange = vi.fn();
    render(<GuruPromptCard {...defaultProps} onModeChange={onModeChange} />);

    const tab01 = screen.getByRole("tab", { name: /01: 전체 포트폴리오 분석/i });

    // ArrowRight / ArrowDown moves to followup
    fireEvent.keyDown(tab01, { key: "ArrowRight" });
    expect(onModeChange).toHaveBeenCalledWith("followup");

    // End key moves to followup
    fireEvent.keyDown(tab01, { key: "End" });
    expect(onModeChange).toHaveBeenCalledWith("followup");

    // ArrowLeft / ArrowUp moves to full
    fireEvent.keyDown(tab01, { key: "ArrowLeft" });
    expect(onModeChange).toHaveBeenCalledWith("full");

    // Home key moves to full
    fireEvent.keyDown(tab01, { key: "Home" });
    expect(onModeChange).toHaveBeenCalledWith("full");
  });

  it("renders followup mode with delta prompt text and matching tabpanel aria-labelledby", () => {
    render(<GuruPromptCard {...defaultProps} mode="followup" />);

    const tab02 = screen.getByRole("tab", { name: /02: 변동사항 피드백/i });
    expect(tab02.getAttribute("aria-selected")).toBe("true");

    const tabpanel = screen.getByRole("tabpanel");
    expect(tabpanel.getAttribute("aria-labelledby")).toBe("guru-prompt-tab-followup");

    const textarea = screen.getByRole("textbox");
    expect((textarea as HTMLTextAreaElement).value).toBe("MOCK FOLLOWUP PROMPT TEXT");
  });

  it("shows friendly notice when followup mode is selected but no previous session exists", () => {
    const onModeChange = vi.fn();
    render(
      <GuruPromptCard
        {...defaultProps}
        mode="followup"
        followUpPromptText={null}
        prevSessionDate={undefined}
        onModeChange={onModeChange}
      />,
    );

    expect(screen.getByText(/아직 이전 분석 이력이 없습니다/i)).toBeDefined();
    const returnBtn = screen.getByRole("button", { name: /> 전체 포트폴리오 분석/i });
    fireEvent.click(returnBtn);
    expect(onModeChange).toHaveBeenCalledWith("full");
  });

  it("calls onResetBaseline when baseline button is clicked", () => {
    const onResetBaseline = vi.fn();
    render(<GuruPromptCard {...defaultProps} onResetBaseline={onResetBaseline} />);

    const resetBtn = screen.getByRole("button", { name: ko.guru_ai_baseline_reset });
    fireEvent.click(resetBtn);
    expect(onResetBaseline).toHaveBeenCalledTimes(1);
  });

  it("calls onCopy when copy button is clicked", () => {
    const onCopy = vi.fn();
    render(<GuruPromptCard {...defaultProps} onCopy={onCopy} />);

    const copyBtn = screen.getByRole("button", { name: ko.guru_ai_copy });
    fireEvent.click(copyBtn);
    expect(onCopy).toHaveBeenCalledTimes(1);
  });
});
