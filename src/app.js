const runtimeEnv = window.NORTHSTAR_CONFIG || {};
const GOOGLE_CLIENT_ID = runtimeEnv.GOOGLE_CLIENT_ID || "";
const ADMIN_EMAILS = (runtimeEnv.ADMIN_EMAILS || "admin@gmail.com")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const seedProducts = [
  {
    id: "p-espresso",
    name: "AeroPress Coffee Kit",
    brand: "BrewNest",
    category: "Kitchen",
    price: 89,
    stock: 24,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
    description: "A compact coffee kit with stainless filters, travel case, and tasting cards for café-quality mornings.",
    availability: "Ships today"
  },
  {
    id: "p-speaker",
    name: "Sonic Bloom Speaker",
    brand: "LumaTech",
    category: "Electronics",
    price: 149,
    stock: 12,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80",
    description: "Water-resistant Bluetooth speaker with immersive 360° audio and 22-hour battery life.",
    availability: "Low stock"
  },
  {
    id: "p-backpack",
    name: "Urban Trail Backpack",
    brand: "Wayline",
    category: "Travel",
    price: 116,
    stock: 31,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
    description: "Weatherproof commuter backpack with laptop vault, expandable packing zone, and RFID pocket.",
    availability: "In stock"
  },
  {
    id: "p-lamp",
    name: "Halo Desk Lamp",
    brand: "GlowHaus",
    category: "Home",
    price: 72,
    stock: 18,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
    description: "Dimmable LED lamp with wireless charging base, warm-to-cool temperature control, and timer mode.",
    availability: "In stock"
  },
  {
    id: "p-sneaker",
    name: "Cloudstep Runner",
    brand: "StrideLab",
    category: "Fitness",
    price: 132,
    stock: 16,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    description: "Lightweight road running shoe with responsive foam, recycled knit upper, and reflective accents.",
    availability: "In stock"
  },
  {
    id: "p-planter",
    name: "Self-watering Planter Duo",
    brand: "Leaf & Loom",
    category: "Home",
    price: 54,
    stock: 40,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=80",
    description: "Minimal ceramic planters with visible reservoirs and aerated inserts for thriving herbs and houseplants.",
    availability: "In stock"
  }
];

const seedLocations = [
  { id: "loc-nyc", city: "New York", state: "NY", zip: "10001", service: "Same-day delivery", active: true },
  { id: "loc-bos", city: "Boston", state: "MA", zip: "02108", service: "Next-day delivery", active: true },
  { id: "loc-chi", city: "Chicago", state: "IL", zip: "60601", service: "Two-day delivery", active: true }
];

const seedOrders = [
  {
    id: "ORD-1048",
    customer: { name: "Maya Chen", email: "maya@example.com", city: "New York", state: "NY", zip: "10001" },
    items: [{ productId: "p-backpack", name: "Urban Trail Backpack", quantity: 1, price: 116 }],
    status: "processing",
    createdAt: "2026-05-11T13:42:00.000Z",
    total: 116
  },
  {
    id: "ORD-1047",
    customer: { name: "Jordan Lee", email: "jordan@example.com", city: "Boston", state: "MA", zip: "02108" },
    items: [{ productId: "p-speaker", name: "Sonic Bloom Speaker", quantity: 2, price: 149 }],
    status: "shipped",
    createdAt: "2026-05-10T16:05:00.000Z",
    total: 298
  }
];

const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
const state = {
  page: "store",
  products: load("products", seedProducts),
  locations: load("locations", seedLocations),
  orders: load("orders", seedOrders),
  cart: load("cart", {}),
  admin: load("admin", null),
  filters: { query: "", category: "All", maxPrice: 250, brand: "All" },
  checkout: { serviceable: null, checkedZip: "" },
  adminOrderSearch: ""
};

function load(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(`northstar:${key}`)) ?? fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(`northstar:${key}`, JSON.stringify(value));
}

function currency(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function app() {
  document.querySelector("#app").innerHTML = `
    <header class="site-header">
      <nav class="nav-shell" aria-label="Main navigation">
        <a class="brand" href="#store" data-route="store"><span class="brand-mark">N</span><span>Northstar Market</span></a>
        <button class="menu-toggle" aria-label="Toggle navigation" data-menu-toggle>☰</button>
        <div class="nav-links" data-nav-links>
          <a href="#store" data-route="store" class="${state.page === "store" ? "active" : ""}">Shop</a>
          <a href="#checkout" data-route="checkout" class="${state.page === "checkout" ? "active" : ""}">Checkout</a>
          <a href="#admin" data-route="admin" class="${state.page === "admin" ? "active" : ""}">Admin</a>
        </div>
        <button class="cart-button" data-route="cart" aria-label="Open cart">🛒 <span>${cartCount()}</span></button>
      </nav>
    </header>
    <main>${renderPage()}</main>
    <footer class="footer">
      <div><strong>Northstar Market</strong><p>Curated goods delivered only where service quality is guaranteed.</p></div>
      <div><strong>Service promise</strong><p>Checkout validates ZIP codes before orders are accepted.</p></div>
      <div><strong>Security</strong><p>Admin sign-in is designed for Google/Gmail authentication and an email allowlist.</p></div>
    </footer>`;
  bindGlobalEvents();
}

function renderPage() {
  if (state.page === "cart") return renderCart();
  if (state.page === "checkout") return renderCheckout();
  if (state.page === "admin") return renderAdmin();
  return renderStore();
}

function renderStore() {
  const categories = ["All", ...new Set(state.products.map((product) => product.category))];
  const brands = ["All", ...new Set(state.products.map((product) => product.brand))];
  const products = filteredProducts();
  return `
    <section class="hero">
      <div class="hero-copy">
        <span class="eyebrow">Premium commerce, local delivery</span>
        <h1>Shop curated essentials with delivery rules that protect your promise.</h1>
        <p>Discover high-quality products, build a cart in seconds, and checkout only in approved service zones.</p>
        <div class="hero-actions"><a class="primary" href="#catalog">Explore products</a><button class="secondary" data-route="admin">Admin portal</button></div>
      </div>
      <div class="hero-card">
        <span>Today&apos;s revenue</span><strong>${currency(todayRevenue())}</strong><small>${state.orders.length} active orders · ${state.locations.filter((location) => location.active).length} service zones</small>
      </div>
    </section>
    <section class="catalog-layout" id="catalog">
      <aside class="filters" aria-label="Product filters">
        <h2>Find products</h2>
        <label>Search<input type="search" value="${state.filters.query}" data-filter="query" placeholder="Coffee, speaker, home..." /></label>
        <label>Category<select data-filter="category">${categories.map((category) => `<option ${category === state.filters.category ? "selected" : ""}>${category}</option>`).join("")}</select></label>
        <label>Brand<select data-filter="brand">${brands.map((brand) => `<option ${brand === state.filters.brand ? "selected" : ""}>${brand}</option>`).join("")}</select></label>
        <label>Max price <strong>${currency(Number(state.filters.maxPrice))}</strong><input type="range" min="40" max="250" value="${state.filters.maxPrice}" data-filter="maxPrice" /></label>
      </aside>
      <section class="product-zone">
        <div class="section-heading"><span>${products.length} products</span><h2>Popular picks</h2></div>
        <div class="product-grid">${products.map(renderProductCard).join("") || `<p class="empty">No products match your filters.</p>`}</div>
      </section>
    </section>`;
}

function renderProductCard(product) {
  return `
    <article class="product-card">
      <img src="${product.image}" alt="${product.name}" loading="lazy" />
      <div class="product-card-body">
        <div class="pill-row"><span>${product.category}</span><span>★ ${product.rating}</span></div>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-meta"><strong>${currency(product.price)}</strong><small>${product.availability} · ${product.stock} left</small></div>
        <button class="primary wide" data-add-cart="${product.id}" ${product.stock < 1 ? "disabled" : ""}>Add to cart</button>
      </div>
    </article>`;
}

function renderCart() {
  const items = cartItems();
  return `
    <section class="page-shell">
      <div class="section-heading"><span>${cartCount()} items</span><h1>Your cart</h1></div>
      <div class="cart-layout">
        <div class="cart-list">${items.map(renderCartItem).join("") || `<p class="empty">Your cart is empty. Add products from the catalog to begin.</p>`}</div>
        <aside class="summary-card">
          <h2>Order summary</h2>
          <div><span>Subtotal</span><strong>${currency(cartTotal())}</strong></div>
          <div><span>Estimated shipping</span><strong>${cartTotal() ? currency(9) : currency(0)}</strong></div>
          <div class="summary-total"><span>Total</span><strong>${currency(cartTotal() ? cartTotal() + 9 : 0)}</strong></div>
          <button class="primary wide" data-route="checkout" ${items.length ? "" : "disabled"}>Continue to checkout</button>
        </aside>
      </div>
    </section>`;
}

function renderCartItem(item) {
  return `
    <article class="cart-item">
      <img src="${item.image}" alt="${item.name}" />
      <div><h3>${item.name}</h3><p>${currency(item.price)} · ${item.brand}</p></div>
      <div class="quantity-control">
        <button data-qty="${item.id}" data-delta="-1">−</button><strong>${item.quantity}</strong><button data-qty="${item.id}" data-delta="1">+</button>
      </div>
      <button class="ghost-danger" data-remove-cart="${item.id}">Remove</button>
    </article>`;
}

function renderCheckout() {
  const serviceMessage = state.checkout.serviceable === null
    ? "Enter your ZIP code to verify delivery."
    : state.checkout.serviceable
      ? "Great news — this destination is in an active service zone."
      : "Sorry, orders cannot be placed for this ZIP code yet.";
  return `
    <section class="page-shell checkout-page">
      <div class="section-heading"><span>Secure flow</span><h1>Checkout</h1></div>
      <form class="checkout-form" data-checkout-form>
        <div class="form-card">
          <h2>Customer details</h2>
          <label>Name<input required name="name" placeholder="Avery Stone" /></label>
          <label>Email<input required type="email" name="email" placeholder="avery@gmail.com" /></label>
          <div class="two-col"><label>City<input required name="city" placeholder="New York" /></label><label>State<input required name="state" maxlength="2" placeholder="NY" /></label></div>
          <label>ZIP code<input required name="zip" pattern="[0-9]{5}" placeholder="10001" value="${state.checkout.checkedZip}" data-zip-input /></label>
          <button type="button" class="secondary" data-check-location>Check serviceability</button>
          <p class="service-message ${state.checkout.serviceable === false ? "error" : ""}">${serviceMessage}</p>
        </div>
        <div class="form-card">
          <h2>Payment & review</h2>
          <p class="helper">This demo records orders without collecting payment credentials. Connect a payment gateway before production launch.</p>
          <div class="mini-summary">${cartItems().map((item) => `<span>${item.quantity}× ${item.name}</span><strong>${currency(item.quantity * item.price)}</strong>`).join("") || `<p>No cart items.</p>`}</div>
          <button class="primary wide" ${cartCount() && state.checkout.serviceable ? "" : "disabled"}>Place order</button>
        </div>
      </form>
    </section>`;
}

function renderAdmin() {
  if (!state.admin) return renderAdminLogin();
  return `
    <section class="admin-shell">
      <div class="admin-topbar"><div><span class="eyebrow">Admin portal</span><h1>Operations dashboard</h1><p>Signed in as ${state.admin.email}</p></div><button class="secondary" data-admin-logout>Sign out</button></div>
      ${renderDashboardCards()}
      <div class="admin-grid">
        ${renderOrderManagement()}
        ${renderProductManagement()}
        ${renderLocationManagement()}
      </div>
    </section>`;
}

function renderAdminLogin() {
  return `
    <section class="login-shell">
      <div class="login-card">
        <span class="eyebrow">Restricted admin area</span>
        <h1>Sign in with a Gmail or Google Workspace account</h1>
        <p>Production deployments should configure <code>GOOGLE_CLIENT_ID</code>, verify the Google ID token on a server, and allow only approved administrator emails.</p>
        <div id="google-signin"></div>
        ${GOOGLE_CLIENT_ID ? "" : `<form class="demo-login" data-demo-login><label>Demo admin email<input type="email" name="email" value="admin@gmail.com" /></label><button class="primary wide">Use demo admin</button></form>`}
      </div>
    </section>`;
}

function renderDashboardCards() {
  const totalRevenue = state.orders.reduce((sum, order) => sum + order.total, 0);
  const stock = state.products.reduce((sum, product) => sum + Number(product.stock), 0);
  return `<div class="metric-grid">
    <article><span>Revenue</span><strong>${currency(totalRevenue)}</strong><small>All recorded orders</small></article>
    <article><span>Orders</span><strong>${state.orders.length}</strong><small>${state.orders.filter((order) => order.status !== "delivered").length} in progress</small></article>
    <article><span>Products</span><strong>${state.products.length}</strong><small>${stock} units in stock</small></article>
    <article><span>Service zones</span><strong>${state.locations.filter((location) => location.active).length}</strong><small>Active delivery locations</small></article>
  </div>`;
}

function renderOrderManagement() {
  const term = state.adminOrderSearch.toLowerCase();
  const orders = state.orders.filter((order) => JSON.stringify(order).toLowerCase().includes(term));
  return `<section class="admin-panel large"><div class="panel-heading"><h2>Order management</h2><input type="search" placeholder="Search orders" value="${state.adminOrderSearch}" data-order-search /></div>
    <div class="table-wrap"><table><thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th></tr></thead><tbody>${orders.map((order) => `
      <tr><td>${order.id}<small>${new Date(order.createdAt).toLocaleDateString()}</small></td><td>${order.customer.name}<small>${order.customer.email}<br>${order.customer.city}, ${order.customer.state} ${order.customer.zip}</small></td><td>${order.items.map((item) => `${item.quantity}× ${item.name}`).join("<br>")}</td><td>${currency(order.total)}</td><td><select data-order-status="${order.id}">${statuses.map((status) => `<option ${status === order.status ? "selected" : ""}>${status}</option>`).join("")}</select></td></tr>`).join("")}</tbody></table></div></section>`;
}

function renderProductManagement() {
  return `<section class="admin-panel"><h2>Product management</h2>
    <form class="stack-form" data-product-form>
      <input name="id" type="hidden" />
      <label>Name<input required name="name" /></label><label>Brand<input required name="brand" /></label>
      <div class="two-col"><label>Category<input required name="category" /></label><label>Price<input required name="price" type="number" min="1" /></label></div>
      <div class="two-col"><label>Stock<input required name="stock" type="number" min="0" /></label><label>Image URL<input required name="image" /></label></div>
      <label>Description<textarea required name="description"></textarea></label>
      <button class="primary wide">Save product</button>
    </form>
    <div class="admin-list">${state.products.map((product) => `<article><div><strong>${product.name}</strong><small>${currency(product.price)} · ${product.stock} units</small></div><div><button class="secondary small" data-edit-product="${product.id}">Edit</button><button class="ghost-danger small" data-delete-product="${product.id}">Delete</button></div></article>`).join("")}</div>
  </section>`;
}

function renderLocationManagement() {
  return `<section class="admin-panel"><h2>Location & service management</h2>
    <form class="stack-form" data-location-form>
      <div class="two-col"><label>City<input required name="city" /></label><label>State<input required maxlength="2" name="state" /></label></div>
      <div class="two-col"><label>ZIP<input required pattern="[0-9]{5}" name="zip" /></label><label>Service<input required name="service" placeholder="Same-day delivery" /></label></div>
      <button class="primary wide">Add service location</button>
    </form>
    <div class="admin-list">${state.locations.map((location) => `<article><div><strong>${location.city}, ${location.state} ${location.zip}</strong><small>${location.service}</small></div><label class="switch"><input type="checkbox" data-toggle-location="${location.id}" ${location.active ? "checked" : ""}/><span>${location.active ? "Active" : "Paused"}</span></label><button class="ghost-danger small" data-delete-location="${location.id}">Delete</button></article>`).join("")}</div>
  </section>`;
}

function filteredProducts() {
  return state.products.filter((product) => {
    const matchesQuery = `${product.name} ${product.description} ${product.brand}`.toLowerCase().includes(state.filters.query.toLowerCase());
    const matchesCategory = state.filters.category === "All" || product.category === state.filters.category;
    const matchesBrand = state.filters.brand === "All" || product.brand === state.filters.brand;
    return matchesQuery && matchesCategory && matchesBrand && product.price <= Number(state.filters.maxPrice);
  });
}

function cartItems() {
  return Object.entries(state.cart).map(([id, quantity]) => ({ ...state.products.find((product) => product.id === id), quantity })).filter((item) => item.id);
}
function cartCount() { return Object.values(state.cart).reduce((sum, quantity) => sum + quantity, 0); }
function cartTotal() { return cartItems().reduce((sum, item) => sum + item.price * item.quantity, 0); }
function todayRevenue() { return state.orders.filter((order) => new Date(order.createdAt).toDateString() === new Date().toDateString()).reduce((sum, order) => sum + order.total, 0); }

function bindGlobalEvents() {
  document.querySelectorAll("[data-route]").forEach((el) => el.addEventListener("click", (event) => { event.preventDefault(); state.page = el.dataset.route; app(); initGoogle(); }));
  document.querySelector("[data-menu-toggle]")?.addEventListener("click", () => document.querySelector("[data-nav-links]").classList.toggle("open"));
  document.querySelectorAll("[data-add-cart]").forEach((button) => button.addEventListener("click", () => addToCart(button.dataset.addCart)));
  document.querySelectorAll("[data-filter]").forEach((input) => input.addEventListener("input", () => { state.filters[input.dataset.filter] = input.value; app(); }));
  document.querySelectorAll("[data-qty]").forEach((button) => button.addEventListener("click", () => updateQty(button.dataset.qty, Number(button.dataset.delta))));
  document.querySelectorAll("[data-remove-cart]").forEach((button) => button.addEventListener("click", () => { delete state.cart[button.dataset.removeCart]; save("cart", state.cart); app(); }));
  document.querySelector("[data-check-location]")?.addEventListener("click", checkLocation);
  document.querySelector("[data-checkout-form]")?.addEventListener("submit", placeOrder);
  document.querySelector("[data-demo-login]")?.addEventListener("submit", demoLogin);
  document.querySelector("[data-admin-logout]")?.addEventListener("click", () => { state.admin = null; save("admin", null); app(); initGoogle(); });
  document.querySelector("[data-order-search]")?.addEventListener("input", (event) => { state.adminOrderSearch = event.target.value; app(); });
  document.querySelectorAll("[data-order-status]").forEach((select) => select.addEventListener("change", () => { state.orders = state.orders.map((order) => order.id === select.dataset.orderStatus ? { ...order, status: select.value } : order); save("orders", state.orders); toast("Order status updated."); app(); }));
  document.querySelector("[data-product-form]")?.addEventListener("submit", saveProduct);
  document.querySelectorAll("[data-edit-product]").forEach((button) => button.addEventListener("click", () => fillProductForm(button.dataset.editProduct)));
  document.querySelectorAll("[data-delete-product]").forEach((button) => button.addEventListener("click", () => deleteProduct(button.dataset.deleteProduct)));
  document.querySelector("[data-location-form]")?.addEventListener("submit", addLocation);
  document.querySelectorAll("[data-toggle-location]").forEach((input) => input.addEventListener("change", () => toggleLocation(input.dataset.toggleLocation)));
  document.querySelectorAll("[data-delete-location]").forEach((button) => button.addEventListener("click", () => deleteLocation(button.dataset.deleteLocation)));
}

function addToCart(id) {
  state.cart[id] = (state.cart[id] || 0) + 1;
  save("cart", state.cart);
  toast("Added to cart.");
  app();
}

function updateQty(id, delta) {
  state.cart[id] = Math.max(0, (state.cart[id] || 0) + delta);
  if (state.cart[id] === 0) delete state.cart[id];
  save("cart", state.cart);
  app();
}

function checkLocation() {
  const zip = document.querySelector("[data-zip-input]").value.trim();
  state.checkout.checkedZip = zip;
  state.checkout.serviceable = state.locations.some((location) => location.active && location.zip === zip);
  app();
}

function placeOrder(event) {
  event.preventDefault();
  const form = new FormData(event.target);
  if (!cartCount() || !state.checkout.serviceable) return;
  const items = cartItems().map((item) => ({ productId: item.id, name: item.name, quantity: item.quantity, price: item.price }));
  const order = {
    id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    customer: { name: form.get("name"), email: form.get("email"), city: form.get("city"), state: String(form.get("state")).toUpperCase(), zip: form.get("zip") },
    items,
    status: "pending",
    createdAt: new Date().toISOString(),
    total: cartTotal() + 9
  };
  state.orders = [order, ...state.orders];
  state.products = state.products.map((product) => ({ ...product, stock: Math.max(0, product.stock - (state.cart[product.id] || 0)) }));
  state.cart = {};
  state.checkout = { serviceable: null, checkedZip: "" };
  save("orders", state.orders); save("products", state.products); save("cart", state.cart);
  toast(`Order ${order.id} placed successfully.`);
  state.page = "store";
  app();
}

function demoLogin(event) {
  event.preventDefault();
  const email = new FormData(event.target).get("email").toLowerCase();
  if (!email.endsWith("@gmail.com") && !ADMIN_EMAILS.includes(email)) return toast("Use a Gmail or approved Workspace admin email.", true);
  if (!ADMIN_EMAILS.includes(email)) return toast("Email is not on the admin allowlist.", true);
  state.admin = { email, name: "Demo Administrator" };
  save("admin", state.admin);
  app();
}

function handleGoogleCredential(response) {
  const payload = parseJwt(response.credential);
  const email = payload.email?.toLowerCase();
  if (!email || (!email.endsWith("@gmail.com") && payload.hd === undefined)) return toast("Only Gmail or Google Workspace accounts are accepted.", true);
  if (!ADMIN_EMAILS.includes(email)) return toast("Google account is not on the admin allowlist.", true);
  state.admin = { email, name: payload.name || email };
  save("admin", state.admin);
  app();
}

function parseJwt(token) {
  return JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
}

function saveProduct(event) {
  event.preventDefault();
  const form = new FormData(event.target);
  const id = form.get("id") || `p-${crypto.randomUUID()}`;
  const product = {
    id,
    name: form.get("name"), brand: form.get("brand"), category: form.get("category"),
    price: Number(form.get("price")), stock: Number(form.get("stock")), image: form.get("image"),
    description: form.get("description"), rating: 4.5, availability: Number(form.get("stock")) > 0 ? "In stock" : "Out of stock"
  };
  state.products = state.products.some((item) => item.id === id) ? state.products.map((item) => item.id === id ? product : item) : [product, ...state.products];
  save("products", state.products);
  toast("Product saved.");
  app();
}

function fillProductForm(id) {
  const product = state.products.find((item) => item.id === id);
  const form = document.querySelector("[data-product-form]");
  Object.entries(product).forEach(([key, value]) => { if (form.elements[key]) form.elements[key].value = value; });
  form.scrollIntoView({ behavior: "smooth", block: "center" });
}

function deleteProduct(id) {
  state.products = state.products.filter((product) => product.id !== id);
  delete state.cart[id];
  save("products", state.products); save("cart", state.cart);
  app();
}

function addLocation(event) {
  event.preventDefault();
  const form = new FormData(event.target);
  state.locations = [{ id: `loc-${crypto.randomUUID()}`, city: form.get("city"), state: String(form.get("state")).toUpperCase(), zip: form.get("zip"), service: form.get("service"), active: true }, ...state.locations];
  save("locations", state.locations);
  toast("Service location added.");
  app();
}
function toggleLocation(id) { state.locations = state.locations.map((loc) => loc.id === id ? { ...loc, active: !loc.active } : loc); save("locations", state.locations); app(); }
function deleteLocation(id) { state.locations = state.locations.filter((loc) => loc.id !== id); save("locations", state.locations); app(); }

function initGoogle() {
  if (!GOOGLE_CLIENT_ID || state.page !== "admin" || state.admin || !window.google) return;
  window.google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: handleGoogleCredential });
  window.google.accounts.id.renderButton(document.getElementById("google-signin"), { theme: "outline", size: "large", width: 320 });
}

function toast(message, error = false) {
  const toastEl = document.createElement("div");
  toastEl.className = `toast ${error ? "error" : ""}`;
  toastEl.textContent = message;
  document.querySelector("#toast-region").append(toastEl);
  setTimeout(() => toastEl.remove(), 3200);
}

window.addEventListener("load", initGoogle);
window.addEventListener("hashchange", () => { state.page = location.hash.replace("#", "") || "store"; app(); initGoogle(); });
state.page = location.hash.replace("#", "") || "store";
app();
