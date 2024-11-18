class SocialCounters {
    constructor() {
        // Sample follower counts - replace with actual API data
        this.socialData = {
            telegram: 15700,
            instagram: 25300,
            tiktok: 45800,
            youtube: 12400
        };
        
        this.animationDuration = 2000; // 2 seconds
        this.init();
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    animateValue(element, start, end, duration) {
        const range = end - start;
        const increment = range / (duration / 16); // 60fps
        let current = start;
        
        const animate = () => {
            current += increment;
            if (current >= end) {
                element.textContent = this.formatNumber(end);
            } else {
                element.textContent = this.formatNumber(Math.floor(current));
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }

    startAnimation(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const value = parseInt(counter.getAttribute('data-value'));
                if (!isNaN(value)) {
                    this.animateValue(counter, 0, value, this.animationDuration);
                    observer.unobserve(counter); // Only animate once
                }
            }
        });
    }

    init() {
        const observer = new IntersectionObserver(
            this.startAnimation.bind(this),
            { threshold: 0.1 }
        );

        document.querySelectorAll('.social-counter').forEach(counter => {
            observer.observe(counter);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.count');
    const duration = 2000; // Animation duration in milliseconds

    const animateCounter = (counter, targetValue) => {
        let startValue = 0;
        const increment = targetValue / (duration / 16); // 60 FPS
        
        const updateCounter = () => {
            startValue += increment;
            if (startValue < targetValue) {
                counter.textContent = Math.ceil(startValue).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = targetValue.toLocaleString();
            }
        };

        updateCounter();
    };

    const startCountAnimation = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const targetValue = parseInt(counter.textContent.replace(/[^0-9]/g, ''));
                counter.textContent = '0';
                animateCounter(counter, targetValue);
                observer.unobserve(counter);
            }
        });
    };

    const observer = new IntersectionObserver(startCountAnimation, {
        threshold: 0.5
    });

    counters.forEach(counter => {
        observer.observe(counter);
    });

    window.socialCounters = new SocialCounters();
});
