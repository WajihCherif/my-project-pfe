"""Fix all generated files that have a literal \\n at end of content."""
import os
import glob

# Find all .ts, .html, .css files under src/
files_to_fix = glob.glob("src/**/*.ts", recursive=True) + \
               glob.glob("src/**/*.html", recursive=True) + \
               glob.glob("src/**/*.css", recursive=True)

fixed_count = 0
for path in files_to_fix:
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    # Remove literal backslash-n that was appended at end
    if content.endswith("\\n"):
        new_content = content[:-2] + "\n"
        with open(path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Fixed: {path}")
        fixed_count += 1

print(f"\nTotal files fixed: {fixed_count}")
