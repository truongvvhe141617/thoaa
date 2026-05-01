// ============================================
// PRELOADER
// ============================================
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('preloader').classList.add('hidden');
        initFireworks();
    }, 2200);
});

// ============================================
// FLOATING PARTICLES
// ============================================
function createParticles() {
    const container = document.getElementById('particles');
    const colors = ['#ff6b9d', '#a855f7', '#fbbf24', '#34d399', '#f472b6', '#818cf8'];
    const shapes = ['●', '★', '♥', '✦', '◆'];

    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const size = Math.random() * 8 + 4;
        const color = colors[Math.floor(Math.random() * colors.length)];

        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.background = color;
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
        particle.style.animationDelay = (Math.random() * 10) + 's';
        particle.style.opacity = Math.random() * 0.5 + 0.2;

        container.appendChild(particle);
    }
}
createParticles();

// ============================================
// FIREWORKS ON CANVAS
// ============================================
const fwCanvas = document.getElementById('fireworks-canvas');
const fwCtx = fwCanvas.getContext('2d');
let fireworks = [];
let fwParticles = [];
let fwRunning = false;

function resizeFireworksCanvas() {
    fwCanvas.width = window.innerWidth;
    fwCanvas.height = window.innerHeight;
}
resizeFireworksCanvas();
window.addEventListener('resize', resizeFireworksCanvas);

class Firework {
    constructor(x, y, targetY) {
        this.x = x;
        this.y = y;
        this.targetY = targetY;
        this.speed = 4 + Math.random() * 3;
        this.alive = true;
        this.trail = [];
    }

    update() {
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 8) this.trail.shift();
        this.y -= this.speed;
        if (this.y <= this.targetY) {
            this.alive = false;
            this.explode();
        }
    }

    explode() {
        const colors = ['#ff6b9d', '#a855f7', '#fbbf24', '#34d399', '#f472b6', '#818cf8', '#fb923c'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const count = 60 + Math.floor(Math.random() * 40);
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i;
            const speed = 2 + Math.random() * 4;
            fwParticles.push({
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                decay: 0.01 + Math.random() * 0.02,
                color: color,
                size: 2 + Math.random() * 2
            });
        }
    }

    draw() {
        for (let i = 0; i < this.trail.length; i++) {
            const alpha = i / this.trail.length;
            fwCtx.beginPath();
            fwCtx.arc(this.trail[i].x, this.trail[i].y, 2, 0, Math.PI * 2);
            fwCtx.fillStyle = `rgba(255, 200, 100, ${alpha})`;
            fwCtx.fill();
        }
    }
}

function initFireworks() {
    fwRunning = true;
    animateFireworks();
    // Launch fireworks periodically
    launchFirework();
    setInterval(launchFirework, 1500);
}

function launchFirework() {
    if (!fwRunning) return;
    const x = Math.random() * fwCanvas.width * 0.8 + fwCanvas.width * 0.1;
    const targetY = Math.random() * fwCanvas.height * 0.4 + 50;
    fireworks.push(new Firework(x, fwCanvas.height, targetY));
}

function animateFireworks() {
    fwCtx.globalCompositeOperation = 'destination-out';
    fwCtx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    fwCtx.fillRect(0, 0, fwCanvas.width, fwCanvas.height);
    fwCtx.globalCompositeOperation = 'lighter';

    // Update fireworks
    fireworks = fireworks.filter(fw => {
        fw.update();
        if (fw.alive) fw.draw();
        return fw.alive;
    });

    // Update particles
    fwParticles = fwParticles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // gravity
        p.life -= p.decay;

        if (p.life > 0) {
            fwCtx.beginPath();
            fwCtx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
            fwCtx.fillStyle = p.color;
            fwCtx.globalAlpha = p.life;
            fwCtx.fill();
            fwCtx.globalAlpha = 1;
            return true;
        }
        return false;
    });

    requestAnimationFrame(animateFireworks);
}

// ============================================
// COUNTDOWN TIMER
// ============================================
function updateCountdown() {
    // Set birthday date - change this to the actual birthday!
    const birthday = new Date('2026-06-15T00:00:00');
    const now = new Date();
    const diff = birthday - now;

    if (diff <= 0) {
        document.getElementById('days').textContent = '🎉';
        document.getElementById('hours').textContent = '🎂';
        document.getElementById('minutes').textContent = '🎊';
        document.getElementById('seconds').textContent = '🥳';
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    animateNumber('days', days);
    animateNumber('hours', hours);
    animateNumber('minutes', minutes);
    animateNumber('seconds', seconds);
}

function animateNumber(id, value) {
    const el = document.getElementById(id);
    const newValue = String(value).padStart(2, '0');
    if (el.textContent !== newValue) {
        el.style.transform = 'scale(1.2)';
        el.textContent = newValue;
        setTimeout(() => { el.style.transform = 'scale(1)'; }, 200);
    }
}

setInterval(updateCountdown, 1000);
updateCountdown();

// ============================================
// SCROLL ANIMATIONS (Custom AOS)
// ============================================
function handleScrollAnimations() {
    const elements = document.querySelectorAll('[data-aos]');
    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        if (rect.top < windowHeight * 0.85) {
            el.classList.add('aos-animate');
        }
    });
}

window.addEventListener('scroll', handleScrollAnimations);
window.addEventListener('load', handleScrollAnimations);

// ============================================
// LIGHTBOX
// ============================================
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const storyCards = document.querySelectorAll('.story-card');
let currentImageIndex = 0;
const images = [];

storyCards.forEach((card, index) => {
    const img = card.querySelector('img');
    images.push(img.src);
    card.addEventListener('click', () => {
        currentImageIndex = index;
        openLightbox(img.src);
    });
});

function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
document.querySelector('.lightbox-prev').addEventListener('click', () => {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    lightboxImg.src = images[currentImageIndex];
});
document.querySelector('.lightbox-next').addEventListener('click', () => {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    lightboxImg.src = images[currentImageIndex];
});

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') document.querySelector('.lightbox-prev').click();
    if (e.key === 'ArrowRight') document.querySelector('.lightbox-next').click();
});

// ============================================
// CONFETTI SYSTEM
// ============================================
const confettiCanvas = document.getElementById('confetti-canvas');
const confettiCtx = confettiCanvas.getContext('2d');
let confettiPieces = [];
let confettiRunning = false;

function resizeConfettiCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}
resizeConfettiCanvas();
window.addEventListener('resize', resizeConfettiCanvas);

class ConfettiPiece {
    constructor() {
        this.x = Math.random() * confettiCanvas.width;
        this.y = -20;
        this.size = Math.random() * 10 + 5;
        this.speedY = Math.random() * 3 + 2;
        this.speedX = Math.random() * 4 - 2;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 10 - 5;
        this.color = ['#ff6b9d', '#a855f7', '#fbbf24', '#34d399', '#f472b6', '#818cf8', '#fb923c', '#22d3ee'][Math.floor(Math.random() * 8)];
        this.shape = Math.random() > 0.5 ? 'rect' : 'circle';
        this.opacity = 1;
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;
        this.speedX += (Math.random() - 0.5) * 0.2;

        if (this.y > confettiCanvas.height + 20) {
            this.opacity -= 0.02;
        }
    }

    draw() {
        confettiCtx.save();
        confettiCtx.translate(this.x, this.y);
        confettiCtx.rotate((this.rotation * Math.PI) / 180);
        confettiCtx.globalAlpha = this.opacity;
        confettiCtx.fillStyle = this.color;

        if (this.shape === 'rect') {
            confettiCtx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
        } else {
            confettiCtx.beginPath();
            confettiCtx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
            confettiCtx.fill();
        }

        confettiCtx.restore();
    }
}

function launchConfetti() {
    confettiRunning = true;
    const interval = setInterval(() => {
        for (let i = 0; i < 5; i++) {
            confettiPieces.push(new ConfettiPiece());
        }
    }, 50);

    setTimeout(() => clearInterval(interval), 3000);
    setTimeout(() => { confettiRunning = false; }, 6000);
}

function animateConfetti() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    confettiPieces = confettiPieces.filter(p => p.opacity > 0);
    confettiPieces.forEach(p => {
        p.update();
        p.draw();
    });

    requestAnimationFrame(animateConfetti);
}
animateConfetti();

// ============================================
// CELEBRATE BUTTON — Blow Candles
// ============================================
document.getElementById('celebrate-btn').addEventListener('click', function () {
    const candles = document.getElementById('cake-candles');
    const afterBlow = document.getElementById('after-blow');

    // Blow out candles
    candles.classList.add('blown');

    // Launch confetti
    launchConfetti();

    // Show message after a beat
    setTimeout(() => {
        afterBlow.classList.remove('hidden');
        afterBlow.classList.add('show');
    }, 800);

    // Play birthday tune
    if (!musicPlaying) {
        musicPlaying = true;
        musicBtn.classList.add('playing');
        playBirthdayTune();
    }

    // Button animation
    this.style.transform = 'scale(0.9)';
    this.textContent = '🎉 Chúc mừng Thoaa! 🎉';
    setTimeout(() => {
        this.style.transform = '';
    }, 200);

    // Reset after 8 seconds
    setTimeout(() => {
        candles.classList.remove('blown');
        afterBlow.classList.add('hidden');
        afterBlow.classList.remove('show');
        this.innerHTML = '<span>🌬️ Phù ~ Thổi Nến!</span>';
    }, 8000);
});

// ============================================
// MUSIC TOGGLE (placeholder)
// ============================================
const musicBtn = document.getElementById('music-toggle');
let musicPlaying = false;

// Create a simple audio context for birthday tune
let audioCtx = null;

function playBirthdayTune() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    // Full "Happy Birthday" melody — played twice (lần 1 + lần 2 cao hơn)
    // Tempo chậm hơn, âm thanh ấm hơn
    const t = 0.42; // tempo unit — chậm hơn cho nghe rõ

    // Lần 1: C major
    const verse1 = [
        // "Happy birthday to you"
        { freq: 264, dur: t*1 },   // Hap-
        { freq: 264, dur: t*0.5 }, // py
        { freq: 297, dur: t*1.5 }, // birth-
        { freq: 264, dur: t*1.5 }, // day
        { freq: 352, dur: t*1.5 }, // to
        { freq: 330, dur: t*3 },   // you
        { freq: 0,   dur: t*0.5 }, // pause

        // "Happy birthday to you"
        { freq: 264, dur: t*1 },
        { freq: 264, dur: t*0.5 },
        { freq: 297, dur: t*1.5 },
        { freq: 264, dur: t*1.5 },
        { freq: 396, dur: t*1.5 },
        { freq: 352, dur: t*3 },
        { freq: 0,   dur: t*0.5 },

        // "Happy birthday dear Thoaa"
        { freq: 264, dur: t*1 },
        { freq: 264, dur: t*0.5 },
        { freq: 528, dur: t*1.5 },
        { freq: 440, dur: t*1.5 },
        { freq: 352, dur: t*1.5 },
        { freq: 330, dur: t*1.5 },
        { freq: 297, dur: t*1.5 },
        { freq: 0,   dur: t*0.5 },

        // "Happy birthday to you"
        { freq: 470, dur: t*1 },
        { freq: 470, dur: t*0.5 },
        { freq: 440, dur: t*1.5 },
        { freq: 352, dur: t*1.5 },
        { freq: 396, dur: t*1.5 },
        { freq: 352, dur: t*3 },
    ];

    // Pause giữa 2 lần
    const pause = [{ freq: 0, dur: t * 3 }];

    // Lần 2: Cao hơn nửa cung (D major) — nghe tươi vui hơn
    const shift = 297 / 264; // D/C ratio
    const verse2 = verse1.map(n => ({
        freq: n.freq === 0 ? 0 : Math.round(n.freq * shift),
        dur: n.dur
    }));

    // Ending chord — kết bài
    const ending = [
        { freq: 0,   dur: t * 1 },
        { freq: 352, dur: t * 1 },
        { freq: 440, dur: t * 1 },
        { freq: 528, dur: t * 4 },
    ];

    const allNotes = [...verse1, ...pause, ...verse2, ...pause, ...ending];

    let time = audioCtx.currentTime + 0.1;

    allNotes.forEach(note => {
        if (note.freq === 0) {
            // Rest / pause
            time += note.dur;
            return;
        }

        // Main tone — triangle wave (ấm, mềm)
        const osc1 = audioCtx.createOscillator();
        const gain1 = audioCtx.createGain();
        osc1.type = 'triangle';
        osc1.frequency.value = note.freq;
        osc1.connect(gain1);
        gain1.connect(audioCtx.destination);
        gain1.gain.setValueAtTime(0.18, time);
        gain1.gain.setValueAtTime(0.18, time + note.dur * 0.6);
        gain1.gain.exponentialRampToValueAtTime(0.005, time + note.dur * 0.95);
        osc1.start(time);
        osc1.stop(time + note.dur);

        // Harmony — nhẹ nhàng octave trên
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.type = 'sine';
        osc2.frequency.value = note.freq * 2;
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        gain2.gain.setValueAtTime(0.04, time);
        gain2.gain.exponentialRampToValueAtTime(0.002, time + note.dur * 0.9);
        osc2.start(time);
        osc2.stop(time + note.dur);

        time += note.dur;
    });
}

musicBtn.addEventListener('click', () => {
    musicPlaying = !musicPlaying;
    musicBtn.classList.toggle('playing', musicPlaying);
    if (musicPlaying) {
        playBirthdayTune();
    }
});

// ============================================
// SMOOTH SCROLL FOR NAVIGATION
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ============================================
// PARALLAX EFFECT ON HERO
// ============================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
        hero.style.opacity = 1 - scrolled / window.innerHeight;
    }
});

// ============================================
// CURSOR SPARKLE EFFECT
// ============================================
document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.92) {
        createSparkle(e.clientX, e.clientY);
    }
});

function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: ${['#ff6b9d', '#a855f7', '#fbbf24', '#34d399'][Math.floor(Math.random() * 4)]};
        pointer-events: none;
        z-index: 9999;
        animation: sparkle-fade 0.8s ease forwards;
    `;
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 800);
}

// Add sparkle animation
const sparkleStyle = document.createElement('style');
sparkleStyle.textContent = `
    @keyframes sparkle-fade {
        0% { transform: scale(1); opacity: 1; }
        100% { transform: scale(0) translateY(-20px); opacity: 0; }
    }
`;
document.head.appendChild(sparkleStyle);

// ============================================
// EASTER EGG: Konami Code
// ============================================
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
        launchConfetti();
        launchConfetti();
        document.body.style.animation = 'rainbow-bg 2s ease';
        setTimeout(() => { document.body.style.animation = ''; }, 2000);
    }
});
