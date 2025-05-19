import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_CHATWOOT_BASE_URL + '/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'api_access_token': process.env.NEXT_PUBLIC_CHATWOOT_API_ACCESS_TOKEN
  }
});

export default api;
