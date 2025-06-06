// Function to generate star rating HTML
function generateRatingStars(rating) {
    if (!rating) return '<div class="no-rating">No ratings yet</div>';

    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }

    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }

    return stars;
}

// Function to create product card HTML
function createProductCard(product, type) {
    let baseCategory = type === 'spareParts' ? 'parts' : product.category.toLowerCase().replace(/\s+/g, '-');
    const categories = [baseCategory];

    const vehicleTypeText = product.vehicleType ? 
    product.vehicleType.replace(/<[^>]+>/g, '').toLowerCase() : '';

    const vehicleTypeClass = vehicleTypeText.includes('car') ? 'car' : 
    (vehicleTypeText.includes('motorcycle') || vehicleTypeText.includes('scooter') ? 'bike' : '');
    
    const categoryAttr = categories.join(',');
    const fullDescription = product.description || "";
    const shortDescription = fullDescription.length > 100 ? fullDescription.slice(0, 100) + '...' : fullDescription;
    const showToggle = fullDescription.length > 100;

    return `
        <div class="product-card" style="display:none" data-category="${categoryAttr}" data-id="${product.title.replace(/\s+/g, '-').toLowerCase()}">
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            <div class="product-img">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-title">${product.title}</h3>
                <h3 class="product-vehihead">${product.vehihead}</h3>
                ${product.vehicleType ? `<h4 class="product-vehicleType">${product.vehicleType}</h4>` : ''}
                ${product.meets ? `<h4 class="product-meets">${product.meets}</h4>` : ''}
                ${product.quality ? `<h4 class="product-quality">${product.quality}</h4>` : ''}
                ${product.description ? `
                    <p class="product-description" id="desc-${product.title.replace(/\s+/g, '-').toLowerCase()}">
                        <span class="desc-text collapsed">${shortDescription}</span>
                        ${showToggle ? `<a href="#" class="toggle-link"
                            data-full="${encodeURIComponent(fullDescription)}"
                            data-short="${encodeURIComponent(shortDescription)}"
                            data-id="${product.title.replace(/\s+/g, '-').toLowerCase()}">See more</a>` : ''}
                    </p>
                ` : ''}
            
                ${product.rating ? `
                <div class="product-rating">
                    ${generateRatingStars(product.rating)}
                    ${product.reviews ? `<span>(${product.reviews})</span>` : ''}
                </div>
                ` : ''}
                <div class="product-actions">
                    <button class="whatsapp-btn">Order -Whatsapp</button>
                    <button class="wishlist-btn"><i class="far fa-heart"></i></button>
                </div>
            </div>
        </div>
    `;
}

// Function to render products by type
function renderProducts(products, type, containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    container.innerHTML = '';
    products.forEach(product => {
        container.innerHTML += createProductCard(product, type);
    });

    attachWhatsAppListeners(products, type);
    attachToggleDescription();
    
    // Initialize filters and pagination
    initFilters();
    initPagination();
    
    filteredProducts = Array.from(document.querySelectorAll('.product-card'));
    applyPagination();
}

// WhatsApp Button Event
function attachWhatsAppListeners(products, type) {
    document.querySelectorAll('.whatsapp-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const card = this.closest('.product-card');
            const productId = card.dataset.id;
            const product = products.find(p =>
                p.title.replace(/\s+/g, '-').toLowerCase() === productId
            );

            if (product) {
                const message = `🛒 *Order Request* 🛒\n\n` +
                    `*Product:* ${product.title}\n` +
                    // `*Price:* ${product.price}\n` +
                    `*Category:* ${product.category}\n\n` +
                    `*Vehicle Type: ${product.vehicleType}*\n\n` +
                    `_Please confirm availability._`;

                window.open(`https://wa.me/918547372272?text=${encodeURIComponent(message)}`, '_blank');
            }
        });
    });
}

// Global variables for pagination
let currentPage = 1;
const productsPerPage = 6;
let filteredProducts = [];

// Centralized function for page navigation
function goToPage(pageNumber) {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    // Validate page number
    if (pageNumber < 1) pageNumber = 1;
    if (pageNumber > totalPages) pageNumber = totalPages;
    
    currentPage = pageNumber;
    showCurrentPage();
    updatePagination();
    
    // Scroll to product section
    const productSection = document.querySelector('#products');
    if (productSection) {
        productSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Show products for current page
function showCurrentPage() {
    // First hide all products
    document.querySelectorAll('.product-card').forEach(product => {
        product.style.display = 'none';
    });

    // Calculate range for current page
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);

    // Show only products for current page
    productsToShow.forEach(product => {
        product.style.display = 'block';
    });
}

// Update pagination controls
function updatePagination() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const pageIndicator = document.getElementById('pageIndicator');
    
    // Update button states
    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= totalPages || totalPages === 0;
    
    // Update page indicator
    pageIndicator.textContent = totalPages > 0 
        ? `Page ${currentPage} of ${totalPages}` 
        : 'No products found';
    
    // Toggle pagination controls visibility
    document.querySelector('.pagination-controls').style.display = 
        filteredProducts.length <= productsPerPage ? 'none' : 'block';
}

// Initialize pagination controls
function initPagination() {
    // Remove any existing event listeners to prevent duplicates
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    
    // Clone buttons to remove existing listeners
    const newPrevBtn = prevBtn.cloneNode(true);
    const newNextBtn = nextBtn.cloneNode(true);
    
    prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
    nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
    
    // Add fresh event listeners
    document.getElementById('prevPage').addEventListener('click', () => {
        goToPage(currentPage - 1);
    });

    document.getElementById('nextPage').addEventListener('click', () => {
        goToPage(currentPage + 1);
    });
}

// applyFilters function with pagination
function applyFilters() {
    const allProducts = document.querySelectorAll('.product-card');
    filteredProducts = [];

    // Get all active filter buttons
    const activeButtons = document.querySelectorAll('.filter-btn.active');
    const selectedCategories = Array.from(activeButtons).map(btn => btn.dataset.filter);

    // If 'all' is selected or no filter, show all
    const showAll = selectedCategories.includes('all') || selectedCategories.length === 0;

    allProducts.forEach(product => {
        const category = product.dataset.category;
        if (showAll || selectedCategories.includes(category)) {
            filteredProducts.push(product);
        } else {
            product.style.display = 'none';
        }
    });

    // Reset to first page
    goToPage(1);
}

function applyPagination() {
    showCurrentPage();
    updatePagination();
}

// Filter initialization
function initFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Clear all active states
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const allProducts = document.querySelectorAll('.product-card');
            filteredProducts = [];
            
            allProducts.forEach(product => {
                const productCategories = product.dataset.category.split(',');
                const productVehicleType = product.querySelector('.product-vehicleType');
                const vehicleType = productVehicleType ? productVehicleType.textContent.toLowerCase() : '';
                
                let shouldShow = false;
                
                if (filter === 'all') {
                    shouldShow = true;
                } else {
                    switch(filter) {
                        case 'car':
                            shouldShow = vehicleType.includes('car');
                            break;
                        case 'bike':
                            shouldShow = vehicleType.includes('motorcycle') || 
                                         vehicleType.includes('scooter') || 
                                         vehicleType.includes('bike');
                            break;
                        case 'fully-synthetic':
                            shouldShow = productCategories.includes('fully-synthetic');
                            break;
                        case 'semi-synthetic':
                            shouldShow = productCategories.includes('semi-synthetic');
                            break;
                        default:
                            shouldShow = productCategories.includes(filter);
                    }
                }
                
                if (shouldShow) {
                    filteredProducts.push(product);
                }
            });
            
            // Reset to first page
            goToPage(1);
        });
    });
}

// Tabs Initialization
function initTabs() {
    const btnOils = document.getElementById('btnOils');
    const btnParts = document.getElementById('btnParts');

    if (btnOils && btnParts) {
        btnOils.addEventListener('click', function () {
            document.getElementById('oilsSection').classList.remove('hidden');
            document.getElementById('sparePartsSection').classList.add('hidden');
            this.classList.add('active');
            btnParts.classList.remove('active');
        });

        btnParts.addEventListener('click', function () {
            document.getElementById('oilsSection').classList.add('hidden');
            document.getElementById('sparePartsSection').classList.remove('hidden');
            this.classList.add('active');
            btnOils.classList.remove('active');
        });
    }
}

// Toggle See More / See Less
function attachToggleDescription() {
    document.querySelectorAll('.toggle-link').forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();

            const full = decodeURIComponent(this.dataset.full);
            const short = decodeURIComponent(this.dataset.short);
            const id = this.dataset.id;
            const descEl = document.getElementById(`desc-${id}`);
            const isExpanded = this.innerText === 'See more';

            descEl.innerHTML = `
                ${isExpanded ? full : short}
                <a href="#" class="toggle-link"
                   data-full="${encodeURIComponent(full)}"
                   data-short="${encodeURIComponent(short)}"
                   data-id="${id}">${isExpanded ? 'See less' : 'See more'}</a>
            `;

            attachToggleDescription();
        });
    });
}

// Fetch and Initialize
document.addEventListener('DOMContentLoaded', function () {
    fetch('assets/data/data.json')
        .then(response => {
            if (!response.ok) throw new Error('Network error');
            return response.json();
        })
        .then(data => {
            if (data.oils?.length) {
                renderProducts(data.oils, 'oils', '#oilsSection .products-grid');
            }
            if (data.spareParts?.length) {
                renderProducts(data.spareParts, 'spareParts', '#sparePartsSection .products-grid');
            }

            initTabs();
        })
        .catch(error => {
            console.error('Error loading product data:', error);
            document.querySelectorAll('.products-grid').forEach(c => {
                c.innerHTML = '<p class="error-message">Unable to load products. Please try again later.</p>';
            });
        });
});