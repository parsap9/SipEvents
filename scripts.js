// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
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

    // Carousel functionality
    const track = document.querySelector('.carousel-track');
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    const cards = Array.from(track.getElementsByClassName('exhibitor-card'));
    let currentIndex = 0;

    function updateCarousel() {
        const offset = -currentIndex * 100;
        track.style.transform = `translateX(${offset}%)`;
    }

    // Initialize carousel styles
    track.style.display = 'flex';
    track.style.transition = 'transform 0.3s ease-in-out';
    cards.forEach(card => {
        card.style.flex = '0 0 100%';
    });

    // Add click handlers for carousel buttons
    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % cards.length;
        updateCarousel();
    });

    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateCarousel();
    });

    // Auto-rotate carousel every 5 seconds
    setInterval(() => {
        currentIndex = (currentIndex + 1) % cards.length;
        updateCarousel();
    }, 5000);
});
