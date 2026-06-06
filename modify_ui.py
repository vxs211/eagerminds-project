import os
import re

directories = ['app', 'components']

replacements = [
    (r'bg-white\b', 'bg-surface-1'),
    (r'bg-gray-50\b', 'bg-canvas'),
    (r'bg-gray-100\b', 'bg-surface-2'),
    (r'bg-gray-200\b', 'bg-hairline'),
    (r'text-gray-900\b', 'text-ink'),
    (r'text-gray-800\b', 'text-ink'),
    (r'text-gray-700\b', 'text-ink-muted'),
    (r'text-gray-600\b', 'text-ink-muted'),
    (r'text-gray-500\b', 'text-ink-muted'),
    (r'text-\[\#171717\]\b', 'text-ink'),
    (r'text-\[\#4d4d4d\]\b', 'text-ink-muted'),
    (r'bg-\[\#171717\]\b', 'bg-surface-2'),
    (r'border-gray-200\b', 'border-hairline'),
    (r'border-gray-300\b', 'border-hairline-soft'),
    (r'border-\[\#ebebeb\]\b', 'border-hairline'),
    (r'border-\[\#171717\]\b', 'border-hairline'),
    (r'hover:bg-gray-50\b', 'hover:bg-surface-2'),
    (r'hover:bg-gray-100\b', 'hover:bg-surface-2'),
    (r'ring-gray-300\b', 'ring-hairline'),
    (r'ring-gray-200\b', 'ring-hairline'),
    (r'focus:ring-blue-500\b', 'focus:ring-accent-blue'),
    (r'focus:border-blue-500\b', 'focus:border-accent-blue'),
    (r'focus:ring-black\b', 'focus:ring-accent-blue'),
    (r'focus:border-black\b', 'focus:border-accent-blue'),
    (r'text-blue-600\b', 'text-accent-blue'),
    (r'hover:text-blue-700\b', 'hover:text-accent-blue'),
]

for directory in directories:
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r') as f:
                    content = f.read()

                new_content = content
                for pattern, repl in replacements:
                    new_content = re.sub(pattern, repl, new_content)

                if new_content != content:
                    with open(filepath, 'w') as f:
                        f.write(new_content)
                    print(f"Updated {filepath}")
