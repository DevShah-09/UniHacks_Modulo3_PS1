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
        console.log('🔐 Authorization header set with token');
      } else {
        console.warn('⚠️ No token found in userInfo');
      }
    } else {
      console.warn('⚠️ No userInfo found in localStorage');
    }
    console.log('📤 API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('📥 API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Error Response:', error.response?.status, error.response?.data?.message);
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

// Podcasts helpers
export const uploadPodcast = async (formData) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  const response = await api.post('/podcasts', formData, config);
  return response.data;
};

export const getPodcasts = async () => {
  const response = await api.get('/podcasts');
  return response.data;
};

export const getPodcast = async (podcastId) => {
  const response = await api.get(`/podcasts/${podcastId}`);
  return response.data;
};

export const updatePodcast = async (podcastId, data) => {
  const response = await api.put(`/podcasts/${podcastId}`, data);
  return response.data;
};

export const deletePodcast = async (podcastId) => {
  const response = await api.delete(`/podcasts/${podcastId}`);
  return response.data;
};

export const searchPodcasts = async (query = '', tags = []) => {
  const params = new URLSearchParams();
  if (query) params.append('query', query);
  if (tags.length) params.append('tags', tags.join(','));
  const response = await api.get(`/podcasts/search/query?${params.toString()}`);
  return response.data;
};

// Advanced AI features
export const getPerspectives = async (postId) => {
  const response = await api.get(`/posts/${postId}/perspectives`);
  return response.data;
};

export const getSentiment = async (postId) => {
  const response = await api.get(`/posts/${postId}/sentiment`);
  return response.data;
};

export const getRelatedPosts = async (postId) => {
  const response = await api.get(`/posts/${postId}/related`);
  return response.data;
};

export const transcribePodcast = async (podcastId) => {
  const response = await api.post(`/podcasts/${podcastId}/transcribe`);
  return response.data;
};

export default api;
