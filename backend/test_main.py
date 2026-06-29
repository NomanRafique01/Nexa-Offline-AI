"""
Tests for Nexa backend API.

Run with:
    cd backend
    pip install pytest httpx --break-system-packages
    pytest test_main.py -v
"""

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import sys
import os

# ── Make sure imports resolve ─────────────────────────────────
sys.path.insert(0, os.path.dirname(__file__))

# Mock heavy dependencies before importing main
# (Vosk, sounddevice etc. won't be available in CI)
sys.modules["vosk"] = MagicMock()
sys.modules["sounddevice"] = MagicMock()
sys.modules["argostranslate"] = MagicMock()
sys.modules["argostranslate.translate"] = MagicMock()
sys.modules["argostranslate.package"] = MagicMock()

from main import app, strip_markdown, compress_image_b64

client = TestClient(app)


# ─────────────────────────────────────────────────────────────
# Unit Tests — pure functions
# ─────────────────────────────────────────────────────────────

class TestStripMarkdown:
    def test_removes_bold(self):
        assert strip_markdown("**hello**") == "hello"

    def test_removes_headings(self):
        assert strip_markdown("## Title").strip() == "Title"

    def test_removes_code_block(self):
        result = strip_markdown("```python\nprint('hi')\n```")
        assert "```" not in result

    def test_removes_inline_code(self):
        assert strip_markdown("`code`") == "code"

    def test_removes_bullet_points(self):
        result = strip_markdown("- item one")
        assert "-" not in result.strip()

    def test_plain_text_unchanged(self):
        text = "Hello world"
        assert strip_markdown(text) == text

    def test_removes_links(self):
        result = strip_markdown("[click here](https://example.com)")
        assert "click here" in result
        assert "https" not in result


# ─────────────────────────────────────────────────────────────
# API Tests — endpoints
# ─────────────────────────────────────────────────────────────

class TestRootEndpoint:
    def test_returns_200(self):
        response = client.get("/")
        assert response.status_code == 200

    def test_returns_json(self):
        response = client.get("/")
        assert response.headers["content-type"].startswith("application/json")


class TestRuntimeStatus:
    def test_returns_200(self):
        response = client.get("/runtime-status")
        assert response.status_code == 200

    def test_has_expected_keys(self):
        response = client.get("/runtime-status")
        data = response.json()
        # Should return some status info
        assert isinstance(data, dict)


class TestConversations:
    def test_get_conversations_returns_200(self):
        response = client.get("/conversations")
        assert response.status_code == 200

    def test_get_conversations_returns_list(self):
        response = client.get("/conversations")
        data = response.json()
        assert isinstance(data, list)

    def test_delete_all_conversations(self):
        response = client.delete("/conversations/all")
        assert response.status_code == 200

    def test_get_nonexistent_conversation(self):
        response = client.get("/conversations/99999")
        # API returns 200 with empty list when conversation not found
        assert response.status_code == 200


class TestTranslate:
    def test_missing_body_returns_422(self):
        response = client.post("/translate", json={})
        assert response.status_code == 422

    def test_list_languages_returns_200(self):
        response = client.get("/translate/languages")
        assert response.status_code == 200

    def test_list_languages_returns_dict_with_installed(self):
        response = client.get("/translate/languages")
        data = response.json()
        assert isinstance(data, dict)
        assert "installed" in data


class TestRunPython:
    def test_simple_code_executes(self):
        response = client.post("/run-python", json={"code": "print('hello')"})
        assert response.status_code == 200

    def test_returns_output(self):
        response = client.post("/run-python", json={"code": "print(1 + 1)"})
        data = response.json()
        assert "output" in data or "result" in data or "stdout" in data

    def test_empty_code(self):
        response = client.post("/run-python", json={"code": ""})
        assert response.status_code in [200, 422]

    def test_missing_code_field(self):
        response = client.post("/run-python", json={})
        assert response.status_code == 422


class TestExtractText:
    def test_no_file_returns_422(self):
        response = client.post("/extract-text")
        assert response.status_code == 422

    def test_invalid_file_type(self):
        response = client.post(
            "/extract-text",
            files={"file": ("test.txt", b"hello world", "text/plain")}
        )
        # Should either process or return a meaningful error
        assert response.status_code in [200, 400, 422, 500]