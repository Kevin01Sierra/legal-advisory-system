export const authService = {
  async login(email, password) {
    return apiClient.post('/auth/login', { email, password });
  },

  async register(formData) {
    return apiClient.post('/auth/register', formData);
  },
};