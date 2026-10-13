import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ── Auth API ──────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => axios.post(`${BASE_URL}/auth/register`, data),
  login: (data) => axios.post(`${BASE_URL}/auth/login`, data),
};

// ── Course API ────────────────────────────────────────────────────────────────
export const courseAPI = {
  getAll: () => axios.get(`${BASE_URL}/courses`, { headers: getAuthHeader() }),
  getById: (id) => axios.get(`${BASE_URL}/courses/${id}`, { headers: getAuthHeader() }),
  search: (keyword) => axios.get(`${BASE_URL}/courses/search?keyword=${keyword}`, { headers: getAuthHeader() }),
  create: (data) => axios.post(`${BASE_URL}/courses`, data, { headers: getAuthHeader() }),
  update: (id, data) => axios.put(`${BASE_URL}/courses/${id}`, data, { headers: getAuthHeader() }),
  delete: (id) => axios.delete(`${BASE_URL}/courses/${id}`, { headers: getAuthHeader() }),
  enroll: (id) => axios.post(`${BASE_URL}/courses/${id}/enroll`, {}, { headers: getAuthHeader() }),
  myEnrollments: () => axios.get(`${BASE_URL}/courses/my-enrollments`, { headers: getAuthHeader() }),
  updateProgress: (id, progressPercent) =>
    axios.put(`${BASE_URL}/courses/${id}/progress`, { progressPercent }, { headers: getAuthHeader() }),
};

// ── Quiz API ──────────────────────────────────────────────────────────────────
export const quizAPI = {
  getByCourse: (courseId) => axios.get(`${BASE_URL}/courses/${courseId}/quizzes`, { headers: getAuthHeader() }),
  getById: (quizId) => axios.get(`${BASE_URL}/quizzes/${quizId}`, { headers: getAuthHeader() }),
  create: (courseId, data) => axios.post(`${BASE_URL}/courses/${courseId}/quizzes`, data, { headers: getAuthHeader() }),
  submit: (quizId, answers) => axios.post(`${BASE_URL}/quizzes/${quizId}/submit`, { answers }, { headers: getAuthHeader() }),
  myResults: () => axios.get(`${BASE_URL}/quiz-results/my`, { headers: getAuthHeader() }),
};

// ── Admin API ─────────────────────────────────────────────────────────────────
export const adminAPI = {
  getUsers: () => axios.get(`${BASE_URL}/admin/users`, { headers: getAuthHeader() }),
  deleteUser: (id) => axios.delete(`${BASE_URL}/admin/users/${id}`, { headers: getAuthHeader() }),
};
