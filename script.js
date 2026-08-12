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

    // Projects carousel controls
    const projectsCarousel = document.querySelector('.projects-carousel');
    if (projectsCarousel) {
        const viewport = projectsCarousel.querySelector('.projects-viewport');
        const track = projectsCarousel.querySelector('.projects-track');
        const slides = Array.from(projectsCarousel.querySelectorAll('.project-slide'));
        const prevBtn = projectsCarousel.querySelector('.carousel-btn.prev');
        const nextBtn = projectsCarousel.querySelector('.carousel-btn.next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentSlide = 0;

        function clampIndex(index) {
            if (index < 0) return slides.length - 1;
            if (index >= slides.length) return 0;
            return index;
        }

        function setActiveSlide(index) {
            currentSlide = clampIndex(index);
            const activeSlide = slides[currentSlide];
            const targetOffset = activeSlide.offsetLeft - ((viewport.clientWidth - activeSlide.clientWidth) / 2);
            track.style.transform = `translateX(${-targetOffset}px)`;

            slides.forEach((slide, i) => {
                slide.classList.toggle('is-active', i === currentSlide);
            });

            if (dotsContainer) {
                const dots = dotsContainer.querySelectorAll('button');
                dots.forEach((dot, i) => {
                    dot.classList.toggle('is-active', i === currentSlide);
                    dot.setAttribute('aria-selected', i === currentSlide ? 'true' : 'false');
                });
            }
        }

        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.className = 'carousel-dot';
                dot.setAttribute('aria-label', `Go to project ${index + 1}`);
                dot.setAttribute('aria-selected', 'false');
                dot.addEventListener('click', () => setActiveSlide(index));
                dotsContainer.appendChild(dot);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => setActiveSlide(currentSlide - 1));
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => setActiveSlide(currentSlide + 1));
        }

        window.addEventListener('resize', () => setActiveSlide(currentSlide));
        setActiveSlide(0);
    }

    // Fullscreen Image Lightbox for project screenshots
    const projectImages = document.querySelectorAll('.project-media img');
    projectImages.forEach(img => {
        img.addEventListener('click', function(e) {
            e.stopPropagation();
            const modal = document.createElement('div');
            modal.className = 'project-image-modal';
            modal.innerHTML = `
                <div class="modal-backdrop"></div>
                <div class="modal-content">
                    <button class="modal-close" type="button" aria-label="Close modal">&times;</button>
                    <img src="${this.src}" alt="${this.alt}" />
                </div>
            `;
            document.body.appendChild(modal);
            requestAnimationFrame(() => modal.classList.add('active'));

            const closeModal = () => {
                modal.classList.remove('active');
                setTimeout(() => modal.remove(), 250);
            };
            modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
            modal.querySelector('.modal-close').addEventListener('click', closeModal);
        });
    });
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
            if (btnText) btnText.textContent = 'Show all 22 certifications';
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