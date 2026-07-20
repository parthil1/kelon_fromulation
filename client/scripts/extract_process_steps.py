"""Extract clean square photo interiors from process.png circles."""
from PIL import Image, ImageDraw
from pathlib import Path

SRC = Path(r"d:\kelon_fromulation\client\public\process.png")
OUT = Path(r"d:\kelon_fromulation\client\public\process-steps")
OUT.mkdir(parents=True, exist_ok=True)

im = Image.open(SRC).convert("RGB")
w, h = im.size

# Slightly inset radius to exclude source ring/badge chrome
STEPS = {
    "01": (168, 278, 78),
    "02": (618, 278, 78),
    "03": (1000, 278, 78),
    "04": (1455, 278, 78),
    "05": (168, 642, 78),
    "06": (618, 642, 78),
    "07": (1000, 642, 78),
    "08": (1455, 642, 78),
}

for label, (cx, cy, r) in STEPS.items():
    cx = min(max(cx, r + 2), w - r - 2)
    cy = min(max(cy, r + 2), h - r - 2)
    crop = im.crop((cx - r, cy - r, cx + r, cy + r))
    out = crop.resize((640, 640), Image.Resampling.LANCZOS)
    out.save(OUT / f"step-{label}.png", "PNG", optimize=True)
    print(f"step-{label}: ({cx},{cy}) r={r}")

print("done")
