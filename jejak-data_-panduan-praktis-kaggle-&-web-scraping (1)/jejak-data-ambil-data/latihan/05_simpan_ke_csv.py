"""
05_simpan_ke_csv.py
==============================================================
Alur Penuh: Scraping Data -> Pembersihan Ringan -> Simpan ke CSV
Target: http://books.toscrape.com/
==============================================================
"""
import os
import requests
from bs4 import BeautifulSoup
import pandas as pd

RATING_MAP = {"One": 1, "Two": 2, "Three": 3, "Four": 4, "Five": 5}

def bersihkan_harga(teks):
    return float(teks.replace("£", "").replace("$", "").strip())

def main():
    print("=" * 60)
    print("  SCRAPING LENGKAP & SIMPAN KE FILE CSV")
    print("=" * 60)

    url = "http://books.toscrape.com/catalogue/page-1.html"
    headers = {"User-Agent": "PenyimpanDataCSV/1.0"}

    print(f"1. Mengambil: {url} ...")
    resp = requests.get(url, headers=headers, timeout=10)
    soup = BeautifulSoup(resp.text, "html.parser")
    pods = soup.select("article.product_pod")

    daftar_buku = []
    for pod in pods:
        link = pod.select_one("h3 a")
        judul = link["title"] if (link and "title" in link.attrs) else link.get_text()
        harga = bersihkan_harga(pod.select_one("p.price_color").get_text(strip=True))

        tag_rating = pod.select_one("p.star-rating")
        rating = 0
        if tag_rating:
            for c in tag_rating.get("class", []):
                if c in RATING_MAP:
                    rating = RATING_MAP[c]

        stok_teks = pod.select_one("p.instock.availability").get_text(strip=True)

        daftar_buku.append({
            "judul": judul,
            "harga_gbp": harga,
            "rating_bintang": rating,
            "tersedia": "In stock" in stok_teks
        })

    print(f"2. Mengonversi {len(daftar_buku)} buku ke DataFrame...")
    df = pd.DataFrame(daftar_buku)

    nama_file = "hasil_scrape_buku.csv"
    print(f"3. Menyimpan ke '{nama_file}'...")
    df.to_csv(nama_file, index=False, encoding="utf-8")

    print(f" BERHASIL! File tersimpan di: {os.path.abspath(nama_file)}")
    print(df.head())

if __name__ == "__main__":
    main()
