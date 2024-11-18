// Check if user is logged in
function checkAuth() {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = '/admin/login.html';
        return null;
    }
    return token;
}

// Add auth token to fetch requests
async function authenticatedFetch(url, options = {}) {
    const token = checkAuth();
    if (!token) return null;

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
    };

    try {
        const response = await fetch(url, {
            ...options,
            headers
        });

        if (response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('adminToken');
            window.location.href = '/admin/login.html';
            return null;
        }

        return response;
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}

// Initialize auth check
document.addEventListener('DOMContentLoaded', checkAuth);
