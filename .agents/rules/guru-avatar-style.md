# Guru Avatar Image Style Specification (구루 아바타 스타일 규격)

**Activation:** This rule is **ALWAYS ON** whenever creating, editing, or converting investment guru avatars in `public/gurus/*.webp`.

---

## 📌 Core Aesthetic: Minimalist White Line Art on Transparent Background (화이트 라인 아트 스케치)

Portfolio Bridge의 모든 구루 아바타(`public/gurus/*.webp`)는 블룸버그 단말기 다크 테마(검정/`zinc-950` 배경)에 완벽히 녹아드는 **미니멀 화이트 라인 아트 / 스케치 아웃라인(Minimalist White Line Art on Transparent Background)** 규격을 엄격히 준수합니다.

월스트리트 저널(WSJ) 헤드컷(Hedcut) 스타일의 미니멀 선화 판화처럼, 얇고 깨끗한 단색 화이트 선으로 인물의 이목구비와 윤곽선만을 표현합니다.

일반 실사 사각형 컬러 사진, 면 채움(Solid fills), 무거운 셰이딩, 불투명 사각형 배경은 **절대 금지**됩니다.

---

## 🎨 Technical Specifications (기술 사양)

| 항목 | 사양 | 세부 설명 |
| :--- | :--- | :--- |
| **포맷** | `WebP` (RGBA) | 투명 알파 채널 필수 (`VP8X` 포맷) |
| **해상도** | `512 x 512` ~ `1024 x 1024` | 1:1 정방형 픽셀 비율 |
| **배경** | 100% 투명 | 인물 선화 외 배경 완전 투명 (`Alpha = 0`, 투명 비율 60~85%) |
| **RGB 채널** | `RGB = (255, 255, 255)` | **모든 픽셀의 RGB는 순백색(255)으로 고정** |
| **Alpha 채널** | `Alpha = 0 ~ 255` | **오직 Alpha 채널의 투명도만으로 선의 굵기와 명암 윤곽선을 표현** |

---

## ✍️ AI Prompt Template for Avatar Generation

이미지 생성 AI(DALL-E, Imagen 등)에 요청할 때 반드시 아래 프롬프트 구조를 사용해야 합니다:

```text
A minimalist white line art portrait illustration of [Guru Name] ([Firm / Title]).
Style requirements:
- Clean, single-color white line drawing portrait on a solid pitch black background (#000000)
- Minimalist contours: hair outline, facial features (eyes, nose, smile/mouth, eyebrows), suit lapels, collar, and tie
- NO photorealism, NO colors, NO textures, NO grayscale fills or shading
- Pure vector-style minimalist line art sketch (similar to Wall Street Journal hedcut / clean contour line art)
- Square 1:1 aspect ratio
```

---

## 🛠️ Post-Processing Pipeline (투명 WebP 변환)

검은 배경 위에 그려진 흰색 라인 아트를 단말기 투명 WebP로 변환하는 공식 수학 공식:
```python
# 검은 배경(0,0,0) -> Alpha = 0 (투명)
# 흰색 선(255,255,255) -> RGB = (255,255,255), Alpha = (밝기값)
alpha = luminance  # (0.299*R + 0.587*G + 0.114*B)
R = 255, G = 255, B = 255
```

- 변환 도구: `.agents/skills/guru-prompt/scripts/generate_guru_avatar.py`
- 실행 명령:
  ```bash
  python3 .agents/skills/guru-prompt/scripts/generate_guru_avatar.py input_black_bg.png public/gurus/<guru_id>.webp
  ```

---

## 🚫 Guardrails (금지 사항)
- ❌ **사각형 불투명 배경 금지**: 배경이 채워진 사진은 검정 단말기 UI에서 흰/회색 네모 박스로 보여 UI를 심각하게 훼손합니다.
- ❌ **컬러 픽셀 금지**: 피부톤, 넥타이 색상 등 컬러 채도(Saturation)가 0을 초과하면 안 됩니다.
- ❌ **실사 사진(Photorealism) 금지**: 실사 인물 사진 대신 반드시 깔끔한 라인 아트 일러스트레이션을 사용해야 합니다.

