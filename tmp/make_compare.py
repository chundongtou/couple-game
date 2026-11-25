from PIL import Image, ImageDraw
import os
ROOT = r"E:\DSH研发\.agents\worktrees\dsh-bf954628-7cd3\couple-game"
REF = r"E:\DSH研发\.agents\worktrees\dsh-bf954628-7cd3\shots\ref-dice-hand"
OUT = os.path.join(ROOT, "shots", "v9.7-dice")
W = 390
# reference crops
ref1 = Image.open(os.path.join(REF, "toss", "crop-011.0.png")).convert("RGB")
ref2 = Image.open(os.path.join(REF, "toss", "crop-012.0.png")).convert("RGB")
def fit(im, w=W, h=360):
    r = min(w / im.width, h / im.height)
    return im.resize((int(im.width * r), int(im.height * r)), Image.LANCZOS)
ref1, ref2 = fit(ref1), fit(ref2)
# our frames: crop hand/die region then fit
def crop_frame(name, box):
    im = Image.open(os.path.join(OUT, name)).convert("RGB")
    im = im.crop(box)
    return fit(im, W, 360)
our_hold = crop_frame("390x844-hold.png", (300, 760, 760, 1240))
our_throw = crop_frame("390x844-throw.png", (300, 700, 760, 1180))
pad = 12
cw = W + pad * 2
ch = 360 + 26 + pad
canvas = Image.new("RGB", (cw * 2, ch * 2 + 8), (12, 14, 18))
d = ImageDraw.Draw(canvas)
labels = ["ref crop-011 (pinch)", "ref crop-012 (pinch/throw)", "V9.7 hold (390x844)", "V9.7 throw (390x844)"]
imgs = [ref1, ref2, our_hold, our_throw]
for i, im in enumerate(imgs):
    x = (i % 2) * cw + pad
    y = (i // 2) * ch + 24 + pad
    canvas.paste(im, (x, y))
    d.text((x, y - 16), labels[i], fill=(235, 230, 220))
canvas.save(os.path.join(OUT, "compare-ref.png"))
print("saved", canvas.size)
