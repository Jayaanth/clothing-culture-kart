const defaultProducts = [
  {
    id: "mysuru-oversized",
    name: "Mysuru Signal Oversized Tee",
    category: "Oversized Tees",
    price: 899,
    sizes: ["S", "M", "L", "XL"],
    stock: 4,
    tag: "Limited Drop",
    description: "Heavy oversized tee with local Mysuru street signal artwork.",
    img: "assets/product-mysuru-tee.svg"
  },
  {
    id: "garage-graphic",
    name: "Garage Culture Graphic Tee",
    category: "Graphic Tees",
    price: 799,
    sizes: ["M", "L", "XL"],
    stock: 9,
    tag: "Best Seller",
    description: "Graphic tee built around garage-culture typography and street attitude.",
    img: "assets/product-garage-tee.svg"
  },
  {
    id: "engineer-hoodie",
    name: "Engineer Built Hoodie",
    category: "Hoodies",
    price: 1599,
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 3,
    tag: "Only Few Left",
    description: "Warm hoodie with engineer-built identity and limited stock energy.",
    img: "assets/product-hoodie.svg"
  },
  {
    id: "culture-cap",
    name: "Culture Kart Utility Cap",
    category: "Streetwear Accessories",
    price: 499,
    sizes: ["Free"],
    stock: 12,
    tag: "New",
    description: "Daily streetwear cap for completing a clean local fit.",
    img: "assets/product-cap.svg"
  },
  {
    id: "burnt-backprint",
    name: "Burnt Orange Backprint Tee",
    category: "Graphic Tees",
    price: 849,
    sizes: ["S", "M", "L", "XL"],
    stock: 7,
    tag: "Drop 02",
    description: "Burnt orange backprint tee with the core CCK tagline.",
    img: "assets/product-backprint.svg"
  },
  {
    id: "night-oversized",
    name: "Night Shift Oversized Tee",
    category: "Oversized Tees",
    price: 949,
    sizes: ["M", "L", "XL", "XXL"],
    stock: 5,
    tag: "Heavy GSM",
    description: "Matte black oversized tee for night rides, college fits and drop days.",
    img: "assets/product-night-tee.svg"
  },
  {
    id: "street-tote",
    name: "Street Lab Canvas Tote",
    category: "Streetwear Accessories",
    price: 399,
    sizes: ["Free"],
    stock: 6,
    tag: "COD Ready",
    description: "Canvas tote for carrying everyday gear with Culture Kart branding.",
    img: "assets/product-tote.svg"
  },
  {
    id: "maroon-hoodie",
    name: "Maroon Underground Hoodie",
    category: "Hoodies",
    price: 1699,
    sizes: ["M", "L", "XL"],
    stock: 2,
    tag: "Only Few Left",
    description: "Deep maroon hoodie with underground drop identity.",
    img: "assets/product-maroon-hoodie.svg"
  }
];

const defaultSettings = {
  brandName: "Clothing Culture",
  brandSmall: "Kart Streetwear",
  brandMark: "CCK",
  tagline: "Built by Engineers. Styled for Streets.",
  instagram: "https://www.instagram.com/clothingculturecart/",
  whatsappNumber: "",
  locationName: "Mysuru, Karnataka",
  locationNote: "Exact pickup point can be shared on WhatsApp during order confirmation.",
  mapQuery: "Mysuru, Karnataka",
  timings: "Mon-Sat: 11 AM - 8 PM. Sunday: Drop and pickup slots only.",
  heroTitle: "Clothing",
  heroOutline: "Culture",
  heroKicker: "Mysuru Independent Streetwear",
  logoImage: ""
};

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

let products = JSON.parse(localStorage.getItem("cck-products") || "null") || defaultProducts;
const siteSettings = { ...defaultSettings, ...(JSON.parse(localStorage.getItem("cck-settings") || "null") || {}) };

function cleanPhoneNumber(value) {
  return String(value || "").replace(/[^\d]/g, "");
}

function getWhatsAppLink(product = null) {
  const number = cleanPhoneNumber(siteSettings.whatsappNumber);
  const productText = product ? `Hi CCK, I want to order/check availability for ${product.name}.` : "Hi CCK, I want to order from Clothing Culture Kart.";
  const text = encodeURIComponent(productText);
  return number ? `https://wa.me/${number}?text=${text}` : `https://wa.me/?text=${text}`;
}

function getMapEmbedUrl() {
  return `https://www.google.com/maps?q=${encodeURIComponent(siteSettings.mapQuery || siteSettings.locationName)}&output=embed`;
}

function showToast(message) {
  const toast = document.querySelector("[data-toast]");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("is-visible"), 1900);
}

function applySiteSettings() {
  document.querySelectorAll(".brand-mark").forEach((node) => {
    if (siteSettings.logoImage) {
      node.innerHTML = `<img src="${siteSettings.logoImage}" alt="${siteSettings.brandMark} logo">`;
      node.classList.add("has-logo-image");
    } else {
      node.textContent = siteSettings.brandMark;
      node.classList.remove("has-logo-image");
    }
  });
  document.querySelectorAll(".brand-name").forEach((node) => {
    node.innerHTML = `${siteSettings.brandName} <small>${siteSettings.brandSmall}</small>`;
  });
  document.querySelectorAll("[data-site-tagline]").forEach((node) => {
    node.textContent = siteSettings.tagline;
  });
  document.querySelectorAll("[data-hero-kicker]").forEach((node) => {
    node.textContent = siteSettings.heroKicker;
  });
  document.querySelectorAll("[data-hero-title]").forEach((node) => {
    node.innerHTML = `${siteSettings.heroTitle} <span>${siteSettings.heroOutline}</span>`;
  });
  document.querySelectorAll("[data-instagram-link]").forEach((node) => {
    node.href = siteSettings.instagram;
  });
  document.querySelectorAll("[data-whatsapp-link]").forEach((node) => {
    node.href = getWhatsAppLink();
  });
  document.querySelectorAll("[data-whatsapp-number]").forEach((node) => {
    node.textContent = siteSettings.whatsappNumber || "Add WhatsApp number in admin";
  });
  document.querySelectorAll("[data-location-name]").forEach((node) => {
    node.textContent = siteSettings.locationName;
  });
  document.querySelectorAll("[data-location-note]").forEach((node) => {
    node.textContent = siteSettings.locationNote;
  });
  document.querySelectorAll("[data-location-timings]").forEach((node) => {
    node.textContent = siteSettings.timings;
  });
  document.querySelectorAll("[data-map-frame]").forEach((node) => {
    node.src = getMapEmbedUrl();
    node.title = `${siteSettings.locationName} map`;
  });
}

function createProductCard(product) {
  return `
    <article class="product-card" data-product-card data-category="${product.category}" data-price="${product.price}">
      <div class="product-media" data-zoom="${product.id}">
        <span class="badge">${product.tag}</span>
        <img src="${product.img}" alt="${product.name}">
      </div>
      <div class="product-info">
        <h3 class="product-title">${product.name}</h3>
        <div class="product-meta">
          <span>${product.category}</span>
          <strong>${currency.format(product.price)}</strong>
        </div>
        <p class="catalog-description">${product.description || "Streetwear catalog piece from Clothing Culture Kart."}</p>
        <div class="product-meta">
          <span class="${product.stock <= 4 ? "stock-low" : ""}">${product.stock <= 4 ? "Only " : ""}${product.stock} left</span>
          <span>Sizes: ${product.sizes.join(", ")}</span>
        </div>
        <div class="card-actions">
          <a class="solid-button" href="${getWhatsAppLink(product)}" target="_blank" rel="noreferrer">Order on WhatsApp</a>
          <a class="ghost-button" href="${siteSettings.instagram}" target="_blank" rel="noreferrer">DM Instagram</a>
        </div>
      </div>
    </article>
  `;
}

function renderProducts(targetSelector, list = products.slice(0, 4)) {
  const target = document.querySelector(targetSelector);
  if (!target) return;
  target.innerHTML = list.filter(Boolean).map(createProductCard).join("");
}

function openProductModal(id) {
  const product = products.find((entry) => entry.id === id);
  const modal = document.querySelector("[data-modal]");
  const body = document.querySelector("[data-modal-body]");
  if (!product || !modal || !body) return;
  body.innerHTML = `
    <img src="${product.img}" alt="${product.name}">
    <div>
      <span class="section-kicker">${product.category}</span>
      <h2 class="section-title" style="font-size: clamp(2rem, 6vw, 4rem);">${product.name}</h2>
      <p class="section-copy">${product.description || "Streetwear catalog piece from Clothing Culture Kart."}</p>
      <p><strong>${currency.format(product.price)}</strong> / <span class="${product.stock <= 4 ? "stock-low" : ""}">${product.stock} left</span></p>
      <div class="sizes">${product.sizes.map((size) => `<span class="size-chip">${size}</span>`).join("")}</div>
      <div class="button-row">
        <a class="solid-button" href="${getWhatsAppLink(product)}" target="_blank" rel="noreferrer">Order on WhatsApp</a>
        <a class="ghost-button" href="${siteSettings.instagram}" target="_blank" rel="noreferrer">DM Instagram</a>
      </div>
    </div>
  `;
  modal.classList.add("is-open");
}

function closeProductModal() {
  document.querySelector("[data-modal]")?.classList.remove("is-open");
}

function applyFilters() {
  const grid = document.querySelector("[data-catalog-grid]");
  if (!grid) return;

  const category = document.querySelector("[data-category-filter] .is-active")?.dataset.value || "All";
  const sort = document.querySelector("[data-sort]")?.value || "featured";

  let filtered = products.filter((product) => category === "All" || product.category === category);
  if (sort === "low") filtered = filtered.sort((a, b) => a.price - b.price);
  if (sort === "high") filtered = filtered.sort((a, b) => b.price - a.price);
  if (sort === "stock") filtered = filtered.sort((a, b) => a.stock - b.stock);

  grid.innerHTML = filtered.map(createProductCard).join("");
  const resultCount = document.querySelector("[data-result-count]");
  if (resultCount) resultCount.textContent = `${filtered.length} catalog items`;
}

function updateCountdown() {
  const nodes = document.querySelectorAll("[data-countdown]");
  if (!nodes.length) return;
  const now = new Date();
  const target = new Date(now);
  target.setDate(target.getDate() + ((6 - target.getDay() + 7) % 7 || 7));
  target.setHours(20, 0, 0, 0);
  const diff = Math.max(0, target - now);
  const values = {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    mins: Math.floor((diff / 60000) % 60),
    secs: Math.floor((diff / 1000) % 60)
  };
  nodes.forEach((node) => {
    node.querySelector("[data-days]").textContent = String(values.days).padStart(2, "0");
    node.querySelector("[data-hours]").textContent = String(values.hours).padStart(2, "0");
    node.querySelector("[data-mins]").textContent = String(values.mins).padStart(2, "0");
    node.querySelector("[data-secs]").textContent = String(values.secs).padStart(2, "0");
  });
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("button, [data-zoom], .modal-backdrop");
  if (!target) return;

  if (target.matches("[data-nav-toggle]")) {
    document.querySelector(".site-header")?.classList.toggle("nav-open");
  }
  if (target.matches("[data-close-modal], .modal-backdrop")) closeProductModal();

  const zoomId = target.getAttribute("data-zoom");
  if (zoomId) openProductModal(zoomId);

  if (target.matches("[data-category-filter] button")) {
    target.parentElement.querySelectorAll("button").forEach((button) => button.classList.remove("is-active"));
    target.classList.add("is-active");
    applyFilters();
  }
});

document.addEventListener("change", (event) => {
  if (event.target.matches("[data-sort]")) applyFilters();
});

document.addEventListener("submit", (event) => {
  if (event.target.matches("[data-contact-form]")) {
    event.preventDefault();
    const data = new FormData(event.target);
    const message = `Hi CCK, my name is ${data.get("name")}. ${data.get("message")}`;
    const number = cleanPhoneNumber(siteSettings.whatsappNumber);
    const url = number ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : getWhatsAppLink();
    window.open(url, "_blank", "noopener,noreferrer");
    event.target.reset();
    showToast("Opening WhatsApp");
  }
});

applySiteSettings();
renderProducts("[data-featured-grid]", products.slice(0, 4));
renderProducts("[data-best-grid]", products.slice(0, 4));
renderProducts("[data-catalog-grid]", products);
applyFilters();
updateCountdown();
setInterval(updateCountdown, 1000);
