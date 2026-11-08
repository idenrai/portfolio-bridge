# Martin Fowler Refactoring Catalog & Smells

Portfolio Bridge 소스코드 품질 향상을 위한 마틴 파울러 리팩토링 카탈로그입니다.

---

## 1. Code Smells Diagnostic

| 스멜 분류 | 증상 | 권장 리팩토링 기법 |
| :--- | :--- | :--- |
| **Bloaters** | 100줄 이상의 긴 함수, 5개 이상의 파라미터 | **Extract Function**, **Introduce Parameter Object** |
| **Dispensables** | 주석 처리된 데드코드, 미사용 임포트/인터페이스 | **Remove Dead Code**, **Inline Variable** |
| **Conditional Complexity** | 3중 이상의 중첩 if/else 블록 | **Replace Nested Conditional with Guard Clauses** |
| **Feature Envy** | 다른 객체/스토어의 데이터를 과도하게 읽어 처리 | **Move Function**, **Encapsulate Collection** |
| **Shotgun Surgery** | 하나의 변경으로 인해 여러 파일의 사소한 수정이 연쇄 발생 | **Move Function / Combine Functions into Class/Module** |

---

## 2. Guard Clauses & Early Return Pattern

```typescript
// Before: 높은 순환 복잡도
function calculateAssetYield(asset: Asset, rate: number) {
  if (asset) {
    if (asset.amount > 0) {
      if (rate > 0) {
        return (asset.amount * rate) / 100;
      }
    }
  }
  return 0;
}

// After: 가드 절을 활용한 조기 반환 (Flat & Clean)
function calculateAssetYield(asset: Asset | null, rate: number): number {
  if (!asset || asset.amount <= 0 || rate <= 0) {
    return 0;
  }
  return (asset.amount * rate) / 100;
}
```

