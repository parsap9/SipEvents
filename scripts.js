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
});
