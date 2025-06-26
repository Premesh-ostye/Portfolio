// Initialize scroll animations
AOS.init({ duration: 800, offset: 100 });

// Smooth scroll to top
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Typewriter animation for all .typed elements
function typeWriterAll() {
  const elements = document.querySelectorAll('.typed');
  elements.forEach((el, index) => {
    const text = el.textContent;
    el.textContent = '';
    let i = 0;
    function type() {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(type, 25);
      }
    }
    setTimeout(type, 300 * index);
  });
}

// Reveal animations on scroll
function fadeInOnScroll() {
  const fadeEls = document.querySelectorAll('.card, .project, .timeline-entry, .testimonial, .fact');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  fadeEls.forEach((el) => observer.observe(el));
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
  });
});

// Initialize on load
window.onload = () => {
  typeWriterAll();
  fadeInOnScroll();
};
