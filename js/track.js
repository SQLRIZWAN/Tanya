// ============================================================
//  ShopWorld — Order Tracking
// ============================================================
const Track = (() => {
  const STEPS = [
    { key:'placed',    label:'Order Placed',       icon:'fa-check',          color:'#94a3b8' },
    { key:'confirmed', label:'Confirmed',           icon:'fa-clipboard-check',color:'#3b82f6' },
    { key:'processing',label:'Processing',          icon:'fa-cogs',           color:'#f59e0b' },
    { key:'shipped',   label:'Shipped',             icon:'fa-box',            color:'#8b5cf6' },
    { key:'out',       label:'Out for Delivery',    icon:'fa-motorcycle',     color:'#f97316' },
    { key:'delivered', label:'Delivered',           icon:'fa-home',           color:'#22c55e' },
  ];

  function _loadOrders() {
    try { return JSON.parse(localStorage.getItem('sw_orders') || '[]'); }
    catch { return []; }
  }

  function _currentStepIndex(order) {
    const now   = Date.now();
    const hist  = order.statusHistory || [];
    let idx = 0;
    for (let i = 0; i < hist.length; i++) {
      if (now >= hist[i].time) idx = i;
    }
    return Math.min(idx, STEPS.length - 1);
  }

  function _fmt(ts) {
    return new Date(ts).toLocaleString('en-IN', {
      day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit'
    });
  }

  function _renderOrder(order) {
    const stepIdx = _currentStepIndex(order);
    const hist    = order.statusHistory || [];

    const timelineHTML = STEPS.map((step, i) => {
      const done   = i < stepIdx;
      const active = i === stepIdx;
      const pend   = i > stepIdx;
      const dotCls = done ? 'tl-dot done' : active ? 'tl-dot active' : 'tl-dot';
      const stepCls= pend ? 'tl-step pending' : 'tl-step';
      const timeStr = hist[i] && (done || active) ? _fmt(hist[i].time) : 'Scheduled';
      return `<div class="${stepCls}">
        <div class="${dotCls}"><i class="fas ${done?'fa-check':step.icon}" style="font-size:9px"></i></div>
        <div class="tl-label">${step.label}</div>
        <div class="tl-time">${timeStr}</div>
      </div>`;
    }).join('');

    const itemsHTML = (order.items || []).map(item => `
      <div class="order-item-row">
        <img class="oi-img" src="${item.img || ''}" alt="${item.title}"
          onerror="this.src='https://placehold.co/48x48/f8fafc/94a3b8?text=IMG'"/>
        <div style="flex:1;min-width:0">
          <div class="oi-name">${item.title}</div>
          <div class="oi-meta">Qty: ${item.qty}</div>
        </div>
        <span class="oi-price">₹${(item.price*item.qty).toLocaleString('en-IN')}</span>
      </div>`).join('');

    const currentStatus = STEPS[stepIdx].label;
    const statusClass = ['status-placed','status-confirmed','status-processing','status-shipped','status-shipped','status-delivered'][stepIdx];

    return `<div class="order-card">
      <div class="order-card-head">
        <div>
          <div class="order-id">${order.id}</div>
          <div class="order-date">Placed on ${_fmt(order.placedAt)}</div>
          <div style="margin-top:8px">
            <span class="status-badge ${statusClass}">${currentStatus}</span>
          </div>
        </div>
        <div class="order-total">₹${order.total.toLocaleString('en-IN')}</div>
      </div>

      <div class="order-items-title">Items (${(order.items||[]).length})</div>
      ${itemsHTML}

      <div style="margin:16px 0;height:1px;background:#f1f5f9"></div>

      <div class="order-items-title" style="margin-bottom:16px">Delivery Status</div>
      <div class="timeline">${timelineHTML}</div>

      ${order.customer ? `
      <div style="margin-top:16px;padding-top:16px;border-top:1px solid #f1f5f9;font-size:13px;color:#64748b">
        <strong style="color:#0f172a">Delivering to:</strong>
        ${order.customer.fname}, ${order.customer.address}, ${order.customer.city} - ${order.customer.pin}
      </div>` : ''}
    </div>`;
  }

  function find() {
    const id     = document.getElementById('trackInput').value.trim().toUpperCase();
    const result = document.getElementById('trackResult');
    if (!id) { _toast('Enter an Order ID', 'error'); return; }

    const orders = _loadOrders();
    const order  = orders.find(o => o.id === id);

    if (!order) {
      result.innerHTML = `<div class="empty-track">
        <i class="fas fa-search"></i>
        <h3 style="color:#64748b">Order not found</h3>
        <p>Check the Order ID and try again</p>
      </div>`;
      return;
    }
    result.innerHTML = _renderOrder(order);
  }

  function _renderRecent() {
    const orders = _loadOrders();
    const div    = document.getElementById('recentOrders');
    if (!orders.length || !div) return;

    div.innerHTML = `<div class="recent-label"><i class="fas fa-history" style="color:#ff6b35"></i> Recent Orders</div>` +
      orders.slice(0, 5).map(o => {
        const stepIdx = _currentStepIndex(o);
        const status  = STEPS[stepIdx].label;
        return `<div class="recent-item" onclick="document.getElementById('trackInput').value='${o.id}';Track.find()">
          <div>
            <div style="font-weight:700;font-size:14px">${o.id}</div>
            <div style="font-size:12px;color:#94a3b8;margin-top:3px">${_fmt(o.placedAt)} · ${(o.items||[]).length} item(s)</div>
          </div>
          <div style="text-align:right">
            <div style="font-weight:800;color:#ff6b35">₹${o.total.toLocaleString('en-IN')}</div>
            <div style="font-size:12px;color:#22c55e;margin-top:3px">${status}</div>
          </div>
        </div>`;
      }).join('');
  }

  function _toast(msg, type) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.className = 'toast' + (type ? ' '+type : '');
    el.innerHTML = `<i class="fas fa-info-circle"></i> ${msg}`;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), 3000);
  }

  document.addEventListener('DOMContentLoaded', () => {
    _renderRecent();
    // auto-track if ?id= in URL
    const urlId = new URLSearchParams(location.search).get('id');
    if (urlId) {
      document.getElementById('trackInput').value = urlId;
      find();
    }
  });

  return { find };
})();
