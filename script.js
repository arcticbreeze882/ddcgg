// ===== DATA ===== //
const categories = [
    { id: 'fruits', name: 'Fresh Fruits', icon: 'fa-apple-whole', items: '24 Items' },
    { id: 'vegetables', name: 'Vegetables', icon: 'fa-carrot', items: '32 Items' },
    { id: 'dairy', name: 'Dairy & Eggs', icon: 'fa-cheese', items: '16 Items' },
    { id: 'bakery', name: 'Bakery', icon: 'fa-bread-slice', items: '12 Items' },
    { id: 'meats', name: 'Fresh Meats', icon: 'fa-drumstick-bite', items: '18 Items' },
];

const products = [
    {
        id: 1,
        name: 'Organic Apples',
        category: 'fruits',
        price: 4.99,
        unit: '/ kg',
        image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6faa6?auto=format&fit=crop&q=80&w=500',
        badge: 'Organic',
        rating: 4.8
    },
    {
        id: 2,
        name: 'Fresh Carrots',
        category: 'vegetables',
        price: 2.49,
        unit: '/ bunch',
        image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=500',
        badge: 'Top Seller',
        rating: 4.5
    },
    {
        id: 3,
        name: 'Whole Milk',
        category: 'dairy',
        price: 3.99,
        unit: '/ gal',
        image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=500',
        badge: 'Fresh',
        rating: 4.9
    },
    {
        id: 4,
        name: 'Artisan Bread',
        category: 'bakery',
        price: 5.49,
        unit: '/ loaf',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=500',
        badge: 'Baked Today',
        rating: 4.7
    },
    {
        id: 5,
        name: 'Bananas',
        category: 'fruits',
        price: 1.99,
        unit: '/ bunch',
        image: 'https://images.unsplash.com/photo-1571501715214-4505ee4ff581?auto=format&fit=crop&q=80&w=500',
        badge: '',
        rating: 4.6
    },
    {
        id: 6,
        name: 'Fresh Tomatoes',
        category: 'vegetables',
        price: 3.49,
        unit: '/ kg',
        image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=500',
        badge: 'Local',
        rating: 4.8
    },
    {
        id: 7,
        name: 'Free Range Eggs',
        category: 'dairy',
        price: 6.99,
        unit: '/ dz',
        image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&q=80&w=500',
        badge: 'Organic',
        rating: 4.9
    },
    {
        id: 8,
        name: 'Organic Spinach',
        category: 'vegetables',
        price: 2.99,
        unit: '/ bunch',
        image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=500',
        badge: '',
        rating: 4.5
    }
];

// ===== DOM ELEMENTS ===== //
const categoriesGrid = document.querySelector('.categories-grid');
const productsGrid = document.getElementById('products-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const cartIcon = document.getElementById('cart-icon');
const cartOverlay = document.getElementById('cart-overlay');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartBadge = document.getElementById('cart-badge');
const cartTotalPrice = document.getElementById('cart-total-price');
const navbar = document.getElementById('navbar');

// Cart State
let cart = [];

// ===== INITIALIZE ===== //
document.addEventListener('DOMContentLoaded', () => {
    renderCategories();
    renderProducts('all');
    setupFilters();
    setupCartToggle();
    setupScrollAnimations();
    setupStickyNav();
});

// ===== RENDER FUNCTIONS ===== //
function renderCategories() {
    categories.forEach((cat, index) => {
        const delay = index * 100;
        const catEl = document.createElement('div');
        catEl.className = 'category-card animate-on-scroll fade-up';
        catEl.style.transitionDelay = `${delay}ms`;
        catEl.innerHTML = `
            <div class="category-icon">
                <i class="fa-solid ${cat.icon}"></i>
            </div>
            <h3>${cat.name}</h3>
            <p>${cat.items}</p>
        `;
        categoriesGrid.appendChild(catEl);
    });
}

function renderProducts(filter) {
    productsGrid.innerHTML = '';
    
    const filteredProducts = filter === 'all' 
        ? products 
        : products.filter(p => p.category === filter);

    filteredProducts.forEach((product, index) => {
        const delay = (index % 4) * 100; // Stagger animation for rows
        const badgeHTML = product.badge ? `<span class="product-badge">${product.badge}</span>` : '';
        
        const prodEl = document.createElement('div');
        prodEl.className = 'product-card animate-on-scroll fade-up';
        prodEl.style.transitionDelay = `${delay}ms`;
        prodEl.innerHTML = `
            <div class="product-img-wrapper">
                ${badgeHTML}
                <img src="${product.image}" alt="${product.name}" class="product-img">
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    <i class="fa-solid fa-plus"></i>
                </button>
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-footer">
                    <div class="product-price">$${product.price}<span>${product.unit}</span></div>
                    <div class="product-rating">
                        <i class="fa-solid fa-star"></i> ${product.rating}
                    </div>
                </div>
            </div>
        `;
        productsGrid.appendChild(prodEl);
    });

    // Re-trigger scroll animations for new elements
    setTimeout(observeElements, 100);
}

// ===== FILTERING ===== //
function setupFilters() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add to clicked
            btn.classList.add('active');
            // Render
            const filter = btn.getAttribute('data-filter');
            renderProducts(filter);
        });
    });
}

// ===== CART FUNCTIONALITY ===== //
function setupCartToggle() {
    cartIcon.addEventListener('click', () => {
        cartOverlay.classList.add('active');
        cartSidebar.classList.add('active');
    });

    closeCartBtn.addEventListener('click', () => {
        cartOverlay.classList.remove('active');
        cartSidebar.classList.remove('active');
    });

    cartOverlay.addEventListener('click', () => {
        cartOverlay.classList.remove('active');
        cartSidebar.classList.remove('active');
    });
}

window.addToCart = function(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Check if already in cart
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    
    // Smooth visual feedback
    cartIcon.style.transform = 'scale(1.2)';
    setTimeout(() => cartIcon.style.transform = 'scale(1)', 200);
}

window.removeFromCart = function(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

function updateCartUI() {
    // Update badge Count
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartBadge.textContent = totalItems;

    // Render Items
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Your cart is empty.</div>';
        cartTotalPrice.textContent = '$0.00';
        return;
    }

    cartItemsContainer.innerHTML = '';
    let totalValue = 0;

    cart.forEach(item => {
        totalValue += item.price * item.quantity;
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
                <h4 class="cart-item-title">${item.name}</h4>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span class="cart-item-price">$${item.price} x ${item.quantity}</span>
                    <i class="fa-solid fa-trash cart-item-remove" onclick="removeFromCart(${item.id})"></i>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(itemEl);
    });

    cartTotalPrice.textContent = '$' + totalValue.toFixed(2);
}

// ===== SCROLL ANIMATIONS & NAV ===== //
function setupStickyNav() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

function setupScrollAnimations() {
    observeElements();
}

function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once animated
                // observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1, // Trigger when 10% visible
        rootMargin: "0px 0px -50px 0px" // Slight offset
    });

    const animatedElements = document.querySelectorAll('.animate-on-scroll:not(.visible)');
    animatedElements.forEach(el => observer.observe(el));
}
