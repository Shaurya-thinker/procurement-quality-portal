import api from './api';

const USER_API = '/api/v1/users';

export const userApi = {
  // Create a new user
  createUser: async (userData) => {
    const response = await api.post(USER_API, userData);
    return response.data;
  },

  // Get user by ID
  getUserById: async (userId) => {
    const response = await api.get(`${USER_API}/${userId}`);
    return response.data;
  },

  // Get user by email
  getUserByEmail: async (email) => {
    const response = await api.get(`${USER_API}/email/${email}`);
    return response.data;
  },

  // Get all users
  getAllUsers: async (skip = 0, limit = 100) => {
    const response = await api.get(USER_API, {
      params: { skip, limit },
    });
    return response.data;
  },

  // Update user
  updateUser: async (userId, userData) => {
    const response = await api.put(`${USER_API}/${userId}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (userId) => {
    const response = await api.delete(`${USER_API}/${userId}`);
    return response.data;
  },
};
