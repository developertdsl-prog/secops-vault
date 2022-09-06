import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || '/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
    'x-vault-token': 'secops_root_token_live_9941'
  }
});

export const fetchSummary = async () => {
  const res = await apiClient.get('/analytics/summary');
  return res.data;
};

export const fetchSecrets = async () => {
  const res = await apiClient.get('/secrets');
  return res.data;
};

export const createSecret = async (secretData) => {
  const res = await apiClient.post(`/secrets/${secretData.path}`, secretData);
  return res.data;
};

export default apiClient;
