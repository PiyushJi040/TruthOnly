// Interaction utilities for enhanced UX

// Haptic-like feedback using vibration API (if available)
export const triggerHaptic = (pattern = [10]) => {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
};

// Visual feedback for clicks
export const createRipple = (event) => {
  const button = event.currentTarget;
  const ripple = document.createElement('span');
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  ripple.classList.add('ripple-effect');

  const existingRipple = button.getElementsByClassName('ripple-effect')[0];
  if (existingRipple) {
    existingRipple.remove();
  }

  button.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 600);
};

// Sound effects using Web Audio API
class SoundEffects {
  constructor() {
    this.audioContext = null;
    this.enabled = true;
  }

  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  playTone(frequency = 440, duration = 100, type = 'sine') {
    if (!this.enabled) return;
    
    try {
      this.init();
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration / 1000);
    } catch (error) {
      console.log('Audio not supported');
    }
  }

  playClick() {
    this.playTone(800, 50, 'square');
  }

  playSuccess() {
    this.playTone(523.25, 100, 'sine');
    setTimeout(() => this.playTone(659.25, 100, 'sine'), 100);
    setTimeout(() => this.playTone(783.99, 200, 'sine'), 200);
  }

  playError() {
    this.playTone(200, 100, 'sawtooth');
    setTimeout(() => this.playTone(150, 200, 'sawtooth'), 100);
  }

  playHover() {
    this.playTone(600, 30, 'sine');
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}

export const soundEffects = new SoundEffects();

// Particle burst effect
export const createParticleBurst = (x, y, color = '#ff6b6b', count = 20) => {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = `${x}px`;
  container.style.top = `${y}px`;
  container.style.pointerEvents = 'none';
  container.style.zIndex = '10000';
  document.body.appendChild(container);

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    const angle = (Math.PI * 2 * i) / count;
    const velocity = 2 + Math.random() * 3;
    const size = 3 + Math.random() * 5;

    particle.style.position = 'absolute';
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.backgroundColor = color;
    particle.style.borderRadius = '50%';
    particle.style.boxShadow = `0 0 10px ${color}`;

    container.appendChild(particle);

    const animation = particle.animate([
      {
        transform: 'translate(0, 0) scale(1)',
        opacity: 1
      },
      {
        transform: `translate(${Math.cos(angle) * velocity * 50}px, ${Math.sin(angle) * velocity * 50}px) scale(0)`,
        opacity: 0
      }
    ], {
      duration: 800,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });

    animation.onfinish = () => particle.remove();
  }

  setTimeout(() => container.remove(), 1000);
};

const style = document.createElement('style');
style.textContent = `
  .ripple-effect {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple-animation 0.6s ease-out;
    pointer-events: none;
  }

  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

export default {
  triggerHaptic,
  createRipple,
  soundEffects,
  createParticleBurst
};
