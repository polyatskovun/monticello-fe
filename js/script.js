/**
 * Плавна прокрутка до вказаної секції
 * @param {string} sectionId - ID секції для прокрутки
 */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

/**
 * Розгортання/згортання деталей проекту
 * @param {string} projectId - ID проекту для розгортання деталей
 */
function toggleDetails(projectId) {
    const detailsElement = document.getElementById(projectId + '-details');
    const button = event.target;
    
    if (!detailsElement) {
        console.error(`Element with ID ${projectId}-details not found`);
        return;
    }
    
    const isExpanded = detailsElement.classList.contains('show');
    
    if (isExpanded) {
        // Згортання деталей
        detailsElement.classList.remove('show');
        button.classList.remove('expanded');
        button.textContent = 'MORE DETAILS';
        console.log(`🔼 Деталі проекту ${projectId} згорнуто`);
    } else {
        // Розгортання деталей
        detailsElement.classList.add('show');
        button.classList.add('expanded');
        button.textContent = 'HIDE DETAILS';
        console.log(`🔽 Деталі проекту ${projectId} розгорнуто`);
        
        // Плавна прокрутка до деталей через невелику затримку
        setTimeout(() => {
            detailsElement.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }, 300);
    }
}

/**
 * Ініціалізація після завантаження DOM
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Monticello website loaded successfully');
    
    // Додаткова функціональність для навігації
    initNavigation();
    
    // Ініціалізація соціальних посилань
    initSocialLinks();
    
    // Ініціалізація кнопок деталей
    initDetailsButtons();
});

/**
 * Ініціалізація кнопок деталей проектів
 */
function initDetailsButtons() {
    const detailButtons = document.querySelectorAll('.service-btn');
    
    detailButtons.forEach(button => {
        // Додаємо стрілку до кнопки
        if (!button.textContent.includes('▼') && !button.textContent.includes('▲')) {
            button.textContent += ' ▼';
        }
        
        // Додаємо hover ефект
        button.addEventListener('mouseenter', function() {
            if (!this.classList.contains('expanded')) {
                this.style.transform = 'translateY(-2px) scale(1.02)';
            }
        });
        
        button.addEventListener('mouseleave', function() {
            if (!this.classList.contains('expanded')) {
                this.style.transform = 'translateY(-2px)';
            }
        });
    });
    
    console.log('📋 Кнопки деталей проектів ініціалізовано');
}

/**
 * Ініціалізація навігації з активними станами
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Видаляємо активний клас з усіх посилань
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Додаємо активний клас до натиснутого посилання
            this.classList.add('active');
            
            // Отримуємо ID секції з href
            const targetId = this.getAttribute('href').substring(1);
            
            // Плавна прокрутка до секції
            if (targetId) {
                e.preventDefault();
                scrollToSection(targetId);
            }
        });
    });
}

/**
 * Ініціалізація соціальних посилань з логуванням
 */
function initSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach((link, index) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const socialNames = ['Facebook', 'Twitter', 'Instagram'];
            const socialName = socialNames[index] || 'Social Media';
            
            console.log(`🔗 Клік по ${socialName}`);
            
            // Тут можна додати реальні посилання на соціальні мережі
            // window.open('https://facebook.com/monticello', '_blank');
        });
    });
}

/**
 * Плавне з'явлення елементів при прокрутці
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Спостерігаємо за елементами, які потрібно анімувати
    const animatedElements = document.querySelectorAll('.service-item, .news-card');
    animatedElements.forEach(el => observer.observe(el));
}

// Ініціалізуємо анімації прокрутки після завантаження
document.addEventListener('DOMContentLoaded', initScrollAnimations);