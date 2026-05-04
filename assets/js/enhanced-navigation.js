// Enhanced Navigation with Animations and Interactions

class EnhancedNavigation {
    constructor() {
        this.init();
        this.bindEvents();
        this.initAnimations();
    }

    init() {
        this.navbar = document.getElementById('navbar');
        this.mobileToggle = document.getElementById('mobile-toggle');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.dropdowns = document.querySelectorAll('.dropdown');
        this.scrollTop = 0;
        
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Set active navigation state
        this.setActiveNavigation();
    }

    bindEvents() {
        // Mobile menu toggle
        if (this.mobileToggle) {
            this.mobileToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Scroll effects
        window.addEventListener('scroll', () => this.handleScroll());

        // Dropdown menus
        this.dropdowns.forEach(dropdown => {
            this.setupDropdown(dropdown);
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navbar.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Close mobile menu on link click
        const mobileLinks = this.mobileMenu?.querySelectorAll('.navbar-link');
        mobileLinks?.forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    initAnimations() {
        // Animate navigation items on load
        const navItems = this.navbar?.querySelectorAll('.navbar-menu > li');
        navItems?.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                item.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 100 * index);
        });

        // Animate logo on load
        const logo = this.navbar?.querySelector('.navbar-logo');
        if (logo) {
            logo.style.opacity = '0';
            logo.style.transform = 'scale(0.8)';
            setTimeout(() => {
                logo.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                logo.style.opacity = '1';
                logo.style.transform = 'scale(1)';
            }, 200);
        }

        // Initialize reveal animations
        this.initRevealAnimations();
    }

    initRevealAnimations() {
        const revealElements = document.querySelectorAll('.reveal');
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    }

    toggleMobileMenu() {
        const isOpen = this.mobileMenu?.classList.contains('active');
        
        if (isOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        this.mobileMenu?.classList.add('active');
        this.mobileToggle?.classList.add('active');
        this.mobileToggle?.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
        
        // Animate mobile menu items
        const mobileItems = this.mobileMenu?.querySelectorAll('.navbar-menu > li');
        mobileItems?.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            setTimeout(() => {
                item.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 50 * index);
        });
    }

    closeMobileMenu() {
        this.mobileMenu?.classList.remove('active');
        this.mobileToggle?.classList.remove('active');
        this.mobileToggle?.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    handleScroll() {
        const currentScroll = window.pageYOffset;
        
        // Add scrolled class for styling
        if (currentScroll > 50) {
            this.navbar?.classList.add('navbar-scrolled');
        } else {
            this.navbar?.classList.remove('navbar-scrolled');
        }

        // Hide/show navbar on scroll
        if (currentScroll > this.scrollTop && currentScroll > 100) {
            // Scrolling down
            this.navbar?.style.setProperty('transform', 'translateY(-100%)');
        } else {
            // Scrolling up
            this.navbar?.style.setProperty('transform', 'translateY(0)');
        }
        
        this.scrollTop = currentScroll;
    }

    setupDropdown(dropdown) {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu, .mega-menu');
        
        if (!toggle || !menu) return;

        // Mouse events
        dropdown.addEventListener('mouseenter', () => {
            this.showDropdown(dropdown);
        });

        dropdown.addEventListener('mouseleave', () => {
            this.hideDropdown(dropdown);
        });

        // Touch events for mobile and click behavior
        toggle.addEventListener('click', (e) => {
            const isActive = dropdown.classList.contains('active');
            const isMobile = window.innerWidth <= 768;
            
            // Close all other dropdowns
            this.dropdowns.forEach(d => {
                if (d !== dropdown) this.hideDropdown(d);
            });
            
            if (isActive) {
                // If already open, navigate to the main page
                if (isMobile || !dropdown.matches(':hover')) {
                    window.location.href = toggle.getAttribute('href');
                } else {
                    this.hideDropdown(dropdown);
                }
            } else {
                // If closed, open dropdown
                e.preventDefault();
                this.showDropdown(dropdown);
            }
        });

        // Keyboard navigation
        toggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const isActive = dropdown.classList.contains('active');
                
                if (isActive) {
                    this.hideDropdown(dropdown);
                } else {
                    this.showDropdown(dropdown);
                    // Focus first menu item
                    const firstItem = menu.querySelector('a');
                    firstItem?.focus();
                }
            } else if (e.key === 'Escape') {
                this.hideDropdown(dropdown);
                toggle.focus();
            }
        });

        // Click handlers for individual dropdown items
        const dropdownItems = menu.querySelectorAll('a');
        dropdownItems.forEach(item => {
            item.addEventListener('click', (e) => {
                // Allow normal navigation for individual items
                // Don't prevent default behavior
            });
        });

        // Focus trap for dropdown
        menu.addEventListener('keydown', (e) => {
            const items = menu.querySelectorAll('a');
            const currentIndex = Array.from(items).findIndex(item => item === document.activeElement);
            
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % items.length;
                items[nextIndex]?.focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prevIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
                items[prevIndex]?.focus();
            } else if (e.key === 'Escape') {
                this.hideDropdown(dropdown);
                toggle.focus();
            }
        });
    }

    showDropdown(dropdown) {
        dropdown.classList.add('active');
        const menu = dropdown.querySelector('.dropdown-menu, .mega-menu');
        if (menu) {
            menu.style.opacity = '0';
            menu.style.transform = menu.classList.contains('mega-menu') 
                ? 'translateX(-50%) translateY(-10px)' 
                : 'translateY(-10px)';
            
            requestAnimationFrame(() => {
                menu.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                menu.style.opacity = '1';
                menu.style.transform = menu.classList.contains('mega-menu') 
                    ? 'translateX(-50%) translateY(0)' 
                    : 'translateY(0)';
            });
        }
    }

    hideDropdown(dropdown) {
        dropdown.classList.remove('active');
        const menu = dropdown.querySelector('.dropdown-menu, .mega-menu');
        if (menu) {
            menu.style.opacity = '0';
            menu.style.transform = menu.classList.contains('mega-menu') 
                ? 'translateX(-50%) translateY(-10px)' 
                : 'translateY(-10px)';
        }
    }

    handleKeyboard(e) {
        // Escape key closes mobile menu and dropdowns
        if (e.key === 'Escape') {
            this.closeMobileMenu();
            this.dropdowns.forEach(dropdown => this.hideDropdown(dropdown));
        }
    }

    // Add smooth scroll for anchor links
    setupSmoothScroll() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const offsetTop = target.offsetTop - 100; // Account for fixed navbar
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Add active state based on current page
    setActiveNavigation() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.navbar-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && currentPath.includes(href.replace('../', ''))) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Add search functionality
    setupSearch() {
        const searchToggle = document.querySelector('.search-toggle');
        const searchBox = document.querySelector('.search-box');
        const searchInput = document.querySelector('.search-input');
        
        if (searchToggle && searchBox) {
            searchToggle.addEventListener('click', () => {
                searchBox.classList.toggle('active');
                if (searchBox.classList.contains('active')) {
                    searchInput?.focus();
                }
            });
            
            // Close search on escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && searchBox.classList.contains('active')) {
                    searchBox.classList.remove('active');
                }
            });
        }
    }

    // Add page transition effects
    setupPageTransitions() {
        const links = document.querySelectorAll('a:not([target="_blank"])');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                // Skip if it's an anchor link or has special handling
                if (link.getAttribute('href')?.startsWith('#') || 
                    link.classList.contains('no-transition') ||
                    link.onclick) {
                    return;
                }
                
                e.preventDefault();
                const href = link.getAttribute('href');
                
                // Add fade out effect
                document.body.style.transition = 'opacity 0.3s ease';
                document.body.style.opacity = '0';
                
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            });
        });
    }

    // Initialize everything when DOM is ready
    static init() {
        document.addEventListener('DOMContentLoaded', () => {
            new EnhancedNavigation();
        });
    }
}

// Auto-initialize
EnhancedNavigation.init();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedNavigation;
}
