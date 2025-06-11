import { useState, useEffect } from 'react';
import { 
  getTasks, 
  getTasksByStatus, 
  getTasksByPriority,
  searchTasks 
} from '../services/api';
import { useAuth } from '../context/AuthContext';
import { showNotification } from '../utils/notifications';

const useTaskNotifications = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchTasks = async (filter = 'all', sortBy = 'dueDate', searchQuery = '') => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      let fetchedTasks = [];

      if (searchQuery) {
        fetchedTasks = await searchTasks(searchQuery);
      } else {
        switch (filter) {
          case 'all':
            fetchedTasks = await getTasks();
            break;
          case 'pending':
          case 'in-progress':
          case 'completed':
            fetchedTasks = await getTasksByStatus(filter);
            break;
          case 'high':
          case 'medium':
          case 'low':
            fetchedTasks = await getTasksByPriority(filter);
            break;
          default:
            fetchedTasks = await getTasks();
        }
      }

      // Sort tasks
      const sortedTasks = [...fetchedTasks].sort((a, b) => {
        switch (sortBy) {
          case 'dueDate':
            return new Date(a.dueDate) - new Date(b.dueDate);
          case 'priority':
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
          case 'createdAt':
            return new Date(b.createdAt) - new Date(a.createdAt);
          default:
            return 0;
        }
      });

      setTasks(sortedTasks);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  useEffect(() => {
    if (!tasks || !user) return;

    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

    tasks.forEach(task => {
      if (task.dueDate && !task.completed) {
        const dueDate = new Date(task.dueDate);
        if (dueDate > now && dueDate <= oneHourFromNow) {
          showNotification(
            'Task Due Soon',
            `Task "${task.title}" is due in less than an hour!`,
            'warning'
          );
        }
      }
    });
  }, [tasks, user]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    refreshTasks: () => fetchTasks()
  };
};

export default useTaskNotifications;