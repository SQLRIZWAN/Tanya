// ============================================================
//  ShopWorld — Main App Logic
// ============================================================
const App = (() => {
  let _all = [];
  let _store = 'all';
  let _cat   = 'all';
  let _query = '';
  let _sort  = 'relevance';
  let _shown = 20;

  // ── Boot ──────────────────────────────────────────────────
  async function init() {
    _all = await fetchAllProducts();
    document.getElementById('skeletonGrid').style.display = 'none';
    document.getElementById('productsGrid').style.display = 'grid';
    render();

    // keyboard search
    document.getElementById('searchInput').addEventListener('keydown', e => {
      if (e.key === 'Enter') search();
    });
  }

  // ── Store Tab ─────────────────────────────────────────────
  function switchStore(store, btn) {
    _store = store;
    _shown = 20;

    // tabs
    document.querySelectorAll('.s-tab').forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');
    else {
      const t = document.querySelector(`[data-store="${store}"]`);
      if (t) t.classList.add('active');
    }

    // store hero banner
    const sh = document.getElementById('storeHero');
    if (store === 'all') {
      sh.classList.remove('visible');
    } else {
      const s = STORES[store];
      sh.style.background = `linear-gradient(135deg, ${s.dark} 0%, ${s.color} 100%)`;
      sh.innerHTML = `<div class="store-hero-inner">
        <h2>${s.name}</h2>
        <p>Browse ${s.name} products — add to cart and checkout with UPI</p>
      </div>`;
      sh.classList.add('visible');
    }
    render();
  }

  // ── Category Filter ───────────────────────────────────────
  function filterCat(cat, btn) {
    _cat = cat;
    _shown = 20;
    document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
    if (btn) btn.classList.add('active');
    render();
  }

  // ── Search ────────────────────────────────────────────────
  function search() {
    _query = document.getElementById('searchInput').value.trim().toLowerCase();
    const storeVal = document.getElementById('searchStore').value;
    if (storeVal !== 'all') switchStore(storeVal);
    _shown = 20;
    render();
  }

  // ── Sort ─────────────────────────────────────────────────
  function sort() {
    _sort = document.getElementById('sortSelect').value;
    render();
  }

  // ── Load More ─────────────────────────────────────────────
  function loadMore() {
    _shown += 20;
    render();
    toast('More products loaded!', 'success');
  }

  // ── Filtered list ─────────────────────────────────────────
  function _filtered() {
    let list = [..._all];
    if (_store !== 'all') list = list.filter(p => p.store === _store);
    if (_cat   !== 'all') list = list.filter(p => p.category === _cat);
    if (_query)           list = list.filter(p =>
      p.title.toLowerCase().includes(_query) ||
      (p.brand || '').toLowerCase().includes(_query) ||
      p.store.toLowerCase().includes(_query)
    );
    switch (_sort) {
      case 'price-asc':  list.sort((a,b) => a.price - b.price); break;
      case 'price-desc': list.sort((a,b) => b.price - a.price); break;
      case 'rating':     list.sort((a,b) => b.rating - a.rating); break;
      case 'discount':   list.sort((a,b) => (b.original-b.price)/b.original - (a.original-a.price)/a.original); break;
      case 'newest':     list.sort((a,b) => String(b.id).localeCompare(String(a.id))); break;
    }
    return list;
  }

  // ── Render ────────────────────────────────────────────────
  function render() {
    const filtered = _filtered();
    const visible  = filtered.slice(0, _shown);
    const grid     = document.getElementById('productsGrid');
    const lma      = document.getElementById('loadMoreArea');

    document.getElementById('resultCount').textContent =
      `Showing ${visible.length} of ${filtered.length} product${filtered.length !== 1 ? 's' : ''}`;

    lma.style.display = filtered.length > _shown ? 'block' : 'none';

    if (!filtered.length) {
      grid.innerHTML = `<div class="no-results">
        <i class="fas fa-search"></i>
        <h3>No products found</h3>
        <p>Try another keyword or store</p>
      </div>`;
      return;
    }

    grid.innerHTML = visible.map(_cardHTML).join('');
  }

  // ── Card HTML ─────────────────────────────────────────────
  function _cardHTML(p) {
    const disc  = Math.round((p.original - p.price) / p.original * 100);
    const store = STORES[p.store];
    const stars = _stars(p.rating);
    return `<div class="p-card" onclick="App.openModal('${p.id}')">
      <span class="p-card-store" style="background:${store.color}">${store.name}</span>
      <span class="p-card-disc">-${disc}%</span>
      <button class="p-card-wish" onclick="event.stopPropagation();App.wishToggle(this,'${p.id}')">
        <i class="far fa-heart"></i>
      </button>
      <div class="p-img-wrap">
        <img src="${p.img}" alt="${p.title}" loading="lazy"
          onerror="this.src='https://placehold.co/300x300/f8fafc/94a3b8?text=${encodeURIComponent(store.name)}'"/>
      </div>
      <div class="p-body">
        ${p.brand ? `<div class="p-brand">${p.brand}</div>` : ''}
        <div class="p-title">${p.title}</div>
        <div class="p-rating">
          <span class="stars">${stars}</span>
          <strong style="font-size:12px">${p.rating}</strong>
          <span class="rev-count">(${p.reviews.toLocaleString('en-IN')})</span>
        </div>
        <div class="p-price-row">
          <span class="p-price">₹${p.price.toLocaleString('en-IN')}</span>
          <span class="p-orig">₹${p.original.toLocaleString('en-IN')}</span>
          <span class="p-save">Save ₹${(p.original-p.price).toLocaleString('en-IN')}</span>
        </div>
        <div class="p-delivery"><i class="fas fa-truck"></i>${p.delivery}</div>
        <div class="p-actions">
          <button class="btn-cart" onclick="event.stopPropagation();App.addToCart('${p.id}')">
            <i class="fas fa-cart-plus"></i> Add
          </button>
          <button class="btn-buy" onclick="event.stopPropagation();App.buyNow('${p.id}')">
            Buy Now
          </button>
        </div>
      </div>
    </div>`;
  }

  function _stars(r) {
    return [1,2,3,4,5].map(i =>
      r >= i ? '<i class="fas fa-star"></i>'
      : r >= i-.5 ? '<i class="fas fa-star-half-alt"></i>'
      : '<i class="far fa-star"></i>'
    ).join('');
  }

  // ── Modal ─────────────────────────────────────────────────
  function openModal(id) {
    const p = _all.find(x => x.id == id);
    if (!p) return;
    const store = STORES[p.store];
    const disc  = Math.round((p.original - p.price) / p.original * 100);

    document.getElementById('modalInner').innerHTML = `
      <div class="modal-grid">
        <div class="modal-img-col">
          <img src="${p.img}" alt="${p.title}"
            onerror="this.src='https://placehold.co/400x400/f8fafc/94a3b8?text=${encodeURIComponent(store.name)}'"/>
        </div>
        <div class="modal-info-col">
          <span class="modal-store-pill" style="background:${store.color}">${store.name}</span>
          ${p.brand ? `<div class="modal-brand">Brand: ${p.brand}</div>` : ''}
          <div class="modal-title">${p.title}</div>
          <div class="modal-rating-row">
            <span class="stars" style="color:#f59e0b;font-size:14px">${_stars(p.rating)}</span>
            <strong>${p.rating}</strong>
            <span style="font-size:13px;color:#94a3b8">(${p.reviews.toLocaleString('en-IN')} reviews)</span>
          </div>
          <div class="modal-price-block">
            <span class="modal-price">₹${p.price.toLocaleString('en-IN')}</span>
            <span class="modal-orig">₹${p.original.toLocaleString('en-IN')}</span>
            <span class="modal-discount-badge">${disc}% OFF</span>
          </div>
          <div class="modal-desc">${p.description || 'Premium quality product from ' + store.name + '.'}</div>
          <div class="modal-delivery"><i class="fas fa-truck"></i>${p.delivery} — FREE</div>
          <div class="modal-actions">
            <button class="modal-btn-cart" onclick="App.addToCart('${p.id}');App.closeModal()">
              <i class="fas fa-cart-plus"></i> Add to Cart
            </button>
            <button class="modal-btn-buy" onclick="App.buyNow('${p.id}')">
              Buy Now
            </button>
          </div>
        </div>
      </div>`;

    document.getElementById('modalBg').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    document.getElementById('modalBg').classList.remove('open');
    document.body.style.overflow = '';
  }

  // ── Cart actions ──────────────────────────────────────────
  function addToCart(id) {
    const p = _all.find(x => x.id == id);
    if (!p) return;
    Cart.add(p);
    toast(`Added: ${p.title.substring(0,32)}…`, 'success');
  }

  function buyNow(id) {
    const p = _all.find(x => x.id == id);
    if (!p) return;
    Cart.add(p);
    closeModal();
    window.location.href = 'checkout.html';
  }

  // ── Wishlist ──────────────────────────────────────────────
  function wishToggle(btn, id) {
    btn.classList.toggle('active');
    const p = _all.find(x => x.id == id);
    if (btn.classList.contains('active')) {
      btn.querySelector('i').className = 'fas fa-heart';
      toast(`Wishlisted: ${(p?.title||'').substring(0,30)}…`);
    } else {
      btn.querySelector('i').className = 'far fa-heart';
      toast('Removed from wishlist');
    }
  }

  function toggleWishlist() {
    toast('Wishlist coming soon!');
  }

  // ── Toast ─────────────────────────────────────────────────
  function toast(msg, type='') {
    const el = document.getElementById('toast');
    if (!el) return;
    el.className = 'toast' + (type ? ' '+type : '');
    el.innerHTML = `<i class="fas fa-${type==='success'?'check-circle':type==='error'?'times-circle':'info-circle'}"></i> ${msg}`;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), 2800);
  }

  // expose toast globally so cart.js can use it
  window._toast = toast;

  document.addEventListener('DOMContentLoaded', init);

  return { switchStore, filterCat, search, sort, loadMore, openModal, closeModal, addToCart, buyNow, wishToggle, toggleWishlist };
})();

// also expose toast globally
function toast(msg, type) { window._toast && window._toast(msg, type); }
