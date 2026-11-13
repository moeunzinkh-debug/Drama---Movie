"""
Generates the PWA icons, favicon and Open Graph fallback from the CINEMA KH mark.

Run: python3 scripts/make-icons.py

Requires the Noto Sans Khmer variable font, which ships in the repo's
node_modules (installed by `npm install`):

    node_modules/@fontsource-variable/noto-sans-khmer/files/noto-sans-khmer-khmer-wght-normal.woff2

The brand tokens match app/globals.css: --color-ink #07070c, --color-gold #f0b429.
Generating these from code keeps them reproducible instead of being binary blobs
whose origin nobody remembers.
"""

import sys
from pathlib import Path

from fontTools.ttLib import TTFont  # noqa: F401  (documented dependency)
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public"
KHMER_WOFF2 = (
    ROOT
    / "node_modules/@fontsource-variable/noto-sans-khmer/files"
    / "noto-sans-khmer-khmer-wght-normal.woff2"
)

INK = (7, 7, 12)
INK_2 = (20, 20, 31)
GOLD = (240, 180, 41)
WHITE = (236, 236, 244)
MIST = (154, 154, 173)

SERIF_CANDIDATES = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf",
]

# Khmer string used on the OG card.
TAGLINE_KM = "ភាពយន្ត និងរឿងភាគ មើលឥតគិតថ្លៃ"


def serif(size: int) -> ImageFont.FreeTypeFont:
    for path in SERIF_CANDIDATES:
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def khmer_font(size: int) -> ImageFont.FreeTypeFont | None:
    """Loads the bundled Khmer font, converting woff2 -> ttf on first use."""
    if not KHMER_WOFF2.exists():
        return None
    ttf = Path("/tmp/cinema-kh-khmer.ttf")
    if not ttf.exists() or ttf.stat().st_mtime < KHMER_WOFF2.stat().st_mtime:
        font = TTFont(str(KHMER_WOFF2))
        font.flavor = None  # strip the woff2 wrapper
        font.save(str(ttf))
    return ImageFont.truetype(str(ttf), size)


def rounded_mask(size: int, radius: int) -> Image.Image:
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, size - 1, size - 1), radius, fill=255)
    return mask


def draw_mark(size: int, *, padding_ratio: float = 0.0) -> Image.Image:
    """Gold "C" on a dark rounded tile, drawn at 4x then downsampled."""
    ss = 4
    big = size * ss
    img = Image.new("RGBA", (big, big), (0, 0, 0, 0))

    grad = Image.new("RGB", (1, big))
    for y in range(big):
        t = y / max(big - 1, 1)
        grad.putpixel((0, y), tuple(round(INK[i] + (INK_2[i] - INK[i]) * t) for i in range(3)))
    img.paste(grad.resize((big, big)), (0, 0), rounded_mask(big, int(big * 0.22)))

    draw = ImageDraw.Draw(img)
    inner = int(big * (1 - padding_ratio * 2))
    font = serif(int(inner * 0.74))
    box = draw.textbbox((0, 0), "C", font=font)
    draw.text(
        ((big - (box[2] - box[0])) / 2 - box[0], (big - (box[3] - box[1])) / 2 - box[1] - big * 0.015),
        "C",
        font=font,
        fill=GOLD,
    )
    return img.resize((size, size), Image.LANCZOS)


def make_og(target: Path) -> None:
    """1200x630 social card with the Khmer tagline rendered properly."""
    W, H = 1200, 630
    og = Image.new("RGB", (W, H), INK)
    d = ImageDraw.Draw(og)
    for y in range(H):
        t = y / (H - 1)
        d.line([(0, y), (W, y)], fill=tuple(round(INK[i] + (INK_2[i] - INK[i]) * t) for i in range(3)))

    # Soft gold wash in the top-left, echoing the site hero.
    wash = Image.new("L", (W, H), 0)
    wd = ImageDraw.Draw(wash)
    for r in range(420, 0, -6):
        wd.ellipse((-240 - r // 3, -240 - r // 3, r * 2, r * 2), fill=int(26 * (1 - r / 420)))
    wash = wash.filter(ImageFilter.GaussianBlur(60))
    og.paste(Image.new("RGB", (W, H), GOLD), (0, 0), wash)

    mark = draw_mark(160)
    og.paste(mark, (88, 88), mark)

    logo = serif(86)
    x = 88 + 160 + 28
    d.text((x, 112), "CINEMA", font=logo, fill=WHITE)
    # Use the layout width of the word, not textbbox, which is ink-bounded.
    cw = d.textlength("CINEMA", font=logo)
    d.text((x + cw + 14, 112), "KH", font=logo, fill=GOLD)

    d.rectangle((x, 212, x + 64, 219), fill=GOLD)

    km = khmer_font(46)
    if km:
        # Khmer stacks marks above/below the baseline, so give it room.
        d.text((x, 262), TAGLINE_KM, font=km, fill=WHITE)
        d.text((x, 340), "គ្រប់រឿង មើលបានឥតគិតថ្លៃ", font=khmer_font(32), fill=MIST)
    else:
        print("  ! Khmer font missing — run `npm install` first", file=sys.stderr)
        d.text((x, 262), "Free Khmer movies and drama", font=serif(46), fill=WHITE)

    # Footer rail.
    d.rectangle((0, H - 84, W, H - 80), fill=(35, 35, 47))
    d.text((88, H - 58), "cinema-kh.com", font=serif(26), fill=MIST)
    km_small = khmer_font(26)
    label_km, label_en = "ខ្មែរ · ", "English"
    w_km = d.textlength(label_km, font=km_small) if km_small else 0
    w_en = d.textlength(label_en, font=serif(26))
    lx = W - 88 - (w_km + w_en)
    if km_small:
        d.text((lx, H - 58), label_km, font=km_small, fill=MIST)
    d.text((lx + w_km, H - 58), label_en, font=serif(26), fill=MIST)

    og.save(target, optimize=True)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)

    for size in (192, 512):
        draw_mark(size).save(OUT / f"icon-{size}.png", optimize=True)

    # Maskable icons: keep the mark inside the 80% safe zone so any platform
    # mask (circle, squircle, teardrop) crops only background.
    for size in (192, 512):
        tile = draw_mark(size, padding_ratio=0.14)
        canvas = Image.new("RGBA", (size, size), INK + (255,))
        canvas.paste(tile, (0, 0), tile)
        canvas.convert("RGB").save(OUT / f"icon-maskable-{size}.png", optimize=True)

    draw_mark(180).convert("RGB").save(OUT / "apple-touch-icon.png", optimize=True)
    draw_mark(32).save(OUT / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
    draw_mark(192).save(OUT / "favicon-192.png", optimize=True)

    make_og(OUT / "og-default.png")

    for p in sorted(OUT.glob("*.png")) + [OUT / "favicon.ico"]:
        print(f"  {p.name:28} {p.stat().st_size / 1024:6.1f} KiB")


if __name__ == "__main__":
    main()
