// Platform-specific icons and display names
const platformConfig = {
    telegram: { icon: 'fa-telegram', displayName: 'Telegram' },
    instagram: { icon: 'fa-instagram', displayName: 'Instagram' },
    youtube: { icon: 'fa-youtube', displayName: 'YouTube' },
    tiktok: { icon: 'fa-tiktok', displayName: 'TikTok' }
};

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString || Date.now());
    return date.toLocaleString();
}

// Format numbers for display
function formatNumber(num) {
    return new Intl.NumberFormat().format(num || 0);
}

// Check if user is logged in
function checkAuth() {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = '/admin/login.html';
        return null;
    }
    return token;
}

// Create a social media card
function createSocialCard(platform) {
    try {
        const template = document.getElementById('socialCardTemplate');
        if (!template) {
            console.error('Template not found');
            return null;
        }

        const card = template.content.cloneNode(true);
        const socialCard = card.querySelector('.social-card');
        
        if (!socialCard) {
            console.error('Social card element not found in template');
            return null;
        }

        // Set platform data attribute
        socialCard.setAttribute('data-platform', platform.platform);
        
        // Set icon
        const icon = card.querySelector('.fab');
        if (icon && platformConfig[platform.platform]) {
            icon.classList.add(platformConfig[platform.platform].icon);
        }
        
        // Set platform name
        const platformName = card.querySelector('.platform-name');
        if (platformName && platformConfig[platform.platform]) {
            platformName.textContent = platformConfig[platform.platform].displayName;
        }
        
        // Set last updated
        const lastUpdated = card.querySelector('.last-updated');
        if (lastUpdated) {
            lastUpdated.textContent = `Last updated: ${formatDate(platform.updated_at)}`;
        }
        
        // Set count input
        const countInput = card.querySelector('.count-input');
        if (countInput) {
            countInput.value = platform.follower_count || 0;
        }
        
        // Set URL input
        const urlInput = card.querySelector('.url-input');
        if (urlInput) {
            urlInput.value = platform.platform_url || '';
        }
        
        // Add update button handler
        const updateBtn = card.querySelector('.update-btn');
        if (updateBtn) {
            updateBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                const cardElement = e.target.closest('.social-card');
                if (cardElement) {
                    await updateCount(cardElement);
                }
            });
        }
        
        return card;
    } catch (error) {
        console.error('Error creating social card:', error);
        return null;
    }
}

// Update follower count
async function updateCount(cardElement) {
    const token = checkAuth();
    if (!token || !cardElement) return;

    const platformName = cardElement.getAttribute('data-platform');
    const countInput = cardElement.querySelector('.count-input');
    const urlInput = cardElement.querySelector('.url-input');
    const updateBtn = cardElement.querySelector('.update-btn');
    
    if (!countInput || !urlInput || !updateBtn || !platformName) {
        showMessage(cardElement, 'Invalid card structure', 'error');
        return;
    }

    const count = parseInt(countInput.value);
    const url = urlInput.value.trim();
    
    if (isNaN(count) || count < 0) {
        showMessage(cardElement, 'Please enter a valid number', 'error');
        return;
    }
    
    if (!url) {
        showMessage(cardElement, 'URL is required', 'error');
        return;
    }
    
    updateBtn.disabled = true;

    try {
        const response = await fetch(`/api/social/update/${platformName}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ 
                count: count,
                url: url
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to update count');
        }

        showMessage(cardElement, 'Updated successfully', 'success');
        
        const lastUpdated = cardElement.querySelector('.last-updated');
        if (lastUpdated) {
            lastUpdated.textContent = `Last updated: ${formatDate()}`;
        }
    } catch (error) {
        console.error('Error updating count:', error);
        showMessage(cardElement, error.message, 'error');
    } finally {
        updateBtn.disabled = false;
    }
}

// Show success/error message
function showMessage(cardElement, text, type) {
    if (!cardElement) return;
    
    const messageDiv = cardElement.querySelector('.message');
    if (!messageDiv) return;
    
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}-message`;
    
    setTimeout(() => {
        if (messageDiv) {
            messageDiv.textContent = '';
            messageDiv.className = 'message';
        }
    }, 3000);
}

// Load all social media counts
async function loadSocialCounts() {
    const container = document.getElementById('socialCards');
    if (!container) {
        console.error('Social cards container not found');
        return;
    }
    
    try {
        const response = await fetch('/api/social/counts');
        if (!response.ok) {
            throw new Error('Failed to fetch counts');
        }
        
        const platforms = await response.json();
        container.innerHTML = '';
        
        for (const platform of platforms) {
            const card = createSocialCard(platform);
            if (card) {
                container.appendChild(card);
            }
        }
        
        if (platforms.length === 0) {
            container.innerHTML = '<div class="message">No social media platforms configured</div>';
        }
    } catch (error) {
        console.error('Error loading social counts:', error);
        container.innerHTML = '<div class="error-message">Failed to load social media counts</div>';
    }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    if (checkAuth()) {
        loadSocialCounts();
    }
});
