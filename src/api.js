import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '';

const client = axios.create({
    baseURL: API_BASE,
});

// Debug: expose resolved API base so production bundle can be inspected
if (typeof window !== 'undefined') {
    window.__API_BASE = API_BASE;
    console.log('[app] API_BASE =', API_BASE);
}

export default client;
