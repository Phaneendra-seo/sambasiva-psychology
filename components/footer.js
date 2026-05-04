// Universal Footer JavaScript
function initializeFooter() {
    // Set current year
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Initialize Lucide icons for footer
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
        
        // Re-initialize icons after a delay to catch any dynamically loaded content
        setTimeout(() => {
            lucide.createIcons();
        }, 500);
        
        // Additional initialization for footer icons
        setTimeout(() => {
            lucide.createIcons();
        }, 1000);
    }
    
    // Fallback: If icons still not visible, try manual initialization
    setTimeout(() => {
        const icons = document.querySelectorAll('[data-lucide]');
        if (icons.length > 0) {
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }, 2000);
}

// Make function globally available
window.initializeFooter = initializeFooter;

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize footer if footer element exists
    const footerElement = document.getElementById('current-year');
    if (footerElement) {
        initializeFooter();
    }
});

// Also initialize immediately in case DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFooter);
} else {
    initializeFooter();
}
