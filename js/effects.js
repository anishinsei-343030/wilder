class FilmGrain {
  constructor() {
    this.canvas = document.getElementById('grainCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.render();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  render() {
    const w = this.canvas.width, h = this.canvas.height;
    const imageData = this.ctx.createImageData(w, h);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const v = Math.random() * 60;
      data[i] = v; data[i+1] = v; data[i+2] = v; data[i+3] = 8;
    }
    this.ctx.putImageData(imageData, 0, 0);
  }
}

class CursorGlow {
  constructor() {
    this.x = -200; this.y = -200;
    this.element = document.getElementById('cursorGlow');
    if (!this.element) return;
    document.addEventListener('mousemove', (e) => { this.x = e.clientX; this.y = e.clientY; });
    this.animate();
  }
  animate() {
    this.element.style.transform = `translate(${this.x - 150}px, ${this.y - 150}px)`;
    requestAnimationFrame(() => this.animate());
  }
}

class MagneticButtons {
  constructor() {
    document.querySelectorAll('[data-magnetic]').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const maxDist = 100;
        const dist = Math.sqrt(x * x + y * y);
        if (dist < maxDist) {
          const factor = 1 - dist / maxDist;
          btn.style.transform = `translate(${x * factor * 0.3}px, ${y * factor * 0.3}px)`;
        }
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
        btn.style.transition = 'transform 0.6s var(--ease-slow)';
        setTimeout(() => btn.style.transition = '', 600);
      });
    });
  }
}
