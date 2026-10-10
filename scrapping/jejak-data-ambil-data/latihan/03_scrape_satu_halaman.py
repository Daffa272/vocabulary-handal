"""
03_scrape_satu_halaman.py
==============================================================
Scraping Halaman Pertama: Mengambil Kutipan & Penulis
Target: http://quotes.toscrape.com/ (Situs resmi untuk latihan)
Library: requests, beautifulsoup4
==============================================================
"""
import sys
import requests
from bs4 import BeautifulSoup

def main():
    print("=" * 60)
    print("  SCRAPING DASAR: SATU HALAMAN QUOTES")
    print("=" * 60)

    url = "http://quotes.toscrape.com/"
    headers = {
        "User-Agent": "LatihanPemulaScraper/1.0 (Pendidikan Pembelajaran Data; Windows)"
    }

    print(f"1. Mengirim permintaan HTTP GET ke: {url}")
    try:
        response = requests.get(url, headers=headers, timeout=10)
        print(f"   Status Code: {response.status_code}")
        response.raise_for_status()
    except Exception as e:
        print(f"❌ Terjadi kesalahan: {e}")
        return

    print("2. Parsing teks HTML dengan BeautifulSoup...")
    soup = BeautifulSoup(response.text, "html.parser")
    elemen_quotes = soup.select("div.quote")
    print(f"   Ditemukan {len(elemen_quotes)} elemen kutipan di halaman ini!\n")

    for index, item in enumerate(elemen_quotes, start=1):
        tag_teks = item.select_one("span.text")
        teks_kutipan = tag_teks.get_text(strip=True) if tag_teks else "Tidak ada teks"

        tag_penulis = item.select_one("small.author")
        nama_penulis = tag_penulis.get_text(strip=True) if tag_penulis else "Anonim"

        print(f"[{index}] {nama_penulis}: {teks_kutipan[:60]}...")

    print("-" * 60)
    print(" Ekstraksi selesai dengan sukses!")

if __name__ == "__main__":
    main()
