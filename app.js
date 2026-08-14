/**
 * ==========================================================================
 * NEXUS STORE - CORE APPLICATION JAVASCRIPT
 * ==========================================================================
 */

// 1. PRODUCT CATALOG DATA
const PRODUCTS = [
  {
    id: 1,
    name: "CyberPulse Pro Wireless Headphones",
    category: "audio",
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.9,
    reviewsCount: 128,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    badge: "Más Vendido",
    description: "Cancelación activa de ruido híbrida de 45dB, audio espacial 360°, transductores de titanio de 40mm y batería de hasta 65 horas continuas."
  },
  {
    id: 2,
    name: "UltraBook Phantom X 16'' M3",
    category: "laptops",
    price: 1299.00,
    originalPrice: 1450.00,
    rating: 5.0,
    reviewsCount: 84,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
    badge: "Destacado",
    description: "Pantalla OLED 4K a 120Hz, 32GB RAM DDR5, 1TB SSD NVMe Gen4, chasis ultraligero de aleación de magnesio y aluminio aeroespacial."
  },
  {
    id: 3,
    name: "Nexus Titan Neo 5G 256GB",
    category: "smartphones",
    price: 899.99,
    originalPrice: 999.99,
    rating: 4.8,
    reviewsCount: 215,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80",
    badge: "Nuevo",
    description: "Cámara insignia con sensor de 200MP, procesador Octa-Core de 3nm, carga ultrarrápida de 120W y pantalla AMOLED fluida de 144Hz."
  },
  {
    id: 4,
    name: "Apex Chrono Smartwatch OLED",
    category: "wearables",
    price: 249.50,
    originalPrice: 299.99,
    rating: 4.7,
    reviewsCount: 92,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    badge: "Oferta",
    description: "Monitor de salud avanzado ECG, SpO2, resistencia al agua 50m (5ATM), GPS dual integrado y acabado en cristal de zafiro."
  },
  {
    id: 5,
    name: "Vortex Mech Keyboard RGB Hot-Swap",
    category: "gaming",
    price: 139.99,
    originalPrice: 169.99,
    rating: 4.9,
    reviewsCount: 160,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
    badge: "Gamer",
    description: "Interruptores mecánicos lineales pre-lubricados, keycaps PBT doble inyección, conectividad tri-modo (Bluetooth/2.4G/Cable)."
  },
  {
    id: 6,
    name: "Quantum Precision Gaming Mouse",
    category: "gaming",
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.8,
    reviewsCount: 110,
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80",
    badge: "Popular",
    description: "Sensor óptico de 26,000 DPI, solo 58 gramos de peso ultraligero, microinterruptores ópticos con vida útil de 100M de clicks."
  },
  {
    id: 7,
    name: "Aura True Wireless Buds Pro",
    category: "audio",
    price: 119.00,
    originalPrice: 149.00,
    rating: 4.6,
    reviewsCount: 75,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
    badge: "Top Audio",
    description: "Cancelación activa inteligente, micrófonos cuádruples con IA para llamadas cristalinas y estuche con carga inalámbrica Qi."
  },
  {
    id: 8,
    name: "VisionPro 4K HDR Webcam con Mic IA",
    category: "accesorios",
    price: 109.99,
    originalPrice: 135.00,
    rating: 4.7,
    reviewsCount: 64,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80",
    badge: "Streaming",
    description: "Resolución 4K Ultra HD a 60fps, enfoque automático por detección de rostros y obturador de privacidad magnético."
  }
];

// 2. APPLICATION STATE
let state = {
  cart: JSON.parse(localStorage.getItem('nexus_cart')) || [],
  wishlist: JSON.parse(localStorage.getItem('nexus_wishlist')) || [],
  currentCategory: 'all',
  searchQuery: '',
  sortBy: 'featured',
  discountPercentage: 0,
  couponCode: ''
};

// 3. DOM ELEMENTS
const productsGrid = document.getElementById('productsGrid');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const cartItemsContainer = document.getElementById('cartItems');
const cartBadge = document.getElementById('cartBadge');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartDiscount = document.getElementById('cartDiscount');
const cartDiscountRow = document.getElementById('cartDiscountRow');
const cartShipping = document.getElementById('cartShipping');
const cartTotal = document.getElementById('cartTotal');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const categoryTabs = document.querySelectorAll('.tab-btn');
const toastContainer = document.getElementById('toastContainer');

// Modal Elements
const modalOverlay = document.getElementById('modalOverlay');
const modalBody = document.getElementById('modalBody');

// 4. INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  updateCartUI();
  setupEventListeners();
});

// 5. EVENT LISTENERS SETUP
function setupEventListeners() {
  // Category tabs
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      categoryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.currentCategory = tab.dataset.category;
      renderProducts();
    });
  });

  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.toLowerCase().trim();
      renderProducts();
    });
  }

  // Sort select
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      renderProducts();
    });
  }

  // Cart Open / Close
  document.getElementById('btnOpenCart')?.addEventListener('click', openCart);
  document.getElementById('btnCloseCart')?.addEventListener('click', closeCart);
  cartOverlay?.addEventListener('click', closeCart);

  // Apply Coupon
  document.getElementById('btnApplyCoupon')?.addEventListener('click', applyCoupon);

  // Checkout Button
  document.getElementById('btnCheckout')?.addEventListener('click', openCheckoutModal);

  // Close Modal on backdrop click
  modalOverlay?.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
}

// 6. PRODUCT RENDERING & FILTERING
function renderProducts() {
  let filtered = PRODUCTS.filter(product => {
    const matchesCategory = state.currentCategory === 'all' || product.category === state.currentCategory;
    const matchesSearch = product.name.toLowerCase().includes(state.searchQuery) ||
                          product.description.toLowerCase().includes(state.searchQuery);
    return matchesCategory && matchesSearch;
  });

  // Sorting
  if (state.sortBy === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (state.sortBy === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (state.sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  if (filtered.length === 0) {
    productsGrid.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-search"></i>
        <h3>No encontramos productos</h3>
        <p>Intenta con otra palabra clave o cambia los filtros de búsqueda.</p>
      </div>
    `;
    return;
  }

  productsGrid.innerHTML = filtered.map(product => {
    const isWishlisted = state.wishlist.includes(product.id);
    return `
      <div class="product-card" data-id="${product.id}">
        <span class="product-badge">${product.badge}</span>
        <button class="btn-wishlist ${isWishlisted ? 'active' : ''}" onclick="toggleWishlist(${product.id})" title="Guardar en favoritos">
          <i class="${isWishlisted ? 'fas' : 'far'} fa-heart"></i>
        </button>
        <div class="product-img-wrapper" onclick="openProductQuickView(${product.id})">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
        </div>
        <div class="product-info">
          <span class="product-category">${product.category}</span>
          <h3 class="product-title" onclick="openProductQuickView(${product.id})">${product.name}</h3>
          <div class="product-rating">
            <i class="fas fa-star"></i>
            <strong>${product.rating}</strong>
            <span>(${product.reviewsCount} reseñas)</span>
          </div>
          <div class="product-bottom">
            <div class="product-price">
              $${product.price.toFixed(2)}
              <span class="product-price-original">$${product.originalPrice.toFixed(2)}</span>
            </div>
            <button class="btn-add-cart" onclick="addToCart(${product.id})">
              <i class="fas fa-cart-plus"></i> Añadir
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// 7. CART MANAGEMENT
function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existingItem = state.cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    state.cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: 1
    });
  }

  saveCart();
  updateCartUI();
  showToast(`¡"${product.name}" añadido al carrito!`, 'success');
}

function updateCartItemQty(productId, delta) {
  const item = state.cart.find(i => i.id === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(productId);
    return;
  }

  saveCart();
  updateCartUI();
}

function removeFromCart(productId) {
  state.cart = state.cart.filter(item => item.id !== productId);
  saveCart();
  updateCartUI();
  showToast("Producto eliminado del carrito", "info");
}

function saveCart() {
  localStorage.setItem('nexus_cart', JSON.stringify(state.cart));
}

function updateCartUI() {
  // Total count badge
  const totalCount = state.cart.reduce((sum, item) => sum + item.qty, 0);
  if (cartBadge) {
    cartBadge.textContent = totalCount;
    cartBadge.style.display = totalCount > 0 ? 'flex' : 'none';
  }

  // Render items in drawer
  if (!cartItemsContainer) return;

  if (state.cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-state" style="padding: 2.5rem 0;">
        <i class="fas fa-shopping-bag" style="font-size: 2.5rem;"></i>
        <h4>Tu carrito está vacío</h4>
        <p style="font-size: 0.85rem; margin-top: 0.3rem;">¡Explora nuestros productos y encuentra increíbles ofertas!</p>
      </div>
    `;
    updatePricing(0);
    return;
  }

  cartItemsContainer.innerHTML = state.cart.map(item => `
    <div class="cart-item">
      <button class="btn-remove-item" onclick="removeFromCart(${item.id})" title="Eliminar">
        <i class="fas fa-times"></i>
      </button>
      <div class="cart-item-img">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="cart-item-details">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="updateCartItemQty(${item.id}, -1)">-</button>
          <span class="qty-count">${item.qty}</span>
          <button class="qty-btn" onclick="updateCartItemQty(${item.id}, 1)">+</button>
        </div>
      </div>
    </div>
  `).join('');

  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  updatePricing(subtotal);
}

function updatePricing(subtotal) {
  const discountAmount = subtotal * (state.discountPercentage / 100);
  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 15.00;
  const total = Math.max(0, subtotal - discountAmount + shipping);

  if (cartSubtotal) cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
  if (cartShipping) cartShipping.textContent = shipping === 0 ? 'GRATIS' : `$${shipping.toFixed(2)}`;
  
  if (cartDiscountRow) {
    if (state.discountPercentage > 0 && subtotal > 0) {
      cartDiscountRow.style.display = 'flex';
      cartDiscount.textContent = `-$${discountAmount.toFixed(2)} (${state.discountPercentage}%)`;
    } else {
      cartDiscountRow.style.display = 'none';
    }
  }

  if (cartTotal) cartTotal.textContent = `$${total.toFixed(2)}`;
}

function applyCoupon() {
  const couponInput = document.getElementById('couponInput');
  if (!couponInput) return;

  const code = couponInput.value.trim().toUpperCase();
  if (code === 'DESCUENTO10') {
    state.discountPercentage = 10;
    state.couponCode = code;
    showToast("¡Cupón del 10% aplicado correctamente!", "success");
  } else if (code === 'PROMO20') {
    state.discountPercentage = 20;
    state.couponCode = code;
    showToast("¡Súper cupón del 20% de descuento aplicado!", "success");
  } else {
    showToast("Código de cupón no válido. Prueba con 'DESCUENTO10' o 'PROMO20'", "error");
    return;
  }
  updateCartUI();
}

function openCart() {
  cartDrawer?.classList.add('open');
  cartOverlay?.classList.add('open');
}

function closeCart() {
  cartDrawer?.classList.remove('open');
  cartOverlay?.classList.remove('open');
}

// 8. WISHLIST
function toggleWishlist(productId) {
  const index = state.wishlist.indexOf(productId);
  if (index > -1) {
    state.wishlist.splice(index, 1);
    showToast("Eliminado de favoritos", "info");
  } else {
    state.wishlist.push(productId);
    showToast("¡Añadido a tu lista de favoritos!", "success");
  }
  localStorage.setItem('nexus_wishlist', JSON.stringify(state.wishlist));
  renderProducts();
}

// 9. MODALS (QUICK VIEW & CHECKOUT)
function openProductQuickView(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  modalBody.innerHTML = `
    <div style="display: flex; gap: 1.5rem; flex-direction: row; flex-wrap: wrap;">
      <div style="flex: 1; min-width: 250px; background: rgba(0,0,0,0.3); border-radius: var(--radius-md); padding: 1.5rem; display: flex; align-items: center; justify-content: center;">
        <img src="${product.image}" alt="${product.name}" style="max-width: 100%; max-height: 250px; object-fit: contain;">
      </div>
      <div style="flex: 1.2; min-width: 280px; display: flex; flex-direction: column;">
        <span class="product-badge" style="position: static; display: inline-block; margin-bottom: 0.5rem;">${product.badge}</span>
        <h2 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 0.5rem;">${product.name}</h2>
        <div class="product-rating" style="margin-bottom: 1rem;">
          <i class="fas fa-star"></i>
          <strong>${product.rating}</strong>
          <span>(${product.reviewsCount} valoraciones de clientes)</span>
        </div>
        <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.5rem; line-height: 1.6;">${product.description}</p>
        <div style="font-size: 1.8rem; font-weight: 800; color: #38bdf8; margin-bottom: 1.5rem;">
          $${product.price.toFixed(2)}
          <span style="font-size: 1rem; color: var(--text-sub); text-decoration: line-through; margin-left: 0.5rem;">$${product.originalPrice.toFixed(2)}</span>
        </div>
        <div style="display: flex; gap: 1rem; margin-top: auto;">
          <button class="hero-btn" style="flex: 1;" onclick="addToCart(${product.id}); closeModal();">
            <i class="fas fa-shopping-cart"></i> Añadir al Carrito
          </button>
        </div>
      </div>
    </div>
  `;

  modalOverlay.classList.add('open');
}

function openCheckoutModal() {
  if (state.cart.length === 0) {
    showToast("Tu carrito está vacío. Añade productos primero.", "error");
    return;
  }

  closeCart();

  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discount = subtotal * (state.discountPercentage / 100);
  const shipping = subtotal > 100 ? 0 : 15.00;
  const total = subtotal - discount + shipping;

  modalBody.innerHTML = `
    <h2 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 1.2rem; display: flex; align-items: center; gap: 0.5rem;">
      <i class="fas fa-shield-alt" style="color: var(--success);"></i> Finalizar Compra Segura
    </h2>
    <form id="checkoutForm" onsubmit="processCheckout(event)">
      <div class="form-row">
        <div class="form-group">
          <label>Nombre y Apellidos *</label>
          <input type="text" class="form-control" placeholder="Juan Pérez" required>
        </div>
        <div class="form-group">
          <label>Correo Electrónico *</label>
          <input type="email" class="form-control" placeholder="tu@correo.com" required>
        </div>
      </div>
      <div class="form-group">
        <label>Dirección de Envío *</label>
        <input type="text" class="form-control" placeholder="Av. Principal #123, Depto 4B" required>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Ciudad *</label>
          <input type="text" class="form-control" placeholder="Madrid / Buenos Aires / CDMX" required>
        </div>
        <div class="form-group">
          <label>Código Postal *</label>
          <input type="text" class="form-control" placeholder="28001" required>
        </div>
      </div>
      
      <label style="display: block; font-size: 0.85rem; font-weight: 600; color: var(--text-muted); margin: 1rem 0 0.5rem;">Método de Pago</label>
      <div class="payment-methods">
        <div class="payment-card active" onclick="selectPayment(this)">
          <i class="fas fa-credit-card"></i>
          <span>Tarjeta</span>
        </div>
        <div class="payment-card" onclick="selectPayment(this)">
          <i class="fab fa-paypal"></i>
          <span>PayPal</span>
        </div>
        <div class="payment-card" onclick="selectPayment(this)">
          <i class="fas fa-university"></i>
          <span>Transferencia</span>
        </div>
      </div>

      <div class="order-receipt">
        <div class="order-receipt-row">
          <span>Subtotal (${state.cart.length} productos)</span>
          <span>$${subtotal.toFixed(2)}</span>
        </div>
        ${state.discountPercentage > 0 ? `
          <div class="order-receipt-row" style="color: var(--success);">
            <span>Descuento aplicado (${state.discountPercentage}%)</span>
            <span>-$${discount.toFixed(2)}</span>
          </div>
        ` : ''}
        <div class="order-receipt-row">
          <span>Costo de envío</span>
          <span>${shipping === 0 ? 'GRATIS' : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div class="order-receipt-row total">
          <span>TOTAL A PAGAR</span>
          <span>$${total.toFixed(2)} USD</span>
        </div>
      </div>

      <button type="submit" class="btn-checkout" style="width: 100%; margin-top: 1rem;">
        <i class="fas fa-lock"></i> Confirmar y Pagar $${total.toFixed(2)}
      </button>
    </form>
  `;

  modalOverlay.classList.add('open');
}

function selectPayment(element) {
  document.querySelectorAll('.payment-card').forEach(c => c.classList.remove('active'));
  element.classList.add('active');
}

function processCheckout(event) {
  event.preventDefault();

  const orderId = 'NX-' + Math.floor(100000 + Math.random() * 900000);
  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discount = subtotal * (state.discountPercentage / 100);
  const shipping = subtotal > 100 ? 0 : 15.00;
  const total = subtotal - discount + shipping;

  // Clear Cart
  state.cart = [];
  state.discountPercentage = 0;
  saveCart();
  updateCartUI();

  // Show Success Receipt View
  modalBody.innerHTML = `
    <div class="order-success-view">
      <div class="success-icon">
        <i class="fas fa-check"></i>
      </div>
      <h2 style="font-size: 1.6rem; font-weight: 800; margin-bottom: 0.5rem;">¡Pago Confirmado con Éxito!</h2>
      <p style="color: var(--text-muted); font-size: 0.95rem;">Tu pedido ha sido procesado y está en camino.</p>

      <div class="order-receipt" style="margin-top: 1.5rem;">
        <div class="order-receipt-row">
          <span>Número de Orden:</span>
          <strong style="color: var(--text-main);">${orderId}</strong>
        </div>
        <div class="order-receipt-row">
          <span>Fecha:</span>
          <span>${new Date().toLocaleDateString()}</span>
        </div>
        <div class="order-receipt-row">
          <span>Estado:</span>
          <span style="color: var(--success); font-weight: 600;">Completado / En preparación</span>
        </div>
        <div class="order-receipt-row total">
          <span>Total Pagado:</span>
          <span>$${total.toFixed(2)} USD</span>
        </div>
      </div>

      <button class="hero-btn" style="width: 100%; margin-top: 1rem;" onclick="closeModal();">
        <i class="fas fa-shopping-bag"></i> Seguir Comprando
      </button>
    </div>
  `;

  showToast("¡Pedido realizado con éxito!", "success");
}

function closeModal() {
  modalOverlay.classList.remove('open');
}

// 10. TOAST SYSTEM
function showToast(message, type = 'info') {
  if (!toastContainer) return;

  const icons = {
    success: 'fa-check-circle',
    info: 'fa-info-circle',
    error: 'fa-exclamation-circle'
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i class="fas ${icons[type] || 'fa-info-circle'}"></i>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}
