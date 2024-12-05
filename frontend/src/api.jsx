import axios from "axios";

// Base URL for all API requests
const API_BASE_URL = "http://localhost:3000/api/v1";

// Utility function to set up headers with token
const getHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// 1. Create Task
export const createTask = async (token, title, description, userId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/create-task`,
      { title, description, id: userId },
      getHeaders(token)
    );
    return response.data; // { message, taskID }
  } catch (error) {
    console.error(
      "Error creating task:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// 2. Get All Tasks
export const getAllTasks = async (token, userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get-all-tasks`, {
      ...getHeaders(token),
      params: { id: userId }, // Pass `id` as query parameter
    });
    return response.data; // { user, tasks }
  } catch (error) {
    console.error(
      "Error fetching tasks:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// 3. Delete Task
export const deleteTask = async (token, taskId, userId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/delete-task`, {
      ...getHeaders(token),
      data: { taskId, userId }, // Send `taskId` and `userId` in body
    });
    return response.data; // { message }
  } catch (error) {
    console.error(
      "Error deleting task:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// 4. Update Task
export const updateTask = async (token, taskId, title, description) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/update-task`,
      { taskId, title, description }, // Only send fields that need to be updated
      getHeaders(token)
    );
    return response.data; // { message, task }
  } catch (error) {
    console.error(
      "Error updating task:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// 5. Toggle Important Task
export const toggleImportantTask = async (token, taskId) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/update-imp-task/${taskId}`, // Use `taskId` in the URL
      {},
      getHeaders(token)
    );
    return response.data; // { message }
  } catch (error) {
    console.error(
      "Error toggling important task:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// 6. Toggle Completed Task
export const toggleCompletedTask = async (token, taskId) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/update-completed-task/${taskId}`, // Use `taskId` in the URL
      {},
      getHeaders(token)
    );
    return response.data; // { message }
  } catch (error) {
    console.error(
      "Error toggling completed task:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// 7. Get Important Tasks
export const getImportantTasks = async (token, userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get-important-tasks`, {
      ...getHeaders(token),
      params: { id: userId }, // Send `id` as query parameter
    });
    return response.data; // { importantTasks }
  } catch (error) {
    console.error(
      "Error fetching important tasks:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// 8. Get Completed Tasks
export const getCompletedTasks = async (token, userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get-completed-tasks`, {
      ...getHeaders(token),
      params: { id: userId }, // Send `id` as query parameter
    });
    return response.data; // { CompletedTasks }
  } catch (error) {
    console.error(
      "Error fetching completed tasks:",
      error.response?.data || error.message
    );
    throw error;
  }
};
