// Force hardware acceleration to improve animation performance
function enableHardwareAcceleration() {
    // Create an invisible element to force the browser to use hardware acceleration
    const accelerator = document.createElement('div');
    accelerator.style.cssText = `
        position: fixed;
        transform: translateZ(0);
        top: -100px;
        left: -100px;
        width: 1px;
        height: 1px;
        z-index: -1;
        pointer-events: none;
        opacity: 0.01;
        will-change: transform, opacity;
    `;
    document.body.appendChild(accelerator);
    
    // Mark the body as loaded after all resources are ready
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });
}

// Force creation of render layers for key elements to improve initial animation performance
function forceRenderLayers() {
    // List of selectors for elements that will be animated
    const animatedElements = [
        '.project-card', 
        '.skill-category',
        '.contact-item',
        '.terminal',
        '.hero-content',
        '.hero-image',
        '.section-title',
        '.social-links a',
        '.service-card', // Added service cards
        '.services-info', // Added services info section
        '.services-note', // Added services note
        '.services-process', // Added services process
        '#robot-guide-container'
    ];
    
    // Create render layers for elements before they animate
    animatedElements.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            // Force hardware acceleration
            el.style.transform = 'translateZ(0)';
            el.style.willChange = 'transform, opacity';
            
            // Trigger a small non-visible transform to force creation of a compositor layer
            requestAnimationFrame(() => {
                el.style.transform = 'translateZ(0.1px)';
                requestAnimationFrame(() => {
                    el.style.transform = 'translateZ(0)';
                });
            });
        });
    });
}

// Run immediately
enableHardwareAcceleration();
forceRenderLayers();

/* Use passive event listeners for all scroll events */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize particles.js
    initParticles();
    
    // Smooth scrolling for navigation links
    initSmoothScroll();
    
    // Initialize typing animation in hero section
    initTypingAnimation();
    
    // Initialize terminal animation in about section
    initTerminalAnimation();
    
    // Initialize skill bars animation with faster load time
    initSkillBars();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Mobile menu toggle
    initMobileMenu();
    
    // Add scroll event for header
    initHeaderScroll();
    
    // Initialize form submission
    initContactForm();
    
    // Initialize new enhanced animations
    initEnhancedAnimations();
    
    // Initialize enhanced hover transitions
    enhanceHoverTransitions();
    
    // Update the menu to include services section
    updateNavigation();
    
    // Apply passive event listeners to all scroll events for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    function handleScroll() {
        // This is a centralized scroll handler to reduce multiple scroll listeners
        requestAnimationFrame(function() {
            // Only run animations if they're in the viewport
            if (isInViewport('.skill-progress')) animateSkillBars();
            if (isInViewport('.counter')) animateCounter();
            
            // Update header state based on scroll position
            updateHeaderOnScroll();
        });
    }
    
    function isInViewport(selector) {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) return false;
        
        const element = elements[0]; // Check at least one element
        const rect = element.getBoundingClientRect();
        return (rect.top <= window.innerHeight * 0.8);
    }
    
    function updateHeaderOnScroll() {
        const header = document.querySelector('header');
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class for background color change
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

// Enhanced animation system
function initEnhancedAnimations() {
    // Preload animations for better performance on mobile
    document.body.classList.add('animations-ready');
    
    // Add animated elements with different delays
    animateElementsWithDelay('.skill-icon', 'bounce', 100);
    animateElementsWithDelay('.project-logo i', 'float-enhanced', 150);
    animateElementsWithDelay('.contact-item', 'slide-in-right', 100);
    
    // Add hover animations
    addHoverAnimation('.btn', 'pulse-subtle');
    addHoverAnimation('.social-links a', 'rotate-scale');
    addHoverAnimation('.skill-category', 'glow');
    addHoverAnimation('.project-card', 'pulse-subtle');
    
    // Add continuous background animations
    addBackgroundAnimation();
    
    // Add floating code lines animation
    initCodeLinesAnimation();
    
    // Add cursor follow effect (disable on mobile for performance)
    if (window.innerWidth > 768) {
        initCursorFollowEffect();
    }
    
    // Add logo animation
    animateLogo();
    
    // Add scroll indicator
    addScrollIndicator();
}

// Initialize particles.js with more interactive and optimized backend-themed configuration
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        const particleConfig = {
            "particles": {
                "number": {
                    "value": (window.innerWidth < 768) ? 10 : 20, // Further reduced particles for better performance
                    "density": {
                        "enable": true,
                        "value_area": 1500 // Increased to spread particles more
                    }
                },
                "color": {
                    "value": ["#60a5fa", "#3B82F6"] // Reduced color variations for better performance
                },
                "shape": {
                    "type": ["circle"], // Only circles for better performance
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    }
                },
                "opacity": {
                    "value": 0.3, // Lowered opacity
                    "random": false, // Disabled random opacity
                    "anim": {
                        "enable": false // Completely disabled animation
                    }
                },
                "size": {
                    "value": 2.5,
                    "random": true,
                    "anim": {
                        "enable": false // Completely disabled animation
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#60a5fa",
                    "opacity": 0.2, // Reduced opacity of lines
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": (window.innerWidth < 768) ? 0.3 : 0.8, // Further reduced speed
                    "direction": "none",
                    "random": false, // Disabled random movement
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": window.innerWidth > 1024, // Only enable on desktop
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": false, // Disabled for better performance
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 0.8
                        }
                    }
                }
            },
            "retina_detect": false // Disabled retina detection for performance
        };
        
        // Only initialize particles if not on a low-end device
        if (!isLowEndDevice()) {
            particlesJS('particles-js', particleConfig);
        } else {
            // For low-end devices, create a simple static background instead
            createSimpleBackground();
        }
    }
}

// Check if device is low-end based on memory and processor
function isLowEndDevice() {
    // Check for low memory conditions
    if (navigator.deviceMemory !== undefined && navigator.deviceMemory < 4) {
        return true;
    }
    
    // Check for low-end mobile devices
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && 
        window.innerWidth < 768) {
        return true;
    }
    
    return false;
}

// Create a simple static background for low-end devices
function createSimpleBackground() {
    const particlesContainer = document.getElementById('particles-js');
    if (particlesContainer) {
        particlesContainer.style.background = 'radial-gradient(circle, rgba(26,26,26,1) 0%, rgba(24,24,30,1) 100%)';
        
        // Add a few static dots
        for (let i = 0; i < 10; i++) {
            const dot = document.createElement('div');
            dot.style.position = 'absolute';
            dot.style.width = '3px';
            dot.style.height = '3px';
            dot.style.borderRadius = '50%';
            dot.style.backgroundColor = '#60a5fa';
            dot.style.opacity = '0.3';
            dot.style.top = `${Math.random() * 100}%`;
            dot.style.left = `${Math.random() * 100}%`;
            particlesContainer.appendChild(dot);
        }
    }
}

// Enhanced smooth scrolling for navigation links with easing
function initSmoothScroll() {
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
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Use smoother cubic-bezier easing
                const startPosition = window.pageYOffset;
                const targetPosition = targetElement.getBoundingClientRect().top + startPosition - 70; // Adjusted for header
                const distance = targetPosition - startPosition;
                let startTime = null;
                
                function animation(currentTime) {
                    if (startTime === null) startTime = currentTime;
                    const timeElapsed = currentTime - startTime;
                    const duration = 800; // ms - longer for smoother effect
                    
                    // Easing function - cubic bezier approximation of ease-in-out
                    const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
                    window.scrollTo(0, run);
                    
                    if (timeElapsed < duration) {
                        requestAnimationFrame(animation);
                    }
                }
                
                // Easing function
                function easeInOutCubic(t, b, c, d) {
                    t /= d / 2;
                    if (t < 1) return c / 2 * t * t * t + b;
                    t -= 2;
                    return c / 2 * (t * t * t + 2) + b;
                }
                
                requestAnimationFrame(animation);
            }
        });
    });
}

// Improved typing animation with smoother transitions
function initTypingAnimation() {
    const typingText = document.querySelector('.typing-text');
    if (!typingText) return;
    
    const phrases = [
        "I'm Viraj Bhamre",
        "I'm a Backend Developer",
        "I'm a MERN Stack Developer",
        "I'm an API Expert",
        "I'm a Problem Solver"
    ];
    
    let currentPhraseIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function type() {
        const currentPhrase = phrases[currentPhraseIndex];
        
        if (isDeleting) {
            typingText.textContent = currentPhrase.substring(0, currentCharIndex - 1);
            currentCharIndex--;
            // Random speed variation for more natural typing
            typingSpeed = Math.random() * 30 + 30;
        } else {
            typingText.textContent = currentPhrase.substring(0, currentCharIndex + 1);
            currentCharIndex++;
            // Random speed variation for more natural typing
            typingSpeed = Math.random() * 70 + 70;
        }
        
        // Switch to deleting after completing the phrase
        if (!isDeleting && currentCharIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 1000; // Pause at the end of phrase
        } 
        // Move to next phrase after deleting
        else if (isDeleting && currentCharIndex === 0) {
            isDeleting = false;
            currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
            typingSpeed = 500; // Pause before starting new phrase
        }
        
        setTimeout(type, typingSpeed);
    }
    
    // Start typing animation
    setTimeout(type, 1000);
}

// Terminal animation with improved visuals and optimized performance
function initTerminalAnimation() {
    const terminal = document.querySelector('.terminal-body');
    if (!terminal) return;
    
    // Performance check
    if (isLowEndDevice()) {
        // For low-end devices, just show a static terminal with pre-typed content
        renderStaticTerminal(terminal);
        return;
    }
    
    const typingElement = terminal.querySelector('.typing');
    const commands = [
        "node server.js",
        "git push origin main",
        "npm run build"  // Removed one command to reduce processing
    ];
    
    let commandIndex = 0;
    let charIndex = 0;
    
    function typeCommand() {
        if (commandIndex >= commands.length) {
            commandIndex = 0;
        }
        
        const currentCommand = commands[commandIndex];
        
        if (charIndex < currentCommand.length) {
            typingElement.textContent += currentCommand.charAt(charIndex);
            charIndex++;
            setTimeout(typeCommand, Math.random() * 30 + 30); // Faster typing speed
        } else {
            // Command completed, process it
            setTimeout(() => {
                processCommand(currentCommand);
            }, 300); // Reduced delay
        }
    }
    
    function processCommand(command) {
        // Create output element based on the command
        const prompt = document.createElement('p');
        prompt.innerHTML = `<span class="prompt">$ </span><span class="command">${command}</span>`;
        terminal.insertBefore(prompt, terminal.lastElementChild);
        
        let output = '';
        
        // Generate realistic terminal output based on the command - simplified for performance
        if (command === 'node server.js') {
            output = 'Server running on http://localhost:5000\nConnected to MongoDB database';
        } else if (command === 'git push origin main') {
            output = 'Writing objects: 100% (15/15), 1.5 KiB\nTo github.com:virajbhamre/project.git\n   main -> main';
        } else if (command === 'npm run build') {
            output = '> webpack --mode production\n\nBuild completed in 4.32s';
        }
        
        // Add output to terminal with typing effect - optimized with fewer DOM manipulations
        const outputElement = document.createElement('p');
        outputElement.className = 'output';
        terminal.insertBefore(outputElement, terminal.lastElementChild);
        
        // Split output by lines - simplified output with fewer lines
        const lines = output.split('\n');
        let lineIndex = 0;
        let charIndexOutput = 0;
        let currentLineText = '';
        
        function typeOutput() {
            if (lineIndex < lines.length) {
                const currentLine = lines[lineIndex];
                
                if (charIndexOutput < currentLine.length) {
                    // Type character by character for each line - buffer output to reduce DOM updates
                    currentLineText += currentLine.charAt(charIndexOutput);
                    // Only update DOM every 4 characters
                    if (charIndexOutput % 4 === 0 || charIndexOutput === currentLine.length - 1) {
                        outputElement.innerHTML = currentLineText;
                    }
                    charIndexOutput++;
                    setTimeout(typeOutput, 5); // Faster output typing
                } else {
                    // Move to next line
                    currentLineText += '<br>';
                    outputElement.innerHTML = currentLineText;
                    lineIndex++;
                    charIndexOutput = 0;
                    setTimeout(typeOutput, 30); // Reduced delay between lines
                }
            } else {
                // Clear current command and prepare for next one
                typingElement.textContent = '';
                charIndex = 0;
                commandIndex++;
                
                // Scroll terminal to bottom
                terminal.scrollTop = terminal.scrollHeight;
                
                // Start typing next command after a delay
                setTimeout(typeCommand, 1000); // Reduced delay
            }
        }
        
        setTimeout(typeOutput, 200); // Reduced delay
    }
    
    // Start the terminal animation with a slight delay
    setTimeout(typeCommand, 800);
}

// Render static terminal for low-end devices
function renderStaticTerminal(terminal) {
    terminal.innerHTML = `

        <p><span class="prompt">$ </span><span class="command">node server.js</span></p>
        <p class="output">Server running on http://localhost:5000<br>Connected to MongoDB database</p>
        <p><span class="prompt">$ </span><span class="command">git push origin main</span></p>
        <p class="output">Writing objects: 100% (15/15), 1.5 KiB<br>To github.com:virajbhamre/project.git<br>   main -> main</p>
        <p><span class="prompt">$ </span><span class="command">npm run build</span></p>
        <p class="output">> webpack --mode production<br><br>Build completed in 4.32s</p>
        <p><span class="prompt">$ </span><span class="typing"></span><span class="cursor">|</span></p>
    `;
}

// Enhanced skill bars animation with faster load time
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    // Immediately animate skill bars when in view
    function animateSkillBars() {
        skillBars.forEach(bar => {
            const rect = bar.getBoundingClientRect();
            const isVisible = (rect.top <= window.innerHeight * 0.8);
            
            if (isVisible && !bar.classList.contains('animated')) {
                const progress = bar.getAttribute('data-progress');
                
                // Use a much faster animation
                bar.style.transition = 'width 0.6s cubic-bezier(0.17, 0.67, 0.83, 0.67)';
                bar.style.width = progress + '%';
                bar.classList.add('animated');
            }
        });
    }
    
    // Run once immediately without delay
    animateSkillBars();
    
    // Run on scroll with minimal debounce
    window.addEventListener('scroll', function() {
        requestAnimationFrame(animateSkillBars);
    }, { passive: true });
}

// Update the scroll animations function to use the improved animation classes
function initScrollAnimations() {
    // Elements with scroll animations - with expanded elements list to include all missing sections
    const animatedElements = [
        { selector: '.section-title', animation: 'fade-up', threshold: 0.1 },
        { selector: '.project-card', animation: 'fade-up', threshold: 0.1, stagger: true },
        { selector: '.service-card', animation: 'fade-up', threshold: 0.1, stagger: true }, // Explicitly add service cards
        { selector: '.contact-item', animation: 'fade-left', threshold: 0.1, stagger: true },
        { selector: '.hero-content', animation: 'fade-left', threshold: 0 },
        { selector: '.hero-image', animation: 'fade-right', threshold: 0 },
        { selector: '.contact-form', animation: 'fade-right', threshold: 0.1 },
        { selector: '.social-links a', animation: 'fade-up', threshold: 0.1, stagger: true },
        { selector: '.skill-category', animation: 'fade-up', threshold: 0.1, stagger: true },
        { selector: '.terminal', animation: 'fade-right', threshold: 0.1 },
        { selector: '.about-text p', animation: 'fade-left', threshold: 0.1, stagger: true },
        { selector: '.services-info', animation: 'fade-up', threshold: 0.1 },
        { selector: '.services-note', animation: 'fade-left', threshold: 0.1 },
        { selector: '.services-process', animation: 'fade-right', threshold: 0.1 }
    ];
    
    // Fix: Use Intersection Observer with improved callback handling
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                
                // Get animation type from data attribute or use default
                const animation = target.dataset.animation || '';
                const delay = parseInt(target.dataset.delay || 0);
                
                // Add appear class after delay - key fix for missing animations
                setTimeout(() => {
                    // Critical fix: Use the appear class to make elements visible
                    target.classList.add('appear');
                    
                    // Add any specific animation class if specified
                    if (animation) {
                        target.classList.add(animation);
                    }
                    
                    // Stop observing after animation is applied
                    observer.unobserve(target);
                }, delay);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -5% 0px'
    });
    
    // Apply to animated elements with throttled batch processing
    let batchSize = 5; // Process elements in small batches for better performance
    let elementCount = 0;
    
    animatedElements.forEach(item => {
        document.querySelectorAll(item.selector).forEach((element, index) => {
            // Apply base animation class if specified
            if (item.animation) {
                element.dataset.animation = item.animation;
            }
            
            // Apply hardware acceleration properties for smoother animations
            element.style.willChange = 'transform, opacity';
            element.style.backfaceVisibility = 'hidden';
            
            // Add staggered delay if specified (with shorter delays)
            if (item.stagger) {
                // Reduce delay between elements
                const maxDelay = 300; // Maximum delay in ms
                element.dataset.delay = Math.min(index * 50, maxDelay);
            }
            
            // Process in batches to avoid layout thrashing
            elementCount++;
            if (elementCount % batchSize === 0) {
                setTimeout(() => {
                    observer.observe(element);
                }, 0);
            } else {
                observer.observe(element);
            }
        });
    });
    
    // Add reduced parallax background only on high-end devices
    if (window.innerWidth > 1024 && !isReducedMotionPreferred()) {
        addParallaxBackground();
    }
}

// Check if user prefers reduced motion
function isReducedMotionPreferred() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Add parallax background elements for depth
function addParallaxBackground() {
    // Only add parallax on high-performance devices
    if (window.innerWidth <= 1024 || isLowEndDevice()) return;
    
    // Create a container for parallax elements - use fewer elements
    const sections = document.querySelectorAll('section');
    let parallaxElementCount = 0;
    const maxParallaxElements = 10; // Hard limit on total elements
    
    sections.forEach(section => {
        // Skip sections that already have a background
        if (section.querySelector('.parallax-bg')) return;
        
        // Only add to key sections for better performance
        if (!section.classList.contains('hero') && 
            !section.classList.contains('projects') && 
            !section.classList.contains('about') && 
            parallaxElementCount >= maxParallaxElements) {
            return;
        }
        
        const parallaxBg = document.createElement('div');
        parallaxBg.className = 'parallax-bg';
        section.appendChild(parallaxBg);
        
        // Add just 1-2 elements per section
        const elementCount = Math.min(2, maxParallaxElements - parallaxElementCount);
        parallaxElementCount += elementCount;
        
        for (let i = 0; i < elementCount; i++) {
            const element = document.createElement('div');
            element.className = 'parallax-element';
            
            // Random properties
            const size = Math.random() * 60 + 40; // Smaller elements
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            
            element.style.width = `${size}px`;
            element.style.height = `${size}px`;
            element.style.left = `${posX}%`;
            element.style.top = `${posY}%`;
            element.style.transform = 'translateZ(0)'; // Hardware acceleration
            
            parallaxBg.appendChild(element);
        }
    });
    
    // Add efficient parallax effect on scroll
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        lastScrollY = window.scrollY;
        
        if (!ticking) {
            // Use request animation frame to avoid excessive calculations
            window.requestAnimationFrame(() => {
                const elements = document.querySelectorAll('.parallax-element');
                const len = Math.min(elements.length, 12); // Process max 12 elements
                
                for (let i = 0; i < len; i++) {
                    const element = elements[i];
                    const parent = element.closest('section');
                    if (!parent) continue;
                    
                    const sectionTop = parent.offsetTop;
                    const speed = 0.1; // Fixed speed for consistent performance
                    const yPos = (lastScrollY - sectionTop) * speed;
                    
                    // Use transform3d for hardware acceleration
                    element.style.transform = `translate3d(0, ${yPos}px, 0)`;
                }
                
                ticking = false;
            });
            
            ticking = true;
        }
    }, { passive: true });
}

// Improved hover transitions between cards
function enhanceHoverTransitions() {
    // Get all interactive elements that need enhanced hover
    const interactiveElements = document.querySelectorAll('.skill-category, .project-card, .social-links a');
    
    interactiveElements.forEach(element => {
        // Create hover transition state
        element.addEventListener('mouseenter', () => {
            // Reset any ongoing transitions
            element.style.transition = 'transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), box-shadow 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)';
            
            // Ensure other elements return to normal
            if (element.classList.contains('project-card') || element.classList.contains('skill-category')) {
                const siblings = Array.from(element.parentElement.children).filter(e => e !== element);
                
                siblings.forEach(sibling => {
                    sibling.style.transform = 'scale(0.98)';
                    sibling.style.opacity = '0.8';
                });
            }
        });
        
        element.addEventListener('mouseleave', () => {
            // Smooth return to normal state
            if (element.classList.contains('project-card') || element.classList.contains('skill-category')) {
                const siblings = Array.from(element.parentElement.children);
                
                siblings.forEach(sibling => {
                    sibling.style.transform = 'translateY(0) scale(1)';
                    sibling.style.opacity = '1';
                });
            }
        });
    });
    
    // Enhance button hover animations
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.3s ease';
        });
    });
}

// Mobile menu toggle with improved animation
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('.menu');
    const body = document.body;
    
    if (hamburger && menu) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            menu.classList.toggle('active');
            
            // Prevent background scrolling when menu is open
            if (menu.classList.contains('active')) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        });
        
        // Close menu when clicking outside or on menu items
        document.addEventListener('click', function(e) {
            if (menu.classList.contains('active') && 
                !menu.contains(e.target) && 
                !hamburger.contains(e.target)) {
                menu.classList.remove('active');
                hamburger.classList.remove('active');
                body.style.overflow = '';
            }
        });
        
        // Close menu when clicking on menu items
        const menuItems = menu.querySelectorAll('a');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                menu.classList.remove('active');
                hamburger.classList.remove('active');
                body.style.overflow = '';
            });
        });
    }
}

// Contact form submission with validation and animation
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Add input focus animations
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            // Add focus events
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
            
            // Check if input has value on page load
            if (input.value) {
                input.parentElement.classList.add('focused');
            }
        });
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            let isValid = true;
            formInputs.forEach(input => {
                if (input.required && !input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                    
                    // Shake animation for error
                    input.classList.add('shake');
                    setTimeout(() => {
                        input.classList.remove('shake');
                    }, 500);
                } else {
                    input.classList.remove('error');
                }
            });
            
            if (!isValid) return;
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Simulate form submission with success animation
            const submitButton = contactForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            // Simulate server delay
            setTimeout(() => {
                console.log('Form submitted:', { name, email, subject, message });
                
                // Show success message
                submitButton.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                submitButton.classList.add('success');
                
                // Reset form with delay
                setTimeout(() => {
                    contactForm
                    // Show alert
                    const successMessage = document.createElement('div');
                    successMessage.className = 'success-message';
                    successMessage.innerHTML = 'Thank you for your message! I will get back to you soon.';
                    successMessage.style.position = 'absolute';
                    successMessage.style.top = '0';
                    successMessage.style.left = '0';
                    successMessage.style.right = '0';
                    successMessage.style.padding = '15px';
                    successMessage.style.background = 'var(--success-color)';
                    successMessage.style.color = 'white';
                    successMessage.style.borderRadius = 'var(--border-radius) var(--border-radius) 0 0';
                    successMessage.style.textAlign = 'center';
                    successMessage.style.transform = 'translateY(-100%)';
                    successMessage.style.transition = 'transform 0.3s ease';
                    
                    contactForm.style.position = 'relative';
                    contactForm.appendChild(successMessage);
                    
                    // Show message with animation
                    setTimeout(() => {
                        successMessage.style.transform = 'translateY(0)';
                        
                        // Hide message after delay
                        setTimeout(() => {
                            successMessage.style.transform = 'translateY(-100%)';
                            
                            // Remove element after animation
                            setTimeout(() => {
                                successMessage.remove();
                            }, 300);
                        }, 3000);
                    }, 10);
                }, 2000);
            }, 1500);
        });
    }
}

// Animate numbers in stats section with easing
document.addEventListener('DOMContentLoaded', function() {
    const counters = document.querySelectorAll('.counter');
    
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (rect.top <= window.innerHeight * 0.8);
    }
    
    function animateCounter() {
        counters.forEach(counter => {
            if (isInViewport(counter) && !counter.classList.contains('animated')) {
                counter.classList.add('animated');
                
                const target = parseInt(counter.textContent, 10);
                let count = 0;
                const duration = 2500; // 2.5 seconds for smoother counting
                let startTimestamp = null;
                
                function step(timestamp) {
                    if (!startTimestamp) startTimestamp = timestamp;
                    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                    
                    // Easing function for more natural counting
                    const easedProgress = easeOutExpo(progress);
                    count = Math.floor(target * easedProgress);
                    
                    counter.textContent = count;
                    
                    if (progress < 1) {
                        requestAnimationFrame(step);
                    } else {
                        counter.textContent = target; // Ensure final number is exact
                    }
                }
                
                requestAnimationFrame(step);
            }
        });
    }
    
    // Easing function for more natural counting animation
    function easeOutExpo(x) {
        return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    }
    
    // Run once on load
    setTimeout(animateCounter, 500);
    
    // Run on scroll with improved performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(animateCounter, 50);
    });
});

// Function to update navigation to include the services section
function updateNavigation() {
    // Add Services link to the navigation menu if it doesn't exist
    const menu = document.querySelector('.menu');
    if (menu) {
        // Check if we need to add the services menu item
        const servicesLink = Array.from(menu.querySelectorAll('a')).find(link => 
            link.getAttribute('href') === '#services');
        
        if (!servicesLink) {
            // Find the position before contact to insert services
            const contactLi = Array.from(menu.querySelectorAll('li')).find(li => 
                li.querySelector('a')?.getAttribute('href') === '#contact');
            
            if (contactLi) {
                // Create services menu item
                const servicesLi = document.createElement('li');
                const servicesA = document.createElement('a');
                servicesA.setAttribute('href', '#services');
                servicesA.textContent = 'Services';
                servicesLi.appendChild(servicesA);
                
                // Insert before contact
                menu.insertBefore(servicesLi, contactLi);
            }
        }
    }
}

// Responsive handling functions
window.addEventListener('resize', handleResponsive);
window.addEventListener('load', handleResponsive);

function handleResponsive() {
    // Disable certain animations on mobile for performance
    if (window.innerWidth <= 768) {
        // Reduce particle count
        if (typeof pJSDom !== 'undefined' && pJSDom.length > 0) {
            pJSDom[0].pJS.particles.number.value = 30;
            pJSDom[0].pJS.fn.particlesRefresh();
        }
        
        // Remove cursor follower on mobile
        const cursorFollower = document.querySelector('.cursor-follower');
        if (cursorFollower) {
            cursorFollower.remove();
        }
    }
    
    // Adjust project grid layout for better mobile viewing
    const projectsGrid = document.querySelector('.projects-grid');
    if (projectsGrid) {
        if (window.innerWidth <= 768) {
            projectsGrid.style.gridTemplateColumns = '1fr';
        } else {
            projectsGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(280px, 1fr))';
        }
    }
}

// Add page preloader for smooth initial load
function addPreloader() {
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-content">
            <div class="preloader-spinner"></div>
            <div class="preloader-text">Loading...</div>
        </div>
    `;
    preloader.style.position = 'fixed';
    preloader.style.top = '0';
    preloader.style.left = '0';
    preloader.style.width = '100%';
    preloader.style.height = '100%';
    preloader.style.backgroundColor = 'var(--background-dark)';
    preloader.style.display = 'flex';
    preloader.style.justifyContent = 'center';
    preloader.style.alignItems = 'center';
    preloader.style.zIndex = '9999';
    preloader.style.transition = 'opacity 0.5s ease, visibility 0.5s ease';
    
    const spinnerStyle = document.createElement('style');
    spinnerStyle.textContent = `
        .preloader-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid transparent;
            border-top-color: var(--accent-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        .preloader-text {
            margin-top: 20px;
            color: var(--text-color);
            font-size: 16px;
            letter-spacing: 2px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    
    document.head.appendChild(spinnerStyle);
    document.body.appendChild(preloader);
    
    // Hide preloader when page is loaded
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            
            // Remove preloader after transition
            setTimeout(() => {
                preloader.remove();
            }, 500);
        }, 500);
    });
}

// Initialize preloader
addPreloader();