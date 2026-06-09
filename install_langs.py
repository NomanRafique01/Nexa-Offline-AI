import argostranslate.package

print("Updating package index...")
argostranslate.package.update_package_index()
available = argostranslate.package.get_available_packages()

for code in ["zh", "ur", "ar"]:
    pkg = next((p for p in available if p.from_code == "en" and p.to_code == code), None)
    if pkg:
        print(f"Downloading en->{code}...")
        argostranslate.package.install_from_path(pkg.download())
        print(f"✓ Installed en->{code}")
    else:
        print(f"✗ Package en->{code} not found")

print("Done. Restart your backend.")