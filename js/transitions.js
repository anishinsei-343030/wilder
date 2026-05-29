class RevealAnimations {
  constructor() {
    for (const section of document.querySelectorAll('.section, .cinematic-break, .chapter-header')) {
      const reveals = section.querySelectorAll('[data-reveal]');
      reveals.forEach((el, i) => {
        el.style.transitionDelay = `${i * 0.15}s`;
      });
    }

    this.observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const children = entry.target.querySelectorAll('[data-reveal]');
          children.forEach(el => el.classList.add('revealed'));
          this.observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0.08, rootMargin: '0px 0px -80px 0px' });

    for (const el of document.querySelectorAll('.section, .cinematic-break, .quote, .chapter-header')) {
      if (el.querySelector('[data-reveal]')) this.observer.observe(el);
    }
  }
}

class Parallax {
  constructor() {
    this.elements = document.querySelectorAll('[data-parallax]');
    if (this.elements.length === 0) return;
    if (typeof lenis !== 'undefined') {
      lenis.on('scroll', () => this.update());
    } else {
      window.addEventListener('scroll', () => this.update(), { passive: true });
    }
  }
  update() {
    const sy = window.scrollY || 0;
    for (const el of this.elements) {
      const speed = parseFloat(el.dataset.parallax) || 0.5;
      const rect = el.getBoundingClientRect();
      const centerOffset = (rect.top + rect.height / 2) / window.innerHeight - 0.5;
      el.style.transform = `translateY(${centerOffset * speed * 30}px)`;
    }
  }
}
