/**
 * 2D Robot Guide Animation for Portfolio Website
 * Using GSAP for animations with optimized performance
 */

// Global variables
let speechBubble, speechText, container;
let activeSection = null;
let isScrollingUp = false;
let lastScrollY = window.scrollY;
let isFloating = true; // Flag to control random floating behavior
let mouseX = 0, mouseY = 0; // Track mouse position
let isFollowingMouse = true; // Flag to control mouse following behavior
let isMobileDevice = false; // Flag to identify mobile devices
let isAnimationFrameActive = false; // Flag to avoid redundant animation frames
let lastPositionUpdate = 0; // Timestamp for position throttling

// Messages for each section - in first person as Viraj
const sectionMessages = {
    'home': {
        down: "Hi there! I'm Viraj. Welcome to my portfolio! Feel free to scroll down and explore my work.",
        up: "Welcome back to the top! I'm Viraj, a passionate backend developer ready to help with your projects."
    },
    'about': {
        down: "Let me tell you a bit about myself. I'm passionate about backend development and building scalable applications!",
        up: "That's a bit about my background. I combine technical skills with creative problem-solving."
    },
    'skills': {
        down: "These are my core technical skills. I'm particularly strong in backend development with Node.js and Express!",
        up: "My diverse skill set allows me to handle both frontend and backend challenges effectively."
    },
    'projects': {
        down: "Check out some of my favorite projects! Each one demonstrates my problem-solving approach and technical skills.",
        up: "My projects showcase my ability to build complete, functional applications from concept to deployment."
    },
    'services': {
        down: "Here are the development services I offer. I'd be happy to discuss how I can help with your specific needs!",
        up: "I provide custom solutions tailored to your project requirements. Let's work together!"
    },
    'contact': {
        down: "Feel free to reach out! I'm always interested in discussing new projects and opportunities.",
        up: "Have a project in mind? I'd love to hear about it and see how I can help bring it to life!"
    },
    'footer': {
        down: "Thanks for visiting my portfolio! I hope you enjoyed seeing my work and I look forward to connecting.",
        up: "Thanks for exploring my portfolio! Feel free to reach out if you'd like to collaborate on a project."
    }
};

// Initialize the robot guide after the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure all page elements are properly rendered
    setTimeout(() => {
        initRobotGuide();
        
        // Detect if we're on a mobile device
        detectMobileDevice();
        
        // Set behavior based on device type
        if (isMobileDevice) {
            // For mobile devices - enable random floating
            isFollowingMouse = false;
            isFloating = true;
            startRandomFloating();
        } else {
            // For desktop - enable mouse following
            isFollowingMouse = true;
            isFloating = false;
            initMouseTracking();
        }
        
        // Start the continuous animations
        animateRobot();
    }, 300);
});

// Detect if the user is on a mobile/touch device
function detectMobileDevice() {
    isMobileDevice = (window.innerWidth <= 768) || 
                    ('ontouchstart' in window) || 
                    (navigator.maxTouchPoints > 0) || 
                    (navigator.msMaxTouchPoints > 0);
}

// Handle window resize events to update device detection
function handleWindowResize() {
    const wasMobile = isMobileDevice;
    detectMobileDevice();
    
    // If device type changed
    if (wasMobile !== isMobileDevice) {
        if (isMobileDevice) {
            isFollowingMouse = false;
            isFloating = true;
            startRandomFloating();
        } else {
            isFollowingMouse = true;
            isFloating = false;
            initMouseTracking();
        }
    }
    
    // Always ensure robot is in bounds when window resizes
    ensureRobotInBounds();
}

// Main initialization function
function initRobotGuide() {
    // Get elements
    container = document.getElementById('robot-guide-container');
    
    if (!container) {
        console.error('Robot guide container not found in the DOM');
        return;
    }

    // Create HTML/CSS robot and speech bubble
    createHtmlRobot();
    
    // Add responsive styles
    addResponsiveStyles();
    
    // Add style overrides to ensure proper visibility
    addStyleOverrides();
    
    // Now retrieve the created speech bubble elements
    speechBubble = document.getElementById('robot-speech-bubble');
    speechText = document.getElementById('robot-speech-text');
    
    // Initialize the robot's speech bubble
    initSpeechBubble();
    
    // Ensure the robot is within bounds when window resizes
    window.addEventListener('resize', handleWindowResize, { passive: true });
    
    // Set initial position - now in top right area
    const initialPos = {
        x: window.innerWidth - 180, 
        y: 120
    };
    
    // Use GSAP to set initial position - more efficient than direct DOM manipulation
    gsap.set(container, { 
        left: initialPos.x,
        top: initialPos.y,
        opacity: 0
    });
    
    // Fade in the robot after initial positioning
    gsap.to(container, {
        opacity: 1,
        duration: 0.5,
        ease: "power2.inOut"
    });
}

// Initialize tracking of mouse movements
function initMouseTracking() {
    // Set up mouse move event listener with throttling
    document.addEventListener('mousemove', throttle((e) => {
        // Update mouse position
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // If we're following the mouse, update the robot's position
        if (isFollowingMouse && !isMobileDevice && !isAnimationFrameActive) {
            requestAnimationFrame(followMouse);
            isAnimationFrameActive = true;
        }
    }, 16), { passive: true }); // ~60fps throttling
}

// Throttle function to limit event frequency
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Make robot follow the mouse cursor with smooth animation
function followMouse() {
    if (!container || !isFollowingMouse || isMobileDevice) {
        isAnimationFrameActive = false;
        return;
    }
    
    // Only update position every ~10ms (faster than before)
    const now = performance.now();
    if (now - lastPositionUpdate < 10) {
        requestAnimationFrame(followMouse);
        return;
    }
    lastPositionUpdate = now;
    
    // Calculate target position with some offset to make the robot follow slightly behind the cursor
    const targetX = mouseX - container.offsetWidth / 2;
    const targetY = mouseY - container.offsetHeight / 2;
    
    // Create a smoother follower effect with lag
    const currentPos = {
        x: parseFloat(gsap.getProperty(container, "left")) || 0,
        y: parseFloat(gsap.getProperty(container, "top")) || 0
    };
    
    // Calculate distance to move
    const distX = targetX - currentPos.x;
    const distY = targetY - currentPos.y;
    
    // Apply easing (lower divisor = faster movement)
    const easing = 4; // Reduced from 8 for faster movement
    const newX = currentPos.x + distX / easing;
    const newY = currentPos.y + distY / easing;
    
    // Update position with GSAP for better performance - faster duration
    gsap.to(container, {
        left: newX,
        top: newY,
        duration: 0.1, // Reduced from 0.2
        ease: "power1.out", // Changed from power2.out for snappier movement
        overwrite: "auto", // Important to prevent animation queue buildup
        onComplete: () => {
            // Make sure the robot stays within viewport bounds
            ensureRobotInBounds();
            
            // Continue following the mouse if enabled
            isAnimationFrameActive = false;
            if (isFollowingMouse) {
                requestAnimationFrame(followMouse);
                isAnimationFrameActive = true;
            }
        }
    });
    
    // Add slight rotation based on movement direction - limited to improve performance
    if (Math.abs(distX) > 5) { // Only apply rotation on significant movement
        const rotationAmount = distX * 0.01; // Reduced multiplier for subtler effect
        gsap.to('.robot-unit', {
            rotation: Math.min(Math.max(rotationAmount, -3), 3), // Limit rotation to -3 to 3 degrees
            duration: 0.3, // Reduced from 0.5
            overwrite: "auto"
        });
    }
    
    // Animate robot arms based on vertical movement - limited to improve performance
    if (Math.abs(distY) > 10) { // Only animate arms on significant vertical movement
        const leftArm = document.querySelector('.left-arm');
        const rightArm = document.querySelector('.right-arm');
        
        if (leftArm && rightArm) {
            // Adjust arms based on vertical movement - simplified for performance
            const armAngle = distY * 0.03; // Reduced multiplier for subtler effect
            gsap.to([leftArm, rightArm], {
                rotation: (i) => i === 0 ? -10 + armAngle : 10 - armAngle, // Use single animation for both arms
                duration: 0.3, // Reduced from 0.5
                overwrite: "auto"
            });
        }
    }
}

// Toggle between following mouse and random floating
function toggleFollowingMode() {
    // Only allow toggling on desktop devices
    if (isMobileDevice) return;
    
    isFollowingMouse = !isFollowingMouse;
    isFloating = !isFollowingMouse;
    
    if (isFollowingMouse) {
        // If we're switching to follow mode, start following
        requestAnimationFrame(followMouse);
        isAnimationFrameActive = true;
    } else if (isFloating) {
        // If we're switching to floating mode, start random floating
        startRandomFloating();
    }
}

// Create HTML/CSS based robot - optimized for better performance
function createHtmlRobot() {
    // Clear any existing content
    container.innerHTML = '';

    // Create robot structure without speech bubble
    container.innerHTML = `
        <div class="robot-unit">
            <div class="energy-trail"></div>
            <div class="robot-body">
                <!-- Head with visor -->
                <div class="robot-head">
                    <div class="visor"></div>
                    <div class="eyes">
                        <div class="eye left-eye"></div>
                        <div class="eye right-eye"></div>
                    </div>
                    <div class="contour-lines">
                        <div class="contour-line"></div>
                        <div class="contour-line"></div>
                    </div>
                </div>
                
                <!-- Neck and Shoulders -->
                <div class="robot-neck"></div>
                <div class="robot-shoulders">
                    <div class="shoulder left-shoulder"></div>
                    <div class="shoulder right-shoulder"></div>
                </div>
                
                <!-- Torso with glowing core -->
                <div class="robot-torso">
                    <div class="chest-plate"></div>
                    <div class="core"></div>
                    <div class="side-detail left-detail"></div>
                    <div class="side-detail right-detail"></div>
                </div>
                
                <!-- Arms with glowing strips -->
                <div class="robot-arm left-arm">
                    <div class="upper-arm"></div>
                    <div class="elbow"></div>
                    <div class="forearm"></div>
                    <div class="hand">
                        <div class="finger"></div>
                        <div class="finger"></div>
                        <div class="finger"></div>
                    </div>
                </div>
                
                <div class="robot-arm right-arm">
                    <div class="upper-arm"></div>
                    <div class="elbow"></div>
                    <div class="forearm"></div>
                    <div class="hand">
                        <div class="finger"></div>
                        <div class="finger"></div>
                        <div class="finger"></div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Speech bubble is now included in the HTML -->
        <div id="robot-speech-bubble">
            <span id="robot-speech-text">Welcome to my portfolio!</span>
        </div>
    `;

    // Add CSS for the robot with futuristic AI design - optimized with will-change properties
    const robotStyle = document.createElement('style');
    robotStyle.textContent = `
        #robot-guide-container {
            position: fixed;
            width: 100px; /* Reduced from 140px */
            height: 100px; /* Reduced from 140px */
            top: 80px;   /* Position from top instead of bottom */
            right: 30px;
            z-index: 20;
            pointer-events: none;
            will-change: transform, left, top;
            transform: translateZ(0);
        }
        
        /* Main robot unit */
        .robot-unit {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            transform: translateZ(0);
            will-change: transform;
        }
        
        /* Energy trail / hover effect - now flowing upward */
        .energy-trail {
            position: absolute;
            top: -25px;  /* Changed from -35px */
            left: 50%;
            transform: translateX(-50%) rotate(180deg) translateZ(0);
            width: 65px; /* Reduced from 90px */
            height: 120px; /* Reduced from 160px */
            background: linear-gradient(to top, rgba(96, 165, 250, 0), rgba(96, 165, 250, 0.95));
            filter: blur(20px);
            border-radius: 50%;
            opacity: 0.95;
            z-index: -1;
        }
        
        /* Main robot body */
        .robot-body {
            position: relative;
            width: 80%; /* Reduced proportionally */
            height: 85px; /* Reduced from 110px */
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 20px; /* Reduced from 30px */
            margin-bottom: 0;
            transform: translateZ(0);
        }
        
        /* Head with visor */
        .robot-head {
            width: 45px; /* Reduced from 60px */
            height: 55px; /* Reduced from 70px */
            background-color: white;
            border-radius: 24px;
            position: relative;
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
            overflow: hidden;
            z-index: 2;
            transform: translateZ(0);
        }
        
        .visor {
            position: absolute;
            width: 100%;
            height: 50%;
            bottom: 0;
            background-color: black;
            border-radius: 0 0 24px 24px;
            overflow: hidden;
        }
        
        .eyes {
            position: absolute;
            width: 100%;
            display: flex;
            justify-content: space-around;
            bottom: 12px;
        }
        
        .eye {
            width: 10px; /* Reduced from 14px */
            height: 10px; /* Reduced from 14px */
            background-color: #60a5fa;
            border-radius: 50%;
            box-shadow: 0 0 8px rgba(96, 165, 250, 0.8), 
                        0 0 16px rgba(96, 165, 250, 0.4);
        }
        
        .contour-lines {
            position: absolute;
            width: 100%;
            height: 100%;
            pointer-events: none;
        }
        
        .contour-line {
            position: absolute;
            width: 60%;
            height: 1px;
            background-color: rgba(200, 200, 200, 0.6);
            left: 20%;
        }
        
        .contour-line:nth-child(1) {
            top: 15px;
        }
        
        .contour-line:nth-child(2) {
            top: 25px;
        }
        
        /* Neck and shoulders */
        .robot-neck {
            width: 15px; /* Reduced from 20px */
            height: 4px; /* Reduced from 5px */
            background-color: #e0e0e0;
            margin-top: -2px;
            z-index: 1;
            border-radius: 4px;
        }
        
        .robot-shoulders {
            display: flex;
            justify-content: space-between;
            width: 70px; /* Reduced from 90px */
            margin-top: -1px;
        }
        
        .shoulder {
            width: 22px; /* Reduced from 30px */
            height: 15px; /* Reduced from 20px */
            background-color: white;
            position: relative;
            border-radius: 8px 8px 0 0;
        }
        
        .shoulder::after {
            content: '';
            position: absolute;
            bottom: 2px;
            left: 5%;
            width: 90%;
            height: 2px; /* Reduced from 3px */
            background-color: #60a5fa;
            border-radius: 2px;
            box-shadow: 0 0 6px rgba(96, 165, 250, 0.7);
        }
        
        /* Torso with glowing core */
        .robot-torso {
            width: 60px; /* Reduced from 80px */
            height: 45px; /* Reduced from 60px */
            background-color: transparent;
            position: relative;
            margin-top: -3px;
            z-index: 1;
        }
        
        .chest-plate {
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: white;
            border-radius: 8px 8px 20px 20px; /* Reduced from 10px 10px 25px 25px */
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        
        .core {
            position: absolute;
            width: 18px; /* Reduced from 25px */
            height: 18px; /* Reduced from 25px */
            background: radial-gradient(circle, #60a5fa 30%, #3b82f6 70%);
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            box-shadow: 0 0 15px rgba(96, 165, 250, 0.8), 
                       inset 0 0 8px rgba(255, 255, 255, 0.9);
        }
        
        .side-detail {
            position: absolute;
            width: 7px; /* Reduced from 10px */
            height: 22px; /* Reduced from 30px */
            background-color: #e0e0e0;
            top: 12px;
            border-radius: 4px;
        }
        
        .left-detail {
            left: 4px;
        }
        
        .right-detail {
            right: 4px;
        }
        
        /* Arms with glowing strips - simplified for better performance */
        .robot-arm {
            position: absolute;
            width: 45px; /* Reduced from 60px */
            height: 60px; /* Reduced from 80px */
            top: 35px; /* Reduced from 45px */
            z-index: 0;
            transform: translateZ(0);
        }
        
        .left-arm {
            left: -30px; /* Reduced from -40px */
            transform-origin: top right;
            z-index: 1; /* Ensure arms appear in front */
        }
        
        .right-arm {
            right: -30px; /* Reduced from -40px */
            transform-origin: top left;
            z-index: 1; /* Ensure arms appear in front */
        }
        
        .upper-arm {
            position: absolute;
            width: 12px; /* Reduced from 15px */
            height: 28px; /* Reduced from 35px */
            background-color: white;
            border-radius: 6px;
            top: 0;
        }
        
        .left-arm .upper-arm {
            right: 8px;
        }
        
        .right-arm .upper-arm {
            left: 8px;
        }
        
        .upper-arm::after {
            content: '';
            position: absolute;
            width: 60%;
            height: 2px;
            background-color: #60a5fa;
            top: 50%;
            left: 20%;
            border-radius: 2px;
            box-shadow: 0 0 5px rgba(96, 165, 250, 0.7);
        }
        
        .elbow {
            position: absolute;
            width: 9px; /* Reduced from 12px */
            height: 9px; /* Reduced from 12px */
            background-color: black;
            border-radius: 5px;
            top: 25px; /* Reduced from 32px */
        }
        
        .left-arm .elbow {
            right: 8px; /* Reduced from 11px */
        }
        
        .right-arm .elbow {
            left: 8px; /* Reduced from 11px */
        }
        
        .forearm {
            position: absolute;
            width: 10px; /* Reduced from 14px */
            height: 22px; /* Reduced from 30px */
            background-color: white;
            border-radius: 5px;
            top: 31px; /* Reduced from 40px */
        }
        
        .left-arm .forearm {
            right: 8px;
        }
        
        .right-arm .forearm {
            left: 8px;
        }
        
        .forearm::after {
            content: '';
            position: absolute;
            width: 60%;
            height: 2px;
            background-color: #60a5fa;
            top: 50%;
            left: 20%;
            border-radius: 2px;
            box-shadow: 0 0 5px rgba(96, 165, 250, 0.7);
        }
        
        .hand {
            position: absolute;
            width: 14px; /* Reduced from 18px */
            height: 14px; /* Reduced from 18px */
            background-color: white;
            border-radius: 50%;
            top: 50px; /* Reduced from 67px */
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 2px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        
        .left-arm .hand {
            right: 7px;
        }
        
        .right-arm .hand {
            left: 7px;
        }
        
        /* Individual finger styling for more natural hand appearance - reduced count for better performance */
        .finger {
            width: 1.8px; /* Reduced from 2.2px */
            height: 6px; /* Reduced from 8px */
            background-color: #f0f0f0;
            border-radius: 1px;
            position: relative;
            margin: 0 1px;
            /* Create a fan-like arrangement for fingers */
            transform-origin: bottom center;
            box-shadow: 0 0 2px rgba(255, 255, 255, 0.8);
        }
        
        .finger::after {
            content: '';
            position: absolute;
            width: 100%;
            height: 30%;
            bottom: 0;
            background-color: rgba(96, 165, 250, 0.7);
            border-radius: 1px;
            box-shadow: 0 0 3px rgba(96, 165, 250, 0.7);
        }
    `;
    document.head.appendChild(robotStyle);
}

// Override any existing styles from style.css that might affect our robot
function addStyleOverrides() {
    const overrideStyles = document.createElement('style');
    overrideStyles.textContent = `
        /* Force specific styles for robot guide to ensure visibility */
        #robot-guide-container {
            pointer-events: none !important;
            z-index: 9999 !important;
            visibility: visible !important;
            opacity: 1 !important;
            transition: left 0.3s, top 0.3s !important;
        }
        
        #robot-speech-bubble {
            display: block !important;
            opacity: 0 !important;
            visibility: hidden !important;
            z-index: 10000 !important;
            pointer-events: none !important;
        }
        
        .robot-unit {
            filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.2));
            will-change: transform;
        }
        
        /* Make sure our glowing elements have proper z-index */
        .eye, .core, .side-detail, .robot-arm, .hand, .finger {
            z-index: 5;
        }
    `;
    document.head.appendChild(overrideStyles);
}

// Add responsive styles for different screen sizes
function addResponsiveStyles() {
    const responsiveStyles = document.createElement('style');
    responsiveStyles.textContent = `
        @media (max-width: 768px) {
            #robot-guide-container {
                width: 100px;
                height: 100px;
                top: auto;
                bottom: 20px;
                right: 20px;
            }
            
            .robot-body {
                transform: scale(0.75);
            }
            
            .energy-trail {
                height: 120px;
                width: 70px;
            }
        }
        
        @media (max-width: 480px) {
            #robot-guide-container {
                width: 80px;
                height: 80px;
                bottom: 10px;
                right: 10px;
            }
            
            .robot-body {
                transform: scale(0.6);
            }
            
            .energy-trail {
                height: 100px;
                width: 60px;
            }
        }
    `;
    document.head.appendChild(responsiveStyles);
}

// Initialize speech bubble for the robot - now disabled
function initSpeechBubble() {
    // Hide speech bubble completely
    speechBubble = document.getElementById('robot-speech-bubble');
    if (speechBubble) {
        speechBubble.style.display = 'none';
        speechBubble.style.visibility = 'hidden';
        speechBubble.style.opacity = '0';
    }
}

// Update speech bubble text - now disabled
function updateSpeechBubble(text) {
    // All speech bubble functionality is disabled - no need to update text
    return;
}

// Animation without speech
function animateRobotSpeaking() {
    // Now just animates the robot without speech
    const eyes = document.querySelectorAll('.eye');
    const energyTrail = document.querySelector('.energy-trail');
    const core = document.querySelector('.core');
    
    // Basic eye animation
    if (eyes.length) {
        gsap.to(eyes, {
            scale: 1.15,
            boxShadow: "0 0 15px #60a5fa, 0 0 30px rgba(96, 165, 250, 0.8)",
            duration: 0.25,
            repeat: 2,
            yoyo: true
        });
    }
    
    // Core pulses brighter
    if (core) {
        gsap.to(core, {
            scale: 1.1,
            boxShadow: "0 0 20px rgba(96, 165, 250, 0.9)",
            duration: 0.3,
            repeat: 2,
            yoyo: true
        });
    }
    
    // Energy trail intensifies
    if (energyTrail) {
        gsap.to(energyTrail, {
            height: "+=15",
            opacity: 0.9,
            filter: "blur(12px)",
            duration: 0.5,
            repeat: 1,
            yoyo: true
        });
    }
}

// Continuously animate the robot for idle state - optimized for performance
function animateRobot() {
    const robotUnit = document.querySelector('.robot-unit');
    const robotHead = document.querySelector('.robot-head');
    const energyTrail = document.querySelector('.energy-trail');
    const eyes = document.querySelectorAll('.eye');
    const core = document.querySelector('.core');
    const leftArm = document.querySelector('.left-arm');
    const rightArm = document.querySelector('.right-arm');
    
    // Clear any existing animations to prevent stacking
    gsap.killTweensOf([robotUnit, robotHead, energyTrail, eyes, core, leftArm, rightArm]);
    
    // Consolidated animation with fewer tweens
    const mainTimeline = gsap.timeline({repeat: -1, yoyo: true});
    
    // Main floating animation - simpler to improve performance
    mainTimeline.to(robotUnit, {
        y: -8,
        x: 3,
        rotation: 1.5,
        duration: 2, // Reduced from 3
        ease: "sine.inOut"
    });
    
    // Energy trail - simplified animation
    gsap.to(energyTrail, {
        opacity: 0.8,
        height: 120, // Reduced from 160
        filter: "blur(20px)",
        duration: 1.8, // Reduced from 2.5
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
    
    // Eye glow - reduced complexity
    gsap.to(eyes, {
        boxShadow: "0 0 15px rgba(96, 165, 250, 0.8)",
        backgroundColor: "#60a5fa",
        duration: 1.5, // Reduced from 2
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
    
    // Core pulse - simplified animation
    gsap.to(core, {
        boxShadow: "0 0 20px rgba(96, 165, 250, 0.8)",
        scale: 1.1,
        duration: 1.5, // Reduced from 2
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
    
    // Simplified arm movements - faster
    gsap.to(leftArm, {
        rotation: -15,
        duration: 2, // Reduced from 3
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut" 
    });
    
    gsap.to(rightArm, {
        rotation: 15,
        duration: 2, // Reduced from 3
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.3 // Reduced from 0.5
    });
    
    // Reduce finger animations to just a single tween - faster
    const fingers = document.querySelectorAll('.finger');
    if (fingers.length) {
        // Group fingers by hand to reduce number of tweens
        const leftFingers = document.querySelectorAll('.left-arm .finger');
        const rightFingers = document.querySelectorAll('.right-arm .finger');
        
        // Simple open/close animation for fingers
        gsap.to(leftFingers, {
            height: 7,
            duration: 1.8, // Reduced from 2.5
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
        
        gsap.to(rightFingers, {
            height: 7,
            duration: 1.8, // Reduced from 2.5
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 0.5 // Reduced from 1
        });
    }
}

// Start random floating across the screen - now only used if mouse following is disabled
function startRandomFloating() {
    // Only start if random floating is enabled and mouse following is disabled
    if (!isFloating || (isFollowingMouse && !isMobileDevice)) return;
    
    // Get a position that avoids content
    const moveTo = getRandomScreenPosition();
    
    // Use simplified animation with fewer properties
    const timeline = gsap.timeline({
        onComplete: () => {
            // Continue random movement if still in floating mode
            if (isFloating && !isFollowingMouse) {
                // Longer delay to reduce CPU usage
                setTimeout(() => {
                    startRandomFloating();
                }, Math.random() * 500 + 200);
            }
        }
    });
    
    // Simplified rotation value
    const rotationValue = Math.random() > 0.5 ? 2 : -2;
    
    // Simplified movement with direct path and no motionPath
    timeline.to(container, {
        left: moveTo.x,
        top: moveTo.y,
        rotation: rotationValue,
        duration: 2, // Fixed duration for better performance
        ease: "power2.inOut",
        overwrite: true // Important: prevents animation conflicts
    });
}

// Stop random floating (when pointing to specific sections)
function stopRandomFloating() {
    isFloating = false;
    gsap.killTweensOf(container);
}

// Resume random floating
function resumeRandomFloating() {
    isFloating = true;
    startRandomFloating();
}

// Get a random position on screen (favoring the top portion and edges for better visibility)
function getRandomScreenPosition() {
    // Smaller margin to keep away from edges
    const margin = isMobileDevice ? 20 : 50;
    
    // Get current window dimensions minus margins
    const maxX = window.innerWidth - container.offsetWidth - margin;
    const maxY = window.innerHeight - container.offsetHeight - margin;
    
    // Calculate random position, favoring top and sides of screen
    // for better visibility and to avoid covering content
    
    // X position - favor edges
    let xPos;
    const xDistribution = Math.random();
    if (xDistribution < 0.4) {
        // Left edge
        xPos = Math.random() * (maxX * 0.25) + margin;
    } else if (xDistribution < 0.8) {
        // Right edge
        xPos = maxX - Math.random() * (maxX * 0.25);
    } else {
        // Middle (less likely)
        xPos = Math.random() * (maxX * 0.5) + maxX * 0.25;
    }
    
    // Y position - favor top half of screen
    let yPos;
    const yDistribution = Math.random();
    if (yDistribution < 0.6) {
        // Top third
        yPos = Math.random() * (maxY * 0.33) + margin;
    } else if (yDistribution < 0.9) {
        // Middle third
        yPos = Math.random() * (maxY * 0.33) + (maxY * 0.33);
    } else {
        // Bottom third (rare)
        yPos = Math.random() * (maxY * 0.33) + (maxY * 0.66);
    }
    
    return { x: xPos, y: yPos };
}

// Keep the robot within the viewport bounds - optimized with simplified calculations
function ensureRobotInBounds() {
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const padding = 10;
    
    // Check if outside viewport and adjust if needed
    if (rect.right > window.innerWidth - padding) {
        gsap.to(container, {
            left: window.innerWidth - rect.width - padding,
            duration: 0.5,
            ease: "power2.out"
        });
    }
    
    if (rect.bottom > window.innerHeight - padding) {
        gsap.to(container, {
            top: window.innerHeight - rect.height - padding,
            duration: 0.5,
            ease: "power2.out"
        });
    }
    
    if (rect.left < padding) {
        gsap.to(container, {
            left: padding,
            duration: 0.5,
            ease: "power2.out"
        });
    }
    
    if (rect.top < padding) {
        gsap.to(container, {
            top: padding,
            duration: 0.5,
            ease: "power2.out"
        });
    }
}