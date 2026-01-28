// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            // Change icon
            const icon = this.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if (menuToggle) {
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.padding = '15px 0';
            navbar.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        } else {
            navbar.style.padding = '20px 0';
            navbar.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        }
    });
    
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Initialize all components
    initializeMaps();
    initializeCharts();
    setupPortfolioFilter();
    setupDarkMode();
    setupContactForm();
    observeSkillBars();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        document.querySelectorAll('.modal').forEach(modal => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(modal => {
                if (modal.style.display === 'block') {
                    closeModal(modal.id);
                }
            });
        }
    });
});

// Initialize Leaflet maps
function initializeMaps() {
    // Map for project 1 in portfolio
    if (document.getElementById('map1')) {
        try {
            const map1 = L.map('map1').setView([-12.0, 34.0], 6);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 18
            }).addTo(map1);
            
            // Add a marker for demonstration
            L.marker([-12.0, 34.0]).addTo(map1)
                .bindPopup('<b>Lake Malawi Basin</b><br>Drought Analysis Study Area')
                .openPopup();
            
            // Add a polygon for the basin area
            const basinBounds = [[-13.5, 32.5], [-10.5, 35.5]];
            L.rectangle(basinBounds, {
                color: "#1a6ea0",
                weight: 2,
                fillColor: "#1a6ea0",
                fillOpacity: 0.1
            }).addTo(map1);
        } catch (error) {
            console.log('Map initialization skipped (running locally)');
        }
    }
    
    // Map for modal 1
    if (document.getElementById('modalMap1')) {
        try {
            const modalMap1 = L.map('modalMap1').setView([-12.0, 34.0], 7);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 18
            }).addTo(modalMap1);
            
            // Add study area
            const bounds = [[-13.5, 32.5], [-10.5, 35.5]];
            L.rectangle(bounds, {
                color: "#1a6ea0",
                weight: 2,
                fillColor: "#1a6ea0",
                fillOpacity: 0.1
            }).addTo(modalMap1).bindPopup('<b>Study Area:</b> Lake Malawi Basin');
            
            // Add sample stations
            const stations = [
                {coords: [-11.5, 34.0], name: 'Station A', type: 'Rainfall'},
                {coords: [-12.5, 33.5], name: 'Station B', type: 'Streamflow'},
                {coords: [-12.0, 34.5], name: 'Station C', type: 'Water Quality'},
                {coords: [-11.0, 33.0], name: 'Station D', type: 'Climate'}
            ];
            
            stations.forEach(station => {
                L.marker(station.coords).addTo(modalMap1)
                    .bindPopup(`<b>${station.name}</b><br>Type: ${station.type}`);
            });
        } catch (error) {
            console.log('Modal map initialization skipped');
        }
    }
}

// Initialize Data Visualizations
function initializeCharts() {
    // Water Quality Chart for Portfolio
    const ctx1 = document.getElementById('dataChart');
    if (ctx1) {
        // Set canvas size for better display
        ctx1.width = 300;
        ctx1.height = 200;
        
        new Chart(ctx1, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [
                    {
                        label: 'Rainfall (mm)',
                        data: [250, 280, 320, 180, 60, 20, 15, 10, 15, 45, 120, 200],
                        borderColor: '#1a6ea0',
                        backgroundColor: 'rgba(26, 110, 160, 0.1)',
                        fill: true,
                        tension: 0.4,
                        borderWidth: 2
                    },
                    {
                        label: 'Streamflow (m³/s)',
                        data: [45, 52, 58, 42, 25, 18, 15, 12, 15, 22, 35, 42],
                        borderColor: '#28a745',
                        backgroundColor: 'rgba(40, 167, 69, 0.1)',
                        fill: true,
                        tension: 0.4,
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            boxWidth: 12,
                            padding: 10
                        }
                    },
                    title: {
                        display: true,
                        text: 'Monthly Patterns',
                        font: {
                            size: 14
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: true,
                            color: 'rgba(0,0,0,0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }
    
    // Create additional chart for modal (if needed)
    const ctx2 = document.getElementById('modalChart');
    if (ctx2) {
        new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: ['Agriculture', 'Domestic', 'Industry', 'Energy', 'Environment'],
                datasets: [{
                    label: 'Water Allocation (%)',
                    data: [65, 20, 8, 5, 2],
                    backgroundColor: [
                        'rgba(26, 110, 160, 0.8)',
                        'rgba(40, 167, 69, 0.8)',
                        'rgba(108, 117, 125, 0.8)',
                        'rgba(255, 193, 7, 0.8)',
                        'rgba(32, 201, 151, 0.8)'
                    ],
                    borderColor: [
                        'rgb(26, 110, 160)',
                        'rgb(40, 167, 69)',
                        'rgb(108, 117, 125)',
                        'rgb(255, 193, 7)',
                        'rgb(32, 201, 151)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Water Allocation by Sector'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Percentage (%)'
                        }
                    }
                }
            }
        });
    }
}

// Portfolio Filtering
function setupPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    
    if (filterBtns.length === 0 || portfolioCards.length === 0) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Filter portfolio cards
            portfolioCards.forEach(card => {
                const categories = card.getAttribute('data-category');
                
                if (filter === 'all' || categories.includes(filter)) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Dark Mode Toggle
function setupDarkMode() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    const moonIcon = themeToggle.querySelector('.fa-moon');
    const sunIcon = themeToggle.querySelector('.fa-sun');
    
    // Check for saved theme or prefer-color-scheme
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem('theme');
    
    // Determine initial theme
    let currentTheme = savedTheme || (prefersDarkScheme.matches ? 'dark' : 'light');
    
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        moonIcon.style.display = 'none';
        sunIcon.style.display = 'inline-block';
    }
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            moonIcon.style.display = 'none';
            sunIcon.style.display = 'inline-block';
            localStorage.setItem('theme', 'dark');
        } else {
            moonIcon.style.display = 'inline-block';
            sunIcon.style.display = 'none';
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Listen for system theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.body.classList.add('dark-mode');
                moonIcon.style.display = 'none';
                sunIcon.style.display = 'inline-block';
            } else {
                document.body.classList.remove('dark-mode');
                moonIcon.style.display = 'inline-block';
                sunIcon.style.display = 'none';
            }
        }
    });
}

// Enhanced Contact Form with Netlify support
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    const btnText = contactForm.querySelector('.btn-text');
    const btnLoader = contactForm.querySelector('.btn-loader');
    const successMessage = contactForm.querySelector('.form-success');
    const errorMessage = contactForm.querySelector('.form-error');
    
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading state
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-flex';
        
        // Hide any previous messages
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';
        
        // Validate form
        if (!validateForm(this)) {
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
            errorMessage.style.display = 'flex';
            errorMessage.querySelector('p').textContent = 'Please fill in all required fields correctly.';
            return;
        }
        
        try {
            // Simulate form submission (replace with actual submission)
            await simulateSubmission();
            
            // Show success message
            successMessage.style.display = 'flex';
            
            // Reset form
            contactForm.reset();
            
            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
        } catch (error) {
            console.error('Form submission error:', error);
            errorMessage.style.display = 'flex';
            errorMessage.querySelector('p').textContent = 'There was an error sending your message. Please try again or email me directly.';
        } finally {
            // Reset button state
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
        }
    });
    
    // Form validation
    function validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            field.style.borderColor = '';
            
            if (!field.value.trim()) {
                field.style.borderColor = '#dc3545';
                isValid = false;
            }
            
            if (field.type === 'email' && field.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(field.value)) {
                    field.style.borderColor = '#dc3545';
                    isValid = false;
                }
            }
        });
        
        return isValid;
    }
    
    // Simulate form submission
    function simulateSubmission() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ status: 'success' });
            }, 1500);
        });
    }
}

// Animate skill bars when scrolled into view
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-level');
    
    skillBars.forEach(bar => {
        const level = bar.getAttribute('data-level');
        bar.style.width = level + '%';
    });
}

// Intersection Observer for skill bars
function observeSkillBars() {
    const skillsSection = document.getElementById('skills');
    if (!skillsSection) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBars();
                observer.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    });
    
    observer.observe(skillsSection);
}

// Modal functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Re-initialize map if it's a modal with a map
        if (modalId === 'modal1') {
            setTimeout(() => {
                const mapElement = document.getElementById('modalMap1');
                if (mapElement && !mapElement._leaflet_id) {
                    try {
                        initializeMaps();
                    } catch (error) {
                        console.log('Could not initialize modal map');
                    }
                }
            }, 100);
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Performance optimization: Lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
        });
    }
}

// Initialize lazy loading when DOM is loaded
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Add active class to current section in navigation
function highlightCurrentSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Initialize section highlighting
document.addEventListener('DOMContentLoaded', highlightCurrentSection);

// Add animation to elements when they come into view
function animateOnScroll() {
    const elements = document.querySelectorAll('.expertise-card, .portfolio-card, .publication-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(el => observer.observe(el));
}

// Initialize animations
document.addEventListener('DOMContentLoaded', animateOnScroll);