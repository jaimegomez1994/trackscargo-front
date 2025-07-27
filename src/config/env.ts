export const config = {
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:3001",
  apiKey: import.meta.env.VITE_API_KEY,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};
