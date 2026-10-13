/* =====================================================================
   CONFIG.JS — SEMUA YANG SERING DIGANTI ADA DI SINI
   Tidak perlu menyentuh index.html / app.js untuk hal-hal di bawah.
   ===================================================================== */
const CONFIG = {

  /* [1] NOMOR WHATSAPP — format internasional, tanpa +, spasi, atau tanda "-"
         Contoh: +62 895-4117-93546  →  "62895411793546"                   */
  waNumber: "62895411793546",

  /* [2] NAMA & TEKS WEB — key ini cocok dengan atribut data-text="..." di index.html
         Mau ganti tulisan? Ubah nilai di kanan saja.                       */
  text: {
    brand:       "Warung Nusantara",
    heroTitle1:  "NASI GORENG &",
    heroTitle2:  "SATE AYAM",
    heroDesc:    "Masakan rumahan khas Indonesia, dimasak saat kamu pesan. Pedas, gurih, dan selalu panas.",
    freshTitle:  "SEGAR, PANAS & PEDAS",
    freshDesc:   "Tiga andalan kami yang paling sering dipesan. Bumbu diulek langsung, bukan bumbu instan.",
    menuTitle:   "Menu Favorit",
    menuDesc:    "Pilih kategori, tambahkan ke keranjang, lalu kirim pesanan lewat WhatsApp.",
    footer:      "© 2026 Warung Nusantara. Dibuat dengan sambal."
  },

  /* [3] 3 MENU ANDALAN di section "Segar, Panas & Pedas"
         img = nama file di folder images/                                  */
  featured: [
    { name: "Nasi Goreng Kampung", img: "nasi-goreng.png", price: 25000 },
    { name: "Sate Ayam Madura",    img: "sate-ayam.png",   price: 30000 },
    { name: "Rendang Sapi",        img: "rendang.png",     price: 38000 }
  ],

  /* [4] KATEGORI MENU — id dipakai di daftar menu di bawah */
  categories: [
    { id: "semua",   label: "Semua" },
    { id: "nasi",    label: "Nasi & Lauk" },
    { id: "mie",     label: "Mie & Kuah" },
    { id: "camilan", label: "Camilan" },
    { id: "minum",   label: "Minuman" }
  ],

  /* [5] DAFTAR MENU
         Tambah menu = salin satu baris { ... } lalu ubah isinya.
         cat  = id kategori di atas | img = file di folder images/
         badge = label kecil (kosongkan "" kalau tidak perlu)              */
  menu: [
    { id: "nasgor",  cat: "nasi",    name: "Nasi Goreng Kampung", desc: "Telur, ayam suwir, kerupuk",     price: 25000, img: "nasi-goreng.png",   badge: "Terlaris" },
    { id: "sate",    cat: "nasi",    name: "Sate Ayam Madura",    desc: "10 tusuk, bumbu kacang, lontong", price: 30000, img: "sate-ayam.png",     badge: "Pedas" },
    { id: "rendang", cat: "nasi",    name: "Rendang Sapi",        desc: "Dimasak 4 jam, nasi putih",       price: 38000, img: "rendang.png",       badge: "Chef's pick" },
    { id: "gado",    cat: "nasi",    name: "Gado-Gado",           desc: "Sayur rebus, lontong, bumbu kacang", price: 22000, img: "gado-gado.png", badge: "" },
    { id: "bakso",   cat: "mie",     name: "Bakso Urat",          desc: "Kuah kaldu sapi, mie, sawi",      price: 24000, img: "bakso.png",         badge: "" },
    { id: "soto",    cat: "mie",     name: "Soto Ayam",           desc: "Kuning, koya, telur rebus",       price: 23000, img: "soto-ayam.png",     badge: "" },
    { id: "miegor",  cat: "mie",     name: "Mie Goreng Jawa",     desc: "Bumbu manis pedas, acar",         price: 22000, img: "mie-goreng.png",    badge: "" },
    { id: "pisgor",  cat: "camilan", name: "Pisang Goreng",       desc: "Crispy, taburan keju",            price: 15000, img: "pisang-goreng.png", badge: "Baru" },
    { id: "marta",   cat: "camilan", name: "Martabak Manis",      desc: "Cokelat kacang keju",             price: 35000, img: "martabak.png",      badge: "" },
    { id: "esteh",   cat: "minum",   name: "Es Teh Manis",        desc: "Teh melati, gula aren",           price: 8000,  img: "es-teh.png",        badge: "" },
    { id: "escamp",  cat: "minum",   name: "Es Campur",           desc: "Alpukat, kelapa muda, sirup",     price: 16000, img: "es-campur.png",     badge: "" },
    { id: "esjeruk", cat: "minum",   name: "Es Jeruk Peras",      desc: "Jeruk segar tanpa pengawet",      price: 12000, img: "es-jeruk.png",      badge: "" }
  ],

  /* [6] TEMA WARNA (tombol di menu Pengaturan)
         Tambah tema: tambah baris di sini + blok [data-accent="id"] di css/style.css */
  accents: [
    { id: "sambal", label: "Sambal",  color: "#e63a1e" },
    { id: "kunyit", label: "Kunyit",  color: "#f2a900" },
    { id: "pandan", label: "Pandan",  color: "#2e9b5f" },
    { id: "kopi",   label: "Kopi",    color: "#8a5a3c" }
  ],

  /* [7] PENGIRIMAN */
  deliveryFee: 5000,        // ongkir (isi 0 kalau gratis)
  freeDeliveryAbove: 100000 // gratis ongkir di atas total ini (0 = nonaktif)
};
