// Smooth scrolling for navigation
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const offsetTop = section.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Header scroll effect and parallax
function handleHeaderScroll() {
    const header = document.querySelector('.header');
    const scrolled = window.scrollY > 50;
    
    if (scrolled) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// Parallax effect for hero background
function handleParallaxScroll() {
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5; // Subtle parallax speed
        const opacity = Math.max(0.3, 1 - scrolled / 800); // Fade out effect
        
        heroBackground.style.transform = `translate3d(0, ${parallax}px, 0)`;
        heroBackground.style.opacity = opacity;
    }
}

// Combined scroll handler with throttling for performance
function handleScroll() {
    handleHeaderScroll();
    handleParallaxScroll();
}

// Form validation and submission
class FormHandler {
    constructor() {
        this.form = document.getElementById('quoteForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.messageDiv = document.getElementById('formMessage');
        this.rateLimitKey = 'dreamw_travel_submissions';
        this.maxSubmissions = 3;
        this.timeWindow = 60 * 60 * 1000; // 1 hour in milliseconds
        
        this.init();
    }
    
    init() {
        if (this.form) {
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
            this.setupDateValidation();
        }
    }
    
    setupDateValidation() {
        const startDate = document.getElementById('startDate');
        const endDate = document.getElementById('endDate');
        
        if (startDate && endDate) {
            // Set minimum date to today
            const today = new Date().toISOString().split('T')[0];
            startDate.min = today;
            endDate.min = today;
            
            startDate.addEventListener('change', () => {
                endDate.min = startDate.value;
                if (endDate.value && endDate.value < startDate.value) {
                    endDate.value = startDate.value;
                }
            });
            
            endDate.addEventListener('change', () => {
                if (startDate.value && endDate.value < startDate.value) {
                    this.showMessage('End date must be after start date.', 'error');
                    endDate.value = startDate.value;
                }
            });
        }
    }
    
    checkRateLimit() {
        const submissions = JSON.parse(localStorage.getItem(this.rateLimitKey) || '[]');
        const now = Date.now();
        
        // Remove old submissions outside the time window
        const recentSubmissions = submissions.filter(timestamp => 
            now - timestamp < this.timeWindow
        );
        
        // Update localStorage with cleaned submissions
        localStorage.setItem(this.rateLimitKey, JSON.stringify(recentSubmissions));
        
        return recentSubmissions.length < this.maxSubmissions;
    }
    
    recordSubmission() {
        const submissions = JSON.parse(localStorage.getItem(this.rateLimitKey) || '[]');
        submissions.push(Date.now());
        localStorage.setItem(this.rateLimitKey, JSON.stringify(submissions));
    }
    
    validateForm() {
        const requiredFields = ['name', 'email', 'origin', 'destination', 'startDate', 'endDate', 'travelers'];
        const consent = document.getElementById('consent');
        const honeypot = document.querySelector('input[name="website"]');
        
        // Check honeypot (should be empty)
        if (honeypot && honeypot.value) {
            this.showMessage('Spam detected. Please try again.', 'error');
            return false;
        }
        
        // Check required fields
        for (const fieldId of requiredFields) {
            const field = document.getElementById(fieldId);
            if (!field || !field.value.trim()) {
                this.showMessage(`Please fill in all required fields.`, 'error');
                field?.focus();
                return false;
            }
        }
        
        // Check consent
        if (!consent || !consent.checked) {
            this.showMessage('Please agree to the consent terms.', 'error');
            consent?.focus();
            return false;
        }
        
        // Validate email format
        const email = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            this.showMessage('Please enter a valid email address.', 'error');
            email.focus();
            return false;
        }
        
        // Validate dates
        const startDate = document.getElementById('startDate');
        const endDate = document.getElementById('endDate');
        if (new Date(endDate.value) < new Date(startDate.value)) {
            this.showMessage('End date must be after start date.', 'error');
            endDate.focus();
            return false;
        }
        
        return true;
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        // Clear previous messages
        this.hideMessage();
        
        // Validate rate limit
        if (!this.checkRateLimit()) {
            this.showMessage('You have reached the maximum number of submissions per hour. Please try again later.', 'error');
            return;
        }
        
        // Validate form
        if (!this.validateForm()) {
            return;
        }
        
        // Show loading state
        this.setLoading(true);
        
        try {
            const formData = new FormData(this.form);
            
            // Set reply-to header for customer email
            const customerEmail = formData.get('email');
            formData.append('_replyto', customerEmail);
            
            const response = await fetch(this.form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                this.recordSubmission();
                const email = document.getElementById('email').value;
                this.showMessage(
                    `Thanks! We've emailed a confirmation to ${email} and will follow up within 24–48 hours.`,
                    'success'
                );
                this.form.reset();
                
                // Scroll to success message
                setTimeout(() => {
                    this.messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.showMessage(
                'We couldn\'t send the email. Please check your details or try again in a moment.',
                'error'
            );
        } finally {
            this.setLoading(false);
        }
    }
    
    setLoading(loading) {
        if (loading) {
            this.submitBtn.classList.add('loading');
            this.submitBtn.disabled = true;
        } else {
            this.submitBtn.classList.remove('loading');
            this.submitBtn.disabled = false;
        }
    }
    
    showMessage(message, type) {
        this.messageDiv.textContent = message;
        this.messageDiv.className = `form-message ${type}`;
        this.messageDiv.style.display = 'block';
    }
    
    hideMessage() {
        this.messageDiv.style.display = 'none';
        this.messageDiv.className = 'form-message';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize form handler
    new FormHandler();
    
    // Set up scroll event listener for header and parallax
    window.addEventListener('scroll', handleScroll);
    
    // Initial header state and parallax position
    handleHeaderScroll();
    handleParallaxScroll();
    
    // Set up smooth scrolling for hero buttons
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    heroButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.textContent.includes('Quote') ? 'quote-form' : 'services';
            scrollToSection(targetSection);
        });
    });
    
    // Add click handlers for external links (ensure they open in new tab)
    const externalLinks = document.querySelectorAll('a[href^="http"]');
    externalLinks.forEach(link => {
        if (!link.getAttribute('target')) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });
    
    // Accessibility improvements
    addAccessibilityFeatures();
});

// Accessibility features
function addAccessibilityFeatures() {
    // Add skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#services';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-color);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1001;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Ensure form labels are properly associated
    const formInputs = document.querySelectorAll('#quoteForm input, #quoteForm select, #quoteForm textarea');
    formInputs.forEach(input => {
        const label = document.querySelector(`label[for="${input.id}"]`);
        if (label && !input.getAttribute('aria-labelledby')) {
            input.setAttribute('aria-labelledby', input.id + '-label');
            label.id = input.id + '-label';
        }
    });
    
    // Add ARIA labels to social media links
    const socialLinks = document.querySelectorAll('.social-links a');
    socialLinks.forEach(link => {
        const icon = link.querySelector('i');
        if (icon) {
            const platform = icon.className.includes('instagram') ? 'Instagram' : 
                           icon.className.includes('facebook') ? 'Facebook' : 
                           icon.className.includes('tiktok') ? 'TikTok' : 'Social Media';
            link.setAttribute('aria-label', `Follow us on ${platform}`);
        }
    });
}

// Utility function for debouncing scroll events
function debounce(func, wait) {
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

// Optimize scroll performance with combined handler
window.addEventListener('scroll', debounce(handleScroll, 8));

// Use requestAnimationFrame for smoother parallax on modern browsers
let ticking = false;
function requestParallaxUpdate() {
    if (!ticking) {
        requestAnimationFrame(handleParallaxScroll);
        ticking = true;
        setTimeout(() => { ticking = false; }, 16);
    }
}

window.addEventListener('scroll', requestParallaxUpdate);

// Error handling for missing elements
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

// Handle form submission errors gracefully
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
});
