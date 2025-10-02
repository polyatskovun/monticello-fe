function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function toggleDetails(projectId) {
    const detailsElement = document.getElementById(projectId + '-details');
    const button = event.target;

    if (!detailsElement) {
        console.error(`Element with ID ${projectId}-details not found`);
        return;
    }

    const isExpanded = detailsElement.classList.contains('show');

    if (isExpanded) {
        detailsElement.classList.remove('show');
        button.classList.remove('expanded');
        button.textContent = 'MORE DETAILS';
        console.log(`🔼 Деталі проекту ${projectId} згорнуто`);
    } else {
        detailsElement.classList.add('show');
        button.classList.add('expanded');
        button.textContent = 'HIDE DETAILS';
        console.log(`🔽 Деталі проекту ${projectId} розгорнуто`);

        setTimeout(() => {
            detailsElement.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }, 300);
    }
}

function addZoomOnClick(galleryItem) {
    const img = galleryItem.querySelector('img');
    let isPressed = false;
    let zoomTimeout;

    if (!img) return;

    galleryItem.addEventListener('mousedown', function (e) {
        e.preventDefault();
        isPressed = true;

        const rect = galleryItem.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        img.style.transformOrigin = `${x}% ${y}%`;

        zoomTimeout = setTimeout(() => {
            if (isPressed) {
                img.style.transform = 'scale(1.5)';
                img.style.transition = 'transform 0.3s ease';
                galleryItem.style.zIndex = '100';
                console.log(`🔍 Збільшення зображення в точці: ${x.toFixed(1)}%, ${y.toFixed(1)}%`);
            }
        }, 200);
    });

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

    galleryItem.addEventListener('mouseup', handleMouseUp);
    galleryItem.addEventListener('mouseleave', handleMouseUp);
    document.addEventListener('mouseup', handleMouseUp);

    img.addEventListener('dragstart', function (e) {
        e.preventDefault();
    });
}


function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        addZoomOnClick(item);
    });

    console.log('🎨 Галерея ініціалізована з функцією збільшення');
}

function loadMoreGalleryItems() {
    const galleryGrid = document.querySelector('.gallery-grid');
    const seeMoreBtn = document.querySelector('.see-more-btn');

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

        addZoomOnClick(galleryItem);

        galleryItem.style.opacity = '0';
        galleryItem.style.transform = 'translateY(20px)';

        galleryGrid.appendChild(galleryItem);

        setTimeout(() => {
            galleryItem.style.transition = 'all 0.5s ease';
            galleryItem.style.opacity = '1';
            galleryItem.style.transform = 'translateY(0)';
        }, index * 100);
    });

    seeMoreBtn.style.transform = 'scale(0)';
    seeMoreBtn.style.opacity = '0';
    setTimeout(() => {
        seeMoreBtn.style.display = 'none';
    }, 300);

    console.log('🖼️ Додаткові елементи галереї завантажено');
}

function initDetailsButtons() {
    const detailButtons = document.querySelectorAll('.service-btn');

    detailButtons.forEach(button => {
        if (!button.textContent.includes('▼') && !button.textContent.includes('▲')) {
            button.textContent += ' ▼';
        }

        button.addEventListener('mouseenter', function () {
            if (!this.classList.contains('expanded')) {
                this.style.transform = 'translateY(-2px) scale(1.02)';
            }
        });

        button.addEventListener('mouseleave', function () {
            if (!this.classList.contains('expanded')) {
                this.style.transform = 'translateY(-2px)';
            }
        });
    });

    console.log('📋 Кнопки деталей проектів ініціалізовано');
}

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-menu a');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            navLinks.forEach(l => l.classList.remove('active'));

            this.classList.add('active');

            const targetId = this.getAttribute('href').substring(1);

            if (targetId) {
                e.preventDefault();
                scrollToSection(targetId);
            }
        });
    });
}

function initSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-link, .footer-social-link');

    socialLinks.forEach((link, index) => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const socialNames = ['Facebook', 'Twitter', 'Instagram'];
            const socialName = socialNames[index % 3] || 'Social Media';

            console.log(`🔗 Клік по ${socialName}`);
        });
    });
}


function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.service-item, .news-card');
    animatedElements.forEach(el => observer.observe(el));
}

let map = null;
let userMarker = null;


function initMap() {
    map = L.map('map').setView([50.4501, 30.5234], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);

    setTimeout(ensureLocationButtonVisible, 100);

    console.log('🗺️ Карта ініціалізована');
}

function ensureLocationButtonVisible() {
    const locationBtn = document.getElementById('locationBtn');
    if (locationBtn) {
        locationBtn.style.position = 'absolute';
        locationBtn.style.zIndex = '1000';
        locationBtn.style.display = 'flex';
        locationBtn.style.opacity = '1';
        locationBtn.style.visibility = 'visible';

        console.log('🔘 Кнопка геолокації перевірена та видима');
    } else {
        console.error('❌ Кнопка геолокації не знайдена');
    }
}

function getCurrentLocation() {
    const locationBtn = document.getElementById('locationBtn');

    if (!navigator.geolocation) {
        console.error('❌ Геолокація не підтримується');
        showLocationError('Геолокація не підтримується вашим браузером');
        return;
    }

    if (locationBtn) {
        locationBtn.classList.add('loading');
        locationBtn.disabled = true;
    }

    console.log('🔍 Пошук місцезнаходження користувача...');

    const options = {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000
    };

    navigator.geolocation.getCurrentPosition(
        function (position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const accuracy = position.coords.accuracy;

            console.log(`📍 Місцезнаходження знайдено: ${lat.toFixed(6)}, ${lng.toFixed(6)} (точність: ${accuracy}м)`);

            updateMapLocation(lat, lng, accuracy);

            addNearbyProjects(lat, lng);

            if (locationBtn) {
                locationBtn.classList.remove('loading');
                locationBtn.disabled = false;
            }

            showLocationSuccess('Місцезнаходження знайдено успішно!');
        },
        function (error) {
            let errorMessage = '';

            switch (error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = 'Доступ до геолокації заборонено. Будь ласка, дозвольте доступ в налаштуваннях браузера.';
                    console.error('❌ Користувач заборонив доступ до геолокації');
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = 'Місцезнаходження недоступне. Перевірте підключення до інтернету.';
                    console.error('❌ Місцезнаходження недоступне');
                    break;
                case error.TIMEOUT:
                    errorMessage = 'Таймаут при отриманні місцезнаходження. Спробуйте ще раз.';
                    console.error('❌ Таймаут при отриманні місцезнаходження');
                    break;
                default:
                    errorMessage = 'Виникла помилка при отриманні місцезнаходження.';
                    console.error('❌ Невідома помилка геолокації:', error.message);
                    break;
            }

            if (map) {
                map.setView([50.4501, 30.5234], 10);
                console.log('🗺️ Показано карту з центром у Києві (fallback)');
            }

            if (locationBtn) {
                locationBtn.classList.remove('loading');
                locationBtn.disabled = false;
            }

            showLocationError(errorMessage);
        },
        options
    );
}

function showLocationSuccess(message) {
    const notification = createNotification(message, 'success');
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function showLocationError(message) {
    const notification = createNotification(message, 'error');
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

function createNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `location-notification ${type}`;
    notification.textContent = message;

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#2ecc71' : '#e74c3c'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        font-size: 0.9rem;
        font-weight: 500;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        max-width: 300px;
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.3s ease;
    `;

    notification.classList.add('location-notification');

    return notification;
}

function initLocationSection() {
    if (typeof L !== 'undefined') {
        initMap();

        setTimeout(() => {
            ensureLocationButtonVisible();

            window.addEventListener('resize', ensureLocationButtonVisible);
        }, 200);

        console.log('🗺️ Секція місцезнаходження ініціалізована');
        console.log('🎯 Кнопка геолокації готова до використання');
    } else {
        console.error('❌ Бібліотека Leaflet не завантажена');
    }
}

function updateMapLocation(lat, lng, accuracy) {
    if (!map) {
        console.error('❌ Карта не ініціалізована');
        return;
    }

    if (userMarker) {
        map.removeLayer(userMarker);
    }

    userMarker = L.marker([lat, lng], {
        icon: L.divIcon({
            className: 'user-location-marker',
            html: '<div class="user-location-pin"></div>',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        })
    }).addTo(map);

    userMarker.bindPopup(`
        <div style="text-align: center; padding: 10px;">
            <strong style="color: #7E5AFF;">📍 Ваше місцезнаходження</strong><br>
            <small style="color: #666;">Точність: ${Math.round(accuracy)}м</small><br>
            <small style="color: #999; font-size: 0.8em;">Клікніть на пін для більш детальної інформації</small>
        </div>
    `).openPopup();

    L.circle([lat, lng], {
        radius: accuracy,
        color: '#7E5AFF',
        fillColor: '#7E5AFF',
        fillOpacity: 0.1,
        weight: 2,
        opacity: 0.6
    }).addTo(map);

    map.setView([lat, lng], 15);

    console.log(`🗺️ Карта оновлена для координат: ${lat}, ${lng} з анімованим піном`);
}

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

function addNearbyProjects(userLat, userLng) {
    if (!map) return;

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

function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Радіус Землі в км
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function initContactForm() {
    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');

    if (!form || !nameInput || !emailInput) {
        console.error('❌ Елементи контактної форми не знайдено');
        return;
    }

    nameInput.addEventListener('blur', () => validateField(nameInput, 'name'));
    emailInput.addEventListener('blur', () => validateField(emailInput, 'email'));

    form.addEventListener('submit', handleFormSubmit);

    console.log('📝 Контактна форма ініціалізована');
}

function validateField(input, type) {
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';

    input.classList.remove('error');
    removeErrorMessage(input);

    if (!value) {
        isValid = false;
        errorMessage = `${type === 'name' ? 'Ім\'я' : 'Email'} обов'язкове для заповнення`;
    } else if (type === 'name' && value.length < 2) {
        isValid = false;
        errorMessage = 'Ім\'я повинно містити мінімум 2 символи';
    } else if (type === 'email' && !isValidEmail(value)) {
        isValid = false;
        errorMessage = 'Введіть коректний email адрес';
    }

    if (!isValid) {
        input.classList.add('error');
        showErrorMessage(input, errorMessage);
    }

    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showErrorMessage(input, message) {
    let errorElement = input.parentNode.querySelector('.error-message');

    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        input.parentNode.appendChild(errorElement);
    }

    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function removeErrorMessage(input) {
    const errorElement = input.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.classList.remove('show');
        setTimeout(() => {
            if (errorElement.parentNode) {
                errorElement.parentNode.removeChild(errorElement);
            }
        }, 300);
    }
}

function showSuccessMessage(form) {
    let successElement = form.querySelector('.success-message');

    if (!successElement) {
        successElement = document.createElement('div');
        successElement.className = 'success-message';
        form.insertBefore(successElement, form.firstChild);
    }

    successElement.textContent = 'Дякуємо! Ваше повідомлення надіслано успішно.';
    successElement.classList.add('show');

    setTimeout(() => {
        successElement.classList.remove('show');
        setTimeout(() => {
            if (successElement.parentNode) {
                successElement.parentNode.removeChild(successElement);
            }
        }, 300);
    }, 5000);
}

function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const nameInput = form.querySelector('#name');
    const emailInput = form.querySelector('#email');
    const submitBtn = form.querySelector('.submit-btn');

    const isNameValid = validateField(nameInput, 'name');
    const isEmailValid = validateField(emailInput, 'email');

    if (isNameValid && isEmailValid) {
        submitBtn.textContent = 'ВІДПРАВЛЯЄТЬСЯ...';
        submitBtn.disabled = true;

        setTimeout(() => {
            console.log('📧 Форма відправлена:', {
                name: nameInput.value,
                email: emailInput.value,
                timestamp: new Date().toISOString()
            });

            showSuccessMessage(form);

            form.reset();

            submitBtn.textContent = 'SUBMIT';
            submitBtn.disabled = false;

            console.log('✅ Контактна форма успішно відправлена');
        }, 2000);
    } else {
        console.log('❌ Форма містить помилки валідації');
    }
}

function initHeroBackgroundRotation() {
    const hero = document.querySelector('.hero');
    const indicators = document.querySelectorAll('.hero-indicator');

    if (!hero || indicators.length === 0) {
        console.error('❌ Елементи героя не знайдено');
        return;
    }

    const backgrounds = [
        '../assets/img/bg1.png',
        '../assets/img/gallery1.png',
        '../assets/img/gallery2.png',
        '../assets/img/gallery3.png',
        '../assets/img/gallery4.png'
    ];

    let currentIndex = 0;
    let rotationInterval;


    function changeBackground(index) {
        if (index < 0 || index >= backgrounds.length) return;

        const gradient = 'linear-gradient(135deg, rgba(116, 185, 255, 0.8) 0%, rgba(102, 126, 234, 0.8) 50%, rgba(118, 75, 162, 0.8) 100%)';
        const newBackground = `${gradient}, url('${backgrounds[index]}') center/cover no-repeat`;

        hero.style.background = newBackground;
        currentIndex = index;

        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });

        console.log(`🖼️ Фон героя змінено на: ${backgrounds[index]}`);
    }

    function startAutoRotation() {
        rotationInterval = setInterval(() => {
            const nextIndex = (currentIndex + 1) % backgrounds.length;
            changeBackground(nextIndex);
        }, 3000);

        console.log('🔄 Автоматична ротація фону запущена (кожні 3 секунди)');
    }

    function stopAutoRotation() {
        if (rotationInterval) {
            clearInterval(rotationInterval);
            rotationInterval = null;
            console.log('⏸️ Автоматична ротація фону зупинена');
        }
    }


    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            changeBackground(index);
            console.log(`Ручна зміна фону на індекс: ${index}`);
        });

        indicator.addEventListener('mouseenter', () => {
            if (!indicator.classList.contains('active')) {
                indicator.style.transform = 'scale(1.1)';
                indicator.style.background = 'rgba(255, 255, 255, 0.7)';
            }
        });

        indicator.addEventListener('mouseleave', () => {
            if (!indicator.classList.contains('active')) {
                indicator.style.transform = '';
                indicator.style.background = '';
            }
        });
    });


    startAutoRotation();
    console.log('🎬 Ротація фону героя ініціалізована з індикаторами');

    return {
        changeBackground,
        startAutoRotation,
        stopAutoRotation,
        getCurrentIndex: () => currentIndex,
        getBackgrounds: () => backgrounds
    };
}

function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    if (!mobileMenuToggle || !navMenu) {
        console.error('❌ Елементи мобільного меню не знайдено');
        return;
    }

    // Toggle mobile menu
    mobileMenuToggle.addEventListener('click', function() {
        mobileMenuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
            console.log('📱 Мобільне меню відкрито');
        } else {
            document.body.style.overflow = '';
            console.log('📱 Мобільне меню закрито');
        }
    });

    // Close menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
            console.log('📱 Мобільне меню закрито після кліку на посилання');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !mobileMenuToggle.contains(e.target)) {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
            console.log('📱 Мобільне меню закрито при кліку поза меню');
        }
    });

    // Close menu on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    console.log('📱 Мобільне меню ініціалізовано');
}

document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 Monticello website loaded successfully');

    initHeroBackgroundRotation();

    initNavigation();

    initMobileMenu();

    initSocialLinks();

    initDetailsButtons();

    initGallery();

    setTimeout(initLocationSection, 100);

    setTimeout(ensureLocationButtonVisible, 500);

    initContactForm();

    const style = document.createElement('style');
    style.textContent = `
        .location-notification.show {
            transform: translateX(0);
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
});