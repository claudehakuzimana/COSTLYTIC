// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const config = {
  api: {
    baseURL: API_BASE_URL,
    timeout: 10000,
  },
  defaultPageSize: 10,
  dateFormat: 'DD/MM/YYYY',
  currencyFormat: 'USD',
};

export default config;
