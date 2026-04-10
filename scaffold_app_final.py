import os
import json

# --- Fix main.ts to bootstrap via AppModule ---
main_ts = """import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
"""

# --- Fix index.html with Bootstrap 5 + Bootstrap Icons CDN ---
index_html = """<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Stock Monitoring System</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Stock Monitoring System - Manage products, depots, etageres and transfers">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <!-- Bootstrap 5 -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <!-- Bootstrap Icons -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body style="font-family: 'Inter', sans-serif; background-color: #f8f9fa;">
  <app-root></app-root>
  <!-- Bootstrap 5 JS Bundle -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
"""

# --- Write files ---
with open("src/main.ts", "w", encoding="utf-8") as f:
    f.write(main_ts)

with open("src/index.html", "w", encoding="utf-8") as f:
    f.write(index_html)

# --- Remove old standalone config files ---
for old_file in ["src/app/app.config.ts", "src/app/app.routes.ts"]:
    if os.path.exists(old_file):
        os.remove(old_file)
        print(f"Removed: {old_file}")

# --- Fix tsconfig.app.json to ensure correct compilation ---
tsconfig_path = "tsconfig.app.json"
if os.path.exists(tsconfig_path):
    with open(tsconfig_path, "r", encoding="utf-8") as f:
        tsconfig = json.load(f)
    # Ensure main.ts is included
    if "files" in tsconfig:
        if "src/main.ts" not in tsconfig["files"]:
            tsconfig["files"].append("src/main.ts")
    with open(tsconfig_path, "w", encoding="utf-8") as f:
        json.dump(tsconfig, f, indent=2)

print("Final cleanup complete: main.ts updated, index.html updated with Bootstrap 5.")
print("")
print("==============================================")
print(" ALL FILES GENERATED SUCCESSFULLY!")
print("==============================================")
print("")
print("Summary:")
print("  - environments/environment.ts")
print("  - core: interceptors, guards, services (auth, product, depot, etagere, user, transfer)")
print("  - shared: models (5), components (navbar, sidebar)")
print("  - features: auth (login/register), dashboard, products, depots, etageres, transfer, users")
print("  - app.module.ts, app-routing.module.ts, app.component.*")
print("  - main.ts, index.html (Bootstrap 5 CDN)")
print("")
print("Next steps:")
print("  1. Stop and restart 'ng serve'")
print("  2. Open http://localhost:4200")
print("  3. Ensure FastAPI backend is running at http://localhost:8000")
