from PIL import Image
im = Image.open(r"couple-game/shots/v8/prod3d/table-real/R0-overview-390x844.png").convert("RGB")
W,H = im.size
print("size", W,H)
x = W//2
last=None
for y in range(400,H,6):
    p = im.getpixel((x,y))
    if last is None or max(abs(a-b) for a,b in zip(p,last))>3:
        print(y, p)
        last=p
