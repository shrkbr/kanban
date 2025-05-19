import axios from 'axios';

// Configuração básica do axios para requisições à API do Chatwoot
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_CHATWOOT_BASE_URL 
    ? `${process.env.NEXT_PUBLIC_CHATWOOT_BASE_URL}/api/v1` 
    : '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Adicionar token de autenticação às requisições se disponível
if (process.env.NEXT_PUBLIC_CHATWOOT_API_ACCESS_TOKEN) {
  api.defaults.headers.common['api_access_token'] = process.env.NEXT_PUBLIC_CHATWOOT_API_ACCESS_TOKEN;
}

export default api;
