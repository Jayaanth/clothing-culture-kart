const defaultSettings = {
  brandName: "Clothing Culture",
  brandSmall: "Kart Streetwear",
  brandMark: "CCK",
  tagline: "Built by Engineers. Styled for Streets.",
  instagram: "https://www.instagram.com/clothingculturecart/",
  whatsapp: "https://wa.me/",
  heroTitle: "Clothing",
  heroOutline: "Culture",
  heroKicker: "Mysuru Independent Streetwear",
  logoImage: ""
};

const adminPasscodeHash = "0d35af9b005ae6d4aaa43e701bf84fd1c2f45eabf2d87c0b87506c894b67b047";
let adminProducts = JSON.parse(localStorage.getItem("cck-products") || "null") || defaultProducts;
let adminSettings = { ...defaultSettings, ...(JSON.parse(localStorage.getItem("cck-settings") || "null") || {}) };
let pendingProductImage = "";
let pendingLogoImage = adminSettings.logoImage || "";

const brandForm = document.querySelector("[data-brand-form]");
const productForm = document.querySelector("[data-product-form]");
const productList = document.querySelector("[data-admin-products]");
const productPreview = document.querySelector("[data-product-preview]");
const logoPreview = document.querySelector("[data-logo-preview]");

async function sha256(value) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function unlockAdmin() {
  document.body.classList.remove("admin-locked");
}

if (sessionStorage.getItem("cck-admin-unlocked") === "true") {
  unlockAdmin();
}

document.querySelector("[data-admin-login]").addEventListener("submit", async (event) => {
  event.preventDefault();
  const passcode = new FormData(event.currentTarget).get("passcode");
  const error = document.querySelector("[data-login-error]");
  if (await sha256(passcode) === adminPasscodeHash) {
    sessionStorage.setItem("cck-admin-unlocked", "true");
    unlockAdmin();
    event.currentTarget.reset();
    showToast("Admin unlocked");
  } else {
    error.textContent = "Wrong passcode.";
  }
});

function slugify(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `product-${Date.now()}`;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function persistAdmin() {
  products = adminProducts;
  localStorage.setItem("cck-products", JSON.stringify(adminProducts));
  localStorage.setItem("cck-settings", JSON.stringify(adminSettings));
  showToast("Admin changes saved");
}

function fillBrandForm() {
  Object.entries(adminSettings).forEach(([key, value]) => {
    const field = brandForm.elements[key];
    if (field && field.type !== "file") field.value = value || "";
  });
  renderLogoPreview();
}

function renderLogoPreview() {
  if (pendingLogoImage) logoPreview.innerHTML = `<img src="${pendingLogoImage}" alt="Logo preview">`;
  else logoPreview.innerHTML = `<span class="brand-mark">${adminSettings.brandMark}</span>`;
}

function renderProductPreview(src) {
  productPreview.innerHTML = src ? `<img src="${src}" alt="Product preview">` : `<p class="section-copy">Product image preview</p>`;
}

function fillProductForm(product = null) {
  const current = product || {
    id: "",
    name: "",
    category: "Oversized Tees",
    price: 899,
    stock: 5,
    tag: "New Drop",
    sizes: ["S", "M", "L", "XL"],
    img: "assets/product-mysuru-tee.svg"
  };
  productForm.elements.id.value = current.id;
  productForm.elements.name.value = current.name;
  productForm.elements.category.value = current.category;
  productForm.elements.price.value = current.price;
  productForm.elements.stock.value = current.stock;
  productForm.elements.tag.value = current.tag;
  productForm.elements.sizes.value = current.sizes.join(", ");
  productForm.elements.img.value = current.img;
  pendingProductImage = "";
  renderProductPreview(current.img);
}

function renderProductList() {
  productList.innerHTML = adminProducts.map((product) => `
    <article class="admin-product-row">
      <img src="${product.img}" alt="${product.name}">
      <div>
        <h3>${product.name}</h3>
        <div class="product-meta">${product.category} / ${currency.format(product.price)} / ${product.stock} left</div>
      </div>
      <div class="admin-actions">
        <button class="ghost-button" type="button" data-edit-product="${product.id}">Edit</button>
        <button class="ghost-button admin-danger" type="button" data-delete-product="${product.id}">Delete</button>
      </div>
    </article>
  `).join("");
}

brandForm.addEventListener("change", async (event) => {
  if (event.target.name === "logoFile" && event.target.files[0]) {
    pendingLogoImage = await readFileAsDataUrl(event.target.files[0]);
    renderLogoPreview();
  }
});

brandForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(brandForm);
  adminSettings = {
    ...adminSettings,
    brandName: data.get("brandName").trim(),
    brandSmall: data.get("brandSmall").trim(),
    brandMark: data.get("brandMark").trim() || "CCK",
    tagline: data.get("tagline").trim(),
    instagram: data.get("instagram").trim(),
    whatsapp: data.get("whatsapp").trim(),
    heroTitle: data.get("heroTitle").trim(),
    heroOutline: data.get("heroOutline").trim(),
    heroKicker: data.get("heroKicker").trim(),
    logoImage: pendingLogoImage
  };
  persistAdmin();
  window.location.reload();
});

productForm.addEventListener("change", async (event) => {
  if (event.target.name === "imageFile" && event.target.files[0]) {
    pendingProductImage = await readFileAsDataUrl(event.target.files[0]);
    productForm.elements.img.value = pendingProductImage;
    renderProductPreview(pendingProductImage);
  }
  if (event.target.name === "img") renderProductPreview(event.target.value);
});

productForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(productForm);
  const name = data.get("name").trim();
  const product = {
    id: data.get("id") || slugify(name),
    name,
    category: data.get("category"),
    price: Number(data.get("price")),
    stock: Number(data.get("stock")),
    tag: data.get("tag").trim(),
    sizes: data.get("sizes").split(",").map((size) => size.trim()).filter(Boolean),
    img: pendingProductImage || data.get("img").trim()
  };
  const existingIndex = adminProducts.findIndex((item) => item.id === product.id);
  if (existingIndex >= 0) adminProducts[existingIndex] = product;
  else adminProducts.unshift(product);
  persistAdmin();
  renderProductList();
  fillProductForm();
});

document.addEventListener("click", (event) => {
  const editId = event.target.closest("[data-edit-product]")?.dataset.editProduct;
  const deleteId = event.target.closest("[data-delete-product]")?.dataset.deleteProduct;
  if (event.target.closest("[data-new-product], [data-reset-form]")) fillProductForm();
  if (event.target.closest("[data-clear-logo]")) {
    pendingLogoImage = "";
    adminSettings.logoImage = "";
    renderLogoPreview();
    persistAdmin();
  }
  if (editId) {
    const product = adminProducts.find((item) => item.id === editId);
    if (product) fillProductForm(product);
    document.querySelector("#products").scrollIntoView({ behavior: "smooth" });
  }
  if (deleteId) {
    adminProducts = adminProducts.filter((item) => item.id !== deleteId);
    persistAdmin();
    renderProductList();
  }
  if (event.target.closest("[data-export]")) {
    const blob = new Blob([JSON.stringify({ settings: adminSettings, products: adminProducts }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "clothing-culture-kart-backup.json";
    link.click();
    URL.revokeObjectURL(url);
  }
  if (event.target.closest("[data-reset-store]")) {
    localStorage.removeItem("cck-products");
    localStorage.removeItem("cck-settings");
    window.location.reload();
  }
});

document.querySelector("[data-import]").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const imported = JSON.parse(await file.text());
  adminSettings = { ...defaultSettings, ...(imported.settings || {}) };
  adminProducts = imported.products || defaultProducts;
  persistAdmin();
  window.location.reload();
});

fillBrandForm();
fillProductForm(adminProducts[0]);
renderProductList();
