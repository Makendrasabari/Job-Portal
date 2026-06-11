/* Main UI Scripts - Stackly Job Portal */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initStickyNavbar();
  initMobileMenu();
  initScrollTop();
  initTestimonialSlider();
  initFaqAccordion();
  initCounters();
  highlightActiveLink();
});

/* 1. Preloader Initialization */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        document.body.style.overflow = '';
      }, 1500);
    });
  }
}

/* 2. Sticky Navbar & Active Indicator */
function initStickyNavbar() {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const isHomepage = !!document.querySelector('.hero-sec');
    
    // Set initial state on load
    if (!isHomepage) {
      navbar.classList.add('scrolled');
    } else if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    }
    
    window.addEventListener('scroll', () => {
      if (isHomepage) {
        if (window.scrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      } else {
        navbar.classList.add('scrolled');
      }
    });
  }
}

/* 3. Mobile Navigation Menu Drawer */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const overlay = document.querySelector('.mobile-overlay');
  const closeBtn = document.querySelector('.mobile-nav-close');
  
  if (toggleBtn && mobileNav && overlay) {
    const toggleMenu = () => {
      const isOpen = mobileNav.classList.contains('open');
      if (isOpen) {
        mobileNav.classList.remove('open');
        toggleBtn.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      } else {
        mobileNav.classList.add('open');
        toggleBtn.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    };
    
    toggleBtn.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);
    
    if (closeBtn) {
      closeBtn.addEventListener('click', toggleMenu);
    }
    
    // Close drawer on links click
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        toggleBtn.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }
}

/* 4. Scroll To Top Button */
function initScrollTop() {
  const scrollBtn = document.querySelector('.scroll-top');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollBtn.classList.add('visible');
      } else {
        scrollBtn.classList.remove('visible');
      }
    });
    
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

/* 5. Testimonial Slider Carousel */
function initTestimonialSlider() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.querySelector('.testimonial-dots');
  
  if (slides.length > 0 && dotsContainer) {
    let currentSlide = 0;
    
    // Create Dots
    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('testimonial-dot');
      if (index === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Go to testimonial slide ${index + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(index);
      });
      dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.testimonial-dot');
    
    const goToSlide = (slideIndex) => {
      slides[currentSlide].classList.remove('active');
      dots[currentSlide].classList.remove('active');
      
      currentSlide = slideIndex;
      
      slides[currentSlide].classList.add('active');
      dots[currentSlide].classList.add('active');
    };
    
    // Auto Rotation
    setInterval(() => {
      let nextSlide = (currentSlide + 1) % slides.length;
      goToSlide(nextSlide);
    }, 6000);
  }
}

/* 6. FAQ Accordion Toggle */
function initFaqAccordion() {
  const faqHeaders = document.querySelectorAll('.faq-header');
  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');
      
      // Close other accordion tabs
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        otherItem.classList.remove('active');
      });
      
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* 7. Statistics Counters Count-Up Animation */
function initCounters() {
  const counters = document.querySelectorAll('.counter-number');
  
  if (counters.length > 0) {
    const options = {
      threshold: 0.5,
      rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = +counter.getAttribute('data-target');
          const duration = 2000; // ms
          const increment = target / (duration / 16); // 16ms per frame (approx 60fps)
          
          let current = 0;
          
          const updateCount = () => {
            current += increment;
            if (current < target) {
              counter.innerText = Math.ceil(current).toLocaleString();
              requestAnimationFrame(updateCount);
            } else {
              counter.innerText = target.toLocaleString() + (counter.getAttribute('data-suffix') || '');
            }
          };
          
          updateCount();
          observer.unobserve(counter);
        }
      });
    }, options);
    
    counters.forEach(counter => {
      observer.observe(counter);
    });
  }
}

/* 8. Active Page Links Highlighting */
function highlightActiveLink() {
  const path = window.location.pathname;
  const pageName = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
  
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === pageName) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}
