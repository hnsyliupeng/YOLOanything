#!/usr/bin/env python3
"""
水上垃圾检测与深度理解系统 — 本地静态服务器
特性：
  - 支持 HTTP Range（视频拖动/逐帧解析必需，Python 内置 http.server 不支持）
  - 正确的 WASM / ES Module MIME 类型（ONNX Runtime Web 必须）
  - 绑定 0.0.0.0，便于沙箱/局域网预览
用法： python3 scripts/server.py [--port 8000] [--root app]
"""
import argparse
import os
import re
import socket
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

EXTRA_TYPES = {
    ".wasm": "application/wasm",
    ".mjs": "text/javascript",
    ".js": "text/javascript",
    ".onnx": "application/octet-stream",
    ".json": "application/json",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
}

RANGE_RE = re.compile(r"bytes=(\d*)-(\d*)$")


class RangeHandler(SimpleHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def guess_type(self, path):
        ext = os.path.splitext(path)[1].lower()
        return EXTRA_TYPES.get(ext) or super().guess_type(path)

    def send_head(self):
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            path = os.path.join(path, "index.html")
        if not os.path.isfile(path):
            self.send_error(404, "Not Found")
            return None
        size = os.path.getsize(path)
        ctype = self.guess_type(path)
        rng = self.headers.get("Range")
        f = open(path, "rb")
        if rng:
            m = RANGE_RE.match(rng.strip())
            if m:
                start_s, end_s = m.groups()
                start = int(start_s) if start_s else 0
                end = int(end_s) if end_s else size - 1
                end = min(end, size - 1)
                if start > end or start >= size:
                    f.close()
                    self.send_error(416, "Requested Range Not Satisfiable")
                    return None
                f.seek(start)
                self.send_response(206)
                self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
                self.send_header("Content-Length", str(end - start + 1))
                self.send_header("Content-Type", ctype)
                self.send_header("Accept-Ranges", "bytes")
                self.end_headers()
                self._range_remaining = end - start + 1
                return _RangeFile(f, self._range_remaining)
        self.send_response(200)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(size))
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Cache-Control", "no-cache")
        self.end_headers()
        return f

    def log_message(self, fmt, *args):
        sys.stderr.write("[server] %s - %s\n" % (self.address_string(), fmt % args))


class _RangeFile:
    def __init__(self, f, remaining):
        self.f, self.remaining = f, remaining

    def read(self, n=-1):
        if self.remaining <= 0:
            return b""
        n = self.remaining if n < 0 else min(n, self.remaining)
        data = self.f.read(n)
        self.remaining -= len(data)
        return data


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--port", type=int, default=8000)
    ap.add_argument("--root", default=os.path.join(os.path.dirname(__file__), "..", "app"))
    args = ap.parse_args()
    root = os.path.abspath(args.root)
    handler = lambda *a, **kw: RangeHandler(*a, directory=root, **kw)
    with ThreadingHTTPServer(("0.0.0.0", args.port), handler) as httpd:
        host = socket.gethostname()
        print(f"[server] 水上垃圾检测系统已启动: http://0.0.0.0:{args.port}  (root={root})", flush=True)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == "__main__":
    main()
