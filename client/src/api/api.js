import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // optionally redirect to login page
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Services
export const postService = {
  getAllPosts: async (page = 1, limit = 10, category = null, search = '') => {
    const params = { page, limit };
    if (category) params.category = category;
    if (search) params.search = search;
    const res = await api.get('/posts', { params });
    return res.data;
  },
  getPost: async (id) => (await api.get(`/posts/${id}`)).data,
  createPost: async (formData) => (await api.post('/posts', formData, { headers: { 'Content-Type': 'multipart/form-data' } })).data,
  updatePost: async (id, formData) => (await api.put(`/posts/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })).data,
  deletePost: async (id) => (await api.delete(`/posts/${id}`)).data,
  addComment: async (postId, commentData) => (await api.post(`/posts/${postId}/comments`, commentData)).data
};

export const categoryService = {
  getAllCategories: async () => (await api.get('/categories')).data,
  createCategory: async (category) => (await api.post('/categories', category)).data
};

export const authService = {
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },
  me: async () => (await api.get('/auth/me')).data
};

export default api;
