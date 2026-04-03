// ===== STATE =====
let currentStore = 'all';
let currentCategory = 'all';
let currentSearch = '';
let cart = [];
let visibleCount = 20;
let currentSort = 'relevance';

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  updateCartBadge();
});

// ===== STORE SWITCH =====
function switchTab(store, btn) {
  currentStore = store;
  visibleCount = 20;

  // update tab active state
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  else {
    const target = document.querySelector(`[data-store="${store}"]`);
    if (target) { target.classList.add('active'); document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active')); target.classList.add('active'); }
  }

  const heroBanner = document.getElementById('heroBanner');
  const storeBanner = document.getElementById('storeBanner');

  if (store === 'all') {
    heroBanner.style.display = '';
    storeBanner.style.display = 'none';
  } else {
    const s = STORES[store];
    heroBanner.style.display = 'none';
    storeBanner.style.display = '';
    storeBanner.className = `store-banner banner-${store}`;
    storeBanner.innerHTML = `
      <h2>${s.name}</h2>
      <p>${s.desc}</p>
      <a href="${s.url}" target="_blank" rel="noopener noreferrer" style="display:inline-block;margin-top:12px;padding:8px 24px;background:rgba(255,255,255,0.2);color:#fff;border-radius:20px;font-size:13px;font-weight:600;border:1px solid rgba(255,255,255,0.4);">
        Visit Official ${s.name} Site &rarr;
      </a>
    `;
  }
  renderProducts();
}

// ===== CATEGORY FILTER =====
function filterCategory(cat, btn) {
  currentCategory = cat;
  visibleCount = 20;
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderProducts();
}

// ===== SEARCH =====
function searchProducts() {
  currentSearch = document.getElementById('searchInput').value.trim().toLowerCase();
  const storeVal = document.getElementById('searchStore').value;
  if (storeVal !== 'all') {
    currentStore = storeVal;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    const target = document.querySelector(`[data-store="${storeVal}"]`);
    if (target) target.classList.add('active');
  }
  visibleCount = 20;
  renderProducts();
}

document.getElementById('searchInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') searchProducts();
});

// ===== SORT =====
function sortProducts() {
  currentSort = document.getElementById('sortSelect').value;
  renderProducts();
}

// ===== FILTER LOGIC =====
function getFilteredProducts() {
  let products = [...ALL_PRODUCTS];
  if (currentStore !== 'all') products = products.filter(p => p.store === currentStore);
  if (currentCategory !== 'all') products = products.filter(p => p.category === currentCategory);
  if (currentSearch) products = products.filter(p =>
    p.title.toLowerCase().includes(currentSearch) ||
    p.store.toLowerCase().includes(currentSearch)
  );

  switch (currentSort) {
    case 'price-low':  products.sort((a,b) => a.price - b.price); break;
    case 'price-high': products.sort((a,b) => b.price - a.price); break;
    case 'rating':     products.sort((a,b) => b.rating - a.rating); break;
    case 'discount':   products.sort((a,b) => (b.original-b.price)/b.original - (a.original-a.price)/a.original); break;
    case 'newest':     products.sort((a,b) => b.id - a.id); break;
  }
  return products;
}

// ===== RENDER PRODUCTS =====
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  const filtered = getFilteredProducts();
  const visible = filtered.slice(0, visibleCount);

  document.getElementById('resultsCount').textContent =
    `Showing ${visible.length} of ${filtered.length} product${filtered.length !== 1 ? 's' : ''}`;

  document.getElementById('loadMoreBtn').style.display =
    filtered.length > visibleCount ? 'inline-block' : 'none';

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        <i class="fas fa-search"></i>
        <h3>No products found</h3>
        <p>Try a different search term or store</p>
      </div>`;
    return;
  }

  grid.innerHTML = visible.map(p => productCard(p)).join('');
}

// ===== PRODUCT CARD HTML =====
function productCard(p) {
  const disc = Math.round((p.original - p.price) / p.original * 100);
  const stars = renderStars(p.rating);
  const store = STORES[p.store];
  return `
    <div class="product-card" onclick="openModal(${p.id})">
      <span class="card-store-badge badge-${p.store}">${store.name}</span>
      <span class="card-discount-badge">-${disc}%</span>
      <div class="card-wishlist" onclick="event.stopPropagation(); wishlistToggle(this)">
        <i class="fas fa-heart"></i>
      </div>
      <div class="card-img-wrap">
        <img src="${p.img}" alt="${p.title}" loading="lazy"
          onerror="this.src='https://placehold.co/300x300/f9f9f9/999?text=${encodeURIComponent(store.name)}'"/>
      </div>
      <div class="card-body">
        <div class="card-title">${p.title}</div>
        <div class="card-rating">
          <span class="stars">${stars}</span>
          <span style="font-weight:600;font-size:12px">${p.rating}</span>
          <span class="rating-count">(${p.reviews.toLocaleString()})</span>
        </div>
        <div class="card-price">
          <span class="price-current">₹${p.price.toLocaleString()}</span>
          <span class="price-original">₹${p.original.toLocaleString()}</span>
          <span class="price-save">Save ₹${(p.original - p.price).toLocaleString()}</span>
        </div>
        <div class="card-actions">
          <button class="btn-add-cart" onclick="event.stopPropagation(); addToCart(${p.id})">
            <i class="fas fa-cart-plus"></i> Add
          </button>
          <button class="btn-buy-now" onclick="event.stopPropagation(); buyNow(${p.id})">
            Buy Now
          </button>
        </div>
        <div class="card-delivery"><i class="fas fa-truck"></i> ${p.delivery}</div>
      </div>
    </div>`;
}

function renderStars(rating) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) html += '<i class="fas fa-star"></i>';
    else if (rating >= i - 0.5) html += '<i class="fas fa-star-half-alt"></i>';
    else html += '<i class="far fa-star"></i>';
  }
  return html;
}

// ===== LOAD MORE =====
function loadMore() {
  visibleCount += 20;
  renderProducts();
  showToast('More products loaded!');
}

// ===== WISHLIST =====
function wishlistToggle(el) {
  el.classList.toggle('wishlisted');
  const icon = el.querySelector('i');
  if (el.classList.contains('wishlisted')) {
    el.style.background = '#ff3f6c';
    icon.style.color = '#fff';
    showToast('Added to Wishlist ❤️');
  } else {
    el.style.background = '#fff';
    icon.style.color = '#999';
    showToast('Removed from Wishlist');
  }
}

// ===== CART =====
function addToCart(id) {
  const product = ALL_PRODUCTS.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty++;
    showToast(`${product.title.substring(0,30)}... qty updated!`);
  } else {
    cart.push({ ...product, qty: 1 });
    showToast(`Added to cart: ${product.title.substring(0,30)}...`);
  }
  updateCartBadge();
  renderCartItems();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCartBadge();
  renderCartItems();
  showToast('Item removed from cart');
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) { removeFromCart(id); return; }
  }
  updateCartBadge();
  renderCartItems();
}

function updateCartBadge() {
  const total = cart.reduce((acc, i) => acc + i.qty, 0);
  document.getElementById('cartCount').textContent = total;
}

function renderCartItems() {
  const container = document.getElementById('cartItems');
  const footer = document.getElementById('cartFooter');
  if (cart.length === 0) {
    container.innerHTML = `<div class="empty-cart"><i class="fas fa-shopping-bag"></i><p>Your cart is empty</p></div>`;
    footer.style.display = 'none';
    return;
  }
  footer.style.display = '';
  const total = cart.reduce((acc, i) => acc + i.price * i.qty, 0);
  document.getElementById('cartTotal').textContent = `₹${total.toLocaleString()}`;
  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img class="cart-item-img" src="${item.img}" alt="${item.title}"
        onerror="this.src='https://placehold.co/70x70/f9f9f9/999?text=IMG'"/>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.title.substring(0,45)}${item.title.length>45?'...':''}</div>
        <div class="cart-item-store">${STORES[item.store].name}</div>
        <div class="cart-item-price">₹${(item.price * item.qty).toLocaleString()}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
        </div>
      </div>
      <span class="cart-item-remove" onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i></span>
    </div>
  `).join('');
}

function showCart() {
  document.getElementById('cartSidebar').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  renderCartItems();
}
function hideCart() {
  document.getElementById('cartSidebar').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
}

function buyNow(id) {
  const p = ALL_PRODUCTS.find(prod => prod.id === id);
  addToCart(id);
  showCart();
  showToast(`Redirecting to ${STORES[p.store].name}...`);
  setTimeout(() => { window.open(STORES[p.store].url, '_blank'); }, 1500);
}

function checkout() {
  if (cart.length === 0) return;
  showToast('Redirecting to checkout... 🛒');
  hideCart();
}

// ===== PRODUCT MODAL =====
function openModal(id) {
  const p = ALL_PRODUCTS.find(prod => prod.id === id);
  const store = STORES[p.store];
  const disc = Math.round((p.original - p.price) / p.original * 100);
  document.getElementById('modalContent').innerHTML = `
    <div class="modal-product">
      <div class="modal-img-side">
        <img src="${p.img}" alt="${p.title}"
          onerror="this.src='https://placehold.co/400x400/f9f9f9/999?text=${encodeURIComponent(store.name)}'"/>
      </div>
      <div class="modal-info-side">
        <div class="modal-store-name" style="color:${store.color}">${store.name}</div>
        <div class="modal-title">${p.title}</div>
        <div class="modal-rating">
          <span class="stars" style="color:#f7a428">${renderStars(p.rating)}</span>
          <strong>${p.rating}</strong>
          <span style="color:#888;font-size:13px">(${p.reviews.toLocaleString()} reviews)</span>
        </div>
        <div class="modal-price-block">
          <span class="modal-current-price">₹${p.price.toLocaleString()}</span>
          <span class="modal-original-price">₹${p.original.toLocaleString()}</span>
          <div class="modal-discount">${disc}% OFF — You save ₹${(p.original - p.price).toLocaleString()}</div>
        </div>
        <div class="modal-description">
          Available on <strong>${store.name}</strong>. ${p.delivery}. Sold and fulfilled by ${store.name}.
          Easy returns within 30 days. 100% authentic product guaranteed.
        </div>
        <div class="modal-actions">
          <button class="modal-add-cart" onclick="addToCart(${p.id}); closeModal()">
            <i class="fas fa-cart-plus"></i> Add to Cart
          </button>
          <button class="modal-buy-now" onclick="buyNow(${p.id}); closeModal()">
            Buy Now on ${store.name}
          </button>
        </div>
        <div class="modal-go-store">
          <i class="fas fa-external-link-alt"></i>
          <a href="${store.url}" target="_blank" rel="noopener noreferrer">
            Browse all on ${store.name} &rarr;
          </a>
        </div>
      </div>
    </div>`;
  document.getElementById('productModal').classList.add('open');
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  document.getElementById('productModal').classList.remove('open');
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ===== TOAST =====
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}
