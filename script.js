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
    setupNewsletterForm();
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
});

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

// Formspree Contact Form
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        
        // Show loading state
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-flex';
        
        // Clear any previous feedback
        clearFormFeedback(this);
        
        // Validate form
        if (!validateForm(this)) {
            showFormFeedback(this, 'Please fill in all required fields correctly.', 'error');
            resetButton(btnText, btnLoader);
            return;
        }
        
        // Validate file size if file is attached
        const fileInput = this.querySelector('input[type="file"]');
        if (fileInput && fileInput.files.length > 0) {
            const fileSize = fileInput.files[0].size; // in bytes
            const maxSize = 5 * 1024 * 1024; // 5MB
            
            if (fileSize > maxSize) {
                showFormFeedback(this, 'File size exceeds 5MB limit. Please upload a smaller file.', 'error');
                resetButton(btnText, btnLoader);
                return;
            }
        }
        
        try {
            // Create FormData for file upload support
            const formData = new FormData(this);
            
            // Submit to Formspree
            const response = await fetch('https://formspree.io/f/xbdygynn', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Show success message
                showFormFeedback(this, 'Thank you! Your message has been sent successfully. I\'ll respond within 24 hours.', 'success');
                
                // Reset form
                contactForm.reset();
                
                console.log('Form submitted successfully to Formspree');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Form submission failed');
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            showFormFeedback(this, 'There was an error sending your message. Please try again or email me directly at macdalfchristopher@gmail.com', 'error');
        } finally {
            resetButton(btnText, btnLoader);
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
                if (!validateEmail(field.value)) {
                    field.style.borderColor = '#dc3545';
                    isValid = false;
                }
            }
        });
        
        return isValid;
    }
}

// Newsletter Form
function setupNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const emailInput = this.querySelector('input[type="email"]');
        const submitBtn = this.querySelector('button[type="submit"]');
        
        // Clear previous feedback
        clearFormFeedback(this);
        
        // Validate email
        if (!validateEmail(emailInput.value)) {
            showFormFeedback(this, 'Please enter a valid email address.', 'error');
            return;
        }
        
        // Disable button during submission
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
        
        try {
            // Create FormData
            const formData = new FormData(this);
            
            // Submit to Formspree
            const response = await fetch('https://formspree.io/f/xbdygynn', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                showFormFeedback(this, 'Thank you for subscribing to my newsletter!', 'success');
                this.reset();
                console.log('Newsletter subscription successful');
            } else {
                throw new Error('Newsletter subscription failed');
            }
            
        } catch (error) {
            console.error('Newsletter error:', error);
            showFormFeedback(this, 'Subscription failed. Please try again later.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });
}

// Helper Functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFormFeedback(form, message, type) {
    const feedbackDiv = form.querySelector('.form-feedback');
    if (!feedbackDiv) return;
    
    feedbackDiv.textContent = message;
    feedbackDiv.className = 'form-feedback ' + type;
    feedbackDiv.style.display = 'block';
    
    // Scroll to feedback
    feedbackDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function clearFormFeedback(form) {
    const feedbackDiv = form.querySelector('.form-feedback');
    if (feedbackDiv) {
        feedbackDiv.style.display = 'none';
        feedbackDiv.className = 'form-feedback';
    }
}

function resetButton(btnText, btnLoader) {
    if (btnText) btnText.style.display = 'inline';
    if (btnLoader) btnLoader.style.display = 'none';
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
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

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

// Initialize maps (simplified for local use)
function initializeMaps() {
    console.log('Maps would be initialized here with proper API keys');
}

// Initialize charts
function initializeCharts() {
    console.log('Charts would be initialized here');
}

// Download CV functionality
function setupCVDownload() {
    const downloadBtn = document.querySelector('a[download*="CV"]');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            console.log('CV download initiated');
        });
    }
}

// Initialize CV download
document.addEventListener('DOMContentLoaded', setupCVDownload);