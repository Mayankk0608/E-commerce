// Page Navigation System
function showPage(pageId, category = null) {
    // Show loading spinner
    showLoading();
    
    setTimeout(() => {
        // Hide all pages
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => {
            page.classList.remove('active');
        });

        // Show selected page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            
            // If navigating to products with category, filter immediately
            if (pageId === 'products' && category) {
                setTimeout(() => filterProducts(category), 100);
            }
        }

        // Hide loading spinner
        hideLoading();
        
        // Smooth scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, 500);
}

// Loading functions
function showLoading() {
    document.getElementById('loadingSpinner').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function hideLoading() {
    document.getElementById('loadingSpinner').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Product filtering function
function filterProducts(category) {
    const products = document.querySelectorAll('.gallery-item');
    
    products.forEach(product => {
        if (category === 'all' || product.dataset.category === category) {
            product.style.display = 'block';
            product.style.animation = 'fadeIn 0.6s ease-in-out';
        } else {
            product.style.display = 'none';
        }
    });

    // Close dropdown after selection on mobile
    const dropdownElements = document.querySelectorAll('.dropdown-toggle');
    dropdownElements.forEach(element => {
        const dropdown_bs = bootstrap.Dropdown.getInstance(element);
        if (dropdown_bs) {
            dropdown_bs.hide();
        }
    });
}

// Authentication form toggle
function toggleAuthForm(type) {
    const signupForm = document.getElementById('signupForm');
    const signinForm = document.getElementById('signinForm');
    
    if (type === 'signup') {
        signupForm.style.display = 'block';
        signinForm.style.display = 'none';
    } else {
        signupForm.style.display = 'none';
        signinForm.style.display = 'block';
    }
}

// Image Loading and Error Handling
function handleImageError(img) {
    img.style.display = 'none';
    const placeholder = document.createElement('div');
    placeholder.className = 'placeholder-image';
    placeholder.style.width = img.style.width || '100%';
    placeholder.style.height = img.style.height || '250px';
    placeholder.textContent = 'Image not available';
    img.parentNode.insertBefore(placeholder, img);
}

// Image Loading with Shimmer Effect
function addImageLoadingEffect() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        if (!img.complete) {
            img.classList.add('image-loading');
            
            img.addEventListener('load', function() {
                this.classList.remove('image-loading');
            });
            
            img.addEventListener('error', function() {
                this.classList.remove('image-loading');
                handleImageError(this);
            });
        }
    });
}

// Lazy Loading for Images with Intersection Observer
function initializeLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.01
    });

    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
}

// Form validation and submission
document.addEventListener('DOMContentLoaded', function() {
    // Initialize image loading effects
    addImageLoadingEffect();
    initializeLazyLoading();
    
    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm(this)) {
                showAlert('Thank you for your message! We will get back to you soon.', 'success');
                this.reset();
            } else {
                showAlert('Please fill in all required fields correctly.', 'error');
            }
        });
    }

    // Auth forms submission
    const authForms = document.querySelectorAll('#signupForm form, #signinForm form');
    authForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm(this)) {
                const isSignup = this.closest('#signupForm') !== null;
                const message = isSignup ? 
                    'Account created successfully! Welcome to ShopZone!' : 
                    'Welcome back! You have been signed in successfully.';
                showAlert(message, 'success');
                this.reset();
            } else {
                showAlert('Please fill in all required fields correctly.', 'error');
            }
        });
    });

    // Add to cart functionality
    document.addEventListener('click', function(e) {
        if (e.target.textContent === 'Add to Cart') {
            e.preventDefault();
            const productName = e.target.closest('.product-card').querySelector('h5').textContent;
            showAlert(`${productName} added to cart successfully!`, 'success');
            
            // Add visual feedback
            e.target.style.background = '#28a745';
            e.target.textContent = 'Added!';
            setTimeout(() => {
                e.target.style.background = '';
                e.target.textContent = 'Add to Cart';
            }, 2000);
        }
    });
});

// Alert system
function showAlert(message, type) {
    const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
    const alertHtml = `
        <div class="alert ${alertClass} alert-dismissible fade show" role="alert" style="position: fixed; top: 80px; left: 50%; transform: translateX(-50%); z-index: 9999; min-width: 300px; border-radius: 10px;">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', alertHtml);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        const alert = document.querySelector('.alert:last-child');
        if (alert) {
            alert.remove();
        }
    }, 5000);
}

// Enhanced button animations
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn-custom');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.boxShadow = '0 0 25px rgba(42, 82, 152, 0.8), 0 0 50px rgba(42, 82, 152, 0.6)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
        
        button.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'scale(1.1)';
        });
    });
});

// Smooth scroll for internal links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Enhanced navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(30, 60, 114, 0.98)';
        navbar.style.boxShadow = '0 6px 25px rgba(0,0,0,0.2)';
    } else {
        navbar.style.background = 'rgba(30, 60, 114, 0.95)';
        navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
    }
});

// Product card hover effects
document.addEventListener('DOMContentLoaded', function() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 15px 40px rgba(0,0,0,0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 8px 30px rgba(0,0,0,0.1)';
        });
    });
});

// Form validation enhancements
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#dc3545';
            input.style.boxShadow = '0 0 10px rgba(220, 53, 69, 0.3)';
            isValid = false;
        } else {
            input.style.borderColor = '#28a745';
            input.style.boxShadow = '0 0 10px rgba(40, 167, 69, 0.3)';
        }
    });
    
    // Password matching validation for signup
    const passwords = form.querySelectorAll('input[type="password"]');
    if (passwords.length === 2) {
        if (passwords[0].value !== passwords[1].value) {
            passwords[1].style.borderColor = '#dc3545';
            passwords[1].style.boxShadow = '0 0 10px rgba(220, 53, 69, 0.3)';
            isValid = false;
        }
    }
    
    return isValid;
}

// Shopping cart functionality (in-memory storage)
let cart = [];
let cartTotal = 0;

function addToCart(productName, price) {
    const item = {
        id: Date.now(),
        name: productName,
        price: price,
        quantity: 1
    };
    
    // Check if item already exists
    const existingItem = cart.find(cartItem => cartItem.name === productName);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push(item);
    }
    
    updateCartTotal();
    showAlert(`${productName} added to cart successfully!`, 'success');
}

function updateCartTotal() {
    cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    updateCartDisplay();
}

function updateCartDisplay() {
    // This function can be expanded to show cart count in navbar
    console.log('Cart items:', cart.length, 'Total:', cartTotal);
}

// Search functionality
function searchProducts(query) {
    const products = document.querySelectorAll('.gallery-item');
    const searchTerm = query.toLowerCase();
    
    products.forEach(product => {
        const productName = product.querySelector('h5').textContent.toLowerCase();
        const productDesc = product.querySelector('p').textContent.toLowerCase();
        
        if (productName.includes(searchTerm) || productDesc.includes(searchTerm)) {
            product.style.display = 'block';
            product.style.animation = 'fadeIn 0.6s ease-in-out';
        } else {
            product.style.display = 'none';
        }
    });
}

// Newsletter subscription
function subscribeNewsletter(email) {
    if (validateEmail(email)) {
        showAlert('Thank you for subscribing to our newsletter!', 'success');
        return true;
    } else {
        showAlert('Please enter a valid email address.', 'error');
        return false;
    }
}

// Email validation helper
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Image Gallery Functionality
function openImageModal(imageSrc, imageAlt) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        cursor: pointer;
    `;
    
    const img = document.createElement('img');
    img.src = imageSrc;
    img.alt = imageAlt;
    img.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        border-radius: 10px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    `;
    
    modal.appendChild(img);
    document.body.appendChild(modal);
    
    modal.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
}

// Image Zoom Functionality for Product Images
function addImageZoomFeature() {
    const productImages = document.querySelectorAll('.product-image-real');
    
    productImages.forEach(img => {
        img.addEventListener('click', function(e) {
            e.stopPropagation();
            openImageModal(this.src, this.alt);
        });
        
        img.style.cursor = 'zoom-in';
        img.title = 'Click to view larger image';
    });
}

// Image Preloading for Better Performance
function preloadImages() {
    const imageUrls = [
        'https://via.placeholder.com/400x300/2a5298/ffffff?text=ShopZone+Hero',
        'https://via.placeholder.com/400x300/ffd700/1e3c72?text=About+Us',
        'https://via.placeholder.com/400x300/ffd700/1e3c72?text=Product+Gallery',
        'https://via.placeholder.com/400x300/ffd700/1e3c72?text=Happy+Customers',
        'https://via.placeholder.com/400x300/ffd700/1e3c72?text=Contact+Us',
        'https://via.placeholder.com/400x300/ffd700/1e3c72?text=Join+Us'
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Social Media Icon Interactions
function addSocialMediaEffects() {
    const socialIcons = document.querySelectorAll('.social-icon');
    
    socialIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const platform = this.alt.toLowerCase();
            showAlert(`Redirecting to ${platform}...`, 'success');
            
            // Add click animation
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            }, 100);
        });
    });
}

// Brand Partner Hover Effects
function addBrandPartnerEffects() {
    const brandImages = document.querySelectorAll('.brand-partner-image');
    
    brandImages.forEach(img => {
        img.addEventListener('mouseenter', function() {
            this.style.opacity = '1';
            this.style.filter = 'grayscale(0%)';
            this.style.transform = 'scale(1.1)';
        });
        
        img.addEventListener('mouseleave', function() {
            this.style.opacity = '0.7';
            this.style.filter = 'grayscale(100%)';
            this.style.transform = 'scale(1)';
        });
    });
}

// Initialize page
window.addEventListener('load', function() {
    // Add some initial animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Initialize tooltips if any
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize image features
    preloadImages();
    addImageZoomFeature();
    addSocialMediaEffects();
    addBrandPartnerEffects();
});

// Responsive navigation handling
document.addEventListener('DOMContentLoaded', function() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    // Close mobile menu when clicking on nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    });
});

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // ESC key to close any open modals/dropdowns
    if (e.key === 'Escape') {
        // Close image modal if open
        const imageModal = document.querySelector('.image-modal');
        if (imageModal) {
            document.body.removeChild(imageModal);
        }
        
        // Close dropdowns
        const openDropdowns = document.querySelectorAll('.dropdown-menu.show');
        openDropdowns.forEach(dropdown => {
            const toggle = dropdown.previousElementSibling;
            if (toggle) {
                const dropdownInstance = bootstrap.Dropdown.getInstance(toggle);
                if (dropdownInstance) {
                    dropdownInstance.hide();
                }
            }
        });
    }
});

// Image Error Handling for All Images
document.addEventListener('DOMContentLoaded', function() {
    const allImages = document.querySelectorAll('img');
    
    allImages.forEach(img => {
        img.addEventListener('error', function() {
            if (!this.dataset.errorHandled) {
                this.dataset.errorHandled = 'true';
                
                // Create a placeholder div
                const placeholder = document.createElement('div');
                placeholder.className = 'placeholder-image';
                placeholder.style.cssText = `
                    width: ${this.offsetWidth || 300}px;
                    height: ${this.offsetHeight || 200}px;
                    background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #666;
                    font-weight: bold;
                    border-radius: 10px;
                    margin: auto;
                `;
                placeholder.textContent = this.alt || 'Image not available';
                
                // Replace the image with placeholder
                this.parentNode.replaceChild(placeholder, this);
            }
        });
    });
});

// Product Image Hover Zoom Effect
document.addEventListener('DOMContentLoaded', function() {
    const productImages = document.querySelectorAll('.product-image-real');
    
    productImages.forEach(img => {
        img.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        img.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
});

// Dynamic Image Loading Status
function showImageLoadingStatus() {
    const images = document.querySelectorAll('img');
    let loadedCount = 0;
    let totalImages = images.length;
    
    images.forEach(img => {
        if (img.complete) {
            loadedCount++;
        } else {
            img.addEventListener('load', () => {
                loadedCount++;
                updateLoadingProgress(loadedCount, totalImages);
            });
            
            img.addEventListener('error', () => {
                loadedCount++;
                updateLoadingProgress(loadedCount, totalImages);
            });
        }
    });
    
    if (loadedCount === totalImages) {
        updateLoadingProgress(loadedCount, totalImages);
    }
}

function updateLoadingProgress(loaded, total) {
    const percentage = Math.round((loaded / total) * 100);
    console.log(`Images loaded: ${loaded}/${total} (${percentage}%)`);
    
    if (loaded === total) {
        console.log('All images loaded successfully!');
        hideLoading();
    }
}

// Initialize image loading status on page load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(showImageLoadingStatus, 1000);
});