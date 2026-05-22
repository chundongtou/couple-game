import sys

with open(r'C:\Users\10630\couple-game\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

old_start = '/* ===== 1. \u771f\u5fc3\u8bdd\u5927\u5192\u9669 ===== */'
old_end = '/* ===== 2. \u6570\u5b57\u70b8\u5f39 ===== */'

i_start = content.find(old_start)
i_end = content.find(old_end)

if i_start == -1 or i_end == -1:
    print(f"NOT FOUND: start={i_start} end={i_end}")
    sys.exit(1)

# Read new section from external file
with open(r'C:\Users\10630\couple-game\new_td.js', 'r', encoding='utf-8') as f:
    new_section = f.read()

content = content[:i_start] + new_section + content[i_end:]

with open(r'C:\Users\10630\couple-game\index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"PATCH 1 OK - replaced {i_end-i_start} chars with {len(new_section)} chars")
