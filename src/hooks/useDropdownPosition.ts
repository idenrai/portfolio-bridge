import { useState, useRef, useEffect, useCallback } from "react";

export interface UseDropdownPositionOptions {
  containerRef: React.RefObject<HTMLElement | null>;
  isOpen: boolean;
  itemCount: number;
  extraHeight?: number;
  maxHeight?: number;
  minWidthFloor?: number;
  offsetY?: number;
}

/**
 * 뷰포트 경계 감지 및 오버플로우 방지 드롭다운 포지셔닝 커스텀 훅
 * - 화면 하단 공간 부족 시 자동으로 상단 플립
 * - 화면 우측 반쪽에 위치 시 우측 정렬로 오버플로우 방지
 * - requestAnimationFrame 디바운싱 및 scroll / resize 이벤트 리스너 자동 관리
 */
export function useDropdownPosition({
  containerRef,
  isOpen,
  itemCount,
  extraHeight = 16,
  maxHeight = 240,
  minWidthFloor,
  offsetY = 6,
}: UseDropdownPositionOptions) {
  const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({});
  const rafRef = useRef<number | null>(null);

  const updatePopupPosition = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      // 드롭다운 예상 높이 계산 (기본 max-h-60은 약 240px)
      const estimatedHeight = Math.min(itemCount * 36 + extraHeight, maxHeight);
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      let top = rect.bottom + offsetY;
      // 하단 공간 부족 및 상단 공간이 더 넓은 경우 위쪽으로 플립
      if (spaceBelow < estimatedHeight && spaceAbove > spaceBelow) {
        top = rect.top - estimatedHeight - offsetY;
      }

      const minWidthValue = minWidthFloor
        ? `${Math.max(rect.width, minWidthFloor)}px`
        : `${rect.width}px`;

      const style: React.CSSProperties = {
        top: `${top}px`,
        minWidth: minWidthValue,
      };

      // 화면 우측 절반에 있을 경우 우측 기준으로 앵커링하여 가로 오버플로우 방지
      if (rect.left > window.innerWidth / 2) {
        style.right = `${document.documentElement.clientWidth - rect.right}px`;
      } else {
        style.left = `${rect.left}px`;
      }

      setPopupStyle(style);
    });
  }, [containerRef, itemCount, extraHeight, maxHeight, minWidthFloor, offsetY]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      updatePopupPosition();
      window.addEventListener("scroll", updatePopupPosition, true);
      window.addEventListener("resize", updatePopupPosition);
    }

    return () => {
      window.removeEventListener("scroll", updatePopupPosition, true);
      window.removeEventListener("resize", updatePopupPosition);
    };
  }, [isOpen, updatePopupPosition]);

  return { popupStyle, updatePopupPosition };
}
