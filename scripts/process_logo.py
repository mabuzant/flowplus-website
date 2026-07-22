#!/usr/bin/env python3
"""Treat a raw client/entity logo for the flow+ homepage clients strip.

Trims the transparent (or solid-colour) border, adds a small even pad, and
writes a transparent PNG to assets/clients/<slug>.png — ready for the
white-tint "Treatment A" strip (tinting is done in CSS, so the file must keep
its own colours on a transparent background).

Usage:
  python3 scripts/process_logo.py <input_image> <slug>
  python3 scripts/process_logo.py youth_co.png youth-councils --crop-rows 135-278

Options:
  --crop-rows A-B   Keep only vertical rows A..B before trimming (use this to
                    cut a sub-lockup out of a composite logo).
  --pad F           Pad fraction of the longest side (default 0.06).

Requires Pillow:  pip install Pillow
"""
import sys, os, argparse
from PIL import Image, ImageChops

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "assets", "clients")


def content_bbox(im):
    """Bounding box of the visible logo: use the alpha channel when the image
    is transparent, otherwise diff against the top-left corner colour."""
    im = im.convert("RGBA")
    alpha = im.split()[3]
    lo, _ = alpha.getextrema()
    if lo < 250:  # genuine transparency
        mask = alpha.point(lambda p: 255 if p > 16 else 0)
    else:         # opaque -> key out the corner background colour
        bg = Image.new("RGB", im.size, im.convert("RGB").getpixel((0, 0)))
        mask = ImageChops.difference(im.convert("RGB"), bg).convert("L").point(
            lambda p: 255 if p > 12 else 0)
    return im, mask.getbbox()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("input", help="path to the raw logo image")
    ap.add_argument("slug", help="kebab-case output name (-> assets/clients/<slug>.png)")
    ap.add_argument("--crop-rows", help="keep only rows A-B before trimming, e.g. 135-278")
    ap.add_argument("--pad", type=float, default=0.06)
    a = ap.parse_args()

    im = Image.open(a.input).convert("RGBA")
    if a.crop_rows:
        y0, y1 = (int(v) for v in a.crop_rows.split("-"))
        im = im.crop((0, y0, im.size[0], y1))

    im, bbox = content_bbox(im)
    if not bbox:
        print("!! no visible content found in image"); sys.exit(1)
    logo = im.crop(bbox)

    if logo.split()[3].getextrema()[0] >= 250:
        print("WARNING: logo has an opaque background. The strip tints logos white "
              "in CSS, which needs a TRANSPARENT background — export/remove the "
              "background before shipping, or it will render as a white block.")

    p = int(max(logo.size) * a.pad)
    canvas = Image.new("RGBA", (logo.size[0] + 2 * p, logo.size[1] + 2 * p), (0, 0, 0, 0))
    canvas.paste(logo, (p, p), logo)

    os.makedirs(OUT_DIR, exist_ok=True)
    out = os.path.join(OUT_DIR, a.slug + ".png")
    canvas.save(out)
    print("wrote", os.path.relpath(out, ROOT), canvas.size)


if __name__ == "__main__":
    main()
