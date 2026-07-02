import re

with open('src/utils/gurus.ts', 'r') as f:
    content = f.read()

gurus_to_update = [
    'graham', 'lilu', 'ackman', 'burry', 'fisher', 'cohen', 
    'marks', 'klarman', 'templeton', 'soros', 'wood', 
    'druckenmiller', 'smith'
]

for g in gurus_to_update:
    # Match the id line, and then name line
    pattern = r'(id:\s*"' + g + r'",\s*\n\s*name:\s*".*?",)'
    replacement = r'\1\n    avatar: "/gurus/' + g + r'.png",'
    content = re.sub(pattern, replacement, content)

with open('src/utils/gurus.ts', 'w') as f:
    f.write(content)
