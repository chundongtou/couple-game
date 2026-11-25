from PIL import Image
import os
base = r"E:\DSH研发\.agents\worktrees\dsh-bf954628-7cd3\couple-game\shots\v9.5-dice\quick"
for name, box in [("390x844-hold.png", (420, 780, 800, 1180)), ("390x844-throw.png", (300, 640, 780, 1100))]:
    im = Image.open(os.path.join(base, name))
    im.crop(box).resize(((box[2]-box[0])*2, (box[3]-box[1])*2), Image.LANCZOS).save(os.path.join(base, "crop-" + name))
    print(name, im.size)
