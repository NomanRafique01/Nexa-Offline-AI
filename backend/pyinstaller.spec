#!/usr/bin/env python3
# PyInstaller spec for Nexa backend (offline, bundled assets)

import os
from PyInstaller.utils.hooks import collect_submodules, collect_dynamic_libs
from PyInstaller.building.build_main import Analysis, PYZ, EXE, COLLECT


hiddenimports = []
hiddenimports += collect_submodules("vosk")
hiddenimports += collect_submodules("argostranslate")
hiddenimports += collect_submodules("sqlalchemy")
hiddenimports += collect_submodules("sounddevice")
hiddenimports += collect_submodules("pdfplumber")
hiddenimports += collect_submodules("PIL")
hiddenimports += collect_submodules("httpx")
hiddenimports += collect_submodules("uvicorn")
hiddenimports += collect_submodules("fastapi")
hiddenimports += collect_submodules("requests")
hiddenimports += collect_submodules("numpy")
hiddenimports += collect_submodules("pandas")
hiddenimports += collect_submodules("matplotlib")
hiddenimports += ["database", "models"]

binaries = []
binaries += collect_dynamic_libs("vosk")

datas = [
    ("piper", "piper"),
    ("vosk-model", "vosk-model"),
    ("argos_packages", "argos_packages"),
]

if os.path.isdir("stanza_resources"):
    datas.append(("stanza_resources", "stanza_resources"))


a = Analysis(
    ["main.py"],
    pathex=["."],
    binaries=binaries,
    datas=datas,
    hiddenimports=hiddenimports,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=None)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name="nexa-backend",
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=False,
    console=True,
    disable_windowed_traceback=False,
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=False,
    name="nexa-backend",
)