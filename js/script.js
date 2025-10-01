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

/**
 * Глобальна змінна для карти
 */
let map = null;
let userMarker = null;

/**
 * Ініціалізація карти
 */
function initMap() {
    // Створюємо карту з центром у Києві (за замовчуванням)
    map = L.map('map').setView([50.4501, 30.5234], 10);
    
    // Додаємо шар карти
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);
    
    console.log('🗺️ Карта ініціалізована');
}

/**
 * Ініціалізація секції місцезнаходження
 */
function initLocationSection() {
    // Ініціалізуємо карту після завантаження бібліотеки Leaflet
    if (typeof L !== 'undefined') {
        initMap();
        console.log('🗺️ Секція місцезнаходження ініціалізована');
        
        // Автоматично отримуємо місцезнаходження при завантаженні сторінки
        setTimeout(() => {
            getCurrentLocation();
        }, 500); // Невелика затримка для ініціалізації карти
    } else {
        console.error('❌ Бібліотека Leaflet не завантажена');
    }
}

/**
 * Отримання поточного місцезнаходження користувача
 */
function getCurrentLocation() {
    // Перевіряємо підтримку геолокації
    if (!navigator.geolocation) {
        console.error('❌ Геолокація не підтримується');
        // Показуємо карту з центром у Києві як fallback
        if (map) {
            map.setView([50.4501, 30.5234], 10);
        }
        return;
    }
    
    console.log('🔍 Автоматичний пошук місцезнаходження користувача...');
    
    // Опції для геолокації
    const options = {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000
    };
    
    // Отримуємо координати
    navigator.geolocation.getCurrentPosition(
        function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const accuracy = position.coords.accuracy;
            
            console.log(`📍 Місцезнаходження автоматично знайдено: ${lat.toFixed(6)}, ${lng.toFixed(6)} (точність: ${accuracy}м)`);
            
            // Оновлюємо карту
            updateMapLocation(lat, lng, accuracy);
            
            // Додаємо маркери найближчих проектів
            addNearbyProjects(lat, lng);
        },
        function(error) {
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    console.error('❌ Користувач заборонив доступ до геолокації');
                    break;
                case error.POSITION_UNAVAILABLE:
                    console.error('❌ Місцезнаходження недоступне');
                    break;
                case error.TIMEOUT:
                    console.error('❌ Таймаут при отриманні місцезнаходження');
                    break;
                default:
                    console.error('❌ Невідома помилка геолокації:', error.message);
                    break;
            }
            
            // Показуємо карту з центром у Києві як fallback
            if (map) {
                map.setView([50.4501, 30.5234], 10);
                console.log('🗺️ Показано карту з центром у Києві (fallback)');
            }
        },
        options
    );
}

/**
 * Оновлення позиції на карті
 */
function updateMapLocation(lat, lng, accuracy) {
    if (!map) {
        console.error('❌ Карта не ініціалізована');
        return;
    }
    
    // Видаляємо попередній маркер користувача
    if (userMarker) {
        map.removeLayer(userMarker);
    }
    
    // Додаємо новий маркер користувача з анімованим піном
    userMarker = L.marker([lat, lng], {
        icon: L.divIcon({
            className: 'user-location-marker',
            html: '<div class="user-location-pin"></div>',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        })
    }).addTo(map);
    
    // Додаємо popup з інформацією
    userMarker.bindPopup(`
        <div style="text-align: center; padding: 10px;">
            <strong style="color: #7E5AFF;">📍 Ваше місцезнаходження</strong><br>
            <small style="color: #666;">Точність: ${Math.round(accuracy)}м</small><br>
            <small style="color: #999; font-size: 0.8em;">Клікніть на пін для більш детальної інформації</small>
        </div>
    `).openPopup();
    
    // Додаємо коло точності з фіолетовим кольором
    L.circle([lat, lng], {
        radius: accuracy,
        color: '#7E5AFF',
        fillColor: '#7E5AFF',
        fillOpacity: 0.1,
        weight: 2,
        opacity: 0.6
    }).addTo(map);
    
    // Центруємо карту на позиції користувача
    map.setView([lat, lng], 15);
    
    console.log(`🗺️ Карта оновлена для координат: ${lat}, ${lng} з анімованим піном`);
}

/**
 * Отримання адреси з координат (reverse geocoding)
 */
async function getAddressFromCoordinates(lat, lng) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
        );
        
        if (!response.ok) {
            throw new Error('Помилка при отриманні адреси');
        }
        
        const data = await response.json();
        
        if (data && data.display_name) {
            document.getElementById('address').textContent = 
                `Адреса: ${data.display_name}`;
            console.log('📍 Адреса отримана:', data.display_name);
        } else {
            document.getElementById('address').textContent = 
                'Адреса: Не вдалося визначити';
        }
    } catch (error) {
        console.error('❌ Помилка при отриманні адреси:', error);
        document.getElementById('address').textContent = 
            'Адреса: Помилка при отриманні';
    }
}

/**
 * Додавання маркерів найближчих проектів
 */
function addNearbyProjects(userLat, userLng) {
    if (!map) return;
    
    // Приклади проектів
    const projects = [
        {
            name: 'Trade Center',
            lat: userLat + 0.01,
            lng: userLng + 0.01,
            description: 'Сучасний торговий центр'
        },
        {
            name: 'Business Complex',
            lat: userLat - 0.015,
            lng: userLng + 0.02,
            description: 'Бізнес-комплекс преміум класу'
        },
        {
            name: 'Residential Tower',
            lat: userLat + 0.02,
            lng: userLng - 0.01,
            description: 'Житловий комплекс'
        }
    ];
    
    projects.forEach(project => {
        const distance = calculateDistance(userLat, userLng, project.lat, project.lng);
        
        const projectMarker = L.marker([project.lat, project.lng], {
            icon: L.divIcon({
                className: 'project-marker',
                html: '🏢',
                iconSize: [25, 25],
                iconAnchor: [12, 12]
            })
        }).addTo(map);
        
        projectMarker.bindPopup(`
            <div style="text-align: center; min-width: 150px;">
                <strong>${project.name}</strong><br>
                <small>${project.description}</small><br>
                <small style="color: #666;">Відстань: ${distance.toFixed(1)} км</small>
            </div>
        `);
        
        console.log(`🏢 Додано проект: ${project.name} (${distance.toFixed(1)} км)`);
    });
}

/**
 * Розрахунок відстані між двома точками
 */
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Радіус Землі в км
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
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
    
    // Ініціалізація галереї
    initGallery();
    
    // Ініціалізація секції місцезнаходження
    setTimeout(initLocationSection, 100); // Невелика затримка для завантаження Leaflet
});