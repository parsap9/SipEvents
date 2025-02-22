// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add scrolling text animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes scrollBackground {
            0% {
                transform: rotate(-45deg) translateX(0);
            }
            100% {
                transform: rotate(-45deg) translateX(-50%);
            }
        }

        @keyframes scrollText {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
    `;
    document.head.appendChild(style);

    // Get all sections that should animate on scroll
    const sections = document.querySelectorAll('.details, .exhibitors, .locations, .newsletter');

    // Initial check for elements in viewport
    checkVisibility();

    // Add scroll event listener
    window.addEventListener('scroll', throttle(checkVisibility, 100));

    // Function to check if elements are visible
    function checkVisibility() {
        sections.forEach(section => {
            // Get section position relative to viewport
            const rect = section.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // If section is in viewport and doesn't have animate class
            if (rect.top <= windowHeight * 0.75 && !section.classList.contains('animate')) {
                // Add animation class
                section.classList.add('animate');
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        });
    }

    // Initialize sections with starting styles
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });

    // Throttle function to limit scroll event firing
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Setup newsletter form
    const newsletterForm = document.querySelector('.newsletter form');
    if (newsletterForm) {
        newsletterForm.setAttribute('action', 'https://formspree.io/f/myzkbqoq');
        newsletterForm.setAttribute('method', 'POST');
        
        // Ensure email input has name attribute
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        if (emailInput && !emailInput.hasAttribute('name')) {
            emailInput.setAttribute('name', 'email');
        }
    }

    // Enhanced Carousel functionality with infinite scroll
    const track = document.querySelector('.carousel-track');
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    const cards = Array.from(track.getElementsByClassName('exhibitor-card'));
    let currentIndex = 0;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;

    // Calculate how many cards to show based on viewport width
    function getCardsToShow() {
        if (window.innerWidth >= 1200) return 3;
        if (window.innerWidth >= 768) return 2;
        return 1;
    }

    function updateCarousel(smooth = true) {
        const cardsToShow = getCardsToShow();
        const cardWidth = track.clientWidth / cardsToShow;
        const maxIndex = cards.length - cardsToShow;
        
        // Enable infinite scroll
        if (currentIndex < 0) {
            currentIndex = maxIndex;
        } else if (currentIndex > maxIndex) {
            currentIndex = 0;
        }
        
        const offset = -(currentIndex * cardWidth);
        track.style.transition = smooth ? 'transform 0.3s ease' : 'none';
        track.style.transform = `translateX(${offset}px)`;
        prevTranslate = offset;
    }

    // Initialize carousel styles
    track.style.display = 'flex';
    track.style.cursor = 'grab';
    
    function initializeCardStyles() {
        const cardsToShow = getCardsToShow();
        const cardWidth = track.clientWidth / cardsToShow;
        cards.forEach(card => {
            card.style.flex = `0 0 ${cardWidth}px`;
            card.style.padding = '30px';
            card.style.userSelect = 'none';
        });
    }

    // Touch and mouse events for dragging
    track.addEventListener('mousedown', dragStart);
    track.addEventListener('touchstart', dragStart);
    track.addEventListener('mousemove', drag);
    track.addEventListener('touchmove', drag);
    track.addEventListener('mouseup', dragEnd);
    track.addEventListener('touchend', dragEnd);
    track.addEventListener('mouseleave', dragEnd);

    function dragStart(e) {
        isDragging = true;
        startPos = e.type === 'mousedown' ? e.pageX : e.touches[0].pageX;
        track.style.cursor = 'grabbing';
    }

    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        const currentPosition = e.type === 'mousemove' ? e.pageX : e.touches[0].pageX;
        const diff = currentPosition - startPos;
        currentTranslate = prevTranslate + diff;
        
        track.style.transform = `translateX(${currentTranslate}px)`;
    }

    function dragEnd() {
        if (!isDragging) return;
        isDragging = false;
        track.style.cursor = 'grab';
        
        const cardsToShow = getCardsToShow();
        const cardWidth = track.clientWidth / cardsToShow;
        const moveBy = Math.abs(currentTranslate - prevTranslate);
        
        if (moveBy > cardWidth / 4) {
            if (currentTranslate > prevTranslate) {
                currentIndex--;
            } else {
                currentIndex++;
            }
        }
        
        updateCarousel();
    }

    // Initialize card styles and handle window resize
    initializeCardStyles();
    window.addEventListener('resize', () => {
        initializeCardStyles();
        updateCarousel();
    });

    // Add click handlers for carousel buttons
    nextButton.addEventListener('click', () => {
        currentIndex++;
        updateCarousel();
    });

    prevButton.addEventListener('click', () => {
        currentIndex--;
        updateCarousel();
    });

    // Auto-rotate carousel every 5 seconds
    setInterval(() => {
        if (!isDragging) {
            currentIndex++;
            updateCarousel();
        }
    }, 5000);

    // Initial carousel update
    updateCarousel();
});
