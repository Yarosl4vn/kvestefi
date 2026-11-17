import http.server
import socketserver
import webbrowser
import socket
import os
import sys

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Enable CORS and caching headers for PWA
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def guess_type(self, path):
        if path.endswith(".js"):
            return "application/javascript; charset=utf-8"
        elif path.endswith(".json"):
            return "application/json; charset=utf-8"
        elif path.endswith(".webmanifest") or path.endswith("manifest.json"):
            return "application/manifest+json; charset=utf-8"
        elif path.endswith(".css"):
            return "text/css; charset=utf-8"
        return super().guess_type(path)

def run():
    global PORT
    local_ip = get_local_ip()
    handler = CustomHandler

    for p in range(PORT, PORT + 20):
        try:
            with socketserver.TCPServer(("", p), handler) as httpd:
                PORT = p
                local_url = f"http://localhost:{PORT}/index.html"
                network_url = f"http://{local_ip}:{PORT}/index.html"

                print("=" * 70)
                print(f"🚀 СЕРВЕР «КВЕСТЕФИ» PWA & WEB УСПЕШНО ЗАПУЩЕН!")
                print("=" * 70)
                print(f"💻 На этом компьютере (ПК): {local_url}")
                print(f"📱 Для iPhone / iPad / других устройств по Wi-Fi:")
                print(f"   {network_url}")
                print("=" * 70)
                print("💡 Как установить на iPhone:")
                print(f"   1. Откройте Safari на iPhone и перейдите по адресу:")
                print(f"      {network_url}")
                print("   2. Нажмите кнопку «Поделиться» -> «На экран Домой»")
                print("=" * 70)
                print("Нажмите Ctrl+C для остановки сервера.")

                try:
                    webbrowser.open(local_url)
                except Exception:
                    pass

                httpd.serve_forever()
                break
        except OSError:
            continue

if __name__ == "__main__":
    run()
