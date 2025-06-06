// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mainNav = document.getElementById('mainNav');

mobileMenuBtn.addEventListener('click', () => {
    mainNav.classList.toggle('active');
});

// Product Filtering
const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        productCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Wishlist Toggle
const wishlistBtns = document.querySelectorAll('.wishlist-btn');

wishlistBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const icon = btn.querySelector('i');
        if (icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            btn.classList.add('active');
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            btn.classList.remove('active');
        }
    });
});

// Testimonial Slider
const testimonials = document.querySelectorAll('.testimonial');
const dots = document.querySelectorAll('.slider-dot');
let currentTestimonial = 0;
let slideInterval;

function showTestimonial(index) {
    // Validate index
    if (index >= testimonials.length) index = 0;
    if (index < 0) index = testimonials.length - 1;
    
    // Hide all testimonials and remove active dots
    testimonials.forEach(testimonial => {
        testimonial.classList.remove('active');
    });
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Show selected testimonial and dot
    testimonials[index].classList.add('active');
    dots[index].classList.add('active');
    currentTestimonial = index;
}

// Initialize slider
function initSlider() {
    // Show first testimonial
    showTestimonial(0);
    
    // Set up auto-rotation
    slideInterval = setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }, 5000);
    
    // Dot click events
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            // Reset timer when manually changing slide
            clearInterval(slideInterval);
            showTestimonial(index);
            slideInterval = setInterval(() => {
                currentTestimonial = (currentTestimonial + 1) % testimonials.length;
                showTestimonial(currentTestimonial);
            }, 5000);
        });
    });
}

// Initialize the slider when DOM is loaded
document.addEventListener('DOMContentLoaded', initSlider);
// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });

            // Close mobile menu if open
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
            }
        }
    });
});
document.addEventListener('DOMContentLoaded', function () {
  const modal = document.getElementById("faqModal");
  const link = document.getElementById("faqLink");
  const closeBtn = document.querySelector(".faq-close");

  link.addEventListener("click", function (e) {
    e.preventDefault();
    modal.style.display = "block";
  });

  closeBtn.addEventListener("click", function () {
    modal.style.display = "none";
  });

  window.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
});
// Hero Slider Functionality
// Updated Hero Slider Functionality with Zoom Effect
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    let currentSlide = 0;
    const slideInterval = 8000; // 8 seconds to match animation duration
    
    function nextSlide() {
        // Reset animation for current slide
        slides[currentSlide].style.animation = 'none';
        void slides[currentSlide].offsetWidth; // Trigger reflow
        slides[currentSlide].classList.remove('active');
        
        currentSlide = (currentSlide + 1) % slides.length;
        
        // Apply active class and animation to next slide
        slides[currentSlide].classList.add('active');
        slides[currentSlide].style.animation = 'zoomIn 8s linear forwards';
    }
    
    // Initialize first slide
    slides[0].classList.add('active');
    slides[0].style.animation = 'zoomIn 8s linear forwards';
    
    // Start the slider
    let sliderInterval = setInterval(nextSlide, slideInterval);
    
    // Pause on hover
    const slider = document.querySelector('.hero-slider');
    slider.addEventListener('mouseenter', () => {
        clearInterval(sliderInterval);
        // Pause animation
        slides[currentSlide].style.animationPlayState = 'paused';
    });
    
    slider.addEventListener('mouseleave', () => {
        // Resume animation
        slides[currentSlide].style.animationPlayState = 'running';
        sliderInterval = setInterval(nextSlide, slideInterval);
    });
}

document.addEventListener('DOMContentLoaded', initHeroSlider);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initHeroSlider();
});