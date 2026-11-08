#!/usr/bin/env python3
"""
generate_guru_avatar.py
Portfolio Bridge - Investment Guru Minimalist White Line Art Avatar Converter

Converts any black-background white line drawing into the signature Bloomberg Terminal
White Stencil WebP format:
- Mode: RGBA
- All foreground RGB = (255, 255, 255)
- Shading/Lines expressed entirely via Alpha channel (0-255)
- Background is 100% transparent (Alpha = 0)
"""

import sys
import os
from PIL import Image
import numpy as np

def convert_to_white_stencil(input_path: str, output_path: str, target_size: int = 1024):
    if not os.path.exists(input_path):
        print(f"Error: Input file does not exist: {input_path}", file=sys.stderr)
        sys.exit(1)

    print(f"Loading input image: {input_path}")
    im = Image.open(input_path)

    # 1. RGBA 변환 및 정방형 1:1 크롭
    im = im.convert("RGBA")
    w, h = im.size
    min_dim = min(w, h)
    left = (w - min_dim) // 2
    top = (h - min_dim) // 2
    im = im.crop((left, top, left + min_dim, top + min_dim))
    im = im.resize((target_size, target_size), Image.Resampling.LANCZOS)

    arr = np.array(im)
    r, g, b, a = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]

    # 2. 휘도(Luminance) 계산
    luminance = 0.299 * r + 0.587 * g + 0.114 * b

    # 3. 알파 채널 연산
    # 만약 원본이 검은 배경(#000000) 위의 흰색 선화라면:
    # 어두운 배경(luminance < 20)은 완전 투명(alpha = 0)
    # 흰색 선화는 밝기에 비례하여 alpha 매핑
    has_custom_alpha = np.any(a < 255)
    if has_custom_alpha:
        # 이미 알파가 분리된 이미지라면 원래 알파와 휘도를 결합
        alpha = (luminance * (a / 255.0)).astype(np.float32)
    else:
        # 검은 배경 위의 흰색 선화인 경우
        # 노이즈 게이트(15 이하 투명화) 및 곡선 보정
        alpha = np.where(luminance < 15, 0, luminance).astype(np.float32)

    # 선을 또렷하게 살리기 위한 약간의 대비 보정 (감마 0.9)
    alpha = np.clip((alpha / 255.0) ** 0.9 * 255.0, 0, 255).astype(np.uint8)

    # 4. 출력 배열 생성: 모든 픽셀 RGB = 255 (순백색) 고정
    out_arr = np.zeros((target_size, target_size, 4), dtype=np.uint8)
    out_arr[:, :, 0] = 255  # Red
    out_arr[:, :, 1] = 255  # Green
    out_arr[:, :, 2] = 255  # Blue
    out_arr[:, :, 3] = alpha  # Alpha

    out_im = Image.fromarray(out_arr, mode="RGBA")
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    out_im.save(output_path, format="WEBP", lossless=True)

    vis_count = np.count_nonzero(alpha > 0)
    total_count = target_size * target_size
    trans_ratio = 1.0 - (vis_count / total_count)
    print(f"✅ Generated white line art avatar: {output_path}")
    print(f"📊 Stats: size={target_size}x{target_size}, transparent_ratio={trans_ratio:.2%}, format=RGBA WebP")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 generate_guru_avatar.py <input_image> <output_webp> [target_size]")
        sys.exit(1)
    
    in_file = sys.argv[1]
    out_file = sys.argv[2]
    sz = int(sys.argv[3]) if len(sys.argv) > 3 else 1024
    convert_to_white_stencil(in_file, out_file, sz)
