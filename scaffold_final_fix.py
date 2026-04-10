main_ts_content = """import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
"""

index_html_content = """<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Stock Monitoring System</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Stock Monitoring System - Manage products, depots, etageres and transfers">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body style="font-family: 'Inter', sans-serif; background-color: #f8f9fa;">
  <app-root></app-root>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
"""

with open("src/main.ts", "w", encoding="utf-8") as f:
    f.write(main_ts_content)
print("main.ts written.")

with open("src/index.html", "w", encoding="utf-8") as f:
    f.write(index_html_content)
print("index.html written.")

print("")
print("=" * 50)
print("ALL FILES GENERATED SUCCESSFULLY!")
print("=" * 50)
print("")
print("What was generated:")
print("  [1] environments/environment.ts + environment.prod.ts")
print("  [2] core/interceptors/auth.interceptor.ts")
print("  [3] core/guards/auth.guard.ts")
print("  [4] core/services: auth, product, depot, etagere, user, transfer")
print("  [5] shared/models: user, product, depot, etagere, transfer")
print("  [6] shared/components: navbar, sidebar")
print("  [7] features: auth (login, register)")
print("  [8] features: dashboard")
print("  [9] features: products (list + form)")
print("  [10] features: depots (list + form)")
print("  [11] features: etageres (list + form)")
print("  [12] features: transfer")
print("  [13] features: users (list + form)")
print("  [14] app.module.ts, app-routing.module.ts, app.component.*")
print("  [15] main.ts (AppModule bootstrap), index.html (Bootstrap 5 CDN)")
print("")
print("NEXT STEP: Restart 'ng serve' and open http://localhost:4200")
