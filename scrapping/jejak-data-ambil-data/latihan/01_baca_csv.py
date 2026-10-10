"""
01_baca_csv.py
==============================================================
Langkah Pertama: Membaca & Memeriksa File CSV Menggunakan Pandas
Tingkat Kesulitan: Sangat Mudah (Pemula)
==============================================================
"""
import sys
import os

try:
    import pandas as pd
except ModuleNotFoundError:
    print("❌ ERROR: Library 'pandas' belum terpasang.")
    print("👉 Solusi di terminal Windows: pip install pandas")
    sys.exit(1)

def main():
    print("=" * 60)
    print("  MEMBACA DATASET DENGAN PANDAS")
    print("=" * 60)

    nama_file = "contoh_buku.csv"

    if not os.path.exists(nama_file):
        print(f"❌ File '{nama_file}' tidak ditemukan di folder ini!")
        print("💡 Pastikan Anda menjalankan skrip dari folder 'latihan'.")
        return

    try:
        print(f" Membaca file: {nama_file} ...")
        df = pd.read_csv(nama_file, encoding='utf-8')
    except UnicodeDecodeError:
        print("⚠️ File memiliki encoding selain UTF-8, mencoba 'latin1'...")
        df = pd.read_csv(nama_file, encoding='latin1')
    except Exception as e:
        print(f"❌ Terjadi kesalahan saat membaca CSV: {e}")
        return

    print(" Berhasil memuat data!\n")

    print("1. Lima Baris Pertama (df.head()):")
    print("-" * 50)
    print(df.head())
    print("\n" + "=" * 50)

    jumlah_baris, jumlah_kolom = df.shape
    print(f"2. Dimensi Data: {jumlah_baris} baris dan {jumlah_kolom} kolom\n")

    print("3. Ringkasan Struktur & Tipe Data (df.info()):")
    print("-" * 50)
    df.info()
    print("\n" + "=" * 50)

    print("4. Ringkasan Statistik Angka (df.describe()):")
    print("-" * 50)
    print(df.describe())
    print("\n" + "=" * 50)

    if 'kategori' in df.columns:
        print("5. Distribusi Buku per Kategori:")
        print(df['kategori'].value_counts())

    print("\n🎉 Selesai! Anda sudah berhasil membuka dan menganalisis dasar data CSV di Python.")

if __name__ == "__main__":
    main()
