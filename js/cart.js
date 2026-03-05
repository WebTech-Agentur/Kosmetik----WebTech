/**
 * Aurelia Studio - Shopping Cart Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // Cart State
    let cart = JSON.parse(localStorage.getItem('aurelia_cart')) || [];

    // UI Elements
    const cartBadge = document.querySelector('.cart-badge');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartClose = document.querySelector('.cart-close');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalElement = document.querySelector('.cart-subtotal-amount');
    const cartIcon = document.querySelector('.cart-icon-wrapper');

    // Initialize UI
    updateCartUI();

    // Event Listeners
    if (cartIcon) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            openCart();
        });
    }

    if (cartClose) {
        cartClose.addEventListener('click', closeCart);
    }

    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCart);
    }

    // "Add to Cart" Buttons
    document.querySelectorAll('.btn-add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const product = {
                id: button.dataset.id,
                name: button.dataset.name,
                price: parseFloat(button.dataset.price),
                image: button.dataset.image,
                quantity: 1
            };
            addToCart(product);
        });
    });

    // "Buy Now" Buttons
    document.querySelectorAll('.btn-buy-now').forEach(button => {
        button.addEventListener('click', () => {
            const product = {
                id: button.dataset.id,
                name: button.dataset.name,
                price: parseFloat(button.dataset.price),
                image: button.dataset.image,
                quantity: 1
            };
            addToCart(product, false); // Add but don't open drawer
            window.location.href = 'checkout.html';
        });
    });

    // Functions
    function addToCart(product, shouldOpenCart = true) {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push(product);
        }
        
        saveCart();
        updateCartUI();
        
        if (shouldOpenCart) {
            openCart();
        }
    }

    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        saveCart();
        updateCartUI();
    }

    function updateQuantity(id, change) {
        const item = cart.find(item => item.id === id);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                removeFromCart(id);
            } else {
                saveCart();
                updateCartUI();
            }
        }
    }

    function saveCart() {
        localStorage.setItem('aurelia_cart', JSON.stringify(cart));
    }

    function openCart() {
        if (cartDrawer) cartDrawer.classList.add('active');
        if (cartOverlay) cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    function closeCart() {
        if (cartDrawer) cartDrawer.classList.remove('active');
        if (cartOverlay) cartOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }

    function updateCartUI() {
        // Update Badge
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartBadge) {
            cartBadge.textContent = totalItems;
            cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
        }

        // Update Drawer Content
        if (cartItemsContainer) {
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Ihr Warenkorb ist leer.</p>';
            } else {
                cartItemsContainer.innerHTML = cart.map(item => `
                    <div class="cart-item">
                        <div class="cart-item-img">
                            <img src="${item.image}" alt="${item.name}">
                        </div>
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <p class="cart-item-price">€${item.price.toFixed(2)}</p>
                            <div class="cart-item-qty">
                                <button class="qty-btn minus" data-id="${item.id}">-</button>
                                <span>${item.quantity}</span>
                                <button class="qty-btn plus" data-id="${item.id}">+</button>
                            </div>
                        </div>
                        <button class="cart-item-remove" data-id="${item.id}">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                            </svg>
                        </button>
                    </div>
                `).join('');

                // Add event listeners for dynamic buttons
                cartItemsContainer.querySelectorAll('.plus').forEach(btn => {
                    btn.addEventListener('click', () => updateQuantity(btn.dataset.id, 1));
                });
                cartItemsContainer.querySelectorAll('.minus').forEach(btn => {
                    btn.addEventListener('click', () => updateQuantity(btn.dataset.id, -1));
                });
                cartItemsContainer.querySelectorAll('.cart-item-remove').forEach(btn => {
                    btn.addEventListener('click', () => removeFromCart(btn.dataset.id));
                });
            }
        }

        // Update Subtotal
        if (cartTotalElement) {
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotalElement.textContent = `€${subtotal.toFixed(2)}`;
        }
    }
});
