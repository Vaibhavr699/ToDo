import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1/tasks';

const getAuthConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getTasks = async (token, filters = {}) => {
  const response = await axios.get(API_URL, {
    ...getAuthConfig(token),
    params: filters,
  });
  return response.data.data;
};

export const createTask = async (taskData, token) => {
  const response = await axios.post(API_URL, taskData, getAuthConfig(token));
  return response.data.data;
};

export const updateTask = async (id, taskData, token) => {
  const response = await axios.put(`${API_URL}/${id}`, taskData, getAuthConfig(token));
  return response.data.data;
};

export const deleteTask = async (id, token) => {
  await axios.delete(`${API_URL}/${id}`, getAuthConfig(token));
};