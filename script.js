// Navigation Scroll Effect
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-link');

menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Active Link Highlighting
const sections = document.querySelectorAll('section');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navLinksItems.forEach(li => {
        li.classList.remove('active');
        if (li.getAttribute('href').includes(current)) {
            li.classList.add('active');
        }
    });
});

// Typing Effect
const typingText = document.querySelector('.typing-text');
const words = ["Digital Experiences", "Web Applications", "User Interfaces", "Creative Solutions"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
        typingText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        setTimeout(type, 2000);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(type, 500);
    } else {
        setTimeout(type, isDeleting ? 100 : 200);
    }
}

/* Contact form: client-side validation + submit handler */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    const sendBtn = contactForm.querySelector('#send-btn');
    const spinner = contactForm.querySelector('.btn-spinner');
    const feedback = document.getElementById('form-feedback');

    function setLoading(isLoading) {
        if (isLoading) {
            sendBtn.setAttribute('disabled', '');
            spinner.style.display = 'inline-block';
            sendBtn.querySelector('.btn-text').textContent = 'Sending...';
        } else {
            sendBtn.removeAttribute('disabled');
            spinner.style.display = 'none';
            sendBtn.querySelector('.btn-text').textContent = 'Send message';
        }
    }

    function showFeedback(message, ok = true) {
        feedback.textContent = message;
        feedback.style.color = ok ? 'var(--primary)' : 'var(--text-muted)';
    }

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        feedback.textContent = '';

        // Simple validation
        const name = contactForm.querySelector('#name');
        const email = contactForm.querySelector('#email');
        const subject = contactForm.querySelector('#subject');
        const message = contactForm.querySelector('#message');
        const consent = contactForm.querySelector('#consent');

        // Check required
        if (!name.value.trim()) { name.focus(); showFeedback('Please enter your full name.', false); return; }
        if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { email.focus(); showFeedback('Please enter a valid email address.', false); return; }
        if (!subject.value.trim()) { subject.focus(); showFeedback('Please provide a short subject.', false); return; }
        if (!message.value.trim()) { message.focus(); showFeedback('Please add a message so I know how I can help.', false); return; }
        if (!consent.checked) { consent.focus(); showFeedback('Please confirm consent to receive a reply.', false); return; }

        // Show loader
        setLoading(true);

        // Build FormData and POST
        try {
            const formData = new FormData(contactForm);

            const endpoint = contactForm.getAttribute('action') || contactForm.dataset.endpoint;

            // If endpoint not set, simulate success
            if (!endpoint) {
                await new Promise(res => setTimeout(res, 900));
                showFeedback('Thanks! Your message was sent (simulated). I will reply soon.');
                contactForm.reset();
                setLoading(false);
                return;
            }

            // send to configured endpoint
            const res = await fetch(endpoint, {
                method: contactForm.getAttribute('method') || 'POST',
                body: formData
            });

            if (!res.ok) throw new Error('Server error');

            let data = {};
            try { data = await res.json(); } catch (_) { /* ignore */ }

            // Handle common success result
            showFeedback(data.message || 'Message sent — I will get back to you shortly.');
            contactForm.reset();

        } catch (err) {
            console.error('Contact form error', err);
            showFeedback('Could not send your message right now — please try again later.', false);
        } finally {
            setLoading(false);
        }
    });
}

// Start typing effect
if (typingText) {
    type();
}

// Tilt Effect for Cards
const cards = document.querySelectorAll('.tilt-card');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10; // Max rotation deg
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
});

// Intersection Observer for Fade-in Animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'all 0.6s ease-out';
    observer.observe(section);
});

// Custom Cursor Logic
const cursor = document.querySelector('.mouse-cursor');
const cursorDot = document.querySelector('.mouse-cursor-dot');

if (cursor && cursorDot) {
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Dot follows instantly
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Circle follows with CSS transition
        cursor.style.left = `${posX}px`;
        cursor.style.top = `${posY}px`;
    });

    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .btn, .card, .skill-item, .social-icon, .glass-card');

    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
        });
    });
}

// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    const themeIcon = themeToggle.querySelector('i');
    const html = document.documentElement;

    // Check for saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    const currentTheme = savedTheme || systemTheme;

    // Apply theme
    if (currentTheme === 'light') {
        html.setAttribute('data-theme', 'light');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }

    // Toggle event
    themeToggle.addEventListener('click', () => {
        const isLight = html.getAttribute('data-theme') === 'light';

        if (isLight) {
            html.removeAttribute('data-theme');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            html.setAttribute('data-theme', 'light');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });
}
