// Mobile Menu Toggle
document.addEventListener("DOMContentLoaded", function() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    // Toggle mobile menu
    mobileMenu.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Back to top button
    const createBackToTopButton = () => {
        const body = document.querySelector('body');
        const backToTopButton = document.createElement('a');
        backToTopButton.setAttribute('href', '#');
        backToTopButton.setAttribute('class', 'back-to-top');
        backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
        body.appendChild(backToTopButton);

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });

        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    };

    createBackToTopButton();

    // Scroll animations
    const scrollElements = document.querySelectorAll('.feature-card, .tutor-card, .testimonial-card, .subject-card, .pricing-card, .section-title');
    scrollElements.forEach(element => {
        element.classList.add('fade-in');
    });

    const elementInView = (el, percentageScroll = 100) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= 
            ((window.innerHeight || document.documentElement.clientHeight) * (percentageScroll/100))
        );
    };

    const displayScrollElement = element => {
        element.classList.add('visible');
    };

    const hideScrollElement = element => {
        element.classList.remove('visible');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach(el => {
            if (elementInView(el, 70)) {
                displayScrollElement(el);
            } else {
                hideScrollElement(el);
            }
        });
    };

    // Initialize on load
    setTimeout(handleScrollAnimation, 100);

    // Add scroll event listener
    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });

    // Sticky header shadow
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 0) {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
    });

    // Form validation for contact/booking forms
    const setupFormValidation = () => {
        const forms = document.querySelectorAll('form');
        if (forms.length === 0) return;

        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                let isValid = true;
                const requiredFields = form.querySelectorAll('[required]');
                
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        isValid = false;
                        field.classList.add('error');
                        
                        // Create error message if it doesn't exist
                        let errorMsg = field.nextElementSibling;
                        if (!errorMsg || !errorMsg.classList.contains('error-message')) {
                            errorMsg = document.createElement('small');
                            errorMsg.classList.add('error-message');
                            errorMsg.style.color = 'red';
                            errorMsg.style.display = 'block';
                            errorMsg.style.marginTop = '5px';
                            field.parentNode.insertBefore(errorMsg, field.nextSibling);
                        }
                        
                        errorMsg.textContent = `${field.name || 'This field'} is required`;
                    } else {
                        field.classList.remove('error');
                        const errorMsg = field.nextElementSibling;
                        if (errorMsg && errorMsg.classList.contains('error-message')) {
                            errorMsg.textContent = '';
                        }
                    }
                });
                
                if (!isValid) {
                    e.preventDefault();
                }
            });
            
            // Real-time validation
            form.querySelectorAll('input, textarea').forEach(field => {
                field.addEventListener('input', function() {
                    if (field.hasAttribute('required') && field.value.trim()) {
                        field.classList.remove('error');
                        const errorMsg = field.nextElementSibling;
                        if (errorMsg && errorMsg.classList.contains('error-message')) {
                            errorMsg.textContent = '';
                        }
                    }
                });
            });
        });
    };

    setupFormValidation();

    // Testimonial slider/carousel (if there are many testimonials)
    const setupTestimonialSlider = () => {
        const testimonialContainer = document.querySelector('.testimonial-grid');
        const testimonials = document.querySelectorAll('.testimonial-card');
        
        if (testimonials.length <= 3) return; // Only activate for more than 3 testimonials
        
        // Create navigation buttons
        const prevButton = document.createElement('button');
        prevButton.classList.add('slider-nav', 'prev-btn');
        prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
        
        const nextButton = document.createElement('button');
        nextButton.classList.add('slider-nav', 'next-btn');
        nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
        
        // Add navigation to container's parent
        const testimonialSection = document.querySelector('.testimonials .container');
        testimonialSection.style.position = 'relative';
        testimonialSection.appendChild(prevButton);
        testimonialSection.appendChild(nextButton);
        
        // Style the buttons
        const navButtons = document.querySelectorAll('.slider-nav');
        navButtons.forEach(button => {
            button.style.position = 'absolute';
            button.style.top = '50%';
            button.style.transform = 'translateY(-50%)';
            button.style.backgroundColor = 'var(--primary)';
            button.style.color = 'white';
            button.style.width = '40px';
            button.style.height = '40px';
            button.style.borderRadius = '50%';
            button.style.border = 'none';
            button.style.display = 'flex';
            button.style.alignItems = 'center';
            button.style.justifyContent = 'center';
            button.style.cursor = 'pointer';
            button.style.zIndex = '10';
            button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        });
        
        prevButton.style.left = '-20px';
        nextButton.style.right = '-20px';
        
        // Initialize slider
        let currentSlide = 0;
        const maxSlides = testimonials.length - 1;
        
        // For mobile view
        const updateSlider = () => {
            if (window.innerWidth <= 768) {
                testimonials.forEach((slide, index) => {
                    slide.style.display = index === currentSlide ? 'block' : 'none';
                });
            } else {
                testimonials.forEach(slide => {
                    slide.style.display = 'block';
                });
            }
        };
        
        // Initial setup
        updateSlider();
        
        // Navigation functionality
        prevButton.addEventListener('click', () => {
            if (currentSlide > 0) {
                currentSlide--;
            } else {
                currentSlide = maxSlides;
            }
            updateSlider();
        });
        
        nextButton.addEventListener('click', () => {
            if (currentSlide < maxSlides) {
                currentSlide++;
            } else {
                currentSlide = 0;
            }
            updateSlider();
        });
        
        // Update on resize
        window.addEventListener('resize', updateSlider);
    };

    // Only setup testimonial slider if there are enough testimonials
    setupTestimonialSlider();

    // FAQ Section (Accordion) setup
    const setupFaqAccordion = () => {
        const faqItems = document.querySelectorAll('.faq-item');
        if (faqItems.length === 0) return;

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            question.addEventListener('click', () => {
                // Close other open items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.faq-answer').style.maxHeight = '0';
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
                if (item.classList.contains('active')) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    answer.style.maxHeight = '0';
                }
            });
        });
    };

    // Setup FAQ if it exists
    setupFaqAccordion();

    // Counter animation for stats
    const animateCounters = () => {
        const counters = document.querySelectorAll('.counter-value');
        if (counters.length === 0) return;

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const step = (target / duration) * 10;
            let current = 0;
            
            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.ceil(current);
                    setTimeout(updateCounter, 10);
                } else {
                    counter.textContent = target;
                }
            };
            
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(counter);
        });
    };

    // Animate counters if they exist
    animateCounters();
});