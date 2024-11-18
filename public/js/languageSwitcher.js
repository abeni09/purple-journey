class LanguageSwitcher {
    constructor() {
        this.currentLang = localStorage.getItem('preferredLanguage') || 'am';
        this.init();
    }

    init() {
        this.applyTranslations();
        this.setupLanguageToggle();
    }

    setupLanguageToggle() {
        const langToggle = document.getElementById('language-toggle');
        if (langToggle) {
            langToggle.addEventListener('click', () => {
                this.currentLang = this.currentLang === 'en' ? 'am' : 'en';
                localStorage.setItem('preferredLanguage', this.currentLang);
                this.applyTranslations();
                this.updateToggleButton();
            });
            this.updateToggleButton();
        }
    }

    updateToggleButton() {
        const langToggle = document.getElementById('language-toggle');
        if (langToggle) {
            langToggle.textContent = this.currentLang === 'en' ? 'አማርኛ' : 'English';
        }
    }

    applyTranslations() {
        // Handle regular content translations
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[this.currentLang] && translations[this.currentLang][key]) {
                // Don't set placeholder here anymore, just set text content
                element.textContent = translations[this.currentLang][key];
            }
        });

        // Handle placeholder translations separately
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (translations[this.currentLang] && translations[this.currentLang][key]) {
                element.placeholder = translations[this.currentLang][key];
            }
        });

        // Update document direction based on language
        document.documentElement.dir = this.currentLang === 'am' ? 'ltr' : 'ltr';
        
        // Dispatch event for other components that might need to know about language changes
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: this.currentLang }
        }));
    }
}

// Initialize language switcher when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.languageSwitcher = new LanguageSwitcher();
});
