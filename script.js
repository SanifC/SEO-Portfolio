// Mobile Navigation
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const body = document.body;

function toggleMenu() {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('active') && 
        !navLinks.contains(e.target) && 
        !navToggle.contains(e.target)) {
        toggleMenu();
    }
});

// Close menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            toggleMenu();
        }
    });
});

// Add click event to hamburger
navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
});

// Project Gallery Functionality
class ProjectGallery {
    constructor() {
        this.modal = document.querySelector('.project-modal');
        this.modalImage = this.modal.querySelector('img');
        this.closeBtn = this.modal.querySelector('.modal-close');
        this.prevBtn = this.modal.querySelector('.modal-prev');
        this.nextBtn = this.modal.querySelector('.modal-next');
        
        this.projects = {};
        this.currentProject = null;
        this.currentImageIndex = 0;
        
        this.initializeProjects();
        this.setupEventListeners();
    }

    async initializeProjects() {
        const projectItems = document.querySelectorAll('.portfolio-item');
        projectItems.forEach(project => {
            const projectId = project.dataset.project;
            this.setupProjectCarousel(project, projectId);
        });
    }

    setupProjectCarousel(project, projectId) {
        const carousel = project.querySelector('.project-carousel');
        const slides = carousel.querySelector('.carousel-slides');
        const images = Array.from(slides.querySelectorAll('img'));
        const prevBtn = carousel.querySelector('.prev');
        const nextBtn = carousel.querySelector('.next');

        let currentIndex = 0;
        this.projects[projectId] = {
            images: images,
            currentIndex: currentIndex
        };

        const updateSlide = () => {
            images.forEach(img => {
                img.classList.remove('active');
                if (!img.complete || img.naturalHeight === 0) {
                    img.onerror = () => {
                        img.src = 'images/placeholder.jpg';
                        console.log(`Failed to load image in ${projectId}`);
                    };
                }
            });
            images[currentIndex].classList.add('active');
        };

        const nextSlide = () => {
            currentIndex = (currentIndex + 1) % images.length;
            updateSlide();
        };

        const prevSlide = () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateSlide();
        };

        // Event listeners for navigation
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            prevSlide();
        });

        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            nextSlide();
        });

        // Auto advance slides
        let slideInterval = setInterval(nextSlide, 3000);

        // Pause auto-advance on hover
        project.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });

        project.addEventListener('mouseleave', () => {
            slideInterval = setInterval(nextSlide, 3000);
        });

        // Handle image clicks for modal and project clicks for navigation
        carousel.addEventListener('click', (e) => {
            if (e.target.tagName === 'IMG') {
                e.stopPropagation();
                this.openModal(projectId, currentIndex);
            }
        });

        // Always allow navigation buttons to work
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Touch support
        let touchStartX = 0;
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            clearInterval(slideInterval);
        }, { passive: true });

        carousel.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
            slideInterval = setInterval(nextSlide, 3000);
        }, { passive: true });

        // Enhanced error handling for images
        images.forEach(img => {
            const originalSrc = img.src;
            img.onerror = () => {
                // Try alternative extension if first one fails
                const currentExt = originalSrc.split('.').pop().toLowerCase();
                const newExt = currentExt === 'jpg' ? 'png' : 'jpg';
                const newSrc = originalSrc.replace(`.${currentExt}`, `.${newExt}`);
                
                // Try loading with alternative extension
                const tempImg = new Image();
                tempImg.onload = () => {
                    img.src = newSrc;
                };
                tempImg.onerror = () => {
                    console.log(`Failed to load image: ${originalSrc}`);
                    img.src = 'images/placeholder.jpg';
                };
                tempImg.src = newSrc;
            };
        });

        // Preload images with extension fallback
        const preloadImage = (img) => {
            const originalSrc = img.src;
            const newImg = new Image();
            
            newImg.onload = () => {
                img.src = originalSrc;
            };
            
            newImg.onerror = () => {
                // Try alternative extension
                const currentExt = originalSrc.split('.').pop().toLowerCase();
                const newExt = currentExt === 'jpg' ? 'png' : 'jpg';
                const newSrc = originalSrc.replace(`.${currentExt}`, `.${newExt}`);
                
                const altImg = new Image();
                altImg.onload = () => {
                    img.src = newSrc;
                };
                altImg.onerror = () => {
                    console.log(`Failed to load image: ${originalSrc}`);
                    img.src = 'images/placeholder.jpg';
                };
                altImg.src = newSrc;
            };
            
            newImg.src = originalSrc;
        };

        // Preload all images
        images.forEach(preloadImage);
    }

    openModal(projectId, currentIndex) {
        this.currentProject = projectId;
        this.currentImageIndex = currentIndex;
        this.images = this.projects[projectId].images;
        this.updateModalImage();
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    updateModalImage() {
        const currentImage = this.images[this.currentImageIndex];
        this.modalImage.src = currentImage.src;
        this.modalImage.onerror = () => {
            this.modalImage.src = 'images/placeholder.jpg';
        };
        this.modalImage.alt = `Project Image ${this.currentImageIndex + 1}`;
    }

    nextImage() {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
        this.updateModalImage();
    }

    prevImage() {
        this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
        this.updateModalImage();
    }

    setupEventListeners() {
        // Navigation events
        navToggle.addEventListener('click', toggleMenu);
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && 
                !navLinks.contains(e.target) && 
                !navToggle.contains(e.target)) {
                toggleMenu();
            }
        });

        // Modal events
        this.closeBtn.addEventListener('click', () => this.closeModal());
        this.nextBtn.addEventListener('click', () => this.nextImage());
        this.prevBtn.addEventListener('click', () => this.prevImage());

        document.addEventListener('keydown', (e) => {
            if (this.modal.classList.contains('active')) {
                if (e.key === 'Escape') this.closeModal();
                if (e.key === 'ArrowRight') this.nextImage();
                if (e.key === 'ArrowLeft') this.prevImage();
            }
        });

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
    }
}

// Scroll and Navigation
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (window.innerWidth <= 768) {
            toggleMenu();
        }

        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        const navHeight = document.querySelector('nav').offsetHeight;

        if (targetSection) {
            const targetPosition = targetSection.offsetTop - navHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Performance optimized reveal animation
const observerOptions = {
    root: null,
    rootMargin: '20px',
    threshold: 0.1
};

const revealElements = document.querySelectorAll('.skill-card, .portfolio-item, .contact-item');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            revealObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

revealElements.forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    element.style.transitionDelay = `${index * 0.1}s`;
    revealObserver.observe(element);
});

// Initialize everything
window.addEventListener('load', () => {
    new ProjectGallery();
    initializeParticles();
    setupMetrics();
    addScrollProgressBar();
    initializeTouchPortfolio();
});

// Metrics Animation
function setupMetrics() {
    const metrics = document.querySelectorAll('.metric');
    const values = [85, 200];
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const metric = entry.target;
                const index = Array.from(metrics).indexOf(metric);
                animateMetric(metric, values[index]);
                observer.unobserve(metric);
            }
        });
    }, { threshold: 0.5 });

    metrics.forEach(metric => observer.observe(metric));
}

function animateMetric(element, targetValue) {
    const circle = element.querySelector('.metric-progress');
    const value = element.querySelector('.metric-value');
    const circumference = 2 * Math.PI * 45;
    let startTime = null;

    function update(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / 2000, 1);
        
        const currentValue = Math.round(targetValue * progress);
        value.textContent = currentValue + '%';
        
        circle.style.strokeDasharray = circumference;
        circle.style.strokeDashoffset = circumference * (1 - progress);

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// Initialize Particles.js
function initializeParticles() {
    particlesJS('particles-js', {
        particles: {
            number: {
                value: window.innerWidth < 768 ? 30 : 50,
                density: {
                    enable: true,
                    value_area: 1000
                }
            },
            color: { value: "#E63946" },
            shape: { type: "circle" },
            opacity: {
                value: 0.3,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: window.innerWidth < 768 ? 2 : 3,
                random: true
            },
            line_linked: {
                enable: true,
                distance: window.innerWidth < 768 ? 150 : 200,
                color: "#E63946",
                opacity: 0.15,
                width: 1
            },
            move: {
                enable: true,
                speed: window.innerWidth < 768 ? 1 : 1.5,
                direction: "none",
                random: true,
                straight: false,
                out_mode: "bounce",
                bounce: false
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: {
                    enable: !('ontouchstart' in window),
                    mode: "repulse"
                },
                onclick: {
                    enable: true,
                    mode: "push"
                },
                resize: true
            }
        },
        retina_detect: true
    });
}

// Form handling with EmailJS
const contactForm = document.querySelector('.contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const button = contactForm.querySelector('button');
    const originalText = button.textContent;
    const formData = {
        name: contactForm.querySelector('input[name="name"]').value,
        email: contactForm.querySelector('input[name="email"]').value,
        message: contactForm.querySelector('textarea[name="message"]').value
    };
    
    // Disable form and show loading state
    button.disabled = true;
    button.innerHTML = '<span>Sending...</span>';
    
    emailjs.send('default_service', 'template_contacct', formData)
        .then(() => {
            // Success state
            button.textContent = 'Message Sent!';
            button.style.backgroundColor = '#4CAF50';
            contactForm.reset();
            
            setTimeout(() => {
                button.disabled = false;
                button.textContent = originalText;
                button.style.backgroundColor = '';
            }, 3000);
        })
        .catch((error) => {
            // Error state
            console.error('EmailJS Error:', error);
            button.textContent = 'Failed to Send';
            button.style.backgroundColor = '#dc3545';
            
            setTimeout(() => {
                button.disabled = false;
                button.textContent = originalText;
                button.style.backgroundColor = '';
            }, 3000);
        });
});

// Navbar background on scroll
const nav = document.querySelector('nav');
function updateNavBackground() {
    const isScrolled = window.scrollY > 50;
    const opacity = isScrolled ? '0.98' : '0.95';
    nav.style.backgroundColor = `rgba(15, 21, 38, ${opacity})`;
}

window.addEventListener('scroll', updateNavBackground);
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(initializeParticles, 250);
});
updateNavBackground();

// Add scroll progress bar
function addScrollProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = `${scrollPercent}%`;
    });
}

// Add this to your existing JavaScript
function initializeTouchPortfolio() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        item.addEventListener('touchstart', function() {
            // Remove 'touched' class from all other items
            portfolioItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('touched');
                }
            });
            
            // Toggle 'touched' class on current item
            this.classList.toggle('touched');
        });
    });

    // Close overlay when touching outside
    document.addEventListener('touchstart', (e) => {
        if (!e.target.closest('.portfolio-item')) {
            portfolioItems.forEach(item => {
                item.classList.remove('touched');
            });
        }
    });
}
