$ErrorActionPreference = "Stop"

Write-Host "Building Nexa backend exe..."

if (-not (Test-Path ".\venv\Scripts\python.exe")) {
  Write-Host "backend\venv not found. Create it first:" -ForegroundColor Yellow
  Write-Host "  python -m venv venv" -ForegroundColor Yellow
  Write-Host "  .\venv\Scripts\pip install -r requirements.txt pyinstaller" -ForegroundColor Yellow
  exit 1
}

.\venv\Scripts\python.exe -m pip install --upgrade pip | Out-Null
.\venv\Scripts\python.exe -m pip install -r requirements.txt pyinstaller

Remove-Item -Recurse -Force ".\build" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force ".\dist"  -ErrorAction SilentlyContinue

.\venv\Scripts\python.exe -m PyInstaller --noconfirm --clean .\pyinstaller.spec

if (Test-Path ".\\dist\\nexa-backend.exe") {
  Copy-Item ".\\dist\\nexa-backend.exe" ".\\nexa-backend.exe" -Force
} elseif (Test-Path ".\\dist\\nexa-backend\\nexa-backend.exe") {
  Copy-Item ".\\dist\\nexa-backend\\nexa-backend.exe" ".\\nexa-backend.exe" -Force
}

Write-Host "Done. Output:"
Write-Host "  backend\\nexa-backend.exe"

