#!/usr/bin/env python3
"""FEARS merch mockups — generated from the real album artwork (PIL)."""
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps, ImageChops
import os

ART_SRC = "/Users/ct/Downloads/Flowell Fears (3840 x 3840 px).png"
COVER = "/Users/ct/projects/flowell-next/public/images/fears-cover.jpg"
OUT = "/Users/ct/projects/flowell-next/public/images/merch"
os.makedirs(OUT, exist_ok=True)

FONTS = {
    "black": "/System/Library/Fonts/Supplemental/Arial Black.ttf",
    "bold": "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    "reg": "/System/Library/Fonts/Supplemental/Arial.ttf",
}
def F(name, size):
    return ImageFont.truetype(FONTS[name], size)

art = Image.open(ART_SRC).convert("RGB")

PAPER = (232, 224, 206)
INK = (23, 21, 18)
GOLD = (241, 196, 15)

def grain(img, amount=16):
    w, h = img.size
    noise = Image.effect_noise((w, h), 22).convert("L").filter(ImageFilter.GaussianBlur(0.5))
    return Image.blend(img.convert("RGB"), Image.merge("RGB", (noise, noise, noise)), amount/255)

def vertical_fears(target, box, ink, scale=1.0, font="black"):
    x0, y0, x1, y1 = box
    letters = ["F","E","A","R","S"]
    line_h = (y1 - y0) // len(letters)
    fs = int(line_h * 0.8 * scale)
    f = F(font, fs)
    d = ImageDraw.Draw(target)
    for i, L in enumerate(letters):
        bb = d.textbbox((0,0), L, font=f)
        lw, lh = bb[2]-bb[0], bb[3]-bb[1]
        d.text((x0 + (x1-x0-lw)//2 - bb[0], y0 + i*line_h + (line_h-lh)//2 - bb[1]), L, font=f, fill=ink)
    return target

def distress(alpha_layer, strength=45):
    w, h = alpha_layer.size
    noise = Image.effect_noise((w, h), strength).point(lambda p: 255 if p > 128 else 0)
    return ImageChops.multiply(alpha_layer, noise)

# ── 1. HOODIE ─────────────────────────────────────────────
def hoodie():
    W = H = 1200
    img = Image.new("RGB", (W, H), (10,10,10))
    fabric = Image.new("RGB", (W, H), (12,12,12))
    fd = ImageDraw.Draw(fabric)
    # body — lifted from bg for separation
    fd.rounded_rectangle((300, 260, 900, 1090), radius=80, fill=(44,44,48))
    # hood — draped: outer dome + inner opening shadow + fold arcs
    fd.ellipse((420, 120, 780, 360), fill=(52,52,56))
    fd.ellipse((470, 170, 730, 330), fill=(16,16,18))   # hood opening shadow
    fd.arc((430, 130, 770, 350), 20, 160, fill=(66,66,70), width=5)  # drape fold
    fd.arc((450, 150, 750, 330), 30, 150, fill=(38,38,42), width=4)
    fd.polygon([(450,280),(750,280),(720,360),(480,360)], fill=(34,34,38))
    # long sleeves
    fd.polygon([(300,320),(130,400),(110,760),(140,1000),(230,1010),(300,900),(310,540)], fill=(40,40,44))
    fd.polygon([(900,320),(1070,400),(1090,760),(1060,1000),(970,1010),(900,900),(890,540)], fill=(40,40,44))
    # ribbed cuffs
    fd.rounded_rectangle((128, 950, 232, 1010), radius=8, fill=(30,30,34))
    fd.rounded_rectangle((968, 950, 1072, 1010), radius=8, fill=(30,30,34))
    # kangaroo pocket
    fd.rounded_rectangle((430, 820, 770, 1050), radius=10, fill=(38,38,42))
    fd.line([(430,820),(770,820)], fill=(52,52,56), width=3)
    # ribbed hem band
    fd.rectangle((300,1040,900,1090), fill=(30,30,34))
    # drawstrings
    fd.line([(540,360),(520,500)], fill=(72,72,76), width=7)
    fd.line([(660,360),(680,500)], fill=(72,72,76), width=7)
    # fabric fold shading — vertical soft shadows at torso edges
    fd.polygon([(300,300),(360,320),(340,1080),(300,1080)], fill=(36,36,40))
    fd.polygon([(900,300),(840,320),(860,1080),(900,1080)], fill=(36,36,40))
    # shoulder seams
    fd.arc((380,240,820,420), 200, 340, fill=(58,58,62), width=3)
    fabric = fabric.filter(ImageFilter.GaussianBlur(1.2))
    img.paste(fabric, (0,0))
    d = ImageDraw.Draw(img)
    # rim lighting — left + top-left edge highlight so silhouette reads on black
    d.arc((296, 256, 904, 1094), 150, 300, fill=(96,96,100), width=3)
    d.arc((120, 96, 1080, 1014), 120, 240, fill=(72,72,76), width=2)
    # distressed cream FEARS stack — centered, ends above pocket
    stack = Image.new("L", (W, H), 0)
    vertical_fears(stack, (520, 390, 720, 790), ink=255, scale=0.9)
    stack = distress(stack, 40)
    img.paste(PAPER, (0,0), stack)
    d.text((560, 1130), "F L O W E L L", font=F("bold", 30), fill=(160,155,145))
    return grain(img)

# ── 2. TEE ─────────────────────────────────────────────────
def tee():
    W = H = 1200
    img = Image.new("RGB", (W, H), (10,10,10))
    fabric = Image.new("RGB", (W, H), (12,12,12))
    fd = ImageDraw.Draw(fabric)
    fd.polygon([(400,170),(800,170),(880,200),(1060,340),(970,480),(880,440),(880,1100),(320,1100),(320,440),(230,480),(140,340),(320,200)], fill=(225,217,199))
    fabric = fabric.filter(ImageFilter.GaussianBlur(1.0))
    img.paste(fabric, (0,0))
    photo = art.crop((int(3840*0.08), int(3840*0.20), int(3840*0.44), int(3840*0.80))).resize((420, 800)).convert("L")
    photo = photo.point(lambda p: int(p * 1.12))
    photo_rgb = ImageOps.colorize(photo, black=(26,24,20), white=(255,250,240))
    img.paste(photo_rgb, (250, 240))
    d = ImageDraw.Draw(img)
    d.rectangle((250, 240, 670, 1040), outline=INK, width=4)
    stack = Image.new("L", (W, H), 0)
    vertical_fears(stack, (610, 260, 790, 900), ink=255, scale=0.88)
    stack = distress(stack, 55)
    img.paste(INK, (0,0), stack)
    d.text((610, 940), "F L O W E L L", font=F("bold", 34), fill=INK)
    return grain(img)

# ── 3. VINYL ───────────────────────────────────────────────
def vinyl():
    W = H = 1200
    img = Image.new("RGB", (W, H), (10,10,10))
    d = ImageDraw.Draw(img)
    sleeve = art.resize((720, 720))
    img.paste(sleeve, (70, 240))
    d.rectangle((70, 240, 790, 960), outline=(45,45,45), width=3)
    rx, ry, r = 980, 600, 290
    d.ellipse((rx-r-24, ry-r-24, rx+r+24, ry+r+24), fill=(6,6,6))
    for rr in range(r, 0, -10):
        shade = 26 + int((r - rr)/r * 16)
        d.ellipse((rx-rr, ry-rr, rx+rr, ry+rr), fill=(shade,shade,shade))
    for gr in range(44, r-16, 24):
        d.ellipse((rx-gr, ry-gr, rx+gr, ry+gr), outline=(40,40,40), width=2)
    lr = 100
    d.ellipse((rx-lr, ry-lr, rx+lr, ry+lr), fill=GOLD)
    d.ellipse((rx-lr+5, ry-lr+5, rx+lr-5, ry+lr-5), outline=(20,20,20), width=2)
    d.ellipse((rx-6, ry-6, rx+6, ry+6), fill=(10,10,10))
    d.text((rx-40, ry-52), "FEARS", font=F("black", 26), fill=INK)
    d.text((rx-34, ry+18), "FLOWELL", font=F("bold", 20), fill=INK)
    return grain(img)

# ── 4. CASSETTE ────────────────────────────────────────────
def cassette():
    W = H = 1200
    img = Image.new("RGB", (W, H), (10,10,10))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((250, 400, 950, 860), radius=22, fill=PAPER)
    d.rounded_rectangle((250, 400, 950, 860), radius=22, outline=INK, width=5)
    d.rounded_rectangle((300, 440, 900, 630), radius=10, fill=(246,241,230))
    d.rectangle((300, 440, 900, 630), outline=INK, width=3)
    d.text((330, 470), "FEARS", font=F("black", 52), fill=INK)
    d.text((330, 540), "FLOWELL · SIDE A", font=F("bold", 26), fill=INK)
    stack = Image.new("L", (W, H), 0)
    vertical_fears(stack, (770, 450, 880, 620), ink=255, scale=0.8)
    stack = distress(stack, 60)
    img.paste(INK, (0,0), stack)
    d.rounded_rectangle((380, 680, 820, 820), radius=12, fill=(18,18,18))
    for cx in (480, 720):
        d.ellipse((cx-42, 700, cx+42, 784), fill=PAPER, outline=INK, width=4)
        d.ellipse((cx-12, 730, cx+12, 754), fill=GOLD)
    for x in range(340, 920, 76):
        d.ellipse((x-6, 832, x+6, 844), fill=INK)
    d.text((70, 1120), "METALLIC GOLD SHELL · RUN OF 100", font=F("reg", 24), fill=(160,155,145))
    return grain(img)

# ── 5. POSTER ──────────────────────────────────────────────
def poster():
    W = H = 1200
    img = Image.new("RGB", (W, H), (16,16,16))
    d = ImageDraw.Draw(img)
    pw, ph = 660, 880
    px, py = (W-pw)//2, 150
    d.rectangle((px+12, py+12, px+pw+12, py+ph+12), fill=(7,7,7))
    poster_art = art.resize((pw, ph))
    img.paste(poster_art, (px, py))
    d.rectangle((px, py, px+pw, py+ph), outline=(50,50,50), width=2)
    d.text((70, 1120), "18 × 24 MATTE · GOLD FOIL · NUMBERED RUN OF 100", font=F("reg", 24), fill=(160,155,145))
    return grain(img)

# ── 6. RECORD PACK ─────────────────────────────────────────
def record_pack():
    W = H = 1200
    img = Image.new("RGB", (W, H), (10,10,10))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((150, 220, 1050, 980), radius=8, fill=(18,18,18), outline=(55,55,55), width=2)
    d.rounded_rectangle((200, 280, 900, 880), radius=6, fill=PAPER)
    lines = [
        ("FEARS — TRACKOUT MANIFEST", "black", 30),
        ("", "reg", 26),
        ("01  Fear of Myself", "reg", 26),
        ("02  Fear of Success", "reg", 26),
        ("03  Fear of Being Forgotten", "reg", 26),
        ("04  Fear of the Wicked", "reg", 26),
        ("05  Fear of Settling", "reg", 26),
        ("06  Fear of Intimacy", "reg", 26),
        ("07  Fear of Nothing", "reg", 26),
        ("08  Fear of God", "reg", 26),
        ("", "reg", 26),
        ("WAV STEMS · 24-BIT / 44.1kHz", "bold", 26),
        ("FULL DAW SESSION FILES", "bold", 26),
        ("EXCLUSIVE RIGHTS · ONE OWNER", "bold", 26),
    ]
    y = 320
    for text, fnt, sz in lines:
        if text:
            d.text((240, y), text, font=F(fnt, sz), fill=INK)
        y += 42
    cover = Image.open(COVER).resize((380, 380))
    img.paste(cover, (720, 150))
    d.rectangle((720, 150, 1100, 530), outline=(60,60,60), width=3)
    d.ellipse((840, 470, 1000, 630), fill=GOLD, outline=(20,20,20), width=3)
    d.text((868, 520), "EXCLUSIVE", font=F("black", 22), fill=INK)
    d.text((880, 552), "1 OF 1", font=F("bold", 26), fill=INK)
    return grain(img)

# ── 7. VAULT BUNDLE ────────────────────────────────────────
def bundle():
    W = H = 1200
    img = Image.new("RGB", (W, H), (10,10,10))
    d = ImageDraw.Draw(img)
    d.text((70, 70), "THE VAULT BUNDLE", font=F("black", 52), fill=PAPER)
    d.text((70, 140), "VINYL + HOODIE + TEE + POSTER + CASSETTE", font=F("bold", 28), fill=GOLD)
    vin = vinyl().resize((380, 380))
    img.paste(vin, (60, 220))
    hoo = hoodie().resize((380, 380))
    img.paste(hoo, (470, 220))
    te = tee().resize((380, 380))
    img.paste(te, (880, 220))
    po = poster().resize((300, 400))
    img.paste(po, (140, 640))
    ca = cassette().resize((380, 380))
    img.paste(ca, (480, 660))
    rp = record_pack().resize((380, 380))
    img.paste(rp, (880, 660))
    d.text((70, 1120), "WORTH $195 · YOURS $149 · SAVE $46", font=F("bold", 26), fill=GOLD)
    return grain(img)

mockups = {
    "fears-hoodie": hoodie,
    "fears-tee": tee,
    "fears-vinyl": vinyl,
    "fears-cassette": cassette,
    "fears-poster": poster,
    "fears-record-pack": record_pack,
    "fears-vault-bundle": bundle,
}

if __name__ == "__main__":
    for pid, fn in mockups.items():
        img = fn()
        img.save(os.path.join(OUT, f"{pid}.jpg"), quality=88)
        print(f"saved {pid}.jpg {img.size}")
    print("DONE — 7 mockups at", OUT)