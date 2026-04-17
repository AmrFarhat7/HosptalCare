// ============================================
// MOBILE-FRIENDLY COMPLETE SCRIPT
// ============================================

// Global Auth Manager (LocalStorage only - No Server needed)
class AuthManager {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('hcc_users') || '[]');
        this.currentUser = JSON.parse(localStorage.getItem('hcc_currentUser')) || null;
        this.init();
    }

    init() {
        this.updateUI();
        console.log('Auth initialized');
    }

    register(name, email, phone, password, confirmPassword) {
        if (password.length < 6) return { success: false, message: 'كلمة المرور 6 أحرف على الأقل!' };
        if (password !== confirmPassword) return { success: false, message: 'كلمات المرور غير متطابقة!' };
        if (this.users.find(u => u.email === email)) return { success: false, message: 'الإيميل موجود مسبقاً!' };

        const newUser = {
            id: Date.now(),
            name: name.trim(),
            email: email.toLowerCase().trim(),
            phone: phone.trim(),
            password,
            joined: new Date().toLocaleDateString('ar-EG')
        };

        this.users.push(newUser);
        localStorage.setItem('hcc_users', JSON.stringify(this.users));
        this.login(email, password);
        return { success: true, message: '✅ تم التسجيل بنجاح!' };
    }

    login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        if (user) {
            this.currentUser = user;
            localStorage.setItem('hcc_currentUser', JSON.stringify(user));
            this.updateUI();
            return { success: true, message: '✅ مرحباً بك!' };
        }
        return { success: false, message: '❌ بيانات خاطئة!' };
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('hcc_currentUser');
        this.updateUI();
        closeAllModals();
    }

    updateUI() {
        const loginBtn = document.querySelector('.login-btn');
        const registerBtn = document.querySelector('.register-btn');
        const userProfile = document.getElementById('userProfile');
        const userName = document.getElementById('userNameDisplay');

        if (this.currentUser) {
            if (loginBtn) loginBtn.style.display = 'none';
            if (registerBtn) registerBtn.style.display = 'none';
            if (userProfile) userProfile.classList.remove('hidden');
            if (userName) userName.textContent = this.currentUser.name.slice(0, 12);
        } else {
            if (loginBtn) loginBtn.style.display = 'inline-flex';
            if (registerBtn) registerBtn.style.display = 'inline-flex';
            if (userProfile) userProfile.classList.add('hidden');
        }
    }

    showMessage(formId, message, isSuccess) {
        const msgEl = document.getElementById(formId + 'Message');
        if (msgEl) {
            msgEl.textContent = message;
            msgEl.className = `message ${isSuccess ? 'success' : 'error'}`;
            msgEl.classList.remove('hidden');
            setTimeout(() => msgEl.classList.add('hidden'), 4000);
        }
    }
}

// Create Auth Instance
const auth = new AuthManager();

// ============================================
// MOBILE PERFECT MODALS
// ============================================
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.classList.add('no-scroll');
        setTimeout(() => modal.classList.add('show'), 10);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.classList.remove('no-scroll');
        }, 300);
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.classList.remove('no-scroll');
        }, 300);
    });
}

// Close on backdrop click
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        closeAllModals();
    }
});

// Close on ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeAllModals();
});

// ============================================
// PERFECT MOBILE NAVIGATION
// ============================================
function initMobileNav() {
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('navMenu');
    const headerButtons = document.getElementById('headerButtons');

    if (!mobileMenuBtn || !navMenu) return;

    mobileMenuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Close menu on overlay click
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });

    // Close menu on link click
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
}

// ============================================
// FORM INITIALIZATION
// ============================================
function initForms() {
    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const result = auth.login(email, password);
            auth.showMessage('login', result.message, result.success);
            if (result.success) {
                this.reset();
                setTimeout(closeAllModals, 1500);
            }
        });
    }

    // Register Form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('regName').value;
            const email = document.getElementById('regEmail').value;
            const phone = document.getElementById('regPhone').value;
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('regConfirmPassword').value;
            
            const result = auth.register(name, email, phone, password, confirmPassword);
            auth.showMessage('register', result.message, result.success);
            if (result.success) {
                this.reset();
                setTimeout(closeAllModals, 1500);
            }
        });
    }

    // Other Forms
    document.querySelectorAll('form:not(#loginForm):not(#registerForm)').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('✅ تم إرسال الطلب بنجاح!\nسنتصل بك خلال 24 ساعة');
            this.reset();
            closeAllModals();
        });
    });

    // Tab Switching (Touch Friendly)
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            const formId = this.dataset.tab + 'Form';
            const targetForm = document.getElementById(formId);
            if (targetForm) targetForm.classList.add('active');
        });
        btn.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        });
        btn.addEventListener('touchend', function() {
            this.classList.remove('touch-active');
        });
    });
}

// ============================================
// SMOOTH SCROLLING & EFFECTS
// ============================================
function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile menu if open
        const mobileMenuBtn = document.getElementById('mobile-menu');
        const navMenu = document.getElementById('navMenu');
        if (mobileMenuBtn && navMenu) {
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    }
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        scrollToSection(targetId);
    });
});

// Navbar scroll effect
let ticking = false;
function updateHeader() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
    }
});

// ============================================
// MOBILE ANIMATIONS (Lightweight)
// ============================================
function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.service-card, .stat-item').forEach(el => {
        observer.observe(el);
    });
}

// Stats Counter (Mobile Optimized)
function animateCounters() {
    const counters = document.querySelectorAll('.stat-item h3');
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
        let current = 0;
        const duration = 2000;
        const stepTime = 20;
        const steps = duration / stepTime;
        const increment = target / steps;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target + (target > 1000 ? 'K+' : '+');
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current) + (target > 1000 ? 'K+' : '+');
            }
        }, stepTime);
    });
}

// ============================================
// MOBILE UTILITIES
// ============================================
function createBackToTop() {
    const btn = document.createElement('button');
    btn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    btn.id = 'backToTop';
    btn.className = 'back-to-top';
    
    document.body.appendChild(btn);

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    });
}

// Prevent zoom on iOS
document.addEventListener('touchstart', function(event) {
    if (event.touches.length > 1) {
        event.preventDefault();
    }
}, { passive: false });

let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏥 HomeCare Connect Loaded');
    
    initMobileNav();
    initForms();
    initAnimations();
    createBackToTop();
    
    // Date picker
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.querySelector('input[type="date"]');
    if (dateInput) {
        dateInput.min = today;
        dateInput.value = today;
    }
    
    // Loading animation
    document.body.classList.add('loaded');
});

// Service worker for offline (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js');
    });
}
// ============================================
// MOBILE NAVBAR - PERFECT WORKING VERSION
// ============================================

// Mobile Navigation - النسخة المثالية
function initMobileNavbar() {
    const hamburger = document.getElementById('mobile-menu');
    const mobileNav = document.getElementById('navMenu');
    const body = document.body;

    if (!hamburger || !mobileNav) {
        console.warn('Mobile menu elements not found');
        return;
    }

    console.log('✅ Mobile Navbar Initialized');

    // Toggle Menu
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        
        // Toggle Classes
        this.classList.toggle('active');
        mobileNav.classList.toggle('active');
        body.classList.toggle('menu-open');
        
        // Visual Feedback
        if (this.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close Menu Methods
    function closeMobileMenu() {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
        body.classList.remove('menu-open');
        document.body.style.overflow = '';
    }

    // Close on Link Click
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', function(e) {
            closeMobileMenu();
            // Smooth scroll
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Close on Overlay Click
    document.addEventListener('click', function(e) {
        if (mobileNav.classList.contains('active') && 
            !hamburger.contains(e.target) && 
            !mobileNav.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Close on ESC Key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Swipe to Close (Mobile)
    let startX = 0;
    mobileNav.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
    });

    mobileNav.addEventListener('touchmove', function(e) {
        if (!mobileNav.classList.contains('active')) return;
        
        const currentX = e.touches[0].clientX;
        const diffX = startX - currentX;
        
        if (diffX > 50) { // Swipe left to close
            closeMobileMenu();
        }
    });

    // Prevent Body Scroll When Menu Open
    body.addEventListener('touchmove', function(e) {
        if (body.classList.contains('menu-open')) {
            e.preventDefault();
        }
    }, { passive: false });
}

// ============================================
// MAIN INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 HomeCare Connect - Mobile Ready');
    
    // Initialize Everything
    initMobileNavbar();  // أهم دالة للـ Navbar
    initForms();
    initAnimations();
    createBackToTop();
    auth.updateUI();
    
    // Mobile viewport fix
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    window.addEventListener('resize', () => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
});

// Window Load
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    console.log('✅ All systems ready!');
});

// ============================================
// باقي الدوال (Auth, Forms, Animations) من الكود السابق
// ============================================
// ... ضع باقي الكود من الرد السابق هنا (AuthManager, initForms, etc.)
// ============================================
// HOMECARE CONNECT - MOBILE PERFECT VERSION
// ============================================

console.log('🏥 Loading HomeCare Connect...');

// 1. AUTH SYSTEM (يعمل بدون خادم)
const authData = {
    users: JSON.parse(localStorage.getItem('hcc_users') || '[]'),
    currentUser: JSON.parse(localStorage.getItem('hcc_user') || 'null'),
    
    register(name, email, phone, password, confirmPassword) {
        if (password.length < 6) return {ok: false, msg: 'كلمة مرور 6 أحرف على الأقل'};
        if (password !== confirmPassword) return {ok: false, msg: 'كلمات المرور غير متطابقة'};
        if (this.users.find(u => u.email === email)) return {ok: false, msg: 'البريد الإلكتروني موجود'};
        
        const user = {
            id: Date.now(),
            name,
            email: email.toLowerCase(),
            phone,
            password,
            date: new Date().toLocaleDateString('ar')
        };
        
        this.users.push(user);
        localStorage.setItem('hcc_users', JSON.stringify(this.users));
        this.login(email, password);
        return {ok: true, msg: '✅ تسجيل ناجح! مرحباً بك'};
    },
    
    login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        if (user) {
            this.currentUser = user;
            localStorage.setItem('hcc_user', JSON.stringify(user));
            this.updateButtons();
            return {ok: true, msg: '✅ تم تسجيل الدخول'};
        }
        return {ok: false, msg: '❌ بيانات خاطئة'};
    },
    
    logout() {
        this.currentUser = null;
        localStorage.removeItem('hcc_user');
        this.updateButtons();
        closeAllModals();
    },
    
    updateButtons() {
        const loginBtn = document.querySelector('.login-btn');
        const regBtn = document.querySelector('.register-btn');
        const profile = document.getElementById('userProfile');
        const nameSpan = document.getElementById('userNameDisplay');
        
        if (this.currentUser) {
            if (loginBtn) loginBtn.style.display = 'none';
            if (regBtn) regBtn.style.display = 'none';
            if (profile) profile.classList.remove('hidden');
            if (nameSpan) nameSpan.textContent = this.currentUser.name;
        } else {
            if (loginBtn) loginBtn.style.display = 'inline-flex';
            if (regBtn) regBtn.style.display = 'inline-flex';
            if (profile) profile.classList.add('hidden');
        }
    },
    
    showMsg(formId, msg, isOk) {
        const el = document.getElementById(formId + 'Message');
        if (el) {
            el.textContent = msg;
            el.className = isOk ? 'message success' : 'message error';
            el.classList.remove('hidden');
            setTimeout(() => el.classList.add('hidden'), 3000);
        }
    }
};

// 2. MODALS
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.style.display = 'flex';
        document.body.classList.add('modal-open');
        setTimeout(() => modal.classList.add('active'), 50);
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }, 300);
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(m => {
        m.classList.remove('active');
        setTimeout(() => {
            m.style.display = 'none';
            document.body.classList.remove('modal-open');
        }, 300);
    });
}

// 3. MOBILE NAVBAR - الدالة الأساسية
function initNavbar() {
    const hamburger = document.getElementById('mobile-menu');
    const nav = document.getElementById('navMenu');
    
    // if (!hamburger || !nav) {
    //     console.error('Navbar elements missing');
    //     return;
    // }
    
    console.log('✅ Navbar initialized');
    
    // Open/Close
    hamburger.onclick = function(e) {
        e.stopPropagation();
        hamburger.classList.toggle('open');
        nav.classList.toggle('show');
        document.body.classList.toggle('nav-open');
    };
    
    // Close methods
    function closeNav() {
        hamburger.classList.remove('open');
        nav.classList.remove('show');
        document.body.classList.remove('nav-open');
    }
    
    // Links
    nav.querySelectorAll('a').forEach(link => {
        link.onclick = function(e) {
            e.preventDefault();
            closeNav();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({behavior: 'smooth'});
        };
    });
    
    // Outside click
    document.onclick = function(e) {
        if (nav.classList.contains('show') && 
            !hamburger.contains(e.target) && 
            !nav.contains(e.target)) {
            closeNav();
        }
    };
}

// 4. FORMS
function initForms() {
    // Login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.onsubmit = function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const pass = document.getElementById('loginPassword').value;
            const result = authData.login(email, pass);
            authData.showMsg('login', result.msg, result.ok);
            if (result.ok) {
                this.reset();
                setTimeout(closeAllModals, 1000);
            }
        };
    }
    
    // Register
    const regForm = document.getElementById('registerForm');
    if (regForm) {
        regForm.onsubmit = function(e) {
            e.preventDefault();
            const name = document.getElementById('regName').value;
            const email = document.getElementById('regEmail').value;
            const phone = document.getElementById('regPhone').value;
            const pass = document.getElementById('regPassword').value;
            const confirm = document.getElementById('regConfirmPassword').value;
            
            const result = authData.register(name, email, phone, pass, confirm);
            authData.showMsg('register', result.msg, result.ok);
            if (result.ok) {
                this.reset();
                setTimeout(closeAllModals, 1000);
            }
        };
    }
    
    // Other forms
    document.querySelectorAll('form').forEach(form => {
        if (!form.id || (form.id !== 'loginForm' && form.id !== 'registerForm')) {
            form.onsubmit = function(e) {
                e.preventDefault();
                alert('✅ تم الإرسال بنجاح!');
                this.reset();
                closeAllModals();
            };
        }
    });
}

// 5. TABS
function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.onclick = function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(this.dataset.tab + 'Form').classList.add('active');
        };
    });
}

// 6. SMOOTH SCROLL
function initScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.onclick = function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({behavior: 'smooth'});
        };
    });
}

// 7. BACK TO TOP
function initBackTop() {
    const btn = document.createElement('button');
    btn.innerHTML = '↑';
    btn.id = 'backtop';
    btn.style.cssText = `
        position:fixed;bottom:20px;right:20px;width:55px;height:55px;
        background:#e74c3c;color:white;border:none;border-radius:50%;font-size:20px;
        cursor:pointer;opacity:0;transition:all .3s;z-index:999;display:none;
    `;
    document.body.appendChild(btn);
    
    btn.onclick = () => window.scrollTo({top:0,behavior:'smooth'});
    window.onscroll = () => {
        if (window.scrollY > 300) {
            btn.style.opacity = '1';
            btn.style.display = 'block';
        } else {
            btn.style.opacity = '0';
        }
    };
}

// ============================================
// START EVERYTHING
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Initializing...');
    
    authData.updateButtons();
    initNavbar();      // navbar موبايل
    initForms();       // register/login
    initTabs();        // tabs
    initScroll();      // smooth scroll
    initBackTop();     // back to top
    
    // Date picker
    const today = new Date().toISOString().split('T')[0];
    const dateInp = document.querySelector('input[type="date"]');
    if (dateInp) {
        dateInp.value = dateInp.min = today;
    }
    
    console.log('✅ Ready!');
});

// Profile logout
document.addEventListener('click', function(e) {
    if (e.target.closest('#userProfile')) {
        authData.logout();
    }
});
document.addEventListener('DOMContentLoaded', function () {

    // فتح Login
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function () {
            openModal('loginModal');
        });
    }

    // فتح Register
    const registerBtn = document.getElementById('registerBtn');
    if (registerBtn) {
        registerBtn.addEventListener('click', function () {
            openModal('registerModal');
        });
    }

    // Book Appointment buttons (كل الأزرار اللي فيها Book Now)
    document.querySelectorAll('.btn-primary').forEach(btn => {
        if (btn.textContent.includes('Book')) {
            btn.addEventListener('click', function () {
                openModal('patientModal');
            });
        }
    });

});
document.querySelectorAll('.close').forEach(btn => {
    btn.addEventListener('click', function () {
        const modal = this.closest('.modal');
        if (modal) {
            modal.style.display = 'none';
        }
    });
});
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});
const menuBtn = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', function () {
        menuBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
document.querySelectorAll('.doctor-card .btn').forEach(btn => {
    btn.addEventListener('click', () => {
        openModal('patientModal');
    });
});
document.getElementById('userProfile').addEventListener('click', () => {
    auth.logout();
});
document.addEventListener('DOMContentLoaded', function () {

    // LOGIN BUTTON
    document.getElementById('loginBtn')?.addEventListener('click', () => {
        openModal('loginModal');
    });

    // REGISTER BUTTON
    document.getElementById('registerBtn')?.addEventListener('click', () => {
        openModal('registerModal');
    });

    // BOOK NOW
    document.querySelectorAll('.doctor-card .btn').forEach(btn => {
        btn.addEventListener('click', () => {
            openModal('patientModal');
        });
    });

    // LOGOUT
    document.getElementById('userProfile')?.addEventListener('click', () => {
        auth.logout();
    });

});
const menu = document.getElementById("navMenu");
const toggle = document.getElementById("mobile-menu");

toggle.addEventListener("click", () => {
    menu.classList.toggle("active");
});
fetch("http://localhost:5000/api/hello")
  .then(res => res.json())
  .then(data => console.log(data));