const products = [
  {
    id: "mysuru-oversized",
    name: "Mysuru Signal Oversized Tee",
    category: "Oversized Tees",
    price: 899,
    sizes: ["S", "M", "L", "XL"],
    stock: 4,
    tag: "Limited Drop",
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
    img: "assets/product-maroon-hoodie.svg"
  }
];

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

const cart = JSON.parse(localStorage.getItem("cck-cart") || "[]");
const wishlist = new Set(JSON.parse(localStorage.getItem("cck-wishlist") || "[]"));

function saveState() {
  localStorage.setItem("cck-cart", JSON.stringify(cart));
  localStorage.setItem("cck-wishlist", JSON.stringify([...wishlist]));
}

function showToast(message) {
  const toast = document.querySelector("[data-toast]");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("is-visible"), 1900);
}

function createProductCard(product) {
  const isLiked = wishlist.has(product.id);
  return `
    <article class="product-card" data-product-card data-category="${product.category}" data-price="${product.price}">
      <button class="icon-button wishlist ${isLiked ? "is-active" : ""}" type="button" data-wishlist="${product.id}" aria-label="Add ${product.name} to wishlist">♡</button>
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
        <div class="product-meta">
          <span class="${product.stock <= 4 ? "stock-low" : ""}">${product.stock <= 4 ? "Only " : ""}${product.stock} left</span>
          <span>COD available</span>
        </div>
        <div class="sizes" aria-label="Available sizes">
          ${product.sizes.map((size) => `<span class="size-chip">${size}</span>`).join("")}
        </div>
        <div class="card-actions">
          <button class="solid-button" type="button" data-add="${product.id}">Add to Cart</button>
          <button class="ghost-button" type="button" data-buy="${product.id}">Quick Buy</button>
        </div>
      </div>
    </article>
  `;
}

function renderProducts(targetSelector, list = products.slice(0, 4)) {
  const target = document.querySelector(targetSelector);
  if (!target) return;
  target.innerHTML = list.map(createProductCard).join("");
}

function updateCart() {
  document.querySelectorAll("[data-cart-count]").forEach((node) => {
    node.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  });

  const cartItems = document.querySelector("[data-cart-items]");
  const cartTotal = document.querySelector("[data-cart-total]");
  if (!cartItems || !cartTotal) return;

  if (!cart.length) {
    cartItems.innerHTML = `<p class="section-copy">Your cart is waiting for the next drop.</p>`;
    cartTotal.textContent = currency.format(0);
    return;
  }

  cartItems.innerHTML = cart.map((item) => {
    const product = products.find((entry) => entry.id === item.id);
    return `
      <div class="cart-item">
        <img src="${product.img}" alt="${product.name}">
        <div>
          <strong>${product.name}</strong>
          <div class="product-meta">${item.qty} x ${currency.format(product.price)}</div>
        </div>
        <button class="icon-button" type="button" data-remove="${product.id}" aria-label="Remove ${product.name}">×</button>
      </div>
    `;
  }).join("");

  const total = cart.reduce((sum, item) => {
    const product = products.find((entry) => entry.id === item.id);
    return sum + product.price * item.qty;
  }, 0);
  cartTotal.textContent = currency.format(total);
}

function addToCart(id, quiet = false) {
  const entry = cart.find((item) => item.id === id);
  if (entry) entry.qty += 1;
  else cart.push({ id, qty: 1 });
  saveState();
  updateCart();
  if (!quiet) showToast("Added to cart");
}

function openCart() {
  document.querySelector("[data-cart-drawer]")?.classList.add("is-open");
}

function closeCart() {
  document.querySelector("[data-cart-drawer]")?.classList.remove("is-open");
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
      <p class="section-copy">Heavy streetwear energy with local Mysuru attitude, built for limited drops and daily wear.</p>
      <p><strong>${currency.format(product.price)}</strong> · <span class="${product.stock <= 4 ? "stock-low" : ""}">${product.stock} left</span></p>
      <div class="sizes">${product.sizes.map((size) => `<span class="size-chip">${size}</span>`).join("")}</div>
      <div class="button-row">
        <button class="solid-button" type="button" data-add="${product.id}">Add to Cart</button>
        <button class="ghost-button" type="button" data-buy="${product.id}">Quick Buy</button>
      </div>
    </div>
  `;
  modal.classList.add("is-open");
}

function closeProductModal() {
  document.querySelector("[data-modal]")?.classList.remove("is-open");
}

function applyFilters() {
  const grid = document.querySelector("[data-shop-grid]");
  if (!grid) return;

  const category = document.querySelector("[data-category-filter] .is-active")?.dataset.value || "All";
  const maxPrice = Number(document.querySelector("[data-price-filter]")?.value || 2000);
  const sort = document.querySelector("[data-sort]")?.value || "featured";

  let filtered = products.filter((product) => {
    const categoryMatch = category === "All" || product.category === category;
    return categoryMatch && product.price <= maxPrice;
  });

  if (sort === "low") filtered = filtered.sort((a, b) => a.price - b.price);
  if (sort === "high") filtered = filtered.sort((a, b) => b.price - a.price);
  if (sort === "stock") filtered = filtered.sort((a, b) => a.stock - b.stock);

  grid.innerHTML = filtered.map(createProductCard).join("");
  document.querySelector("[data-result-count]").textContent = `${filtered.length} styles`;
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
  const target = event.target.closest("button, [data-zoom], .drawer-backdrop, .modal-backdrop");
  if (!target) return;

  if (target.matches("[data-nav-toggle]")) {
    document.querySelector(".site-header")?.classList.toggle("nav-open");
  }
  if (target.matches("[data-open-cart]")) openCart();
  if (target.matches("[data-close-cart], .drawer-backdrop")) closeCart();
  if (target.matches("[data-close-modal], .modal-backdrop")) closeProductModal();

  const addId = target.getAttribute("data-add");
  if (addId) addToCart(addId);

  const buyId = target.getAttribute("data-buy");
  if (buyId) {
    addToCart(buyId, true);
    openCart();
    showToast("Ready for checkout");
  }

  const removeId = target.getAttribute("data-remove");
  if (removeId) {
    const index = cart.findIndex((item) => item.id === removeId);
    if (index >= 0) cart.splice(index, 1);
    saveState();
    updateCart();
  }

  const wishlistId = target.getAttribute("data-wishlist");
  if (wishlistId) {
    wishlist.has(wishlistId) ? wishlist.delete(wishlistId) : wishlist.add(wishlistId);
    saveState();
    target.classList.toggle("is-active");
    showToast(wishlist.has(wishlistId) ? "Saved to wishlist" : "Removed from wishlist");
  }

  const zoomId = target.getAttribute("data-zoom");
  if (zoomId) openProductModal(zoomId);

  if (target.matches("[data-category-filter] button")) {
    target.parentElement.querySelectorAll("button").forEach((button) => button.classList.remove("is-active"));
    target.classList.add("is-active");
    applyFilters();
  }
});

document.addEventListener("input", (event) => {
  if (event.target.matches("[data-price-filter]")) {
    document.querySelector("[data-price-value]").textContent = currency.format(Number(event.target.value));
    applyFilters();
  }
});

document.addEventListener("change", (event) => {
  if (event.target.matches("[data-sort]")) applyFilters();
});

document.addEventListener("submit", (event) => {
  if (event.target.matches("[data-contact-form]")) {
    event.preventDefault();
    showToast("Message drafted. WhatsApp is fastest for live orders.");
    event.target.reset();
  }
});

renderProducts("[data-featured-grid]", products.slice(0, 4));
renderProducts("[data-best-grid]", [products[1], products[2], products[0], products[5]]);
renderProducts("[data-shop-grid]", products);
applyFilters();
updateCart();
updateCountdown();
setInterval(updateCountdown, 1000);
