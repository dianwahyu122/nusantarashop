/* =====================================================================
   APP.JS — logika web. Data & teks diambil dari config.js.
   Bagian: [1] helper  [2] render  [3] keranjang  [4] pesanan WA
           [5] pengaturan  [6] animasi  [7] start
   ===================================================================== */
(() => {
  "use strict";
  const C = CONFIG;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const rp = n => "Rp" + n.toLocaleString("id-ID");
  const root = document.documentElement;
  const img = f => "images/" + f;

  /* ---------- [1] STATE & penyimpanan ---------- */
  const store = {
    get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
  };
  let cart = store.get("wn_cart", {});            // { idMenu: jumlah }
  let settings = store.get("wn_settings", {
    mode: matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark",
    accent: C.accents[0].id, anim: !matchMedia("(prefers-reduced-motion: reduce)").matches
  });
  const find = id => C.menu.find(m => m.id === id);

  /* ---------- [2] RENDER ---------- */
  function fillText() {
    $$("[data-text]").forEach(el => el.textContent = C.text[el.dataset.text] ?? "");
    document.title = C.text.brand + " — Pesan Makanan Indonesia";
  }
  function renderFeatured() {
    $("#featuredRow").innerHTML = C.featured.map(f => `
      <div class="feat reveal"><img src="${img(f.img)}" alt="${f.name}" loading="lazy"><b>${f.name}</b></div>`).join("");
    $$(".feat").forEach((el, i) => el.onclick = () => { addToCart(C.menu.find(m => m.name === C.featured[i].name)?.id); });
  }
  let activeCat = "semua";
  function renderTabs() {
    $("#tabs").innerHTML = C.categories.map(c =>
      `<button class="tab" role="tab" data-cat="${c.id}" aria-selected="${c.id === activeCat}">${c.label}</button>`).join("");
  }
  function renderMenu() {
    const list = C.menu.filter(m => activeCat === "semua" || m.cat === activeCat);
    $("#menuGrid").innerHTML = list.map((m, i) => `
      <article class="card" style="--i:${i}">
        ${m.badge ? `<span class="badge">${m.badge}</span>` : ""}
        <img class="pic" src="${img(m.img)}" alt="${m.name}" loading="lazy">
        <h3>${m.name}</h3><p>${m.desc}</p>
        <span class="price">${rp(m.price)}</span>
        <button class="btn btn-accent" data-add="${m.id}">Tambah</button>
      </article>`).join("");
  }

  /* ---------- [3] KERANJANG ---------- */
  const totalQty = () => Object.values(cart).reduce((a, b) => a + b, 0);
  const subtotal = () => Object.entries(cart).reduce((s, [id, q]) => s + find(id).price * q, 0);
  const delivery = () => (C.freeDeliveryAbove && subtotal() >= C.freeDeliveryAbove) ? 0 : C.deliveryFee;

  function addToCart(id) {
    if (!id) return;
    cart[id] = (cart[id] || 0) + 1;
    saveCart(); toast(find(id).name + " masuk keranjang");
    const c = $("#cartCount"); c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump");
  }
  function changeQty(id, d) { cart[id] = (cart[id] || 0) + d; if (cart[id] <= 0) delete cart[id]; saveCart(); }
  function saveCart() { store.set("wn_cart", cart); renderCart(); }
  function renderCart() {
    $("#cartCount").textContent = totalQty();
    $("#cartItems").innerHTML = totalQty() ? Object.entries(cart).map(([id, q]) => {
      const m = find(id);
      return `<div class="item"><img src="${img(m.img)}" alt=""><div><b>${m.name}</b><br><small>${rp(m.price)}</small></div>
        <div class="qty"><button data-q="-1" data-id="${id}" aria-label="Kurangi">−</button><b>${q}</b><button data-q="1" data-id="${id}" aria-label="Tambah">+</button></div></div>`;
    }).join("") : `<p class="empty">Keranjang masih kosong.<br>Pilih menu dulu, ya.</p>`;
    $("#subtotal").textContent = rp(subtotal());
  }

  /* ---------- Buka / tutup panel ---------- */
  const overlay = $("#overlay");
  function openPanel(el) {
    closeAll();
    el.classList.add("open");
    if (el.classList.contains("drawer")) overlay.classList.add("show");
    document.body.style.overflow = "hidden";
  }
  function closeAll() {
    $$(".drawer.open,.modal.open").forEach(e => e.classList.remove("open"));
    overlay.classList.remove("show"); document.body.style.overflow = "";
  }

  /* ---------- [4] PESANAN → WHATSAPP ---------- */
  function buildMessage(d) {
    const lines = Object.entries(cart).map(([id, q]) => `• ${q}x ${find(id).name} — ${rp(find(id).price * q)}`);
    const ongkir = d.tipe === "Antar" ? delivery() : 0;
    return [
      `Halo ${C.text.brand}, saya mau pesan:`, "", ...lines, "",
      `Subtotal: ${rp(subtotal())}`,
      d.tipe === "Antar" ? `Ongkir: ${ongkir ? rp(ongkir) : "Gratis"}` : "Ambil sendiri",
      `*Total: ${rp(subtotal() + ongkir)}*`, "",
      `Nama: ${d.nama}`, `No. HP: ${d.hp}`, `Metode: ${d.tipe}`,
      d.tipe === "Antar" ? `Alamat: ${d.alamat}` : null,
      d.catatan ? `Catatan: ${d.catatan}` : null
    ].filter(l => l !== null).join("\n");
  }
  function refreshSummary() {
    const antar = $("#orderForm").tipe.value === "Antar";
    $("#alamatWrap").style.display = antar ? "" : "none";
    const o = antar ? delivery() : 0;
    $("#orderSummary").innerHTML =
      `<div class="row"><span>Subtotal</span><span>${rp(subtotal())}</span></div>` +
      `<div class="row"><span>Ongkir</span><span>${antar ? (o ? rp(o) : "Gratis") : "—"}</span></div>` +
      `<div class="row"><b>Total</b><b>${rp(subtotal() + o)}</b></div>`;
  }
  function submitOrder(e) {
    e.preventDefault();
    const f = e.target, err = $("#formError");
    const d = { nama: f.nama.value.trim(), hp: f.hp.value.trim(), tipe: f.tipe.value, alamat: f.alamat.value.trim(), catatan: f.catatan.value.trim() };
    $$("input,textarea", f).forEach(x => x.classList.remove("bad"));
    const bad = [];
    if (!d.nama) bad.push(f.nama);
    if (!/^[0-9+\s-]{9,16}$/.test(d.hp)) bad.push(f.hp);
    if (d.tipe === "Antar" && d.alamat.length < 8) bad.push(f.alamat);
    if (!totalQty()) { err.textContent = "Keranjang kosong. Tambahkan menu dulu."; return; }
    if (bad.length) {
      bad.forEach(x => x.classList.add("bad")); bad[0].focus();
      err.textContent = "Lengkapi kolom yang bertanda merah (nama, no. HP valid, alamat untuk pesanan antar).";
      return;
    }
    err.textContent = "";
    const url = `https://wa.me/${C.waNumber}?text=${encodeURIComponent(buildMessage(d))}`;
    window.open(url, "_blank", "noopener");
    toast("Membuka WhatsApp…");
  }

  /* ---------- [5] PENGATURAN ---------- */
  function applySettings() {
    root.dataset.theme = settings.mode;
    root.dataset.accent = settings.accent;
    document.body.classList.toggle("no-anim", !settings.anim);
    $$("#modeSeg input").forEach(i => i.checked = i.value === settings.mode);
    $$(".sw").forEach(b => b.setAttribute("aria-pressed", b.dataset.id === settings.accent));
    $("#animToggle").checked = settings.anim;
    store.set("wn_settings", settings);
  }
  function renderSwatches() {
    $("#swatches").innerHTML = C.accents.map(a =>
      `<button class="sw" data-id="${a.id}" style="background:${a.color}" aria-label="Tema ${a.label}" title="${a.label}"></button>`).join("");
  }

  /* ---------- [6] ANIMASI: reveal scroll, tilt 3D, navbar ---------- */
  function initReveal() {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .15 });
    $$(".reveal").forEach(el => io.observe(el));
  }
  function initTilt() {
    const box = $("#tilt");
    box.addEventListener("mousemove", e => {
      if (!settings.anim) return;
      const r = box.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      $(".main", box).style.transform = `rotateY(${x * 22}deg) rotateX(${-y * 22}deg)`;
      $(".side", box).style.transform = `translate(${x * -30}px,${y * -30}px) rotateY(${x * 30}deg)`;
    });
    box.addEventListener("mouseleave", () => $$(".plate", box).forEach(p => p.style.transform = ""));
    addEventListener("scroll", () => {
      $("#nav").classList.toggle("scrolled", scrollY > 20);
      if (settings.anim && scrollY < innerHeight) box.style.translate = `0 ${scrollY * .15}px`;
    }, { passive: true });
  }
  let tt;
  function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 1800); }

  /* ---------- Event ---------- */
  function bind() {
    document.addEventListener("click", e => {
      const t = e.target;
      if (t.closest("[data-add]")) addToCart(t.closest("[data-add]").dataset.add);
      else if (t.closest("[data-q]")) { const b = t.closest("[data-q]"); changeQty(b.dataset.id, +b.dataset.q); }
      else if (t.closest(".tab")) { activeCat = t.closest(".tab").dataset.cat; renderTabs(); renderMenu(); }
      else if (t.closest(".sw")) { settings.accent = t.closest(".sw").dataset.id; applySettings(); }
      else if (t.closest("[data-close]") || t === overlay || t.classList.contains("modal")) closeAll();
      else if (t.closest("#links a")) $("#links").classList.remove("open");
    });
    $("#cartBtn").onclick = () => openPanel($("#cartDrawer"));
    $("#settingsBtn").onclick = () => openPanel($("#settingsModal"));
    $("#burger").onclick = () => $("#links").classList.toggle("open");
    $("#themeBtn").onclick = () => { settings.mode = settings.mode === "dark" ? "light" : "dark"; applySettings(); };
    $("#modeSeg").onchange = e => { settings.mode = e.target.value; applySettings(); };
    $("#animToggle").onchange = e => { settings.anim = e.target.checked; applySettings(); };
    $("#checkoutBtn").onclick = () => {
      if (!totalQty()) return toast("Keranjang masih kosong");
      refreshSummary(); $("#formError").textContent = ""; openPanel($("#orderModal"));
    };
    $("#orderForm").addEventListener("change", refreshSummary);
    $("#orderForm").addEventListener("submit", submitOrder);
    addEventListener("keydown", e => e.key === "Escape" && closeAll());
  }

  /* ---------- [7] START ---------- */
  fillText(); renderFeatured(); renderTabs(); renderMenu(); renderSwatches(); renderCart(); applySettings();
  bind(); initReveal(); initTilt();
  const ready = () => setTimeout(() => document.body.classList.add("ready"), settings.anim ? 900 : 0);
  document.readyState === "complete" ? ready() : addEventListener("load", ready);
})();
