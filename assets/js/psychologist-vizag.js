// Psychologist Vizag Page JavaScript

// DOM Elements
const modal = document.getElementById('contactModal');
const appointmentForm = document.getElementById('appointmentForm');
const closeBtn = document.querySelector('.close');

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeMobileNavigation();
    initializeAnimations();
    initializeFormValidation();
    initializeScrollEffects();
    initializePhoneFormatting();
});

// Mobile Navigation functionality
function initializeMobileNavigation() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const navbarLinks = mobileMenu ? mobileMenu.querySelectorAll('.navbar-link') : [];
    
    if (!mobileToggle || !mobileMenu) return;
    
    // Toggle mobile menu
    mobileToggle.addEventListener('click', function() {
        const isOpen = mobileMenu.classList.contains('active');
        
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });
    
    // Close menu when clicking on links
    navbarLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMobileMenu();
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (mobileMenu.classList.contains('active') && 
            !mobileMenu.contains(e.target) && 
            !mobileToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Handle resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1024 && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
}

function openMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileToggle = document.getElementById('mobile-toggle');
    
    mobileMenu.classList.add('active');
    mobileToggle.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Add overlay
    if (!document.querySelector('.mobile-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'mobile-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(overlay);
        
        // Animate overlay
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 10);
        
        // Close on overlay click
        overlay.addEventListener('click', closeMobileMenu);
    }
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileToggle = document.getElementById('mobile-toggle');
    const overlay = document.querySelector('.mobile-overlay');
    
    mobileMenu.classList.remove('active');
    mobileToggle.classList.remove('active');
    document.body.style.overflow = '';
    
    // Remove overlay
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.remove();
        }, 300);
    }
}

// Show booking form modal
function showBookingForm() {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Focus on first input field
    setTimeout(() => {
        document.getElementById('name').focus();
    }, 300);
}

// Close modal
function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    appointmentForm.reset();
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target === modal) {
        closeModal();
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && modal.style.display === 'block') {
        closeModal();
    }
});

// Form submission handler
appointmentForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (validateForm()) {
        submitForm();
    }
});

// Form validation
function validateForm() {
    let isValid = true;
    const requiredFields = ['name', 'phone', 'service'];
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        const value = field.value.trim();
        
        if (!value) {
            showError(field, 'This field is required');
            isValid = false;
        } else {
            clearError(field);
        }
    });
    
    // Validate phone number
    const phoneField = document.getElementById('phone');
    const phoneValue = phoneField.value.trim();
    if (phoneValue && !validatePhoneNumber(phoneValue)) {
        showError(phoneField, 'Please enter a valid phone number');
        isValid = false;
    }
    
    // Validate email if provided
    const emailField = document.getElementById('email');
    const emailValue = emailField.value.trim();
    if (emailValue && !validateEmail(emailValue)) {
        showError(emailField, 'Please enter a valid email address');
        isValid = false;
    }
    
    return isValid;
}

// Phone number validation
function validatePhoneNumber(phone) {
    // Indian phone number format: 10 digits starting with 6-9, optional country code
    const phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// Email validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show error message
function showError(field, message) {
    clearError(field);
    
    field.style.borderColor = '#dc3545';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = '#dc3545';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

// Clear error message
function clearError(field) {
    field.style.borderColor = '#e9ecef';
    
    const errorDiv = field.parentNode.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Submit form
function submitForm() {
    const formData = new FormData(appointmentForm);
    const data = Object.fromEntries(formData);
    
    // Show loading state
    const submitBtn = appointmentForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual endpoint)
    setTimeout(() => {
        console.log('Form submitted:', data);
        
        // Show success message
        showSuccessMessage();
        
        // Reset form
        appointmentForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Close modal after delay
        setTimeout(() => {
            closeModal();
        }, 2000);
    }, 1500);
}

// Show success message
function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.cssText = `
        background: #28a745;
        color: white;
        padding: 1rem;
        border-radius: 10px;
        margin-bottom: 1rem;
        text-align: center;
        animation: slideIn 0.3s ease;
    `;
    successDiv.textContent = 'Appointment request submitted successfully! We will contact you soon.';
    
    appointmentForm.parentNode.insertBefore(successDiv, appointmentForm);
    
    // Remove success message after 3 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// Initialize animations on scroll
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.service-card, .feature-item, .booking-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

// Initialize scroll effects
function initializeScrollEffects() {
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove shadow on scroll
        if (scrollTop > 10) {
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Initialize phone number formatting
function initializePhoneFormatting() {
    const phoneInput = document.getElementById('phone');
    
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        // Format as Indian phone number
        if (value.length > 0) {
            if (value.length <= 5) {
                value = value;
            } else if (value.length <= 10) {
                value = value.slice(0, 5) + ' ' + value.slice(5);
            } else {
                value = '+' + value.slice(0, 2) + ' ' + value.slice(2, 7) + ' ' + value.slice(7, 12);
            }
        }
        
        e.target.value = value;
    });
}

// Initialize form validation enhancements
function initializeFormValidation() {
    const inputs = appointmentForm.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        // Real-time validation
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                showError(this, 'This field is required');
            } else if (this.value.trim()) {
                clearError(this);
                
                // Specific validations
                if (this.id === 'phone' && !validatePhoneNumber(this.value)) {
                    showError(this, 'Please enter a valid phone number');
                } else if (this.id === 'email' && !validateEmail(this.value)) {
                    showError(this, 'Please enter a valid email address');
                }
            }
        });
        
        // Clear error on input
        input.addEventListener('input', function() {
            clearError(this);
        });
    });
}

// Track analytics events
function trackEvent(eventName, properties = {}) {
    // Replace with your analytics tracking code
    console.log('Analytics Event:', eventName, properties);
    
    // Example: Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, properties);
    }
}

// Track button clicks
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn')) {
        const buttonText = e.target.textContent.trim();
        const buttonType = e.target.classList.contains('btn-primary') ? 'primary' : 
                         e.target.classList.contains('btn-secondary') ? 'secondary' : 
                         e.target.classList.contains('btn-success') ? 'success' : 'unknown';
        
        trackEvent('button_click', {
            button_text: buttonText,
            button_type: buttonType,
            page: 'psychologist-vizag'
        });
    }
});

// Track form interactions
appointmentForm.addEventListener('focus', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
        trackEvent('form_field_focus', {
            field_name: e.target.name,
            page: 'psychologist-vizag'
        });
    }
}, true);

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

// Lazy loading for images (if needed)
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Add CSS animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .fade-in {
        animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    trackEvent('javascript_error', {
        error_message: e.error.message,
        error_url: e.filename,
        error_line: e.lineno,
        page: 'psychologist-vizag'
    });
});

// Performance monitoring
window.addEventListener('load', function() {
    if ('performance' in window) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        trackEvent('page_load_time', {
            load_time_ms: loadTime,
            page: 'psychologist-vizag'
        });
    }
});

// Service worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed');
            });
    });
}
