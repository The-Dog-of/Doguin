document.addEventListener('DOMContentLoaded', () => {

    const preloadSharingan = new Image();
    preloadSharingan.src = 'assets/sharingan.gif';
    
    const preloadCrow = new Image();
    preloadCrow.src = 'assets/crow.gif';

    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    let mouseX = 0, mouseY = 0, outlineX = 0, outlineY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX; mouseY = e.clientY;
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });

    function animateCursor() {
        let ease = 0.15;
        outlineX += (mouseX - outlineX) * ease;
        outlineY += (mouseY - outlineY) * ease;
        
        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;
        
        cursorDot.style.transform = 'translate(-50%, -50%)';
        cursorOutline.style.transform = 'translate(-50%, -50%)';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const canvas = document.getElementById('canvas-bg');
    const ctx = canvas.getContext('2d');
    let particlesArray = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Ember {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = -(Math.random() * 0.8 + 0.2); 
            this.opacity = Math.random() * 0.5 + 0.1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.y < 0) {
                this.y = canvas.height;
                this.x = Math.random() * canvas.width;
            }
        }
        draw() {
            ctx.fillStyle = `rgba(230, 25, 43, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initEmbers() {
        particlesArray = [];
        const particleCount = window.innerWidth > 768 ? 80 : 30; 
        for (let i = 0; i < particleCount; i++) {
            particlesArray.push(new Ember());
        }
    }
    function animateEmbers() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particlesArray.forEach(ember => {
            ember.update();
            ember.draw();
        });
        requestAnimationFrame(animateEmbers);
    }
    initEmbers();
    animateEmbers();

    const btnSummon = document.getElementById('btn-summon');
    const genjutsuLayer = document.querySelector('.genjutsu-layer');

    if (btnSummon) {
        btnSummon.addEventListener('click', (e) => {
            e.preventDefault();
            
            spawnCrows();
            
            setTimeout(() => {
                genjutsuLayer.classList.add('genjutsu-active');
            }, 600);

            setTimeout(() => {
                const contactSection = document.querySelector('#contact');
                window.scrollTo({ top: contactSection.offsetTop, behavior: 'instant' });
                
                setTimeout(() => {
                    genjutsuLayer.classList.remove('genjutsu-active');
                }, 800);
            }, 2500);
        });
    }

    function spawnCrows() {
        const crowCount = window.innerWidth > 768 ? 25 : 12;
        
        for (let i = 0; i < crowCount; i++) {
            const crow = document.createElement('div');
            crow.classList.add('crow-entity');
            document.body.appendChild(crow);

            const startX = Math.random() > 0.5 ? -100 : window.innerWidth + 100;
            const startY = Math.random() * window.innerHeight;
            
            const destX = window.innerWidth / 2 + (Math.random() * 600 - 300);
            const destY = window.innerHeight / 2 + (Math.random() * 600 - 300);
            
            const size = Math.random() * 60 + 30; 
            crow.style.width = `${size}px`;
            crow.style.height = `${size}px`;
            crow.style.left = `${startX}px`;
            crow.style.top = `${startY}px`;
            
            const animation = crow.animate([
                { transform: 'translate(0, 0) scale(0.5)' },
                { transform: `translate(${destX - startX}px, ${destY - startY}px) scale(1.5)` }
            ], {
                duration: 800 + Math.random() * 1000,
                easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
                fill: 'forwards'
            });

            animation.onfinish = () => crow.remove();
        }
    }

    if (window.matchMedia("(min-width: 1024px)").matches) {
        const cards = document.querySelectorAll('[data-tilt]');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const cx = rect.width / 2;
                const cy = rect.height / 2;
                
                const rotateX = ((y - cy) / 30) * -1;
                const rotateY = (x - cx) / 30;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('bar-fill')) {
                    entry.target.style.transform = 'scaleX(1)';
                }
                if (entry.target.classList.contains('count')) {
                    const target = +entry.target.getAttribute('data-target');
                    let current = 0;
                    const increment = target / 60; 
                    
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            entry.target.innerText = Math.ceil(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            entry.target.innerText = target;
                        }
                    };
                    updateCounter();
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.bar-fill').forEach(el => observer.observe(el));
    document.querySelectorAll('.count').forEach(el => observer.observe(el));
});