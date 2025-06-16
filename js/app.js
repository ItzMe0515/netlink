document.addEventListener('DOMContentLoaded', function() {
    // Initialize language based on stored preference or default to English
    const currentLang = localStorage.getItem('netlinksolutions-language') || 'en';
    setLanguage(currentLang);

    // Language toggle functionality
    const languageButtons = document.querySelectorAll('.language-toggle__btn');
    languageButtons.forEach(button => {
        // Set active state based on current language
        if (button.dataset.lang === currentLang) {
            button.classList.add('active');
        }

        button.addEventListener('click', function() {
            const lang = this.dataset.lang;
            setLanguage(lang);

            // Update active state
            languageButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Store language preference
            localStorage.setItem('netlinksolutions-language', lang);
        });
    });

    // Mobile menu toggle
    const mobileMenuToggle = document.createElement('button');
    mobileMenuToggle.classList.add('mobile-menu-toggle');
    mobileMenuToggle.innerHTML = `
        <span class="mobile-menu-toggle__bar"></span>
        <span class="mobile-menu-toggle__bar"></span>
        <span class="mobile-menu-toggle__bar"></span>
    `;
    document.querySelector('.header__content').insertBefore(mobileMenuToggle, document.querySelector('.language-toggle'));

    mobileMenuToggle.addEventListener('click', function() {
        const nav = document.querySelector('.nav');
        nav.classList.toggle('nav--open');
        this.classList.toggle('mobile-menu-toggle--active');
    });

    // FAQ accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-item__question');
        question.addEventListener('click', function() {
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current FAQ item
            item.classList.toggle('active');
        });
    });

    // Form validation and submission
    const quoteForm = document.getElementById('quoteForm');
    if (quoteForm) {
        quoteForm.addEventListener('submit', function(e) {
            if (validationFails) {
                e.preventDefault();
                return;
            }

            // Get current language for messages
            const currentLanguage = localStorage.getItem('netlinksolutions-language') || 'en';

            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const service = document.getElementById('service').value;
            const message = document.getElementById('message').value.trim();

            // Validation
            if (!name) {
                showFormMessage('error', currentLanguage === 'en' ?
                    'Please enter your name.' :
                    'Voer uw naam in.');
                return;
            }

            if (!email) {
                showFormMessage('error', currentLanguage === 'en' ?
                    'Please enter your email address.' :
                    'Voer uw e-mailadres in.');
                return;
            }

            if (!service) {
                showFormMessage('error', currentLanguage === 'en' ?
                    'Please select a service.' :
                    'Selecteer een dienst.');
                return;
            }

            if (!message) {
                showFormMessage('error', currentLanguage === 'en' ?
                    'Please enter a message describing your requirements.' :
                    'Voer een bericht in met uw vereisten.');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFormMessage('error', currentLanguage === 'en' ?
                    'Please enter a valid email address.' :
                    'Voer een geldig e-mailadres in.');
                return;
            }

            // If all validation passes, show success message
            showFormMessage('success', currentLanguage === 'en' ?
                'Thank you for your inquiry! We will contact you within 24 hours.' :
                'Bedankt voor uw aanvraag! We nemen binnen 24 uur contact met u op.');

            // Reset form after successful submission
            setTimeout(() => {
                quoteForm.reset();
            }, 1000);
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            // Close mobile menu if open
            const nav = document.querySelector('.nav');
            if (nav.classList.contains('nav--open')) {
                nav.classList.remove('nav--open');
                document.querySelector('.mobile-menu-toggle').classList.remove('mobile-menu-toggle--active');
            }

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add styles for mobile menu and form messages
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 767px) {
            .mobile-menu-toggle {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                width: 28px;
                height: 20px;
                background: none;
                border: none;
                cursor: pointer;
                padding: 0;
                z-index: 10;
            }
            
            .mobile-menu-toggle__bar {
                width: 100%;
                height: 2px;
                background-color: var(--color-text);
                transition: transform 0.3s, opacity 0.3s;
            }
            
            .mobile-menu-toggle--active .mobile-menu-toggle__bar:first-child {
                transform: translateY(9px) rotate(45deg);
            }
            
            .mobile-menu-toggle--active .mobile-menu-toggle__bar:nth-child(2) {
                opacity: 0;
            }
            
            .mobile-menu-toggle--active .mobile-menu-toggle__bar:last-child {
                transform: translateY(-9px) rotate(-45deg);
            }
            
            .nav {
                position: fixed;
                top: 0;
                right: -100%;
                width: 70%;
                height: 100vh;
                background-color: var(--color-surface);
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: flex-start;
                padding: 80px 24px 24px;
                transition: right 0.3s var(--ease-standard);
                box-shadow: var(--shadow-lg);
                z-index: 5;
                border-left: 1px solid var(--color-border);
            }
            
            .nav--open {
                right: 0;
            }
            
            .nav__link {
                padding: 16px 0;
                width: 100%;
                border-bottom: 1px solid var(--color-border);
                font-size: var(--font-size-lg);
            }
        }
        
        @media (min-width: 768px) {
            .mobile-menu-toggle {
                display: none;
            }
        }
        
        .form-message {
            padding: 16px;
            border-radius: var(--radius-md);
            margin-top: 16px;
            font-weight: var(--font-weight-medium);
            animation: slideIn 0.3s var(--ease-standard);
        }
        
        .form-message--success {
            background-color: rgba(var(--color-success-rgb), 0.15);
            color: var(--color-success);
            border: 1px solid rgba(var(--color-success-rgb), 0.25);
        }
        
        .form-message--error {
            background-color: rgba(var(--color-error-rgb), 0.15);
            color: var(--color-error);
            border: 1px solid rgba(var(--color-error-rgb), 0.25);
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
});

// Function to change the language of the website
function setLanguage(lang) {
    // Get all elements with data-en and data-nl attributes
    const elements = document.querySelectorAll('[data-en], [data-nl]');

    elements.forEach(element => {
        // Check if the element has the language attribute
        if (element.hasAttribute(`data-${lang}`)) {
            // Special handling for placeholder attributes
            if (element.hasAttribute('placeholder')) {
                element.setAttribute('placeholder', element.getAttribute(`data-${lang}`));
            } else if (element.tagName === 'OPTION') {
                // Handle select options
                element.textContent = element.getAttribute(`data-${lang}`);
            } else {
                // For regular content
                element.textContent = element.getAttribute(`data-${lang}`);
            }
        }
    });

    // Update HTML lang attribute
    document.documentElement.lang = lang;

    // Store current language globally for form validation
    window.currentLanguage = lang;
}

// Function to show form messages
function showFormMessage(type, message) {
    // Remove any existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create new message
    const messageElement = document.createElement('div');
    messageElement.classList.add('form-message', `form-message--${type}`);
    messageElement.textContent = message;

    // Add message to form
    const form = document.getElementById('quoteForm');
    form.appendChild(messageElement);

    // Scroll message into view
    messageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Auto-remove success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.style.opacity = '0';
                setTimeout(() => {
                    if (messageElement.parentNode) {
                        messageElement.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
}