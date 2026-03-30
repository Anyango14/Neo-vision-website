/* ============================================
   NEO VISION ENGINEERING - MAIN JAVASCRIPT
   Interactive Features & Form Handling
   ============================================ */

// ============ DOM ELEMENTS ============
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');

// ============ MOBILE MENU TOGGLE ============
/**
 * Toggle mobile navigation menu
 * Adds/removes 'active' class to show/hide menu
 */
menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger menu
    const spans = menuToggle.querySelectorAll('span');
    spans.forEach(span => {
        span.style.transition = 'all 0.3s ease';
    });

    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(8px, 8px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(8px, -8px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// ============ CLOSE MENU ON LINK CLICK ============
/**
 * Close mobile menu when a navigation link is clicked
 * Improves mobile user experience
 */
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        
        // Reset hamburger animation
        const spans = menuToggle.querySelectorAll('span');
        spans.forEach(span => {
            span.style.transform = 'none';
        });
        spans[1].style.opacity = '1';
    });
});

// ============ SCROLL TO CONTACT SECTION ============
/**
 * Smooth scroll to contact section when CTA button is clicked
 * Used from hero section
 */
function scrollToContact() {
    const contactSection = document.getElementById('contact');
    contactSection.scrollIntoView({ behavior: 'smooth' });
}

// ============ FORM SUBMISSION HANDLER ============
/**
 * Handle contact form submission
 * Validates form data and redirects to WhatsApp
 * WhatsApp Number: 0729311087
 */
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form data for client-side validation
    const formData = {
        name: document.getElementById('name').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        service: document.getElementById('service').value,
        message: document.getElementById('message').value.trim(),
        timestamp: new Date().toISOString()
    };

    // Basic validation
    if (!formData.name || !formData.phone || !formData.service || !formData.message) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    // Phone validation (basic)
    const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
    if (!phoneRegex.test(formData.phone)) {
        showNotification('Please enter a valid phone number', 'error');
        return;
    }

    // Log form data (for debugging)
    console.log('Quote Request Submitted:', formData);

    // Store data in localStorage for persistence
    storeFormData(formData);

    // Create WhatsApp message content
    const serviceNames = {
        'cctv': 'CCTV & Security Systems',
        'networking': 'Network Installation',
        'electrical': 'Electrical Services',
        'events': 'Events & Sound',
        'other': 'Other'
    };

    const serviceName = serviceNames[formData.service] || formData.service;
    const whatsappMessage = `*New Quote Request*

*Name:* ${formData.name}
*Phone:* ${formData.phone}
*Service:* ${serviceName}
*Message:* ${formData.message}
*Time:* ${new Date().toLocaleString()}`;

    // Show success notification
    showNotification('Redirecting to WhatsApp...', 'success');

    // Redirect to WhatsApp with pre-filled message
    // Using country code 254 for Kenya (0729311087 -> 254729311087)
    const whatsappURL = `https://wa.me/254729311087?text=${encodeURIComponent(whatsappMessage)}`;
    
    // Reset form after brief delay
    setTimeout(() => {
        contactForm.reset();
        window.open(whatsappURL, '_blank');
    }, 500);
});

// ============ NOTIFICATION SYSTEM ============
/**
 * Display notifications to the user
 * @param {string} message - Notification message
 * @param {string} type - 'success', 'error', or 'info'
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
    `;

    // Add styles if not already present
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 16px 24px;
                border-radius: 8px;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
                z-index: 10000;
                animation: slideIn 0.3s ease;
                max-width: 400px;
            }

            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            .notification-success {
                background: #4caf50;
                color: white;
            }

            .notification-error {
                background: #f44336;
                color: white;
            }

            .notification-info {
                background: #2196f3;
                color: white;
            }

            .notification-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 15px;
            }

            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }

            .notification-close:hover {
                opacity: 0.8;
            }

            @media (max-width: 768px) {
                .notification {
                    top: 10px;
                    right: 10px;
                    left: 10px;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Add notification to DOM
    document.body.appendChild(notification);

    // Auto-remove notification after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        notification.addEventListener('animationend', () => {
            notification.remove();
        });

        // Add slide out animation
        if (!document.getElementById('slideout-styles')) {
            const slideOutStyle = document.createElement('style');
            slideOutStyle.id = 'slideout-styles';
            slideOutStyle.textContent = `
                @keyframes slideOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                }
                
                @media (max-width: 768px) {
                    @keyframes slideOut {
                        from {
                            transform: translateX(0);
                            opacity: 1;
                        }
                        to {
                            transform: translateX(calc(100vw + 20px));
                            opacity: 0;
                        }
                    }
                }
            `;
            document.head.appendChild(slideOutStyle);
        }
    }, 4000);
}

// ============ LOCAL STORAGE FUNCTIONS ============
/**
 * Store form data in browser's localStorage
 * Useful for data persistence and offline capability
 */
function storeFormData(data) {
    try {
        let submissions = JSON.parse(localStorage.getItem('formSubmissions')) || [];
        submissions.push(data);
        
        // Keep only last 10 submissions
        if (submissions.length > 10) {
            submissions = submissions.slice(-10);
        }
        
        localStorage.setItem('formSubmissions', JSON.stringify(submissions));
        console.log('Form data saved to localStorage');
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

/**
 * Retrieve stored form data from localStorage
 */
function getStoredFormData() {
    try {
        return JSON.parse(localStorage.getItem('formSubmissions')) || [];
    } catch (error) {
        console.error('Error retrieving from localStorage:', error);
        return [];
    }
}

/**
 * Clear stored form data from localStorage
 */
function clearStoredFormData() {
    try {
        localStorage.removeItem('formSubmissions');
        console.log('Form data cleared from localStorage');
    } catch (error) {
        console.error('Error clearing localStorage:', error);
    }
}

// ============ NAVBAR SCROLL EFFECTS ============
/**
 * Add shadow to navbar when user scrolls down
 * Improves visual hierarchy
 */
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 50) {
        navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// ============ INTERSECTION OBSERVER FOR ANIMATIONS ============
/**
 * Animate elements when they come into view
 * Creates smooth, professional fade-in effects
 */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add animation to service cards and gallery items
document.querySelectorAll('.service-card, .gallery-item, .info-item').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// Add the fadeInUp animation to stylesheet if not present
if (!document.getElementById('observer-animation')) {
    const style = document.createElement('style');
    style.id = 'observer-animation';
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// ============ FORM INPUT ENHANCEMENTS ============
/**
 * Add real-time validation feedback to form inputs
 */
const formInputs = contactForm.querySelectorAll('input, select, textarea');

formInputs.forEach(input => {
    input.addEventListener('blur', () => {
        validateInput(input);
    });

    input.addEventListener('input', () => {
        // Remove error styling on input
        if (input.classList.contains('error')) {
            input.classList.remove('error');
        }
    });
});

/**
 * Validate individual form input
 */
function validateInput(input) {
    const value = input.value.trim();
    
    if (!value && input.hasAttribute('required')) {
        input.classList.add('error');
        return false;
    }

    if (input.type === 'tel') {
        const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
        if (value && !phoneRegex.test(value)) {
            input.classList.add('error');
            return false;
        }
    }

    return true;
}

// Add error styling to stylesheet
if (!document.getElementById('input-validation-styles')) {
    const style = document.createElement('style');
    style.id = 'input-validation-styles';
    style.textContent = `
        input.error,
        select.error,
        textarea.error {
            border-color: #f44336 !important;
            background-color: rgba(244, 67, 54, 0.05);
        }

        input.error:focus,
        select.error:focus,
        textarea.error:focus {
            box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1) !important;
        }
    `;
    document.head.appendChild(style);
}

// ============ PAGE LOAD OPTIMIZATION ============
/**
 * Initialize all interactive features when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('Neo Vision Engineering website loaded successfully');
    
    // Log form submissions from localStorage
    const submissions = getStoredFormData();
    if (submissions.length > 0) {
        console.log(`${submissions.length} form submission(s) stored locally`);
    }

    // Add loading animation to images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', () => {
            img.style.animation = 'fadeInUp 0.6s ease';
        });
    });
});

// ============ PERFORMANCE MONITORING ============
/**
 * Log performance metrics for optimization
 */
if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`Page Load Time: ${pageLoadTime}ms`);
        }, 0);
    });
}

// ============ EXPORT FUNCTIONS FOR EXTERNAL USE ============
window.neovision = {
    scrollToContact,
    showNotification,
    getStoredFormData,
    clearStoredFormData,
    validateInput
};

console.log('Neo Vision Engineering - Interactive features loaded. Access via window.neovision');
