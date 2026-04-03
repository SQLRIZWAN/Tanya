// ============================================================
//  ShopWorld — Cart (localStorage)
// ============================================================
const Cart = (() => {
  const KEY = 'sw_cart';

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch { return []; }
  }
  function save(cart) {
    localStorage.setItem(KEY, JSON.stringify(cart));
  }

  function getAll() { return load(); }

  function add(product) {
    const cart = load();
    const idx = cart.findIndex(i => i.id === product.id);
    if (idx > -1) {
      cart[idx].qty++;
    } else {
      cart.push({ ...product, qty: 1 });
    }
    save(cart);
    _updateBadge(cart);
    return cart;
  }

  function remove(id) {
    const cart = load().filter(i => i.id !== id);
    save(cart);
    _updateBadge(cart);
    return cart;
  }

  function changeQty(id, delta) {
    const cart = load();
    const idx = cart.findIndex(i => i.id === id);
    if (idx < 0) return cart;
    cart[idx].qty += delta;
    if (cart[idx].qty <= 0) cart.splice(idx, 1);
    save(cart);
    _updateBadge(cart);
    return cart;
  }

  function clear() {
    save([]);
    _updateBadge([]);
  }

  function total(cart) {
    return cart.reduce((s, i) => s + i.price * i.qty, 0);
  }

  function totalQty(cart) {
    return cart.reduce((s, i) => s + i.qty, 0);
  }

  function savings(cart) {
    return cart.reduce((s, i) => s + (i.original - i.price) * i.qty, 0);
  }

  // ── UI ──────────────────────────────────────────────────
  function open() {
    render();
    document.getElementById('cartDrawer').classList.add('open');
    document.getElementById('drawerBg').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    document.getElementById('cartDrawer').classList.remove('open');
    document.getElementById('drawerBg').classList.remove('open');
    document.body.style.overflow = '';
  }

  function render() {
    const cart = load();
    const body = document.getElementById('cartBody');
    const foot = document.getElementById('cartFoot');

    if (!cart.length) {
      body.innerHTML = '<div class="cart-empty"><i class="fas fa-shopping-bag"></i><p>Your cart is empty</p></div>';
      foot.style.display = 'none';
      return;
    }

    foot.style.display = '';
    document.getElementById('cartTotal').textContent = '₹' + total(cart).toLocaleString('en-IN');
    const saved = savings(cart);
    document.getElementById('cartSaving').textContent = saved > 0
      ? `You save ₹${saved.toLocaleString('en-IN')} on this order 🎉`
      : '';

    body.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img class="ci-img" src="${item.img}" alt="${item.title}"
          onerror="this.src='https://placehold.co/72x72/f8fafc/94a3b8?text=IMG'"/>
        <div class="ci-info">
          <div class="ci-name">${item.title}</div>
          <div class="ci-store">${STORES[item.store]?.name || item.store}</div>
          <div class="ci-price">₹${(item.price * item.qty).toLocaleString('en-IN')}</div>
          <div class="ci-qty">
            <button class="qty-btn" onclick="Cart.changeQty('${item.id}',-1);Cart.render()">−</button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn" onclick="Cart.changeQty('${item.id}',1);Cart.render()">+</button>
          </div>
        </div>
        <button class="ci-del" onclick="Cart.remove('${item.id}');Cart.render()" title="Remove"><i class="fas fa-trash-alt"></i></button>
      </div>`).join('');
  }

  function _updateBadge(cart) {
    const el = document.getElementById('cartBadge');
    if (el) el.textContent = totalQty(cart);
  }

  // init badge on page load
  _updateBadge(load());

  return { getAll, add, remove, changeQty, clear, total, totalQty, savings, open, close, render, load };
})();
