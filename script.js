document.addEventListener('DOMContentLoaded', function() {
    // Quick Links mobile scroll fix
    const quickLinks = document.querySelectorAll('.quick-nav-item[href^="#"]');
    function isMobile() {
        return window.innerWidth <= 768;
    }
    quickLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (isMobile()) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
    const navLinks = document.querySelectorAll('.navbar a');
    const navbar = document.querySelector('.navbar');
    const navbarHeight = navbar.offsetHeight;
    
    // Function to update active link
    function setActiveLink() {
        const currentScroll = window.scrollY + (window.innerHeight / 2);
        const sections = document.querySelectorAll('section');
        let currentSection = sections[0].id;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (currentScroll >= sectionTop && currentScroll < sectionBottom) {
                currentSection = section.id;
            }
        });

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.remove('active');
            if ((href === 'index.html' && currentSection === 'profile') || 
                (href === `#${currentSection}`)) {
                link.classList.add('active');
            }
        });
    }

    // Improved smooth scroll functionality
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                const targetPosition = targetSection.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Handle scroll events with debouncing
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(() => {
            setActiveLink();
        });
    });

    // Ensure proper section alignment after page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            const hash = window.location.hash;
            if (hash) {
                const targetSection = document.querySelector(hash);
                if (targetSection) {
                    const targetPosition = targetSection.offsetTop - navbarHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        }, 100);
    });

    setActiveLink(); // Initial call
});

// Certifications toggle functionality
function toggleCertifications() {
    const expandedSection = document.querySelector('.certifications-expanded');
    const showAllBtn = document.querySelector('.show-all-btn');
    const btnText = document.querySelector('.btn-text');
    const btnIcon = document.querySelector('.btn-icon');
    
    if (expandedSection) {
        if (expandedSection.classList.contains('show')) {
            // Hide expanded certifications
            expandedSection.classList.remove('show');
            expandedSection.style.display = 'none';
            if (btnText) btnText.textContent = 'Show all 18 certifications';
            if (btnIcon) btnIcon.className = 'bx bx-chevron-down btn-icon';
            if (showAllBtn) showAllBtn.classList.remove('expanded');
        } else {
            // Show expanded certifications
            expandedSection.classList.add('show');
            expandedSection.style.display = 'grid';
            if (btnText) btnText.textContent = 'Show less';
            if (btnIcon) btnIcon.className = 'bx bx-chevron-up btn-icon';
            if (showAllBtn) showAllBtn.classList.add('expanded');
        }
    }
}