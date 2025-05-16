// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Countdown Timer Functionality
    // Set countdown for 20 hours from page load
    const countdownHours = 20;
    const targetTime = new Date();
    targetTime.setHours(targetTime.getHours() + countdownHours);
    
    // Store previous second value to detect changes
    let previousSeconds = -1;
    
    // Update all timers on the page
    function updateTimers() {
        const now = new Date();
        const timeDiff = targetTime - now;
        
        if (timeDiff <= 0) {
            // Time has expired
            document.querySelectorAll('.hours').forEach(el => el.textContent = '00');
            document.querySelectorAll('.minutes').forEach(el => el.textContent = '00');
            document.querySelectorAll('.seconds').forEach(el => el.textContent = '00');
            
            // Also update CTA timer if it exists
            if (document.querySelector('.cta-hours')) {
                document.querySelector('.cta-hours').textContent = '00';
                document.querySelector('.cta-minutes').textContent = '00';
                document.querySelector('.cta-seconds').textContent = '00';
            }
            return;
        }
        
        // Calculate hours, minutes, seconds
        let hours = Math.floor(timeDiff / (1000 * 60 * 60));
        let minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        
        // Format with leading zeros
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        
        // Update all timer elements
        document.querySelectorAll('.hours').forEach(el => el.textContent = hours);
        document.querySelectorAll('.minutes').forEach(el => el.textContent = minutes);
        
        // Apply animation when seconds change
        document.querySelectorAll('.seconds').forEach(el => {
            // Only animate if seconds actually changed
            if (parseInt(seconds) !== previousSeconds) {
                el.classList.remove('digit-changed');
                // Trigger reflow
                void el.offsetWidth;
                el.classList.add('digit-changed');
                el.textContent = seconds;
            }
        });
        
        // Also update CTA timer if it exists
        if (document.querySelector('.cta-hours')) {
            document.querySelector('.cta-hours').textContent = hours;
            document.querySelector('.cta-minutes').textContent = minutes;
            
            const ctaSeconds = document.querySelector('.cta-seconds');
            if (ctaSeconds && parseInt(seconds) !== previousSeconds) {
                ctaSeconds.classList.remove('digit-changed');
                void ctaSeconds.offsetWidth;
                ctaSeconds.classList.add('digit-changed');
                ctaSeconds.textContent = seconds;
            }
        }
        
        // Store current seconds for next comparison
        previousSeconds = parseInt(seconds);
        
        // Add urgency when under certain thresholds
        if (hours === '00' && parseInt(minutes) <= 30) {
            document.querySelectorAll('.countdown-timer').forEach(el => {
                el.classList.add('urgent');
            });
            
            if (document.querySelector('.cta-countdown')) {
                document.querySelector('.cta-countdown').classList.add('urgent');
            }
            
            // Increase flashing frequency when very close to end
            if (parseInt(minutes) <= 5) {
                const banner = document.querySelector('.offer-countdown-banner');
                if (banner) {
                    banner.style.animation = 'flashBackground 3s infinite';
                }
            }
        }
    }
    
    // Update immediately and then every second
    updateTimers();
    setInterval(updateTimers, 1000);
    
    // Add urgency with flashing animation occasionally
    function addUrgencyFlash() {
        const banner = document.querySelector('.offer-countdown-banner');
        if (banner && !banner.style.animation) {
            banner.classList.add('flash-urgency');
            setTimeout(() => {
                banner.classList.remove('flash-urgency');
            }, 1000);
        }
        
        // Schedule next flash between 30-120 seconds
        const nextFlash = Math.floor(Math.random() * (120 - 30) + 30) * 1000;
        setTimeout(addUrgencyFlash, nextFlash);
    }
    
    // Start urgency flashing after 15 seconds
    setTimeout(addUrgencyFlash, 15000);
    
    // Make the countdown more prominent when scrolling
    window.addEventListener('scroll', function() {
        const banner = document.querySelector('.offer-countdown-banner');
        if (banner) {
            if (window.scrollY > 200) {
                banner.style.boxShadow = '0 5px 25px rgba(0, 0, 0, 0.4)';
            } else {
                banner.style.boxShadow = '0 3px 20px rgba(0, 0, 0, 0.3)';
            }
        }
    });
    
    // Initialize a random starting point in the countdown to make it look more realistic
    function setRandomStartTime() {
        // Randomly offset by a few minutes to look less scripted
        const randomMinutes = Math.floor(Math.random() * 17); // Random offset between 0-16 minutes
        const randomSeconds = Math.floor(Math.random() * 60); // Random seconds
        
        targetTime.setMinutes(targetTime.getMinutes() - randomMinutes);
        targetTime.setSeconds(targetTime.getSeconds() - randomSeconds);
        
        // Update the display immediately
        updateTimers();
    }
    
    // Initialize with a slight random offset for authenticity
    setRandomStartTime();
    
    // Add page loader animation
    const body = document.body;
    body.classList.add('loaded');
    
    // Create and append loader element
    const loaderStyle = document.createElement('style');
    loaderStyle.innerHTML = `
        body {
            visibility: hidden;
            opacity: 0;
            transition: opacity 0.8s ease;
        }
        body.loaded {
            visibility: visible;
            opacity: 1;
        }
        
        /* Remove section-reveal clip-path since it's causing visibility issues */
        .section-animation {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 1s ease, transform 1s ease;
        }
        .section-animation.revealed {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Ensure hero section has no animations */
        .hero-content, .hero-image {
            animation: none !important;
            transform: none !important;
        }
    `;
    document.head.appendChild(loaderStyle);
    
    // Mobile menu toggle with advanced animation
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('show');
            
            // Toggle between bars and X icon with animation
            const icon = mobileMenuBtn.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                icon.style.transform = 'rotate(90deg)';
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                icon.style.transform = 'rotate(0deg)';
            }
        });
    }
    
    // Reveal animations when scrolling - using opacity instead of clip-path
    const revealElements = document.querySelectorAll('.features, .courses, .testimonials, .about');
    revealElements.forEach(element => {
        element.classList.add('section-animation');
    });
    
    // Scroll animations for elements
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    revealElements.forEach(element => {
        scrollObserver.observe(element);
    });
    
    // Make sure all sections are visible after 1 second, even if animations failed
    setTimeout(() => {
        document.querySelectorAll('.section-animation').forEach(section => {
            section.classList.add('revealed');
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        });
    }, 1000);
    
    // Smooth scrolling for anchor links with advanced easing
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (navLinks.classList.contains('show')) {
                    navLinks.classList.remove('show');
                    const icon = mobileMenuBtn.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                    icon.style.transform = 'rotate(0deg)';
                }
                
                // Add highlight effect to target section
                const highlightStyle = document.createElement('style');
                const uniqueId = 'highlight-' + Date.now();
                highlightStyle.id = uniqueId;
                highlightStyle.innerHTML = `
                    @keyframes highlightSection {
                        0% { box-shadow: 0 0 0 0 rgba(0, 85, 255, 0); }
                        50% { box-shadow: 0 0 30px 15px rgba(0, 85, 255, 0.2); }
                        100% { box-shadow: 0 0 0 0 rgba(0, 85, 255, 0); }
                    }
                    #${targetId.substring(1)} {
                        animation: highlightSection 1.5s ease-out;
                    }
                `;
                document.head.appendChild(highlightStyle);
                
                // Scroll to target with cubic-bezier easing
                const startPosition = window.pageYOffset;
                const targetPosition = targetElement.getBoundingClientRect().top + startPosition - 80;
                const distance = targetPosition - startPosition;
                const duration = 1000; // ms
                let start = null;
                
                function step(timestamp) {
                    if (!start) start = timestamp;
                    const progress = timestamp - start;
                    const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
                    const percentage = Math.min(progress / duration, 1);
                    const easing = easeInOutCubic(percentage);
                    
                    window.scrollTo(0, startPosition + distance * easing);
                    
                    if (progress < duration) {
                        window.requestAnimationFrame(step);
                    } else {
                        // Remove highlight style after animation completes
                        setTimeout(() => {
                            const styleToRemove = document.getElementById(uniqueId);
                            if (styleToRemove) styleToRemove.remove();
                        }, 1500);
                    }
                }
                
                window.requestAnimationFrame(step);
            }
        });
    });
    
    // Add active class to nav links based on scroll position with improved accuracy
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section, header');
        const navLinks = document.querySelectorAll('.nav-links a');
        const scrollPosition = window.pageYOffset + 300;
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight && sectionId) {
                currentSection = sectionId;
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href').substring(1);
            if (linkHref === currentSection || (currentSection === '' && linkHref === '')) {
                link.classList.add('active');
            }
        });
        
        // Remove parallax effect for hero section
        const header = document.querySelector('header');
        if (header) {
            const headerContent = header.querySelector('.hero-content');
            const headerImage = header.querySelector('.hero-image');
            
            if (headerContent && headerImage) {
                headerContent.style.transform = 'none';
                headerImage.style.transform = 'none';
            }
        }
    });
    
    // Advanced animation for feature cards with staggered timing
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, index * 150); // Staggered animation delay
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Animated counters for stats or numbers in feature cards
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16); // 60fps approx
        
        function updateCounter() {
            start += increment;
            element.textContent = Math.floor(start);
            
            if (start < target) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        
        updateCounter();
    }
    
    // Apply different animations to different types of cards
    document.querySelectorAll('.feature-card').forEach((card, index) => {
        card.classList.add('pre-animation');
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
    
    document.querySelectorAll('.course-card').forEach((card, index) => {
        card.classList.add('pre-animation');
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
    
    document.querySelectorAll('.testimonial-card').forEach((card, index) => {
        card.classList.add('pre-animation');
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Make sure all cards are visible after 2 seconds, even if animations failed
    setTimeout(() => {
        document.querySelectorAll('.pre-animation').forEach(card => {
            card.classList.add('animate');
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
    }, 2000);
    
    // Remove floating animation from hero elements
    const floatingElements = document.querySelectorAll('.about-image');
    floatingElements.forEach(element => {
        element.style.animation = 'float 4s ease-in-out infinite';
    });
    
    // Explicitly remove animation from hero image
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        heroImage.style.animation = 'none';
        heroImage.style.transform = 'none';
    }
    
    // Add animation styles
    const style = document.createElement('style');
    style.innerHTML = `
        .pre-animation {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s cubic-bezier(0.5, 0, 0, 1), 
                        transform 0.8s cubic-bezier(0.5, 0, 0, 1);
        }
        
        .animate {
            opacity: 1;
            transform: translateY(0);
        }
        
        .feature-card:nth-child(odd) {
            transform: translateY(30px) rotate(-1deg);
        }
        
        .feature-card:nth-child(even) {
            transform: translateY(30px) rotate(1deg);
        }
        
        .feature-card.animate:nth-child(odd) {
            transform: translateY(0) rotate(0);
        }
        
        .feature-card.animate:nth-child(even) {
            transform: translateY(0) rotate(0);
        }
        
        .course-card {
            transform: translateY(30px) scale(0.95);
        }
        
        .course-card.animate {
            transform: translateY(0) scale(1);
        }
        
        .testimonial-card:nth-child(odd) {
            transform: translateX(-30px);
        }
        
        .testimonial-card:nth-child(even) {
            transform: translateX(30px);
        }
        
        .testimonial-card.animate:nth-child(odd),
        .testimonial-card.animate:nth-child(even) {
            transform: translateX(0);
        }
    `;
    document.head.appendChild(style);
    
    // Advanced button effects
    document.querySelectorAll('.course-button, .cta-button, .about-button').forEach(button => {
        // Mouse enter/leave effects
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 15px 25px rgba(0, 0, 0, 0.2)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
        
        // Click effect with improved ripple
        button.addEventListener('click', function(e) {
            // Prevent default for demo purposes
            e.preventDefault();
            
            // Add ripple effect with advanced animation
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            
            this.appendChild(ripple);
            
            // Get button dimensions and click position
            const rect = this.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
            
            // Set ripple size based on button's largest dimension
            const size = Math.max(rect.width, rect.height) * 2.5;
            
            // Position ripple at click point
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${clickX - size/2}px`;
            ripple.style.top = `${clickY - size/2}px`;
            
            // Add button press animation
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-5px)';
            }, 150);
            
            // Remove ripple after animation completes
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Here you would normally handle navigation to course details
            console.log('Navigating to details for:', this.closest('.course-card')?.querySelector('h3')?.textContent || 'Course');
        });
    });
    
    // Add improved ripple style
    const rippleStyle = document.createElement('style');
    rippleStyle.innerHTML = `
        .ripple-effect {
            position: absolute;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
        }
        
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        .course-button, .cta-button, .about-button {
            position: relative;
            overflow: hidden;
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                        box-shadow 0.3s ease;
        }
    `;
    document.head.appendChild(rippleStyle);
    
    // Animated cursor effect following mouse
    const cursorEffect = document.createElement('div');
    cursorEffect.className = 'cursor-effect';
    document.body.appendChild(cursorEffect);
    
    const cursorStyle = document.createElement('style');
    cursorStyle.innerHTML = `
        .cursor-effect {
            position: fixed;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: radial-gradient(rgba(0, 85, 255, 0.5), rgba(0, 85, 255, 0));
            pointer-events: none;
            transform: translate(-50%, -50%);
            z-index: 9999;
            mix-blend-mode: difference;
            transition: transform 0.1s ease, width 0.2s ease, height 0.2s ease;
        }
    `;
    document.head.appendChild(cursorStyle);
    
    document.addEventListener('mousemove', e => {
        cursorEffect.style.left = `${e.clientX}px`;
        cursorEffect.style.top = `${e.clientY}px`;
    });
    
    document.addEventListener('mousedown', () => {
        cursorEffect.style.transform = 'translate(-50%, -50%) scale(0.8)';
    });
    
    document.addEventListener('mouseup', () => {
        cursorEffect.style.transform = 'translate(-50%, -50%) scale(1)';
    });
    
    // Advanced hover effects for interactive elements
    document.querySelectorAll('a, button').forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursorEffect.style.width = '50px';
            cursorEffect.style.height = '50px';
        });
        
        element.addEventListener('mouseleave', () => {
            cursorEffect.style.width = '30px';
            cursorEffect.style.height = '30px';
        });
    });
});