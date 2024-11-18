// Format numbers (e.g., 1000 -> 1K)
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Animate counter from current to target number
function animateCounter(element, target, duration = 2000) {
    const start = parseInt(element.textContent.replace(/[^0-9]/g, '')) || 0;
    const range = target - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const animate = () => {
        current += increment;
        if ((increment >= 0 && current >= target) || (increment < 0 && current <= target)) {
            element.textContent = formatNumber(target);
        } else {
            element.textContent = formatNumber(Math.floor(current));
            requestAnimationFrame(animate);
        }
    };
    
    animate();
}

// Update all social media counters
async function updateSocialCounters() {
    try {
        const response = await fetch('/api/social/counts');
        if (!response.ok) throw new Error('Failed to fetch counts');
        
        const platforms = await response.json();
        
        platforms.forEach(platform => {
            const counterElement = document.querySelector(`.counter.${platform.platform}`);
            if (counterElement) {
                // Update URL
                if (platform.platform_url) {
                    counterElement.href = platform.platform_url;
                }
                
                // Update count
                const countElement = counterElement.querySelector('.count');
                if (countElement) {
                    animateCounter(countElement, platform.follower_count);
                }
            }
        });
    } catch (error) {
        console.error('Error updating social counters:', error);
    }
}

// Create Intersection Observer for counter animation
const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            updateSocialCounters();
            observer.unobserve(entry.target);
        }
    });
};

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    const countersSection = document.querySelector('.social-counters');
    if (countersSection) {
        const observer = new IntersectionObserver(observerCallback, {
            threshold: 0.1
        });
        observer.observe(countersSection);
    }
});
