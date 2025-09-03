// Advanced Portfolio Website JavaScript with PWA Features
class PortfolioApp {

    constructor() {
        this.data = null;
        this.filteredProjects = [];
        this.currentFilter = 'all';
        this.searchTerm = '';
        this.isOnline = navigator.onLine;
        this.performanceMetrics = {};
        this.observers = new Map();
        this.theme = localStorage.getItem('theme') || 'light';

        // Initialize the application
        this.init();
    }

    async init() {
        try {
            await this.loadData();
            this.initializeServiceWorker();
            this.setupEventListeners();
            this.initializeTheme();
            this.renderContent();
            this.initializePerformanceMonitoring();
            this.initializeAccessibility();
            this.initializeAnimations();
            this.setupOfflineDetection();
            this.initializeContactForm();



            // Hide loading screen
            setTimeout(() => {
                this.hideLoadingScreen();
            }, 500);

            console.log('Portfolio app initialized successfully');
        } catch (error) {
            console.error('Failed to initialize portfolio app:', error);
            this.handleError('Failed to load application');
        }
    }
    initializeAboutSection() {
        this.initializeScrollAnimations();
        this.initializeStatsCounter();
        this.setupAboutInteractions();
    }

    // Data Management
    async loadData() {
        try {
            // In a real application, this would fetch from an API
            this.data = {
                "projects": [

                ],
                "experience": [
                    {
                        "id": 1,
                        "company": "Accenture Solutions Pvt. Ltd.",
                        "position": "Associate Software Engineer",
                        "location": "Jaipur, IN",
                        "type": "Full-time",
                        "startDate": "2024-07-24",
                        "endDate": null,
                        "current": true,
                        "description": "Designed and developed core features for an e-learning platform with 500K+ active users, including voucher systems, badges, certifications, microservices, and reusable React components for web and mobile applications.",
                        "achievements": [
                            "Built secure authentication and authorization systems for a mobile app, integrating third-party APIs and strengthening API security to protect user data",
                            "Optimized voucher search performance, reducing query time from 8 minutes to 1.5 minutes and significantly improving user experience",
                            "Engineered GitOps automation on the MCMP Cloud platform, streamlining customer processes and eliminating 100% of manual operations."
                        ],
                        "technologies": ["Java", "Spring Boot", "React", "Node.js", "AWS", "Docker", "Kubernetes"],
                        "logo": "static/acc_logo.png"
                    }
                ],
                "skills": [
                    { "name": "Java", "level": 80, "category": "Backend" },
                    { "name": "Python", "level": 80, "category": "Backend" },
                    { "name": "TypeScript", "level": 80, "category": "Frontend" },
                    { "name": "JavaScript", "level": 80, "category": "Frontend" },

                    { "name": "Spring Boot", "level": 80, "category": "Backend" },
                    { "name": "FastAPI", "level": 80, "category": "Backend" },
                    { "name": "NestJS", "level": 80, "category": "Backend" },

                    { "name": "ReactJS", "level": 80, "category": "Frontend" },
                    { "name": "NextJS", "level": 80, "category": "Frontend" },
                    { "name": "jQuery", "level": 80, "category": "Frontend" },

                    { "name": "MySQL", "level": 80, "category": "Database" },
                    { "name": "MongoDB", "level": 80, "category": "Database" },

                    { "name": "Git", "level": 80, "category": "Tools" },
                    { "name": "Docker", "level": 80, "category": "DevOps" },
                    { "name": "Jenkins", "level": 80, "category": "DevOps" },

                    { "name": "MS Azure", "level": 80, "category": "Cloud" },
                    { "name": "AWS", "level": 80, "category": "Cloud" }

                ]
            };

            this.filteredProjects = [...this.data.projects];

            // Cache data for offline use
            this.cacheData('portfolioData', this.data);

        } catch (error) {
            console.warn('Failed to load fresh data, using cached version');
            this.data = this.getCachedData('portfolioData') || this.getDefaultData();
            this.filteredProjects = [...this.data.projects];
        }
    }

    getDefaultData() {
        return {
            projects: [],
            experience: [],
            skills: []
        };
    }

    cacheData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.warn('Failed to cache data:', error);
        }
    }

    getCachedData(key) {
        try {
            const cached = localStorage.getItem(key);
            return cached ? JSON.parse(cached) : null;
        } catch (error) {
            console.warn('Failed to retrieve cached data:', error);
            return null;
        }
    }

    // PWA Service Worker
    async initializeServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('sw.js', { scope: './' });
                console.log('Service Worker registered:', registration);
            } catch (error) {
                console.warn('Service Worker registration failed:', error);
            }
        }
    }


    // Event Listeners Setup
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav__link[href^="#"]').forEach(link => {
            link.addEventListener('click', this.handleNavigation.bind(this));
        });

        // Theme toggle
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // CTA Button
        const ctaButton = document.querySelector('.cta-button');
        if (ctaButton) {
            ctaButton.addEventListener('click', this.handleCTAClick.bind(this));
        }

        // Project filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', this.handleFilterClick.bind(this));
        });

        // Project search
        const searchInput = document.getElementById('project-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(this.handleSearch.bind(this), 300));
        }

        // Modal
        this.setupModalListeners();

        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyboard.bind(this));

        // Performance monitoring toggle (dev feature)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'P') {
                this.togglePerformanceMonitor();
            }
        });

        // Header scroll effect
        // window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 10));
    }

    // Theme Management
    initializeTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        this.updateThemeIcon();
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
        this.updateThemeIcon();
        this.announceToScreenReader(`Switched to ${this.theme} theme`);
    }

    updateThemeIcon() {
        const sunIcon = document.querySelector('.theme-icon--sun');
        const moonIcon = document.querySelector('.theme-icon--moon');

        if (this.theme === 'dark') {
            sunIcon?.classList.add('hidden');
            moonIcon?.classList.remove('hidden');
        } else {
            sunIcon?.classList.remove('hidden');
            moonIcon?.classList.add('hidden');
        }
    }

    // Content Rendering
    renderContent() {
        this.renderProjects();
        this.renderExperience();
        this.renderSkills();
    }

    renderProjects() {
        const grid = document.querySelector('.projects-grid');
        if (!grid) return;

        grid.innerHTML = '';

        if (this.filteredProjects.length === 0) {
            grid.innerHTML = `
                <div class="no-results">
                    <p>No projects found matching your criteria.</p>
                </div>
            `;
            return;
        }

        this.filteredProjects.forEach(project => {
            const card = this.createProjectCard(project);
            grid.appendChild(card);
        });

        // Animate cards
        this.animateProjectCards();
    }

    createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card fade-in';
        card.setAttribute('data-category', project.category);
        card.setAttribute('data-id', project.id);
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `View details for ${project.title}`);

        const statusClass = project.status === 'completed' ? 'completed' : 'in-progress';
        const statusText = project.status === 'completed' ? 'Completed' : 'In Progress';

        card.innerHTML = `
            <div class="project-card__image">
                ${project.image ? `<img src="${project.image}" alt="${project.title} screenshot" loading="lazy" width="auto" height="auto">` : ''}
            </div>
            <div class="project-card__content">
                <h3 class="project-card__title">${project.title}</h3>
                <p class="project-card__description">${project.description}</p>
                <div class="project-card__technologies">
                    ${project.technologies.map(tech =>
            `<span class="tech-badge">${tech}</span>`
        ).join('')}
                </div>
                <div class="project-card__status">
                    <div class="status-indicator ${statusClass}"></div>
                    <span>${statusText}</span>
                </div>
                <div class="project-card__actions">
                    <a href="${project.liveUrl}" target="_blank" rel="noopener" class="btn btn--primary btn--sm" onclick="event.stopPropagation()">
                        View Live
                    </a>
                    <a href="${project.githubUrl}" target="_blank" rel="noopener" class="btn btn--outline btn--sm" onclick="event.stopPropagation()">
                        View Code
                    </a>
                </div>
            </div>
        `;

        // Add click handler for modal - Fixed to work properly
        const cardClickHandler = (e) => {
            // Don't open modal if clicking on action buttons or their children
            if (e.target.closest('.project-card__actions')) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            this.openProjectModal(project);
        };

        card.addEventListener('click', cardClickHandler);

        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.openProjectModal(project);
            }
        });

        return card;
    }

    renderExperience() {
        const timeline = document.querySelector('.experience-timeline');
        if (!timeline) return;

        timeline.innerHTML = '';

        this.data.experience.forEach(exp => {
            const item = this.createExperienceItem(exp);
            timeline.appendChild(item);
        });
    }

    createExperienceItem(exp) {
        const item = document.createElement('div');
        item.className = 'experience-item fade-in';

        const startDate = new Date(exp.startDate);
        const endDate = exp.endDate ? new Date(exp.endDate) : new Date();
        const duration = this.calculateDuration(startDate, endDate, exp.current);

        item.innerHTML = `
            <div class="experience-card">
                <div class="experience-header">
                    <div class="company-logo">
                        <img src="${exp.logo}" alt="" srcset="" width="50" height="auto">
                    </div>
                    <div class="experience-title">
                        <h3>${exp.position}</h3>
                        <div class="company">${exp.company}</div>
                    </div>
                    ${exp.current ? '<span class="status status--success">Current</span>' : ''}
                </div>
                <div class="experience-meta">
                    <span>${duration}</span>
                    <span>${exp.location}</span>
                    <span>${exp.type}</span>
                    
                </div>
                <div class="experience-description">
                    ${exp.description}
                </div>
                <div class="experience-achievements">
                    <h4>Key Achievements</h4>
                    <ul>
                        ${exp.achievements.map(achievement =>
            `<li>${achievement}</li>`
        ).join('')}
                    </ul>
                </div>
                <div class="experience-technologies">
                    ${exp.technologies.map(tech =>
            `<span class="tech-badge">${tech}</span>`
        ).join('')}
                </div>
            </div>
        `;

        return item;
    }

    renderSkills() {
        const skillsContainer = document.querySelector('.skills-categories');
        if (!skillsContainer) return;

        // Helper function for chip styling
        const getChipStyle = (level) => {
            if (level >= 90) return 'chip-expert';
            if (level >= 80) return 'chip-advanced';
            if (level >= 70) return 'chip-intermediate';
            return 'chip-beginner';
        };

        // Group skills by category
        const skillsByCategory = this.data.skills.reduce((acc, skill) => {
            if (!acc[skill.category]) {
                acc[skill.category] = [];
            }
            acc[skill.category].push(skill);
            return acc;
        }, {});

        // Render as modern chips
        skillsContainer.innerHTML = Object.entries(skillsByCategory)
            .map(([category, skills]) => `
      <div class="skills-category fade-in">
        <h3>${category}</h3>
        <div class="skills-chips">
          ${skills.map(skill => `
            <div class="skill-chip ${getChipStyle(skill.level)}">
              <span class="skill-name">${skill.name}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
    }

    createSkillsCategory(category, skills) {
        const element = document.createElement('div');
        element.className = 'skills-category fade-in';

        element.innerHTML = `
            <h3>${category}</h3>
            ${skills.map(skill => `
                <div class="skill-item">
                    <div class="skill-header">
                        <span class="skill-name">${skill.name}</span>
                        <span class="skill-level">${skill.level}%</span>
                    </div>
                    <div class="skill-bar">
                        <div class="skill-progress" data-level="${skill.level}"></div>
                    </div>
                </div>
            `).join('')}
        `;

        return element;
    }

    // Modal Management
    setupModalListeners() {
        const modal = document.getElementById('project-modal');
        const backdrop = document.querySelector('.modal-backdrop');
        const closeBtn = document.querySelector('.modal-close');

        if (closeBtn) {
            closeBtn.addEventListener('click', this.closeModal.bind(this));
        }

        if (backdrop) {
            backdrop.addEventListener('click', this.closeModal.bind(this));
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
                this.closeModal();
            }
        });
    }

    openProjectModal(project) {
        const modal = document.getElementById('project-modal');
        if (!modal) return;

        // Populate modal content
        const modalImage = document.querySelector('.modal-image');
        const modalTitle = document.getElementById('modal-title');
        const modalDescription = document.querySelector('.modal-description');
        const techContainer = document.querySelector('.modal-technologies');
        const statusContainer = document.querySelector('.modal-status');
        const datesContainer = document.querySelector('.modal-dates');
        const liveLink = document.querySelector('.modal-live-link');
        const githubLink = document.querySelector('.modal-github-link');

        if (modalImage) modalImage.src = project.image;
        if (modalTitle) modalTitle.textContent = project.title;
        if (modalDescription) modalDescription.textContent = project.description;

        if (techContainer) {
            techContainer.innerHTML = project.technologies.map(tech =>
                `<span class="tech-badge">${tech}</span>`
            ).join('');
        }

        if (statusContainer) {
            const statusClass = project.status === 'completed' ? 'status--success' : 'status--warning';
            const statusText = project.status === 'completed' ? 'Completed' : 'In Progress';
            statusContainer.innerHTML = `<span class="status ${statusClass}">${statusText}</span>`;
        }

        if (datesContainer) {
            const startDate = new Date(project.startDate).toLocaleDateString();
            const endDate = project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Present';
            datesContainer.innerHTML = `<strong>Duration:</strong> ${startDate} - ${endDate}`;
        }

        if (liveLink) liveLink.href = project.liveUrl;
        if (githubLink) githubLink.href = project.githubUrl;

        // Show modal
        modal.classList.remove('hidden');

        // Focus management
        const closeButton = modal.querySelector('.modal-close');
        if (closeButton) closeButton.focus();

        // Announce to screen readers
        this.announceToScreenReader(`Opened project details for ${project.title}`);
    }

    closeModal() {
        const modal = document.getElementById('project-modal');
        if (modal) {
            modal.classList.add('hidden');
            this.announceToScreenReader('Closed project details');
        }
    }

    // Filtering and Search
    handleFilterClick(e) {
        const button = e.target;
        const filter = button.getAttribute('data-filter');

        // Update active state
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
        });

        button.classList.add('active');
        button.setAttribute('aria-pressed', 'true');

        this.currentFilter = filter;
        this.applyFilters();
        this.announceToScreenReader(`Filtered projects by ${filter}`);
    }

    handleSearch(e) {
        this.searchTerm = e.target.value.toLowerCase();
        this.applyFilters();
    }

    applyFilters() {
        let filtered = [...this.data.projects];

        // Apply category filter
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(project => project.category === this.currentFilter);
        }

        // Apply search filter
        if (this.searchTerm) {
            filtered = filtered.filter(project =>
                project.title.toLowerCase().includes(this.searchTerm) ||
                project.description.toLowerCase().includes(this.searchTerm) ||
                project.technologies.some(tech => tech.toLowerCase().includes(this.searchTerm))
            );
        }

        this.filteredProjects = filtered;
        this.renderProjects();

        // Announce results to screen readers
        const count = filtered.length;
        this.announceToScreenReader(`${count} project${count !== 1 ? 's' : ''} found`);
    }

    // Animation and Intersection Observer
    initializeAnimations() {
        // Fade in sections on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        // Observe all sections and cards
        document.querySelectorAll('.section, .project-card, .experience-item, .skills-category').forEach(el => {
            fadeObserver.observe(el);
        });

        this.observers.set('fade', fadeObserver);
    }

    animateProjectCards() {
        const cards = document.querySelectorAll('.project-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
    }

    animateSkillBars() {
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBars = entry.target.querySelectorAll('.skill-progress');
                    progressBars.forEach(bar => {
                        const level = bar.getAttribute('data-level');
                        setTimeout(() => {
                            bar.style.width = `${level}%`;
                        }, 200);
                    });
                    skillObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.skills-category').forEach(category => {
            skillObserver.observe(category);
        });
    }

    // Performance Monitoring
    initializePerformanceMonitoring() {
        if ('PerformanceObserver' in window) {
            // First Contentful Paint
            const fcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (entry.name === 'first-contentful-paint') {
                        this.performanceMetrics.fcp = Math.round(entry.startTime);
                        this.updatePerformanceDisplay();
                    }
                });
            });
            fcpObserver.observe({ entryTypes: ['paint'] });

            // Largest Contentful Paint
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.performanceMetrics.lcp = Math.round(lastEntry.startTime);
                this.updatePerformanceDisplay();
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

            // Cumulative Layout Shift
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                this.performanceMetrics.cls = Math.round(clsValue * 1000) / 1000;
                this.updatePerformanceDisplay();
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        }
    }

    updatePerformanceDisplay() {
        const fcpElement = document.getElementById('fcp-value');
        const lcpElement = document.getElementById('lcp-value');
        const clsElement = document.getElementById('cls-value');

        if (fcpElement && this.performanceMetrics.fcp) {
            fcpElement.textContent = `${this.performanceMetrics.fcp}ms`;
        }
        if (lcpElement && this.performanceMetrics.lcp) {
            lcpElement.textContent = `${this.performanceMetrics.lcp}ms`;
        }
        if (clsElement && this.performanceMetrics.cls !== undefined) {
            clsElement.textContent = this.performanceMetrics.cls;
        }
    }

    togglePerformanceMonitor() {
        const monitor = document.getElementById('performance-monitor');
        if (monitor) {
            monitor.classList.toggle('hidden');
        }
    }

    // Accessibility Features
    initializeAccessibility() {
        // Skip link functionality
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.getElementById('main-content');
                if (target) {
                    target.focus();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        // Enhanced focus management
        this.setupFocusManagement();

        // Reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--transition-fast', '0.01ms');
            document.documentElement.style.setProperty('--transition-normal', '0.01ms');
            document.documentElement.style.setProperty('--transition-slow', '0.01ms');
        }
    }

    setupFocusManagement() {
        // Roving tabindex for project cards
        const projectGrid = document.querySelector('.projects-grid');
        if (projectGrid) {
            let currentIndex = 0;
            const cards = () => projectGrid.querySelectorAll('.project-card');

            projectGrid.addEventListener('keydown', (e) => {
                const cardList = cards();
                if (cardList.length === 0) return;

                switch (e.key) {
                    case 'ArrowRight':
                    case 'ArrowDown':
                        e.preventDefault();
                        currentIndex = Math.min(currentIndex + 1, cardList.length - 1);
                        cardList[currentIndex].focus();
                        break;
                    case 'ArrowLeft':
                    case 'ArrowUp':
                        e.preventDefault();
                        currentIndex = Math.max(currentIndex - 1, 0);
                        cardList[currentIndex].focus();
                        break;
                    case 'Home':
                        e.preventDefault();
                        currentIndex = 0;
                        cardList[currentIndex].focus();
                        break;
                    case 'End':
                        e.preventDefault();
                        currentIndex = cardList.length - 1;
                        cardList[currentIndex].focus();
                        break;
                }
            });
        }
    }

    announceToScreenReader(message) {
        const announcer = document.getElementById('status-announcements');
        if (announcer) {
            announcer.textContent = message;
            setTimeout(() => {
                announcer.textContent = '';
            }, 1000);
        }
    }

    // Offline Support
    setupOfflineDetection() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.hideOfflineNotification();
            this.announceToScreenReader('Connection restored');
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showOfflineNotification();
            this.announceToScreenReader('You are now offline');
        });

        // Check initial state
        if (!this.isOnline) {
            this.showOfflineNotification();
        }
    }

    showOfflineNotification() {
        const notification = document.getElementById('offline-notification');
        if (notification) {
            notification.classList.remove('hidden');
        }
    }

    hideOfflineNotification() {
        const notification = document.getElementById('offline-notification');
        if (notification) {
            notification.classList.add('hidden');
        }
    }

    // Event Handlers
    handleNavigation(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetSection.offsetTop - headerHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            this.announceToScreenReader(`Navigated to ${targetSection.querySelector('h2')?.textContent || 'section'}`);
        }
    }

    // handleScroll() {
    //     const header = document.querySelector('.header');
    //     const scrollTop = window.pageYOffset;

    //     if (scrollTop > 50) {
    //         header.style.backgroundColor = this.theme === 'dark' 
    //             ? 'rgba(44, 62, 80, 0.98)' 
    //             : 'rgba(255, 255, 255, 0.98)';
    //         header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    //     } else {
    //         header.style.backgroundColor = this.theme === 'dark' 
    //             ? 'rgba(44, 62, 80, 0.95)' 
    //             : 'rgba(255, 255, 255, 0.95)';
    //         header.style.boxShadow = 'none';
    //     }
    // }

    handleCTAClick() {
        // Enhanced CTA functionality
        const userAgent = navigator.userAgent;
        const isIOS = /iPad|iPhone|iPod/.test(userAgent);
        const isAndroid = /Android/.test(userAgent);

        if (isIOS || isAndroid) {
            // Mobile - try to open native mail app
            window.location.href = 'mailto:hello@yashodhan.co';
        } else {
            // Desktop - show contact options
            this.showContactOptions();
        }

        this.announceToScreenReader('Contact options opened');
    }

    showContactOptions() {
        const options = [
            'Email: hello@yashodhan.co',
            'LinkedIn: linkedin.com/in/yashodhanpagar',
            'Phone: +91 8888723386'
        ].join('\n');

        alert(`Contact Yashodhan:\n\n${options}`);
    }

    handleKeyboard(e) {
        // Global keyboard shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'k':
                    e.preventDefault();
                    document.getElementById('project-search-input')?.focus();
                    break;
                case '/':
                    e.preventDefault();
                    document.getElementById('project-search-input')?.focus();
                    break;
            }
        }

        // Arrow key navigation for sections
        if (e.altKey) {
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    this.scrollToNextSection();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.scrollToPreviousSection();
                    break;
            }
        }
    }

    scrollToNextSection() {
        const sections = document.querySelectorAll('.section');
        const currentScrollTop = window.pageYOffset;
        const headerHeight = document.querySelector('.header').offsetHeight;

        for (let section of sections) {
            if (section.offsetTop - headerHeight > currentScrollTop + 100) {
                section.scrollIntoView({ behavior: 'smooth' });
                break;
            }
        }
    }

    scrollToPreviousSection() {
        const sections = Array.from(document.querySelectorAll('.section')).reverse();
        const currentScrollTop = window.pageYOffset;
        const headerHeight = document.querySelector('.header').offsetHeight;

        for (let section of sections) {
            if (section.offsetTop - headerHeight < currentScrollTop - 100) {
                section.scrollIntoView({ behavior: 'smooth' });
                break;
            }
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }

    // Utility Functions
    calculateDuration(startDate, endDate, isCurrent) {
        const months = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24 * 30));
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;

        let duration = '';
        if (years > 0) {
            duration += `${years} year${years > 1 ? 's' : ''}`;
            if (remainingMonths > 0) {
                duration += ` ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
            }
        } else {
            duration = `${months} month${months > 1 ? 's' : ''}`;
        }

        return isCurrent ? `${duration} (Current)` : duration;
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    handleError(message) {
        console.error(message);
        const errorAnnouncer = document.getElementById('error-announcements');
        if (errorAnnouncer) {
            errorAnnouncer.textContent = message;
        }
    }

    // Cleanup
    destroy() {
        // Clean up observers
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();

        // Remove event listeners
        window.removeEventListener('online', this.handleOnline);
        window.removeEventListener('offline', this.handleOffline);
        window.removeEventListener('scroll', this.handleScroll);
    }

    // Add these methods to your PortfolioApp class

    // Contact form initialization (call this in your init() method)
    initializeContactForm() {
        const form = document.getElementById('contact-form');
        const backToTopBtn = document.getElementById('back-to-top');

        if (form) {
            form.addEventListener('submit', this.handleContactFormSubmit.bind(this));

            // Add real-time validation
            const inputs = form.querySelectorAll('.form-control');
            inputs.forEach(input => {
                input.addEventListener('blur', this.validateField.bind(this));
                input.addEventListener('input', this.clearFieldError.bind(this));
            });
        }

        // Back to top button functionality
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', this.scrollToTop.bind(this));
            window.addEventListener('scroll', this.toggleBackToTopButton.bind(this));
        }

        // Footer links smooth scrolling
        document.querySelectorAll('.footer-link[href^="#"]').forEach(link => {
            link.addEventListener('click', this.handleNavigation.bind(this));
        });
    }

    // Contact form submission handler
    async handleContactFormSubmit(event) {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form);
        const submitBtn = form.querySelector('.contact-submit');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');

        // Validate all fields
        if (!this.validateForm(form)) {
            this.announceToScreenReader('Please fix the errors in the form');
            return;
        }

        // Show loading state
        btnText.classList.add('hidden');
        btnLoading.classList.remove('hidden');
        submitBtn.disabled = true;

        try {
            // Simulate API call (replace with your actual endpoint)
            await this.submitContactForm(formData);

            // Show success message
            this.showFormMessage('success', {
                title: 'Message Sent Successfully!',
                message: 'Thank you for reaching out. I\'ll get back to you within 24 hours.'
            });

            // Reset form
            form.reset();
            this.clearAllFieldErrors(form);

            // Analytics tracking (optional)
            this.trackEvent('contact_form_submit', {
                name: formData.get('name'),
                subject: formData.get('subject')
            });

        } catch (error) {
            console.error('Contact form submission failed:', error);

            // Show error message
            this.showFormMessage('error', {
                title: 'Message Failed to Send',
                message: 'Something went wrong. Please try again or email me directly at yashodhan@yashodhan.co'
            });
        } finally {
            // Reset button state
            btnText.classList.remove('hidden');
            btnLoading.classList.add('hidden');
            submitBtn.disabled = false;
        }
    }

    // Simulate form submission (replace with your actual API)
    async submitContactForm(formData) {
        // Replace this with your actual form submission logic
        // Example: sending to a serverless function, email service, etc.

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success/failure
                const success = Math.random() > 0.1; // 90% success rate for demo

                if (success) {
                    resolve({ status: 'success', message: 'Message sent successfully' });
                } else {
                    reject(new Error('Network error'));
                }
            }, 2000);
        });
    }

    // Form validation
    validateForm(form) {
        const fields = form.querySelectorAll('[required]');
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateField({ target: field })) {
                isValid = false;
            }
        });

        return isValid;
    }

    // Individual field validation
    validateField(event) {
        const field = event.target;
        const value = field.value.trim();
        const fieldName = field.name;
        const errorElement = document.getElementById(`${fieldName}-error`);

        let errorMessage = '';

        // Required field check
        if (field.hasAttribute('required') && !value) {
            errorMessage = `${this.getFieldLabel(fieldName)} is required`;
        }
        // Email validation
        else if (fieldName === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = 'Please enter a valid email address';
            }
        }
        // Name validation
        else if (fieldName === 'name' && value) {
            if (value.length < 2) {
                errorMessage = 'Name must be at least 2 characters long';
            }
        }
        // Subject validation
        else if (fieldName === 'subject' && value) {
            if (value.length < 5) {
                errorMessage = 'Subject must be at least 5 characters long';
            }
        }
        // Message validation
        else if (fieldName === 'message' && value) {
            if (value.length < 10) {
                errorMessage = 'Message must be at least 10 characters long';
            }
        }

        // Show/hide error
        if (errorMessage) {
            this.showFieldError(field, errorElement, errorMessage);
            return false;
        } else {
            this.clearFieldError(field, errorElement);
            return true;
        }
    }

    // Helper methods for form validation
    getFieldLabel(fieldName) {
        const labels = {
            name: 'Name',
            email: 'Email',
            subject: 'Subject',
            message: 'Message'
        };
        return labels[fieldName] || fieldName;
    }

    showFieldError(field, errorElement, message) {
        field.classList.add('error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.setAttribute('aria-live', 'polite');
        }
    }

    clearFieldError(event) {
        const field = event.target;
        const fieldName = field.name;
        const errorElement = document.getElementById(`${fieldName}-error`);

        field.classList.remove('error');
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    clearAllFieldErrors(form) {
        const fields = form.querySelectorAll('.form-control');
        fields.forEach(field => {
            field.classList.remove('error');
            const fieldName = field.name;
            const errorElement = document.getElementById(`${fieldName}-error`);
            if (errorElement) {
                errorElement.textContent = '';
            }
        });
    }




    // Show success/error messages
    showFormMessage(type, content) {
        const successMsg = document.querySelector('.success-message');
        const errorMsg = document.querySelector('.error-message');

        // Hide all messages first
        successMsg.classList.add('hidden');
        errorMsg.classList.add('hidden');

        // Show appropriate message
        const targetMessage = type === 'success' ? successMsg : errorMsg;
        const titleElement = targetMessage.querySelector('h4');
        const textElement = targetMessage.querySelector('p');

        if (titleElement) titleElement.textContent = content.title;
        if (textElement) textElement.textContent = content.message;

        targetMessage.classList.remove('hidden');

        // Scroll to message
        targetMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Auto-hide success message after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                successMsg.classList.add('hidden');
            }, 5000);
        }

        // Announce to screen readers
        this.announceToScreenReader(content.title + '. ' + content.message);
    }

    // Back to top functionality
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // Focus management for accessibility
        const skipLink = document.querySelector('.skip-link') || document.querySelector('h1');
        if (skipLink) {
            skipLink.focus();
        }
    }

    toggleBackToTopButton() {
        const backToTopBtn = document.getElementById('back-to-top');
        if (!backToTopBtn) return;

        const scrollPosition = window.pageYOffset;
        const windowHeight = window.innerHeight;

        if (scrollPosition > windowHeight / 2) {
            backToTopBtn.classList.remove('hidden');
        } else {
            backToTopBtn.classList.add('hidden');
        }
    }

    // Enhanced navigation handler (update your existing one)
    handleNavigation(event) {
        event.preventDefault();

        const targetId = event.target.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Update URL without triggering scroll
            history.pushState(null, null, targetId);

            // Focus management for accessibility
            targetElement.setAttribute('tabindex', '-1');
            targetElement.focus();
        }
    }

    // Analytics tracking (optional)
    trackEvent(eventName, parameters) {
        // Replace with your analytics service (Google Analytics, etc.)
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, parameters);
        }

        console.log('Event tracked:', eventName, parameters);
    }

    // Screen reader announcements
    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;

        document.body.appendChild(announcement);

        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Create global app instance
    window.portfolioApp = new PortfolioApp();
});

// Add ripple effect CSS dynamically
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .cta-button {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: rippleEffect 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes rippleEffect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    .no-results {
        grid-column: 1 / -1;
        text-align: center;
        padding: 2rem;
        color: var(--portfolio-accent);
        font-size: var(--font-size-lg);
    }
`;
document.head.appendChild(rippleStyle);

// Enhanced CTA button ripple effect
document.addEventListener('click', function (e) {
    if (e.target.closest('.cta-button')) {
        const button = e.target.closest('.cta-button');
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioApp;
}





