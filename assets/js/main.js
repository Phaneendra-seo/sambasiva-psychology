/**
 * Main JavaScript File
 * Contains common functionality for the website
 */

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Set current year
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Initialize common functionality
    initializeScrollEffects();
    initializeMobileMenu();
    initializeFormHandlers();
    initializeAnimations();
});

/**
 * Initialize scroll effects for navbar
 */
function initializeScrollEffects() {
    // Scroll effects handled by enhanced-navigation.js to avoid conflicts
    // This function is kept for compatibility but functionality moved
}

/**
 * Initialize mobile menu toggle
 */
function initializeMobileMenu() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!mobileToggle || !mobileMenu) return;

    mobileToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        mobileToggle.classList.toggle('active');
        
        // Update ARIA attributes for accessibility
        const isExpanded = mobileMenu.classList.contains('active');
        mobileToggle.setAttribute('aria-expanded', isExpanded);
    });
}

/**
 * Initialize form handlers
 */
function initializeFormHandlers() {
    // Newsletter form handler
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', handleNewsletterSubmit);
    });

    // Contact form handler
    const contactForms = document.querySelectorAll('form[action=""]');
    contactForms.forEach(form => {
        form.addEventListener('submit', handleContactSubmit);
    });
}

/**
 * Handle newsletter form submission
 */
function handleNewsletterSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const emailInput = form.querySelector('input[type="email"]');
    const email = emailInput ? emailInput.value : '';
    
    // Validate email
    if (!validateEmail(email)) {
        showFormMessage(form, 'Please enter a valid email address', 'error');
        return;
    }
    
    // Show success message
    showFormMessage(form, 'Thank you for subscribing! We\'ll keep you updated with our latest insights.', 'success');
    
    // Clear form
    if (emailInput) {
        emailInput.value = '';
    }
}

/**
 * Handle contact form submission
 */
function handleContactSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Basic validation
    const name = formData.get('name') || '';
    const email = formData.get('email') || '';
    const message = formData.get('message') || '';
    
    if (!name || !email || !message) {
        showFormMessage(form, 'Please fill in all required fields', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showFormMessage(form, 'Please enter a valid email address', 'error');
        return;
    }
    
    // Show success message
    showFormMessage(form, 'Thank you for your message! We\'ll get back to you within 24 hours.', 'success');
    
    // Clear form
    form.reset();
}

/**
 * Validate email format
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Show form message (success or error)
 */
function showFormMessage(form, message, type) {
    // Remove existing messages
    const existingMessage = form.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message form-message-${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        padding: 0.75rem 1rem;
        margin-top: 1rem;
        border-radius: 0.5rem;
        font-size: 0.875rem;
        font-weight: 500;
        ${type === 'success' 
            ? 'background-color: #10b981; color: white;' 
            : 'background-color: #ef4444; color: white;'
        }
    `;
    
    // Insert message after form
    form.parentNode.insertBefore(messageDiv, form.nextSibling);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

/**
 * Initialize animations
 */
function initializeAnimations() {
    // Scroll reveal animation
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOnScroll = () => {
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check
    
    // Counter animation
    const counters = document.querySelectorAll('[data-count]');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const update = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString() + '+';
                requestAnimationFrame(update);
            } else {
                counter.textContent = target.toLocaleString() + '+';
            }
        };

        update();
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
        });
    });
}

/**
 * Utility functions
 */
const utils = {
    // Debounce function for performance optimization
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function for scroll events
    throttle: function(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Check if element is in viewport
    isInViewport: function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// Export for global access
window.MainJS = {
    utils,
    validateEmail,
    showFormMessage,
    handleNewsletterSubmit,
    handleContactSubmit
};
