class SectionTransitions {
  constructor() {
    this.transitions = document.querySelectorAll('.section-transition');
    this.init();
  }

  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'transitionPulse 1.5s ease-in-out';
        }
      });
    }, { threshold: 0.5 });
    this.transitions.forEach(el => observer.observe(el));
  }
}

class DynamicBlur {
  constructor() {
    this.blurElements = document.querySelectorAll('[data-blur]');
    if (this.blurElements.length === 0) return;
    window.addEventListener('scroll', () => this.updateBlur());
  }

  updateBlur() {
    const scrollY = window.scrollY;
    const maxBlur = 10;
    this.blurElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const elementCenter = rect.top + rect.height / 2;
      const distance = Math.abs(elementCenter - window.innerHeight / 2);
      const blur = Math.max(0, maxBlur - (distance / window.innerHeight) * maxBlur);
      el.style.filter = `blur(${blur}px)`;
    });
  }
}

class TiltEffect {
  constructor() {
    this.cards = document.querySelectorAll('[data-tilt]');
    this.init();
  }

  init() {
    this.cards.forEach(card => {
      card.addEventListener('mousemove', (e) => this.onMouseMove(e, card));
      card.addEventListener('mouseleave', (e) => this.onMouseLeave(e, card));
    });
  }

  onMouseMove(e, card) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  }

  onMouseLeave(e, card) {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
  }
}

class StaggeredAnimation {
  constructor() {
    this.staggerGroups = document.querySelectorAll('[data-stagger]');
    this.init();
  }

  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const children = entry.target.children;
          Array.from(children).forEach((child, i) => {
            child.style.animation = `slideIn 0.6s var(--ease-slow) ${i * 0.1}s both`;
          });
          observer.unobserve(entry.target);
        }
      });
    });
    this.staggerGroups.forEach(group => observer.observe(group));
    if (!document.querySelector('style[data-stagger]')) {
      const style = document.createElement('style');
      style.setAttribute('data-stagger', '');
      style.textContent = `@keyframes slideIn { 0% { opacity: 0; transform: translateX(-30px); } 100% { opacity: 1; transform: translateX(0); } }`;
      document.head.appendChild(style);
    }
  }
}

class ImageLazyLoad {
  constructor() {
    this.images = document.querySelectorAll('img[loading="lazy"]');
    if (this.images.length === 0) return;
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.addEventListener('load', () => {
            img.style.animation = 'fadeIn 0.8s ease-in';
          });
          img.src = img.dataset.src || img.src;
          this.observer.unobserve(img);
        }
      });
    }, { rootMargin: '50px' });
    this.images.forEach(img => this.observer.observe(img));
    if (!document.querySelector('style[data-lazy-load]')) {
      const style = document.createElement('style');
      style.setAttribute('data-lazy-load', '');
      style.textContent = `@keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }`;
      document.head.appendChild(style);
    }
  }
}

class TypedText {
  constructor() {
    this.typedElements = document.querySelectorAll('[data-typed]');
    this.init();
  }

  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.typeText(entry.target);
          observer.unobserve(entry.target);
        }
      });
    });
    this.typedElements.forEach(el => observer.observe(el));
  }

  typeText(el) {
    const text = el.textContent;
    const speed = parseInt(el.dataset.typed) || 50;
    el.textContent = '';
    let index = 0;
    const type = () => {
      if (index < text.length) {
        el.textContent += text[index];
        index++;
        setTimeout(type, speed);
      }
    };
    type();
  }
}

class FloatingLabels {
  constructor() {
    this.labels = document.querySelectorAll('[data-float]');
    this.animate();
  }

  animate() {
    this.labels.forEach((label, i) => {
      const delay = i * 0.2;
      const duration = 3 + Math.random() * 2;
      label.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
    });
    if (!document.querySelector('style[data-float]')) {
      const style = document.createElement('style');
      style.setAttribute('data-float', '');
      style.textContent = `@keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }`;
      document.head.appendChild(style);
    }
  }
}

class GradientShift {
  constructor() {
    this.gradientElements = document.querySelectorAll('[data-gradient]');
    this.animate();
  }

  animate() {
    if (!document.querySelector('style[data-gradient]')) {
      const style = document.createElement('style');
      style.setAttribute('data-gradient', '');
      style.textContent = `@keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }`;
      document.head.appendChild(style);
    }
    this.gradientElements.forEach((el) => {
      const gradient = el.dataset.gradient;
      el.style.backgroundImage = gradient;
      el.style.backgroundSize = '200% 200%';
      el.style.animation = 'gradientShift 8s ease infinite';
    });
  }
}

class ScrollRevealParallax {
  constructor() {
    this.elements = document.querySelectorAll('[data-reveal-parallax]');
    window.addEventListener('scroll', () => this.update());
  }

  update() {
    const scrollY = window.scrollY;
    this.elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const elementCenter = rect.top + rect.height / 2;
      const windowCenter = window.innerHeight / 2;
      const distance = elementCenter - windowCenter;
      const parallax = (distance / window.innerHeight) * 30;
      const opacity = Math.max(0, Math.min(1, 1 - Math.abs(distance) / window.innerHeight));
      el.style.transform = `translateY(${parallax}px)`;
      el.style.opacity = opacity;
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new SectionTransitions();
  new DynamicBlur();
  new TiltEffect();
  new StaggeredAnimation();
  new ImageLazyLoad();
  new TypedText();
  new FloatingLabels();
  new GradientShift();
  new ScrollRevealParallax();
});