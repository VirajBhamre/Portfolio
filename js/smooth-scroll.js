/**
 * Smooth scrolling implementation using Locomotive Scroll
 * Optimized for better performance
 */

// Initialize Locomotive Scroll
function initLocomotiveScroll() {
    // Check if scroll is already initialized
    if (window.locoScroll) return;
    
    // Create a link element to load the Locomotive Scroll CSS
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = 'https://cdn.jsdelivr.net/npm/locomotive-scroll@4.1.4/dist/locomotive-scroll.min.css';
    document.head.appendChild(linkElement);

    // Load Locomotive Scroll script if not already loaded
    if (!document.querySelector('script[src*="locomotive-scroll"]')) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/locomotive-scroll@4.1.4/dist/locomotive-scroll.min.js';
        script.async = true;
        
        script.onload = () => {
            // Initialize Locomotive Scroll after the script is loaded
            initScrollInstance();
        };
        
        document.body.appendChild(script);
    } else {
        // If the script is already loaded, just initialize the scroll instance
        initScrollInstance();
    }
}

// Separate function to initialize the LocomotiveScroll instance
function initScrollInstance() {
    try {
        // Make sure we have the data-scroll-container
        const container = document.querySelector('[data-scroll-container]');
        if (!container) {
            // Add data-scroll-container to the body if it doesn't exist
            document.body.setAttribute('data-scroll-container', '');
        }
        
        const locoScroll = new LocomotiveScroll({
            el: document.querySelector('[data-scroll-container]'),
            smooth: true,
            multiplier: 0.8, // Reduced for smoother scrolling
            lerp: 0.06,      // Increased for smoother interpolation
            smartphone: {
                smooth: false // Disable smooth scrolling on mobile for better performance
            },
            tablet: {
                smooth: false // Disable smooth scrolling on tablets for better performance
            },
            getDirection: true,
            inertia: 0.3     // Added slight inertia for smoother feeling scrolling
        });

        // Update scroll position for Locomotive Scroll on page refresh
        window.addEventListener('load', () => {
            setTimeout(() => {
                locoScroll.update();
                
                // Force a redraw to ensure everything is positioned correctly
                locoScroll.scrollTo('top', { duration: 0 });
                locoScroll.update();
            }, 300);
        });

        // Update Locomotive Scroll when content changes, using more efficient observer
        const mutationObserver = new MutationObserver(() => {
            setTimeout(() => locoScroll.update(), 100);
        });

        mutationObserver.observe(document.querySelector('[data-scroll-container]'), { 
            childList: true, 
            subtree: true,
            attributes: false,
            characterData: false
        });

        // Handle anchor links with more efficient handlers
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Close mobile menu if open
                const menu = document.querySelector('.menu');
                const hamburger = document.querySelector('.hamburger');
                if (menu.classList.contains('active')) {
                    menu.classList.remove('active');
                    hamburger.classList.remove('active');
                }
                
                const targetId = this.getAttribute('href');
                if (targetId !== '#') {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        locoScroll.scrollTo(targetElement, {
                            offset: -70,
                            duration: 1000,
                            easing: [0.25, 0.0, 0.35, 1.0]
                        });
                    }
                }
            });
        });

        // Make the locoScroll instance globally accessible
        window.locoScroll = locoScroll;
        
        // Make sure animations are triggered properly
        locoScroll.on('scroll', (args) => {
            // Force animation checks when scrolling
            checkAnimations(args);
        });
    } catch (error) {
        console.error('Failed to initialize Locomotive Scroll:', error);
        // Fallback to standard scrolling
        document.body.style.overflow = 'auto';
    }
}

// Function to check which elements should be animated
function checkAnimations(scrollInfo) {
    // Get all elements that need to be animated
    const animatedElements = document.querySelectorAll('.skill-category, .project-card, .contact-item, .contact-form, .terminal, .section-title, .about-text p, .social-links a');
    
    animatedElements.forEach(el => {
        // Only add the appear class if it doesn't already have it
        if (isInView(el, scrollInfo) && !el.classList.contains('appear')) {
            setTimeout(() => {
                el.classList.add('appear');
            }, parseInt(el.dataset.delay || 0));
        }
    });
}

// Helper function to check if element is in viewport
function isInView(element, scrollInfo) {
    const rect = element.getBoundingClientRect();
    return rect.top <= window.innerHeight * 0.8;
}

// Initialize smooth scrolling when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.body.classList.add('disable-smooth-scroll');
    } else {
        initLocomotiveScroll();
    }
});

// Add additional helper for force-triggering animations
window.addEventListener('load', function() {
    setTimeout(() => {
        // Force add appear class to immediate visible elements
        document.querySelectorAll('.skill-category, .project-card, .contact-item, .contact-form, .terminal, .section-title, .about-text p, .social-links a').forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.8 && !element.classList.contains('appear')) {
                element.classList.add('appear');
            }
        });
    }, 500);
});