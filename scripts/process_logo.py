#!/usr/bin/env python3
"""Treat a raw client/entity logo for the flow+ homepage clients strip.

Pipeline: (optional crop) -> auto background removal (if the logo sits on a
solid background) -> trim border -> even pad -> save a transparent PNG to
assets/clients/<slug>.png. The strip tints logos white in CSS ("Treatment A"),
so the output must have a TRANSPARENT background — hence the auto bg removal.

Usage:
  python3 scripts/process_logo.py <input_image> <slug>
  python3 scripts/process_logo.py youth_co.png youth-councils --crop-rows 135-278
  python3 scripts/process_logo.py logo_on_white.png acme --bg-tol 48

Options:
  --crop-rows A-B   Keep only vertical rows A..B before everything else (cut a
                    sub-lockup out of a composite logo).
  --bg-tol N        Colour tolerance for background removal (default 36).
  --no-remove-bg    Skip automatic background removal.
  --pad F           Pad fraction of the longest side (default 0.06).

Requires Pillow:  pip install Pillow
"""
import sys, os, argparse
from collections import deque, Counter
from PIL import Image, ImageChops, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "assets", "clients")


def has_transparency(im):
    return im.convert("RGBA").split()[3].getextrema()[0] < 250


def remove_background(im, tol=36):
    """Key out a SOLID background by flood-filling from the image edges, so
    only the background region connected to the border is made transparent —
    same-coloured areas *inside* the logo are preserved. Returns (image, ok)."""
    im = im.convert("RGBA")
    w, h = im.size
    px = im.load()
    corners = [px[0, 0][:3], px[w - 1, 0][:3], px[0, h - 1][:3], px[w - 1, h - 1][:3]]
    bg = Counter(corners).most_common(1)[0][0]

    def near(c):
        return abs(c[0] - bg[0]) + abs(c[1] - bg[1]) + abs(c[2] - bg[2]) <= tol

    visited = bytearray(w * h)
    q = deque()

    def seed(x, y):
        i = y * w + x
        if not visited[i] and near(px[x, y][:3]):
            visited[i] = 1
            q.append((x, y))

    for x in range(w):
        seed(x, 0); seed(x, h - 1)
    for y in range(h):
        seed(0, y); seed(w - 1, y)

    while q:
        x, y = q.popleft()
        if x > 0: seed(x - 1, y)
        if x < w - 1: seed(x + 1, y)
        if y > 0: seed(x, y - 1)
        if y < h - 1: seed(x, y + 1)

    bg_count = sum(visited)
    # Safety: if we'd erase almost everything (logo ~ same colour as bg), bail.
    if bg_count >= w * h * 0.985:
        return im, False

    alpha = im.split()[3]
    ap = alpha.load()
    for y in range(h):
        base = y * w
        for x in range(w):
            if visited[base + x]:
                ap[x, y] = 0
    alpha = alpha.filter(ImageFilter.GaussianBlur(0.6))  # soften the cut edge
    im.putalpha(alpha)
    return im, True


def content_bbox(im):
    """Bounding box of the visible logo (alpha-based once transparent)."""
    im = im.convert("RGBA")
    alpha = im.split()[3]
    if alpha.getextrema()[0] < 250:
        mask = alpha.point(lambda p: 255 if p > 16 else 0)
    else:
        bg = Image.new("RGB", im.size, im.convert("RGB").getpixel((0, 0)))
        mask = ImageChops.difference(im.convert("RGB"), bg).convert("L").point(
            lambda p: 255 if p > 12 else 0)
    return im, mask.getbbox()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("input", help="path to the raw logo image")
    ap.add_argument("slug", help="kebab-case output name (-> assets/clients/<slug>.png)")
    ap.add_argument("--crop-rows", help="keep only rows A-B before trimming, e.g. 135-278")
    ap.add_argument("--bg-tol", type=int, default=36, help="background-removal colour tolerance")
    ap.add_argument("--no-remove-bg", action="store_true", help="skip auto background removal")
    ap.add_argument("--pad", type=float, default=0.06)
    a = ap.parse_args()

    im = Image.open(a.input).convert("RGBA")
    if a.crop_rows:
        y0, y1 = (int(v) for v in a.crop_rows.split("-"))
        im = im.crop((0, y0, im.size[0], y1))

    # Auto background removal only when the logo has no transparency yet.
    if not a.no_remove_bg and not has_transparency(im):
        im, ok = remove_background(im, tol=a.bg_tol)
        if ok:
            print("• removed solid background (flood-fill from edges)")
        else:
            print("WARNING: could not safely remove the background (logo colour "
                  "too close to it). Send a transparent PNG/SVG, or tune --bg-tol.")

    im, bbox = content_bbox(im)
    if not bbox:
        print("!! no visible content found in image"); sys.exit(1)
    logo = im.crop(bbox)

    if not has_transparency(logo):
        print("WARNING: output still has an opaque background — the white tint "
              "will render it as a block. Provide a transparent source.")

    p = int(max(logo.size) * a.pad)
    canvas = Image.new("RGBA", (logo.size[0] + 2 * p, logo.size[1] + 2 * p), (0, 0, 0, 0))
    canvas.paste(logo, (p, p), logo)

    os.makedirs(OUT_DIR, exist_ok=True)
    out = os.path.join(OUT_DIR, a.slug + ".png")
    canvas.save(out)
    print("wrote", os.path.relpath(out, ROOT), canvas.size)


if __name__ == "__main__":
    main()
