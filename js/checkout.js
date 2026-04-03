// ============================================================
//  ShopWorld — Checkout Logic
// ============================================================
const Checkout = (() => {
  let _payMethod = 'upi';

  function init() {
    const cart = Cart.load();
    if (!cart.length) {
      document.getElementById('coLeft').innerHTML =
        '<div class="co-section" style="text-align:center;padding:60px 20px;color:#94a3b8"><i class="fas fa-shopping-bag" style="font-size:60px;display:block;margin-bottom:16px;opacity:.3"></i><h3 style="color:#64748b">Your cart is empty</h3><a href="index.html" style="display:inline-block;margin-top:16px;padding:12px 28px;background:#ff6b35;color:#fff;border-radius:8px;font-weight:700">Shop Now</a></div>';
      document.getElementById('coPage').style.gridTemplateColumns = '1fr';
      document.querySelector('.co-summary').style.display = 'none';
      return;
    }
    _renderSummary(cart);
    _updateQR(Cart.total(cart));
  }

  function _renderSummary(cart) {
    const items = document.getElementById('summaryItems');
    items.innerHTML = cart.map(item => `
      <div class="sum-item">
        <img class="sum-item-img" src="${item.img}" alt="${item.title}"
          onerror="this.src='https://placehold.co/56x56/f8fafc/94a3b8?text=IMG'"/>
        <div class="sum-item-info">
          <div class="sum-item-name">${item.title}</div>
          <div class="sum-item-meta">Qty: ${item.qty} × ₹${item.price.toLocaleString('en-IN')}</div>
        </div>
        <span class="sum-item-price">₹${(item.price*item.qty).toLocaleString('en-IN')}</span>
      </div>`).join('');

    const total   = Cart.total(cart);
    const savings = Cart.savings(cart);
    document.getElementById('sumSubtotal').textContent = '₹' + total.toLocaleString('en-IN');
    document.getElementById('sumTotal').textContent    = '₹' + total.toLocaleString('en-IN');
    document.getElementById('sumSave').innerHTML       = savings > 0
      ? `<span>You Save</span><span>₹${savings.toLocaleString('en-IN')} 🎉</span>` : '';
  }

  function _updateQR(amount) {
    const upiId   = CONFIG.upi.id;
    const upiName = encodeURIComponent(CONFIG.upi.name);
    const upiStr  = `upi://pay?pa=${upiId}&pn=${upiName}&am=${amount}&cu=INR&tn=ShopWorld+Order`;
    const qrURL   = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiStr)}&bgcolor=ffffff&color=000000&margin=10`;
    const img = document.getElementById('upiQR');
    if (img) img.src = qrURL;
  }

  function selectPayment(method) {
    _payMethod = method;
    document.querySelectorAll('.pay-method').forEach(el => el.classList.remove('selected'));
    document.getElementById('pm-' + method).classList.add('selected');

    const upiPanel = document.getElementById('upiPanel');
    if (upiPanel) upiPanel.className = 'upi-panel' + (method === 'upi' ? ' show' : '');
  }

  function placeOrder() {
    const fname   = document.getElementById('fname').value.trim();
    const mobile  = document.getElementById('mobile').value.trim();
    const address = document.getElementById('address').value.trim();
    const city    = document.getElementById('city').value.trim();
    const state   = document.getElementById('state').value;
    const pin     = document.getElementById('pin').value.trim();

    if (!fname || !mobile || !address || !city || !state || !pin) {
      _toast('Please fill all required fields', 'error');
      return;
    }
    if (!/^\d{10}$/.test(mobile)) {
      _toast('Enter a valid 10-digit mobile number', 'error');
      return;
    }
    if (!/^\d{6}$/.test(pin)) {
      _toast('Enter a valid 6-digit PIN code', 'error');
      return;
    }

    const cart  = Cart.load();
    const total = Cart.total(cart);
    const orderId = _generateOrderId();

    // Save order to localStorage (Firebase placeholder)
    const order = {
      id:        orderId,
      items:     cart,
      total,
      customer:  { fname, mobile, address, city, state, pin },
      payment:   _payMethod,
      status:    'confirmed',
      placedAt:  Date.now(),
      statusHistory: [
        { status:'Order Placed',  time: Date.now() },
        { status:'Confirmed',     time: Date.now() + 60000 },
        { status:'Processing',    time: Date.now() + 3600000 },
        { status:'Shipped',       time: Date.now() + 86400000 },
        { status:'Out for Delivery', time: Date.now() + 172800000 },
        { status:'Delivered',     time: Date.now() + 259200000 },
      ]
    };

    // TODO: Replace with Firebase Realtime DB write:
    // firebase.database().ref('orders/' + orderId).set(order);
    const orders = JSON.parse(localStorage.getItem('sw_orders') || '[]');
    orders.unshift(order);
    localStorage.setItem('sw_orders', JSON.stringify(orders));

    Cart.clear();

    // Show success
    document.getElementById('successOrderId').textContent = 'ORDER ID: ' + orderId;
    document.getElementById('successScreen').classList.add('show');
  }

  function _generateOrderId() {
    const ts   = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).substring(2,6).toUpperCase();
    return CONFIG.orderPrefix + '-' + ts + rand;
  }

  function _toast(msg, type) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.className = 'toast' + (type ? ' ' + type : '');
    el.innerHTML = `<i class="fas fa-${type==='error'?'times-circle':'info-circle'}"></i> ${msg}`;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), 3000);
  }

  document.addEventListener('DOMContentLoaded', init);
  return { selectPayment, placeOrder };
})();
