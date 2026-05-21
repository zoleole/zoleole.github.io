// ═══════════════════════════════════════════
// Z O L E O L E — DRA ATMOSFERA
// ═══════════════════════════════════════════

const poster = document.getElementById('poster');

// ── Loading Curtain ─────────────────────────

window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loading').classList.add('hide');
    }, 800);
});

// ── Starfield ───────────────────────────────

(function initStars() {
    const STAR_COUNT = 160;

    for (let i = 0; i < STAR_COUNT; i++) {
        const star = document.createElement('div');
        const hasTwinkle = Math.random() > 0.6;
        star.className = 'star' + (hasTwinkle ? ' twinkle' : '');

        const size = Math.random() < 0.85
            ? 0.8 + Math.random() * 0.8
            : 1.5 + Math.random() * 1;
        const opacity = 0.15 + Math.random() * 0.45;
        const twinkleDelay = hasTwinkle ? `, ${(Math.random() * 3).toFixed(1)}s` : '';

        star.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      --star-o: ${opacity};
      animation-delay: ${0.2 + Math.random() * 1.2}s${twinkleDelay};
    `;
        poster.appendChild(star);
    }
})();

// ── Constellations ──────────────────────────

(function initConstellations() {
    const canvas = document.getElementById('constellationCanvas');
    const ctx = canvas.getContext('2d');

    const GROUPS = [
        [[8, 3], [15, 18], [6, 35]],
        [[92, 2], [88, 20], [72, 14]],
        [[48, 28], [40, 55], [55, 62]],
        [[30, 75], [20, 92], [42, 95]],
        [[85, 38], [90, 55], [78, 65]],
    ];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function draw() {
        const { width: w, height: h } = canvas;
        ctx.clearRect(0, 0, w, h);
        ctx.strokeStyle = 'rgba(232, 96, 28, 0.06)';
        ctx.lineWidth = 0.5;

        GROUPS.forEach(group => {
            ctx.beginPath();
            group.forEach(([px, py], i) => {
                const x = (px / 100) * w;
                const y = (py / 100) * h;
                i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            });
            ctx.stroke();
        });
    }

    resize();
    window.addEventListener('resize', () => { resize(); setTimeout(draw, 100); });
    setTimeout(draw, 2000);
})();

// ── Shooting Stars ──────────────────────────

(function initShootingStars() {
    function spawn() {
        const ss = document.createElement('div');
        ss.className = 'shooting-star';

        const startX = 15 + Math.random() * 70;
        const startY = Math.random() * 40;
        const angle = 20 + Math.random() * 30;
        const distance = 150 + Math.random() * 250;
        const rad = angle * (Math.PI / 180);
        const trailLen = 40 + Math.random() * 50;
        const dur = 0.5 + Math.random() * 0.6;

        ss.style.cssText = `
      left: ${startX}%;
      top: ${startY}%;
      --shoot-dx: ${Math.cos(rad) * distance}px;
      --shoot-dy: ${Math.sin(rad) * distance}px;
      --trail-len: ${trailLen}px;
      --trail-angle: ${-(180 - angle)}deg;
      animation: shootingStar ${dur}s ease-out forwards;
    `;
        poster.appendChild(ss);
        setTimeout(() => ss.remove(), dur * 1000 + 100);
    }

    function schedule() {
        setTimeout(() => { spawn(); schedule(); }, 3000 + Math.random() * 8000);
    }

    setTimeout(schedule, 2000);
})();

// ── Crosses ─────────────────────────────────

(function initCrosses() {
    const POSITIONS = [
        [8, 3], [92, 2], [15, 18], [72, 14], [88, 20],
        [6, 35], [48, 28], [85, 38], [22, 50], [68, 45],
        [40, 55], [90, 55], [12, 68], [55, 62], [78, 65],
        [30, 75], [60, 72], [8, 82], [50, 85], [75, 80],
        [20, 92], [88, 88], [42, 95], [65, 92], [35, 38],
        [95, 45], [5, 55], [82, 75], [3, 12], [97, 68],
        [50, 8], [15, 95], [96, 15], [62, 3], [38, 97],
        [2, 48], [98, 32], [25, 6], [78, 96], [45, 15],
    ];

    POSITIONS.forEach(([x, y], i) => {
        const cross = document.createElement('div');
        cross.className = 'cross';
        cross.textContent = '+';
        cross.style.left = x + '%';
        cross.style.top = y + '%';
        cross.style.animationDelay = (0.3 + i * 0.04) + 's';
        cross.style.fontSize = (11 * (0.7 + Math.random() * 0.6)) + 'px';
        cross.style.opacity = 0.2 + Math.random() * 0.4;
        poster.appendChild(cross);
    });
})();

// ── Floating Particles ──────────────────────

(function initParticles() {
    function spawn() {
        const p = document.createElement('div');
        p.className = 'particle';

        const size = 1 + Math.random() * 2;
        const dur = 6 + Math.random() * 8;
        const drift = -15 + Math.random() * 30;
        const opacity = 0.1 + Math.random() * 0.25;
        const isOrange = Math.random() > 0.5;

        p.style.cssText = `
      left: ${30 + Math.random() * 40}%;
      top: ${35 + Math.random() * 30}%;
      width: ${size}px;
      height: ${size}px;
      background: ${isOrange ? `rgba(255,100,30,${opacity})` : `rgba(255,255,255,${opacity * 0.6})`};
      --p-o: ${opacity};
      --p-drift: ${drift}px;
      animation-duration: ${dur}s;
    `;
        poster.appendChild(p);
        setTimeout(() => p.remove(), dur * 1000);
    }

    for (let i = 0; i < 16; i++) setTimeout(spawn, i * 250);
    setInterval(spawn, 600);
})();

// ── Clock (Ensenada) ────────────────────────

(function initClock() {
    const el = document.getElementById('ensenada-time');

    function tick() {
        const now = new Date();
        const local = new Date(now.toLocaleString('en-US', { timeZone: 'America/Tijuana' }));
        const h = String(local.getHours()).padStart(2, '0');
        const m = String(local.getMinutes()).padStart(2, '0');
        const s = String(local.getSeconds()).padStart(2, '0');
        el.innerHTML = `${h}:${m}:<span class="seconds">${s}</span>`;
    }

    tick();
    setInterval(tick, 1000);
})();

// ── Weather (Ensenada — Open-Meteo) ─────────

(function initWeather() {
    const API_URL =
        'https://api.open-meteo.com/v1/forecast?latitude=31.8667&longitude=-116.5964&current=temperature_2m,weather_code,is_day&timezone=America%2FTijuana';

    const WMO = {
        0: ['CLEAR SKY', '☀', '☽'], 1: ['MOSTLY CLEAR', '🌤', '☽'], 2: ['PARTLY CLOUDY', '⛅', '☁'],
        3: ['OVERCAST', '☁', '☁'], 45: ['FOG', '🌫', '🌫'], 48: ['RIME FOG', '🌫', '🌫'],
        51: ['LIGHT DRIZZLE', '🌦', '🌧'], 53: ['DRIZZLE', '🌦', '🌧'], 55: ['HEAVY DRIZZLE', '🌧', '🌧'],
        61: ['LIGHT RAIN', '🌦', '🌧'], 63: ['RAIN', '🌧', '🌧'], 65: ['HEAVY RAIN', '🌧', '🌧'],
        71: ['LIGHT SNOW', '🌨', '🌨'], 73: ['SNOW', '❄', '❄'], 75: ['HEAVY SNOW', '❄', '❄'],
        80: ['RAIN SHOWERS', '🌦', '🌧'], 81: ['MODERATE SHOWERS', '🌧', '🌧'], 82: ['VIOLENT SHOWERS', '⛈', '⛈'],
        95: ['THUNDERSTORM', '⛈', '⛈'], 96: ['STORM W/ HAIL', '⛈', '⛈'], 99: ['STORM W/ HAIL', '⛈', '⛈'],
    };

    async function fetchWeather() {
        try {
            const data = await (await fetch(API_URL)).json();
            const temp = Math.round(data.current.temperature_2m);
            const info = WMO[data.current.weather_code] || WMO[0];
            const isDay = data.current.is_day === 1;

            document.getElementById('ensenada-temp').textContent = `${temp}°C`;
            document.getElementById('ensenada-icon').textContent = isDay ? info[1] : info[2];
            document.getElementById('ensenada-condition').textContent = info[0];
        } catch (err) {
            document.getElementById('ensenada-temp').textContent = '--°C';
            document.getElementById('ensenada-condition').textContent = 'OFFLINE';
            console.error('Weather fetch error:', err);
        }
    }

    fetchWeather();
    setInterval(fetchWeather, 10 * 60 * 1000);
})();

// ── Parallax (Mouse + Gyroscope) ────────────

(function initParallax() {
    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;
    const EASE = 0.06;

    const planet = document.querySelector('.planet-container');
    const ringBack = document.querySelector('.ring-back');
    const ringFront = document.querySelector('.ring-front');
    const shimmer = document.querySelector('.ring-shimmer');
    const moonOrbit = document.querySelector('.moon-orbit');
    const glow = document.getElementById('cursorGlow');

    poster.addEventListener('mousemove', (e) => {
        const rect = poster.getBoundingClientRect();
        mouseX = (e.clientX - rect.left) / rect.width - 0.5;
        mouseY = (e.clientY - rect.top) / rect.height - 0.5;
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });

    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', (e) => {
            if (e.gamma !== null && e.beta !== null) {
                mouseX = Math.max(-0.5, Math.min(0.5, e.gamma / 40));
                mouseY = Math.max(-0.5, Math.min(0.5, (e.beta - 40) / 40));
            }
        });
    }

    (function loop() {
        currentX += (mouseX - currentX) * EASE;
        currentY += (mouseY - currentY) * EASE;

        const px = currentX * 15, py = currentY * 15;
        const rx = currentX * 20, ry = currentY * 8;

        planet.style.transform = `translate(calc(-50% + ${px}px), calc(-50% + ${py}px))`;
        ringBack.style.transform = `translate(calc(-50% + ${rx}px), calc(-50% + ${ry}px))`;
        ringFront.style.transform = `translate(calc(-50% + ${rx}px), calc(-50% + ${ry}px))`;
        shimmer.style.transform = `translate(calc(-50% + ${rx}px), calc(-50% + ${ry}px))`;
        moonOrbit.style.marginLeft = (currentX * 10) + 'px';
        moonOrbit.style.marginTop = (currentY * 10) + 'px';

        requestAnimationFrame(loop);
    })();
})();
