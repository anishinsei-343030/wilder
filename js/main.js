const lenis = new Lenis({
  duration: 1.8,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 0.8,
  touchMultiplier: 1.2,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

const navbar = document.getElementById('navbar');
function onScroll() {
  const y = window.scrollY;
  if (navbar) {
    if (y > 80) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
}
lenis.on('scroll', onScroll);

function setVH() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', vh + 'px');
}
setVH();
window.addEventListener('resize', setVH);

const keyImages = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80',
  'https://images.unsplash.com/photo-1470071459604-7b8ec44ffd0e?w=1600&q=80',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&q=80',
  'https://images.unsplash.com/photo-1758781102552-b6ed66cbafe3?w=1600&q=80',
  'https://images.unsplash.com/photo-1765891597474-e290eabcb626?w=1600&q=80',
  'https://images.unsplash.com/photo-1765871319901-0aaafe3f1a2a?w=1600&q=80',
  'https://images.unsplash.com/photo-1769411972412-234cdb5a181b?w=1600&q=80',
  'https://images.unsplash.com/photo-1728279320747-e29867b7e455?w=1600&q=80',
  'https://images.unsplash.com/photo-1766598575246-7eddead93465?w=1600&q=80',
  'https://images.unsplash.com/photo-1768954531915-f448e912d1fc?w=1600&q=80',
  'https://images.unsplash.com/photo-1748288536909-264b4ef79eb4?w=1600&q=80',
];

function preloadImages(urls) {
  return Promise.all(urls.map(url => new Promise(resolve => {
    const img = new Image();
    img.onload = img.onerror = resolve;
    img.src = url;
  })));
}

document.addEventListener('DOMContentLoaded', () => {
  const loading = document.getElementById('loadingScreen');
  const progress = document.getElementById('loadingProgress');
  let ready = false;
  let p = 0;

  preloadImages(keyImages).then(() => {
    ready = true;
    document.querySelector('.cinematic-bg')?.classList.add('loaded');
  });

  const interval = setInterval(() => {
    if (p < 70) p += Math.random() * 10 + 3;
    else if (ready && p < 90) p += 2;
    else if (ready && p >= 90) p = 100;
    else p += Math.random() * 2 + 0.5;

    if (p >= 100) { p = 100; clearInterval(interval); }
    if (progress) progress.style.width = p + '%';
    if (p >= 100 && loading) {
      setTimeout(() => loading.classList.add('hidden'), 600);
    }
  }, 200);
});

class AmbientAudio {
  constructor() {
    this.ctx = null;
    this.source = null;
    this.gain = null;
    this.isPlaying = false;
    this.btn = document.getElementById('audioToggle');
    if (!this.btn) return;
    this.btn.addEventListener('click', () => this.toggle());
  }

  async init() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.gain = this.ctx.createGain();
    this.gain.gain.value = 0;
    this.gain.connect(this.ctx.destination);

    const sr = this.ctx.sampleRate;
    const len = sr * 4;
    const buf = this.ctx.createBuffer(1, len, sr);
    const data = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (last + (0.02 * white)) / 1.02;
      last = data[i];
      data[i] *= 0.3;
    }
    this.source = this.ctx.createBufferSource();
    this.source.buffer = buf;
    this.source.loop = true;
    this.source.connect(this.gain);
    this.source.start();
    this.isPlaying = true;
    this.gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 2);
    this.btn.classList.add('active');
  }

  toggle() {
    if (!this.ctx) { this.init(); return; }
    if (this.isPlaying) {
      this.gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1);
      this.isPlaying = false;
      this.btn.classList.remove('active');
    } else {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      this.gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 2);
      this.isPlaying = true;
      this.btn.classList.add('active');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ParticleSystem();
  new SnowParticleSystem();
  new FilmGrain();
  new CursorGlow();
  new MagneticButtons();
  new AmbientAudio();
  new RevealAnimations();
  new Parallax();
});
