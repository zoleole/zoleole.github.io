// ═══════════════════════════════════════════
// Z O L E O L E — DRA ATMOSFERA
// ═══════════════════════════════════════════

'use strict';

const poster = document.getElementById('poster');
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Loading Curtain ─────────────────────────

(function initLoader() {
    const curtain = document.getElementById('loading');
    const hide = () => curtain.classList.add('hide');

    if (document.readyState === 'complete') {
        setTimeout(hide, 300);
    } else {
        window.addEventListener('load', () => setTimeout(hide, 800));
    }

    // Failsafe: never strand the visitor behind the curtain
    setTimeout(hide, 4000);
})();

// ── Starfield ───────────────────────────────

(function initStars() {
    const STAR_COUNT = 160;
    const frag = document.createDocumentFragment();

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
        frag.appendChild(star);
    }

    poster.appendChild(frag);
})();

// ── Constellations ──────────────────────────
// Retina-sharp canvas; lines plot themselves in like an instrument trace.

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

    let vw = 0, vh = 0;
    let progress = REDUCED_MOTION ? 1 : 0;

    function toPx(group) {
        return group.map(([px, py]) => [(px / 100) * vw, (py / 100) * vh]);
    }

    function pathLength(pts) {
        let len = 0;
        for (let i = 1; i < pts.length; i++) {
            len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
        }
        return len;
    }

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        vw = window.innerWidth;
        vh = window.innerHeight;
        canvas.width = vw * dpr;
        canvas.height = vh * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        draw();
    }

    function draw() {
        ctx.clearRect(0, 0, vw, vh);
        ctx.strokeStyle = 'rgba(232, 96, 28, 0.06)';
        ctx.lineWidth = 0.5;

        GROUPS.forEach(group => {
            const pts = toPx(group);
            const len = pathLength(pts);

            ctx.setLineDash([len]);
            ctx.lineDashOffset = len * (1 - progress);

            ctx.beginPath();
            pts.forEach(([x, y], i) => {
                i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            });
            ctx.stroke();
        });

        ctx.setLineDash([]);
    }

    function animateIn() {
        const DURATION = 1800;
        const start = performance.now();

        (function frame(now) {
            const t = Math.min((now - start) / DURATION, 1);
            progress = 1 - Math.pow(1 - t, 3); // ease-out cubic
            draw();
            if (t < 1) requestAnimationFrame(frame);
        })(start);
    }

    resize();
    window.addEventListener('resize', resize);

    if (!REDUCED_MOTION) {
        setTimeout(() => requestAnimationFrame(animateIn), 1800);
    }
})();

// ── Shooting Stars ──────────────────────────

(function initShootingStars() {
    if (REDUCED_MOTION) return;

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

        // Trail rotated by `angle` points opposite the velocity — behind the star.
        ss.style.cssText = `
      left: ${startX}%;
      top: ${startY}%;
      --shoot-dx: ${Math.cos(rad) * distance}px;
      --shoot-dy: ${Math.sin(rad) * distance}px;
      --trail-len: ${trailLen}px;
      --trail-angle: ${angle}deg;
      animation: shootingStar ${dur}s ease-out forwards;
    `;
        poster.appendChild(ss);
        setTimeout(() => ss.remove(), dur * 1000 + 100);
    }

    function schedule() {
        setTimeout(() => {
            if (!document.hidden) spawn();
            schedule();
        }, 3000 + Math.random() * 8000);
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

    const frag = document.createDocumentFragment();

    POSITIONS.forEach(([x, y], i) => {
        const cross = document.createElement('div');
        cross.className = 'cross';
        cross.textContent = '+';
        cross.style.left = x + '%';
        cross.style.top = y + '%';
        cross.style.animationDelay = (0.3 + i * 0.04) + 's';
        cross.style.fontSize = (11 * (0.7 + Math.random() * 0.6)) + 'px';
        cross.style.opacity = 0.2 + Math.random() * 0.4;
        frag.appendChild(cross);
    });

    poster.appendChild(frag);
})();

// ── Floating Particles ──────────────────────

(function initParticles() {
    if (REDUCED_MOTION) return;

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
    setInterval(() => {
        if (!document.hidden) spawn();
    }, 600);
})();

// ── Clock (Ensenada) ────────────────────────

(function initClock() {
    const el = document.getElementById('ensenada-time');

    const fmt = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'America/Tijuana',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h23',
    });

    function tick() {
        const parts = fmt.formatToParts(new Date());
        const get = type => parts.find(p => p.type === type).value;
        el.innerHTML = `${get('hour')}:${get('minute')}:<span class="seconds">${get('second')}</span>`;
    }

    // Re-align to the next second boundary each tick — no drift.
    (function loop() {
        tick();
        setTimeout(loop, 1000 - (Date.now() % 1000) + 5);
    })();
})();

// ── Weather (Ensenada — Open-Meteo) ─────────

(function initWeather() {
    const API_URL =
        'https://api.open-meteo.com/v1/forecast?latitude=31.8667&longitude=-116.5964&current=temperature_2m,weather_code,is_day&timezone=America%2FTijuana';

    const REFRESH_MS = 10 * 60 * 1000;

    const WMO = {
        0: ['CLEAR SKY', '☀', '☽'], 1: ['MOSTLY CLEAR', '🌤', '☽'], 2: ['PARTLY CLOUDY', '⛅', '☁'],
        3: ['OVERCAST', '☁', '☁'], 45: ['FOG', '🌫', '🌫'], 48: ['RIME FOG', '🌫', '🌫'],
        51: ['LIGHT DRIZZLE', '🌦', '🌧'], 53: ['DRIZZLE', '🌦', '🌧'], 55: ['HEAVY DRIZZLE', '🌧', '🌧'],
        61: ['LIGHT RAIN', '🌦', '🌧'], 63: ['RAIN', '🌧', '🌧'], 65: ['HEAVY RAIN', '🌧', '🌧'],
        71: ['LIGHT SNOW', '🌨', '🌨'], 73: ['SNOW', '❄', '❄'], 75: ['HEAVY SNOW', '❄', '❄'],
        80: ['RAIN SHOWERS', '🌦', '🌧'], 81: ['MODERATE SHOWERS', '🌧', '🌧'], 82: ['VIOLENT SHOWERS', '⛈', '⛈'],
        95: ['THUNDERSTORM', '⛈', '⛈'], 96: ['STORM W/ HAIL', '⛈', '⛈'], 99: ['STORM W/ HAIL', '⛈', '⛈'],
    };

    let lastSuccess = 0;

    async function fetchWeather() {
        const ctrl = new AbortController();
        const timeout = setTimeout(() => ctrl.abort(), 8000);

        try {
            const res = await fetch(API_URL, { signal: ctrl.signal });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();

            const temp = Math.round(data.current.temperature_2m);
            const info = WMO[data.current.weather_code] || WMO[0];
            const isDay = data.current.is_day === 1;

            document.getElementById('ensenada-temp').textContent = `${temp}°C`;
            document.getElementById('ensenada-icon').textContent = isDay ? info[1] : info[2];
            document.getElementById('ensenada-condition').textContent = info[0];
            lastSuccess = Date.now();
        } catch (err) {
            // Keep showing the last good reading; only declare OFFLINE if we never had one.
            if (!lastSuccess) {
                document.getElementById('ensenada-temp').textContent = '--°C';
                document.getElementById('ensenada-icon').textContent = '◌';
                document.getElementById('ensenada-condition').textContent = 'OFFLINE';
            }
            console.warn('Weather fetch error:', err);
        } finally {
            clearTimeout(timeout);
        }
    }

    fetchWeather();
    setInterval(() => {
        if (!document.hidden) fetchWeather();
    }, REFRESH_MS);

    // Returning to the tab with stale data? Refresh right away.
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && Date.now() - lastSuccess > REFRESH_MS) fetchWeather();
    });
})();

// ── Parallax (Pointer + Gyroscope) ──────────

(function initParallax() {
    if (REDUCED_MOTION) return;

    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    const EASE = 0.06;

    const planet = document.querySelector('.planet-container');
    const ringBack = document.querySelector('.ring-back');
    const ringFront = document.querySelector('.ring-front');
    const shimmer = document.querySelector('.ring-shimmer');
    const moonOrbit = document.querySelector('.moon-orbit');
    const glow = document.getElementById('cursorGlow');

    // The ringIn entrance (fill-mode: both) outranks inline styles in the
    // cascade, so parallax transforms would never apply. Once the entrance
    // finishes, drop the animation — its end state matches the base
    // transform, so there is no visual jump.
    [ringBack, ringFront, shimmer].forEach(el => {
        el.addEventListener('animationend', (e) => {
            if (e.animationName === 'ringIn') el.style.animation = 'none';
        }, { once: true });
    });

    let glowOn = false;

    poster.addEventListener('pointermove', (e) => {
        targetX = e.clientX / window.innerWidth - 0.5;
        targetY = e.clientY / window.innerHeight - 0.5;

        if (e.pointerType !== 'touch') {
            glow.style.transform =
                `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
            if (!glowOn) {
                glow.classList.add('on');
                glowOn = true;
            }
        }
    }, { passive: true });

    // Gyroscope — iOS requires an explicit permission grant from a tap.
    function onOrient(e) {
        if (e.gamma !== null && e.beta !== null) {
            targetX = Math.max(-0.5, Math.min(0.5, e.gamma / 40));
            targetY = Math.max(-0.5, Math.min(0.5, (e.beta - 40) / 40));
        }
    }

    const chip = document.getElementById('tiltChip');
    const needsPermission =
        typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function';

    if (needsPermission) {
        chip.hidden = false;
        chip.addEventListener('click', async () => {
            try {
                const state = await DeviceOrientationEvent.requestPermission();
                if (state === 'granted') {
                    window.addEventListener('deviceorientation', onOrient);
                }
            } catch (err) {
                console.warn('Motion permission error:', err);
            }
            chip.classList.add('hide');
            setTimeout(() => { chip.hidden = true; }, 450);
        });
    } else if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', onOrient);
    }

    (function loop() {
        currentX += (targetX - currentX) * EASE;
        currentY += (targetY - currentY) * EASE;

        const px = currentX * 15, py = currentY * 15;
        const rx = currentX * 20, ry = currentY * 8;

        planet.style.transform = `translate(calc(-50% + ${px}px), calc(-50% + ${py}px))`;
        ringBack.style.transform = `translate(calc(-50% + ${rx}px), calc(-50% + ${ry}px))`;
        ringFront.style.transform = `translate(calc(-50% + ${rx}px), calc(-50% + ${ry}px))`;
        shimmer.style.transform = `translate(calc(-50% + ${rx}px), calc(-50% + ${ry}px))`;
        moonOrbit.style.setProperty('--mx', (currentX * 10) + 'px');
        moonOrbit.style.setProperty('--my', (currentY * 10) + 'px');

        requestAnimationFrame(loop);
    })();
})();