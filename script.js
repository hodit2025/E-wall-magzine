// Defensive helper to attach event listeners only when elements exist
function safeQuery(selector) {
    return document.querySelector(selector) || null;
}

// Navigation Toggle (if present)
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // allow links with just '#' to behave normally
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Navbar background change on scroll (defensive)
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});

// Lightbox Gallery Implementation
let currentLightboxIndex = 0;
let lightboxImages = [];

function initializeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    
    if (!lightbox) return;

    // Collect all gallery images
    lightboxImages = Array.from(document.querySelectorAll('.gallery-item img'));
    
    // Add click handlers to gallery items
    document.querySelectorAll('.gallery-item').forEach((item, index) => {
        item.addEventListener('click', function() {
            openLightbox(index);
        });
    });

    function openLightbox(index) {
        currentLightboxIndex = index;
        showLightboxImage();
        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function showLightboxImage() {
        if (lightboxImages[currentLightboxIndex]) {
            const img = lightboxImages[currentLightboxIndex];
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            if (lightboxCaption) {
                lightboxCaption.textContent = img.alt || `Image ${currentLightboxIndex + 1}`;
            }
        }
    }

    function nextImage() {
        currentLightboxIndex = (currentLightboxIndex + 1) % lightboxImages.length;
        showLightboxImage();
    }

    function prevImage() {
        currentLightboxIndex = (currentLightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
        showLightboxImage();
    }

    // Event listeners
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (nextBtn) nextBtn.addEventListener('click', nextImage);
    if (prevBtn) prevBtn.addEventListener('click', prevImage);

    // Click outside image to close
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard controls
    document.addEventListener('keydown', function(e) {
        if (lightbox.style.display === 'block') {
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    prevImage();
                    break;
                case 'ArrowRight':
                    nextImage();
                    break;
            }
        }
    });
}

// Animate elements on scroll (simple fade-in)
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Tab functionality for Program sections
function showTab(tabName) {
    // Hide all tab panes
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab pane
    const targetPane = document.getElementById(tabName);
    if (targetPane) {
        targetPane.classList.add('active');
    }
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

// Initialize interactive behavior after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Observe animated elements
    const animateElements = document.querySelectorAll('.card, .dept-card, .outcome-card, .po-item, .gallery-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Hero slider initialization
    const slider = document.getElementById('hero-slider');
    if (!slider) return;

    const slides = Array.from(slider.querySelectorAll('.slide'));
    const dotsContainer = document.getElementById('slider-dots');
    const prevBtn = slider.querySelector('.slider-prev');
    const nextBtn = slider.querySelector('.slider-next');
    let current = 0;
    let autoplayId = null;

    // Create dots dynamically
    function createDots() {
        if (!dotsContainer) return [];
        dotsContainer.innerHTML = '';
        return slides.map((s, i) => {
            const d = document.createElement('button');
            d.className = 'dot';
            d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
            d.addEventListener('click', () => goTo(i));
            dotsContainer.appendChild(d);
            return d;
        });
    }

    const dots = createDots();

    function show(idx) {
        slides.forEach((s, i) => s.classList.toggle('active', i === idx));
        if (dots.length) dots.forEach((d, i) => d.classList.toggle('active', i === idx));
        current = idx;
    }

    function next() { show((current + 1) % slides.length); }
    function prev() { show((current - 1 + slides.length) % slides.length); }
    function goTo(i) { show(i); }

    // Attach controls
    if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetAutoplay(); });

    // Autoplay with pause on hover
    function startAutoplay() {
        if (autoplayId) clearInterval(autoplayId);
        autoplayId = setInterval(next, 4000);
    }

    function resetAutoplay() {
        if (autoplayId) {
            clearInterval(autoplayId);
            startAutoplay();
        }
    }

    slider.addEventListener('mouseenter', () => { if (autoplayId) clearInterval(autoplayId); });
    slider.addEventListener('mouseleave', () => startAutoplay());

    // Show first slide and start autoplay
    if (slides.length) {
        show(0);
        startAutoplay();
    }

    // Initialize lightbox
    initializeLightbox();
});

// Tab functionality for Program sections
function showTab(tabName) {
    // Hide all tab panes
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab pane
    const targetPane = document.getElementById(tabName);
    if (targetPane) {
        targetPane.classList.add('active');
    }
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

// Tab functionality for Program sections
function showTab(tabName) {
    // Hide all tab panes
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab pane
    const targetPane = document.getElementById(tabName);
    if (targetPane) {
        targetPane.classList.add('active');
    }
    
    // Add active class to clicked button
    event.target.classList.add('active');
}