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
 * Додавання функціональності збільшення зображення при натисканні
 * @param {HTMLElement} galleryItem - Елемент галереї
 */
function addZoomOnClick(galleryItem) {
    const img = galleryItem.querySelector('img');
    let isPressed = false;
    let zoomTimeout;
    
    if (!img) return;
    
    // Обробка натискання миші
    galleryItem.addEventListener('mousedown', function(e) {
        e.preventDefault();
        isPressed = true;
        
        const rect = galleryItem.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        // Встановлюємо точку трансформації
        img.style.transformOrigin = `${x}% ${y}%`;
        
        // Починаємо збільшення через невелику затримку
        zoomTimeout = setTimeout(() => {
            if (isPressed) {
                img.style.transform = 'scale(1.5)';
                img.style.transition = 'transform 0.3s ease';
                galleryItem.style.zIndex = '100';
                console.log(`🔍 Збільшення зображення в точці: ${x.toFixed(1)}%, ${y.toFixed(1)}%`);
            }
        }, 200);
    });
    
    // Обробка відпускання миші
    function handleMouseUp() {
        if (isPressed) {
            isPressed = false;
            clearTimeout(zoomTimeout);
            
            img.style.transform = 'scale(1)';
            img.style.transition = 'transform 0.3s ease';
            galleryItem.style.zIndex = '';
            
            console.log('🔍 Збільшення скасовано');
        }
    }
    
    // Слухачі для різних випадків відпускання
    galleryItem.addEventListener('mouseup', handleMouseUp);
    galleryItem.addEventListener('mouseleave', handleMouseUp);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Запобігаємо перетягування зображення
    img.addEventListener('dragstart', function(e) {
        e.preventDefault();
    });
}

/**
 * Ініціалізація галереї
 */
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        // Додаємо функціональність збільшення при натисканні
        addZoomOnClick(item);
    });
    
    console.log('🎨 Галерея ініціалізована з функцією збільшення');
}

/**
 * Завантаження додаткових елементів галереї
 */
function loadMoreGalleryItems() {
    const galleryGrid = document.querySelector('.gallery-grid');
    const seeMoreBtn = document.querySelector('.see-more-btn');
    
    // Створюємо додаткові елементи галереї
    const additionalItems = [
        { src: './assets/img/gallery-6.jpg', alt: 'Skyscraper' },
        { src: './assets/img/gallery-7.jpg', alt: 'Modern Complex' },
        { src: './assets/img/gallery-8.jpg', alt: 'Business Center' },
        { src: './assets/img/gallery-9.jpg', alt: 'Urban Architecture' }
    ];
    
    additionalItems.forEach((item, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `
            <img src="${item.src}" alt="${item.alt}">
            <div class="gallery-zoom-overlay">
                <img src="./assets/img/bi_zoom.png" alt="Zoom" class="zoom-icon">
            </div>
        `;
        
        // Додаємо функціональність збільшення для нових елементів
        addZoomOnClick(galleryItem);
        
        // Додаємо анімацію появи
        galleryItem.style.opacity = '0';
        galleryItem.style.transform = 'translateY(20px)';
        
        galleryGrid.appendChild(galleryItem);
        
        // Анімація появи з затримкою
        setTimeout(() => {
            galleryItem.style.transition = 'all 0.5s ease';
            galleryItem.style.opacity = '1';
            galleryItem.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Ховаємо кнопку після завантаження
    seeMoreBtn.style.transform = 'scale(0)';
    seeMoreBtn.style.opacity = '0';
    setTimeout(() => {
        seeMoreBtn.style.display = 'none';
    }, 300);
    
    console.log('🖼️ Додаткові елементи галереї завантажено');
}

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
    
    // Ініціалізація галереї
    initGallery();
});