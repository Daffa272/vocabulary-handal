"""
04_scrape_banyak_halaman.py
==============================================================
Scraping Banyak Halaman (Pagination) dengan Sopan (Rate Limiting)
Target: http://books.toscrape.com/
==============================================================
"""
import time
import requests
from bs4 import BeautifulSoup

def scrape_halaman(nomor_halaman):
    url = f"http://books.toscrape.com/catalogue/page-{nomor_halaman}.html"
    headers = {"User-Agent": "LatihanMultiPage/1.0"}

    print(f"🔍 Mengambil Halaman {nomor_halaman}: {url}")
    try:
        resp = requests.get(url, headers=headers, timeout=10)
        if resp.status_code == 404:
            print(f"   ℹ️ Halaman {nomor_halaman} tidak ditemukan (404). Akhir halaman.")
            return []
        resp.raise_for_status()
    except Exception as e:
        print(f"   ❌ Gagal: {e}")
        return []

    soup = BeautifulSoup(resp.text, "html.parser")
    pods = soup.select("article.product_pod")

    daftar = []
    for pod in pods:
        link = pod.select_one("h3 a")
        judul = link["title"] if (link and "title" in link.attrs) else link.get_text()
        harga = pod.select_one("p.price_color").get_text(strip=True)
        daftar.append({"halaman": nomor_halaman, "judul": judul, "harga": harga})

    print(f"    Berhasil mengambil {len(daftar)} buku.")
    return daftar

def main():
    print("=" * 60)
    print("  SCRAPING MULTI-HALAMAN (PAGINATION)")
    print("=" * 60)

    total_data = []
    maks_halaman = 3
    jeda_detik = 2

    for hal in range(1, maks_halaman + 1):
        buku = scrape_halaman(hal)
        if not buku:
            break
        total_data.extend(buku)

        if hal < maks_halaman:
            print(f"⏳ Jeda sopan {jeda_detik} detik...")
            time.sleep(jeda_detik)

    print(f"\n Selesai: Mengambil total {len(total_data)} buku dari {maks_halaman} halaman.")

if __name__ == "__main__":
    main()
