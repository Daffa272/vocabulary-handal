"""
02_kaggle_api.py
==============================================================
Mengunduh Dataset dari Kaggle Lewat Python (Kaggle API & kagglehub)
Tingkat Kesulitan: Mudah
Lokasi Token di Windows: C:\Users\<NamaUserAnda>\.kaggle\kaggle.json
==============================================================
"""
import os
import sys

def cek_kredensial_kaggle():
    home_dir = os.path.expanduser("~")
    kaggle_dir = os.path.join(home_dir, ".kaggle")
    kaggle_json = os.path.join(kaggle_dir, "kaggle.json")
    
    print(f"🔎 Memeriksa file token di: {kaggle_json}")
    if os.path.exists(kaggle_json):
        print(" Token 'kaggle.json' ditemukan!\n")
        return True
    else:
        print("⚠️ File 'kaggle.json' BELUM ditemukan di folder pengguna Anda.")
        print("📌 Panduan Singkat:")
        print("   1. Buka kaggle.com -> Login -> Klik foto profil -> Settings")
        print("   2. Scroll ke bagian 'API' -> Klik tombol 'Create New Token'")
        print("   3. File 'kaggle.json' akan terunduh otomatis.")
        print(f"   4. Buat folder '{kaggle_dir}' dan pindahkan file tersebut ke sana.\n")
        return False

def download_via_kagglehub():
    try:
        import kagglehub
    except ModuleNotFoundError:
        print("⚠️ Library 'kagglehub' belum terpasang.")
        print("👉 Jalankan: pip install kagglehub\n")
        return

    print("🚀 Mengunduh dataset contoh menggunakan library kagglehub...")
    print("Contoh dataset: 'zynicide/wine-reviews'")
    
    try:
        path = kagglehub.dataset_download("zynicide/wine-reviews")
        print(f" Dataset berhasil diunduh ke folder lokal:")
        print(f"   📁 {path}")
        files = os.listdir(path)
        print(f"   📄 File yang tersedia: {files[:5]}")
    except Exception as e:
        print(f"❌ Gagal mengunduh dengan kagglehub: {e}")

def main():
    print("=" * 60)
    print("  PENGAMBILAN DATA VIA KAGGLE API")
    print("=" * 60)

    token_ada = cek_kredensial_kaggle()
    if token_ada:
        download_via_kagglehub()
    else:
        print("Perintah alternatif via terminal Windows:")
        print("  kaggle datasets download -d zynicide/wine-reviews --unzip")

if __name__ == "__main__":
    main()
