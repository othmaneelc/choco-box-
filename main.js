/* ============================================================
   CHOCO BOX MAROC — main.js (Upgraded)
   All interactive features: particles, scroll bar, word reveal,
   3D tilt, counters, magnetic buttons, lightbox, modal,
   lazy blur-up, ticker, sticky bar, back-to-top, cursor.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ── PAGE TRANSITION ──
    const transEl = document.querySelector('.page-transition');
    if (transEl) {
        requestAnimationFrame(() => {
            transEl.classList.add('loaded');
        });
    }
    document.querySelectorAll('a[href]').forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('javascript') ||
                href.startsWith('tel:') || href.includes('wa.me') || href.includes('instagram.com') ||
                link.target === '_blank') return;
            e.preventDefault();
            if (transEl) {
                transEl.classList.remove('loaded', 'sweep-out');
                transEl.classList.add('sweep-in');
                setTimeout(() => { window.location = link.href; }, 400);
            } else { window.location = link.href; }
        });
    });

    // ── TICKER CLOSE ──
    const ticker = document.querySelector('.ticker-bar');
    const tickerClose = document.querySelector('.ticker-close');
    const navbar = document.querySelector('.navbar');
    if (tickerClose && ticker) {
        tickerClose.addEventListener('click', () => {
            ticker.classList.add('hidden');
            if (navbar) navbar.classList.remove('has-ticker');
        });
    }
    if (ticker && navbar && !ticker.classList.contains('hidden')) {
        navbar.classList.add('has-ticker');
    }

    // ── THROTTLED SCROLL (Progress, Navbar, BTT) ──
    let isScrolling = false;
    const scrollBar = document.querySelector('.scroll-progress');
    const btt = document.querySelector('.back-to-top');
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                if (scrollBar) {
                    const docH = document.documentElement.scrollHeight - window.innerHeight;
                    if (docH > 0) scrollBar.style.width = ((scrollY / docH) * 100) + '%';
                }
                if (navbar) navbar.classList.toggle('scrolled', scrollY > 50);
                if (btt) btt.classList.toggle('visible', scrollY > 400);
                isScrolling = false;
            });
            isScrolling = true;
        }
    }, { passive: true });

    // ── MOBILE NAV ──
    const hamburger = document.querySelector('.hamburger');
    const overlay = document.querySelector('.mobile-menu') || document.querySelector('.mobile-nav-overlay');
    if (hamburger && overlay) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            hamburger.classList.toggle('active');
            overlay.classList.toggle('open');
        });
        overlay.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                hamburger.classList.remove('open', 'active');
                overlay.classList.remove('open');
            });
        });
        overlay.addEventListener('click', e => {
            if (e.target === overlay) {
                hamburger.classList.remove('open', 'active');
                overlay.classList.remove('open');
            }
        });
    }

    // ── SCROLL REVEAL (Intersection Observer) ──
    const revealEls = document.querySelectorAll('.scroll-reveal');
    const revealObs = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05, rootMargin: '0px 0px -50px 0px' });
    revealEls.forEach(el => revealObs.observe(el));

    // Hero text reveal on load
    document.querySelectorAll('.reveal-text').forEach(el => el.classList.add('visible'));

    // ── WORD SPLIT REVEAL ──
    document.querySelectorAll('.word-reveal').forEach(el => {
        const text = el.textContent.trim();
        el.innerHTML = text.split(/\s+/).map(w =>
            `<span class="word" style="margin-right:0.3em;">${w}</span>`
        ).join('');
    });
    const wordObs = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const words = entry.target.querySelectorAll('.word');
                words.forEach((w, i) => { w.style.transitionDelay = (i * 0.08) + 's'; });
                entry.target.classList.add('revealed');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    document.querySelectorAll('.word-reveal').forEach(el => wordObs.observe(el));

    // ── PRINCIPLE 2 — THE STAR OF THE SHOW (PETALS) ──
    const starEl = document.querySelector('.hero-star');
    if (starEl) {
        for (let i = 0; i < 15; i++) {
            const petal = document.createElement('div');
            petal.classList.add('petal');
            petal.style.left = (Math.random() * 120 - 10) + '%';
            petal.style.top = (Math.random() * 100) + '%';
            petal.style.animationDuration = (4 + Math.random() * 6) + 's';
            petal.style.animationDelay = (Math.random() * 6) + 's';
            petal.style.transform = `scale(${0.5 + Math.random()}) rotate(${Math.random() * 360}deg)`;
            starEl.appendChild(petal);
        }
    }

    // ── HERO CANVAS PARTICLES ──
    const heroCanvas = document.getElementById('hero-particles-canvas');
    if (heroCanvas) {
        const ctx = heroCanvas.getContext('2d');
        const colors = ['#C9924A', '#E8D5B0', '#F5ECD7'];
        let particles = [];
        function resizeCanvas() {
            heroCanvas.width = heroCanvas.parentElement.offsetWidth;
            heroCanvas.height = heroCanvas.parentElement.offsetHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        for (let i = 0; i < 40; i++) {
            particles.push({
                x: Math.random() * heroCanvas.width,
                y: Math.random() * heroCanvas.height,
                r: Math.random() * 3 + 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                speed: Math.random() * 0.5 + 0.2,
                opacity: Math.random() * 0.5 + 0.3,
                sway: Math.random() * 2 - 1,
                phase: Math.random() * Math.PI * 2
            });
        }

        let frame = 0;
        function drawParticles() {
            ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
            frame++;
            particles.forEach(p => {
                p.y -= p.speed;
                p.x += Math.sin(frame * 0.01 + p.phase) * p.sway * 0.3;
                if (p.y < -10) { p.y = heroCanvas.height + 10; p.x = Math.random() * heroCanvas.width; }
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.opacity;
                ctx.fill();
            });
            ctx.globalAlpha = 1;
            requestAnimationFrame(drawParticles);
        }
        drawParticles();
    }

    // ── NUMBER COUNTER ANIMATION ──
    function animateCount(el, target, suffix) {
        let start = 0;
        const duration = 1800;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
            start = Math.min(start + step, target);
            el.textContent = Math.floor(start) + suffix;
            if (start >= target) clearInterval(timer);
        }, 16);
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelectorAll('[data-count]').forEach(el => {
                    animateCount(el, +el.dataset.count, el.dataset.suffix || '');
                });
                counterObserver.disconnect();
            }
        });
    }, { threshold: 0.5 });

    const statsEl = document.querySelector('[data-count]');
    if (statsEl) counterObserver.observe(statsEl.closest('section') || statsEl);

    // ── 3D TILT ON PRODUCT CARDS (Desktop) ──
    if (window.matchMedia('(pointer:fine)').matches) {
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = (e.clientX - cx) / (rect.width / 2);
                const dy = (e.clientY - cy) / (rect.height / 2);
                card.style.transform = `perspective(1000px) rotateY(${dx * 8}deg) rotateX(${-dy * 8}deg) translateY(-8px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transition = 'transform 0.5s ease';
                card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translateY(0)';
                setTimeout(() => { card.style.transition = ''; }, 500);
            });
        });
    }

    // ── MAGNETIC BUTTONS (Desktop) ──
    if (window.matchMedia('(pointer:fine)').matches) {
        document.querySelectorAll('.magnetic').forEach(btn => {
            btn.addEventListener('mousemove', e => {
                const rect = btn.getBoundingClientRect();
                const bx = rect.left + rect.width / 2;
                const by = rect.top + rect.height / 2;
                const dx = e.clientX - bx;
                const dy = e.clientY - by;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 80) {
                    const pull = (1 - dist / 80) * 8;
                    btn.style.transform = `translate(${(dx / dist) * pull}px, ${(dy / dist) * pull}px)`;
                }
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transition = 'transform 0.4s ease';
                btn.style.transform = 'translate(0,0)';
                setTimeout(() => { btn.style.transition = ''; }, 400);
            });
        });
    }

    // ── LAZY BLUR-UP IMAGES ──
    document.querySelectorAll('img[data-src]').forEach(img => {
        img.classList.add('blur-up');
        const realSrc = img.getAttribute('data-src');
        const loader = new Image();
        loader.onload = () => {
            img.src = realSrc;
            img.classList.remove('blur-up');
            img.classList.add('loaded');
        };
        loader.onerror = () => {
            img.src = realSrc; // Try anyway
            img.classList.remove('blur-up');
            img.classList.add('loaded');
        };
        // Trigger load when near viewport
        const imgObs = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loader.src = realSrc;
                    obs.unobserve(entry.target);
                }
            });
        }, { rootMargin: '200px' });
        imgObs.observe(img);
    });

    // ── PRODUCT FILTERING ──
    const filterBtns = document.querySelectorAll('.filter-btn');
    const products = document.querySelectorAll('.product-item');
    if (filterBtns.length && products.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const f = btn.getAttribute('data-filter');
                products.forEach(p => {
                    const match = f === 'all' || p.getAttribute('data-category') === f;
                    if (match) {
                        p.style.display = 'block';
                        requestAnimationFrame(() => { p.style.opacity = '1'; p.style.transform = 'translateY(0)'; });
                    } else {
                        p.style.opacity = '0'; p.style.transform = 'translateY(20px)';
                        setTimeout(() => { p.style.display = 'none'; }, 300);
                    }
                });
            });
        });
    }

    // ── QUICK VIEW MODAL ──
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalImg = document.querySelector('.modal-img');
    const modalTitle = document.querySelector('.modal-body h2');
    const modalDesc = document.querySelector('.modal-body .modal-desc');
    const modalPrice = document.querySelector('.modal-body .price');
    const modalBtn = document.querySelector('.modal-body .modal-wa-btn');
    const modalClose = document.querySelector('.modal-close');

    document.querySelectorAll('.quick-view-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
            if (!modalOverlay) return;
            const card = btn.closest('.product-item') || btn.closest('.product-card');
            if (!card) return;
            const img = card.querySelector('img');
            const name = card.querySelector('h3')?.textContent || '';
            const desc = card.querySelector('.product-desc')?.textContent || '';
            const price = card.querySelector('.product-price')?.textContent || '';
            const waLink = card.querySelector('a[href*="wa.me"]')?.href || '#';
            if (modalImg) modalImg.src = img?.src || img?.getAttribute('data-src') || '';
            if (modalTitle) modalTitle.textContent = name;
            if (modalDesc) modalDesc.textContent = desc;
            if (modalPrice) modalPrice.textContent = price;
            if (modalBtn) modalBtn.href = waLink;
            modalOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    });
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modalOverlay.classList.remove('open');
            document.body.style.overflow = '';
        });
    }
    if (modalOverlay) {
        modalOverlay.addEventListener('click', e => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    }

    // ── LIGHTBOX ──
    const lightbox = document.querySelector('.lightbox');
    const lbImg = lightbox?.querySelector('img');
    const lbClose = lightbox?.querySelector('.lightbox-close');
    const lbPrev = lightbox?.querySelector('.lightbox-prev');
    const lbNext = lightbox?.querySelector('.lightbox-next');
    let lbImages = [];
    let lbIdx = 0;

    document.querySelectorAll('.lightbox-trigger').forEach((img, i) => {
        lbImages.push(img.src || img.getAttribute('data-src'));
        img.addEventListener('click', () => {
            if (!lightbox) return;
            lbIdx = i;
            lbImg.src = lbImages[lbIdx];
            lightbox.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    });
    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lbPrev) lbPrev.addEventListener('click', () => navigateLB(-1));
    if (lbNext) lbNext.addEventListener('click', () => navigateLB(1));
    if (lightbox) lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', e => {
        if (!lightbox?.classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLB(-1);
        if (e.key === 'ArrowRight') navigateLB(1);
    });
    function closeLightbox() { lightbox.classList.remove('open'); document.body.style.overflow = ''; }
    function navigateLB(dir) {
        lbIdx = (lbIdx + dir + lbImages.length) % lbImages.length;
        lbImg.src = lbImages[lbIdx];
    }
    // Touch swipe for lightbox
    if (lightbox) {
        let startX = 0;
        lightbox.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
        lightbox.addEventListener('touchend', e => {
            const diff = startX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) navigateLB(diff > 0 ? 1 : -1);
        });
    }

    // ── WHATSAPP FLOAT ENTRANCE ──
    const waFloat = document.querySelector('.btn-whatsapp-float');
    if (waFloat) {
        setTimeout(() => { waFloat.classList.add('entered'); }, 2000);
    }

    // ── BACK TO TOP ──
    if (btt) {
        btt.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ── STICKY ORDER BAR (Mobile) ──
    const stickyBar = document.querySelector('.sticky-order-bar');
    const hero = document.querySelector('.hero, .page-hero, .hero-quote');
    if (stickyBar && hero) {
        const stickyObs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                stickyBar.classList.toggle('visible', !entry.isIntersecting);
            });
        }, { threshold: 0 });
        stickyObs.observe(hero);
    }

    // ── CONTACT FORM HANDLER ──
    const form = document.getElementById('contactForm');
    const success = document.getElementById('successMsg');
    if (form && success) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            success.style.display = 'block';
            success.style.animation = 'fadeUp 0.5s ease forwards';
            form.reset();
            setTimeout(() => success.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
        });
    }
    // ── GPU ACCELERATION CLEANUP ──
    document.addEventListener('animationend', (e) => {
        if (e.target.style) e.target.style.willChange = 'auto';
    });
    document.addEventListener('transitionend', (e) => {
        if (e.target.style) e.target.style.willChange = 'auto';
    });

});  // End DOMContentLoaded
