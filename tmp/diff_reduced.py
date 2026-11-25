from PIL import Image, ImageChops
import os
base = r"E:\DSH研发\.agents\worktrees\dsh-bf954628-7cd3\couple-game\shots\v9.3-dice"
a = Image.open(os.path.join(base, 'reduced-390x844-a.png')).convert('RGB')
b = Image.open(os.path.join(base, 'reduced-390x844-b.png')).convert('RGB')
print('sizes', a.size, b.size)
d = ImageChops.difference(a, b)
try:
    import numpy as np
    arr = np.asarray(d)
    print('bbox', d.getbbox(), 'max', int(arr.max()), 'nonzero px', int((arr.sum(axis=2) > 0).sum()), 'total', arr.shape[0] * arr.shape[1])
except Exception as e:
    print('numpy missing', e, 'bbox', d.getbbox())
