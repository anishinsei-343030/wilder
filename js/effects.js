class FilmGrain {
  constructor() {
    this.canvas = document.getElementById('grainCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.generateGrain();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  generateGrain() {
    const imageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random() * 255;
      data[i] = noise;
      data[i + 1] = noise;
      data[i + 2] = noise;
      data[i + 3] = Math.random() * 30;
    }
    
    this.ctx.putImageData(imageData, 0, 0);
    setTimeout(() => this.generateGrain(), 3000);
  }
}

class CursorGlow {
  constructor() {
    this.glow = document.getElementById('cursorGlow');
    if (!this.glow) return;
    this.x = 0;
    this.y = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.easing = 0.15;
    document.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.animate();
  }

  onMouseMove(e) {
    this.targetX = e.clientX;
    this.targetY = e.clientY;
  }

  animate() {
    this.x += (this.targetX - this.x) * this.easing;
    this.y += (this.targetY - this.y) * this.easing;
    this.glow.style.transform = `translate(${this.x - 150}px, ${this.y - 150}px)`;
    requestAnimationFrame(() => this.animate());
  }
}

class MagneticButtons {
  constructor() {
    this.buttons = document.querySelectorAll('[data-magnetic]');
    this.init();
  }

  init() {
    this.buttons.forEach(button => {
      button.addEventListener('mousemove', (e) => this.onMouseMove(e, button));
      button.addEventListener('mouseleave', (e) => this.onMouseLeave(e, button));
    });
  }

  onMouseMove(e, button) {
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = 50;
    if (distance < maxDistance) {
      const pullStrength = (1 - distance / maxDistance) * 0.3;
      button.style.transform = `translate(${x * pullStrength}px, ${y * pullStrength}px)`;
    }
  }

  onMouseLeave(e, button) {
    button.style.transform = 'translate(0, 0)';
  }
}

class ParticleSystem {
  constructor() {
    this.canvas = document.getElementById('particleCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.particleCount = window.innerWidth > 768 ? 40 : 20;
    this.resize();
    window.addEventListener('resize', () => this.resize());
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push(this.createParticle());
    }
    this.animate();
  }

  createParticle() {
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.3 + 0.1,
      targetOpacity: Math.random() * 0.3 + 0.1,
    };
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  animate() {
    this.ctx.fillStyle = 'rgba(10, 10, 10, 0.01)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.opacity += (p.targetOpacity - p.opacity) * 0.02;
      if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;
      p.x = Math.max(0, Math.min(this.canvas.width, p.x));
      p.y = Math.max(0, Math.min(this.canvas.height, p.y));
      if (Math.random() < 0.02) {
        p.targetOpacity = Math.random() * 0.3 + 0.1;
      }
      this.ctx.fillStyle = `rgba(212, 165, 116, ${p.opacity})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
    });
    requestAnimationFrame(() => this.animate());
  }
}

class SnowParticleSystem {
  constructor() {
    this.canvas = document.getElementById('particleCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.snowParticles = [];
    this.snowCount = window.innerWidth > 768 ? 60 : 30;
    this.snowActive = false;
    this.setupSnowTriggers();
    for (let i = 0; i < this.snowCount; i++) {
      this.snowParticles.push(this.createSnowParticle());
    }
    this.animateSnow();
  }

  setupSnowTriggers() {
    const frozenSection = document.querySelector('.chapter-frozen');
    if (frozenSection) {
      const observer = new IntersectionObserver((entries) => {
        this.snowActive = entries[0].isIntersecting;
      });
      observer.observe(frozenSection);
    }
  }

  createSnowParticle() {
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight - window.innerHeight,
      vx: (Math.random() - 0.5) * 1,
      vy: Math.random() * 1.5 + 1,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.3,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.02 + 0.01,
    };
  }

  animateSnow() {
    if (this.snowActive) {
      this.snowParticles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.wobble += p.wobbleSpeed;
        p.x += Math.sin(p.wobble) * 0.3;
        if (p.y > window.innerHeight || p.x < 0 || p.x > window.innerWidth) {
          p.x = Math.random() * window.innerWidth;
          p.y = -10;
        }
        this.ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      });
    }
    requestAnimationFrame(() => this.animateSnow());
  }
}

class RevealAnimations {
  constructor() {
    this.reveals = document.querySelectorAll('[data-reveal]');
    this.options = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, this.options);
    this.reveals.forEach((el) => this.observer.observe(el));
  }
}

class Parallax {
  constructor() {
    this.parallaxElements = document.querySelectorAll('[data-parallax]');
    this.speed = 0.5;
    if (this.parallaxElements.length > 0) {
      window.addEventListener('scroll', () => this.onScroll());
    }
  }

  onScroll() {
    const scrollY = window.scrollY;
    this.parallaxElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const elementTop = rect.top + scrollY;
      const distance = scrollY - (elementTop - window.innerHeight);
      if (distance > -window.innerHeight && distance < window.innerHeight * 2) {
        el.style.transform = `translateY(${distance * this.speed}px)`;
      }
    });
  }
}

class ScrollProgress {
  constructor() {
    this.progressBar = document.createElement('div');
    this.progressBar.style.cssText = `position: fixed; top: 0; left: 0; height: 2px; background: linear-gradient(90deg, #d4a574, #6fb8d4); z-index: 999; width: 0%; transition: width 0.3s ease;`;
    document.body.appendChild(this.progressBar);
    window.addEventListener('scroll', () => this.updateProgress());
  }

  updateProgress() {
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    this.progressBar.style.width = scrolled + '%';
  }
}

class SmoothScroll {
  constructor() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          if (typeof window.lenis !== 'undefined') {
            window.lenis.scrollTo(target, { offset: -100 });
          } else {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });
  }
}

class ScrollJacking {
  constructor() {
    this.speedModifier = 1;
    this.setupScrollSpeedZones();
  }

  setupScrollSpeedZones() {
    const zones = document.querySelectorAll('[data-scroll-speed]');
    if (!zones.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const speed = parseFloat(entry.target.dataset.scrollSpeed) || 1;
          if (typeof window.lenis !== 'undefined') {
            window.lenis.wheelMultiplier = speed;
          }
        }
      });
    });
    zones.forEach(zone => observer.observe(zone));
  }
}

class ElementCounter {
  constructor() {
    this.counters = document.querySelectorAll('[data-counter]');
    this.init();
  }

  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    });
    this.counters.forEach(el => observer.observe(el));
  }

  animateCounter(el) {
    const target = parseInt(el.dataset.counter);
    const duration = 2000;
    const start = Date.now();
    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(progress * target);
      el.textContent = current;
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    animate();
  }
}

class TextBlend {
  constructor() {
    this.textElements = document.querySelectorAll('[data-text-blend]');
    this.init();
  }

  init() {
    if (!document.querySelector('style[data-text-blend]')) {
      const style = document.createElement('style');
      style.setAttribute('data-text-blend', '');
      style.textContent = `@keyframes textBlend { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }`;
      document.head.appendChild(style);
    }
    this.textElements.forEach(el => {
      const text = el.textContent;
      el.innerHTML = text.split('').map((char, i) => `<span style="animation: textBlend 0.5s var(--ease-slow) ${i * 0.05}s both;">${char}</span>`).join('');
    });
  }
}

class MouseTrail {
  constructor() {
    this.particles = [];
    this.canvas = document.getElementById('particleCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    document.addEventListener('mousemove', (e) => {
      if (Math.random() > 0.8) {
        this.particles.push({ x: e.clientX, y: e.clientY, life: 1, size: Math.random() * 2 + 1 });
      }
    });
    this.animate();
  }

  animate() {
    this.particles = this.particles.filter(p => {
      p.life -= 0.02;
      p.y -= 1;
      this.ctx.fillStyle = `rgba(212, 165, 116, ${p.life * 0.1})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      return p.life > 0;
    });
    requestAnimationFrame(() => this.animate());
  }
}

class VisibilityPause {
  constructor() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (typeof window.lenis !== 'undefined') {
          window.lenis.stop();
        }
      } else {
        if (typeof window.lenis !== 'undefined') {
          window.lenis.start();
        }
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new FilmGrain();
  new CursorGlow();
  new MagneticButtons();
  new ParticleSystem();
  new SnowParticleSystem();
  new RevealAnimations();
  new Parallax();
  new ScrollProgress();
  new SmoothScroll();
  new ScrollJacking();
  new ElementCounter();
  new TextBlend();
  new MouseTrail();
  new VisibilityPause();
});