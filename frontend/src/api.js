const BASE = 'https://three65system.onrender.com';

function getToken() {
  return localStorage.getItem('365_token');
}

function setToken(token) {
  localStorage.setItem('365_token', token);
}

function removeToken() {
  localStorage.removeItem('365_token');
}

async function request(method, path, body = null) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  if (res.status === 401) {
    removeToken();
    window.location.reload();
    return;
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Request failed');
  return data;
}

// Auth
export async function register(email, password) {
  const data = await request('POST', '/auth/register', { email, password });
  setToken(data.access_token);
  return data;
}

export async function login(email, password) {
  const data = await request('POST', '/auth/login', { email, password });
  setToken(data.access_token);
  return data;
}

export function logout() {
  removeToken();
}

export function isLoggedIn() {
  return !!getToken();
}

// User
export async function getMe() {
  return request('GET', '/user/me');
}

export async function onboard(payload) {
  return request('POST', '/user/onboard', payload);
}

export async function updateSettings(payload) {
  return request('PUT', '/user/settings', payload);
}

// Daily
export async function getDaily(date) {
  return request('GET', `/daily/${date}`);
}

export async function getDailyRange(start, end) {
  return request('GET', `/daily/range/${start}/${end}`);
}

export async function saveDaily(payload) {
  return request('POST', '/daily/', payload);
}

// Journal
export async function getDayJournals(date) {
  return request('GET', `/journal/${date}`);
}

export async function getPillarArchive(pillarId) {
  return request('GET', `/journal/pillar/${pillarId}`);
}

export async function saveJournal(payload) {
  return request('POST', '/journal/', payload);
}
