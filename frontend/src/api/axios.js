import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Organization helpers
export const getMyOrganization = async () => {
  try {
    const response = await api.get('/organizations/my-org');
    return response.data;
  } catch (error) {
    console.error('Error fetching organization:', error);
    return null;
  }
};

export const createOrganization = async (orgData) => {
  const response = await api.post('/organizations', orgData);
  return response.data;
};

// Posts helpers
export const searchPosts = async (query = '', tags = [], contentType = '') => {
  const params = new URLSearchParams();
  if (query) params.append('query', query);
  if (tags.length) params.append('tags', tags.join(','));
  if (contentType) params.append('contentType', contentType);
  const response = await api.get(`/search?${params.toString()}`);
  return response.data;
};

export const getTags = async () => {
  const response = await api.get('/search/tags');
  return response.data.tags;
};

export const getPostsByTag = async (tagName) => {
  const response = await api.get(`/search/tag/${tagName}`);
  return response.data;
};

// Comments helpers
export const fetchComments = async (postId) => {
  const response = await api.get(`/comments/${postId}`);
  return response.data;
};

export const createComment = async (postId, content) => {
  const response = await api.post('/comments', { postId, content });
  return response.data;
};

export const deleteComment = async (commentId) => {
  const response = await api.delete(`/comments/${commentId}`);
  return response.data;
};

export default api;
