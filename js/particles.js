class ParticleSystem {
  constructor() {
    this.canvas = document.getElementById('particleCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.count = 35;
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    for (let i = 0; i < this.count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.1,
        speedY: -(Math.random() * 0.06 + 0.01),
        opacity: Math.random() * 0.2 + 0.02,
        phaseX: Math.random() * Math.PI * 2
      });
    }
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const time = Date.now() * 0.001;
    for (const p of this.particles) {
      p.x += p.speedX + Math.sin(time + p.phaseX) * 0.05;
      p.y += p.speedY;
      if (p.y < -10) { p.y = this.canvas.height + 10; p.x = Math.random() * this.canvas.width; }
      if (p.x < -10) p.x = this.canvas.width + 10;
      if (p.x > this.canvas.width + 10) p.x = -10;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(232, 230, 227, ${p.opacity})`;
      this.ctx.fill();
    }
    requestAnimationFrame(() => this.animate());
  }
}

class SnowParticleSystem {
  constructor() {
    this.canvas = document.getElementById('particleCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.snowflakes = [];
    this.count = 60;
    this.active = false;
    this.animId = null;
    this.sections = document.querySelectorAll('.chapter-frozen');
    if (this.sections.length === 0) return;
    this.observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) { this.activate(); }
        else { this.deactivate(); }
        break;
      }
    }, { threshold: 0.1 });
    this.observer.observe(this.sections[0]);
  }

  activate() {
    if (this.active) return;
    this.active = true;
    for (let i = 0; i < this.count; i++) {
      this.snowflakes.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 4 + 1,
        speedY: Math.random() * 0.8 + 0.3,
        speedX: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.4 + 0.1,
        swing: Math.random() * Math.PI * 2,
        swingSpeed: Math.random() * 0.02 + 0.005
      });
    }
    this.render();
  }

  deactivate() {
    this.active = false;
    this.snowflakes = [];
    if (this.animId) { cancelAnimationFrame(this.animId); this.animId = null; }
  }

  render() {
    if (!this.active) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.filter = 'blur(0.5px)';
    const time = Date.now() * 0.001;
    for (const s of this.snowflakes) {
      s.x += s.speedX + Math.sin(time * this.swingSpeed + s.swing) * 0.3;
      s.y += s.speedY;
      if (s.y > this.canvas.height + 10) {
        s.y = -10;
        s.x = Math.random() * this.canvas.width;
      }
      if (s.x < -10) s.x = this.canvas.width + 10;
      if (s.x > this.canvas.width + 10) s.x = -10;
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
      this.ctx.fill();
    }
    this.ctx.filter = 'none';
    this.animId = requestAnimationFrame(() => this.render());
  }
}
