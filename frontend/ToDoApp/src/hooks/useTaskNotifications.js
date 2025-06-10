import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { taskApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { showNotification } from '../utils/notifications';

const useTaskNotifications = () => {
  const { currentUser } = useAuth();

  const { data: tasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      if (!currentUser) return [];
      return taskApi.getTasks();
    },
    enabled: !!currentUser
  });

  useEffect(() => {
    if (!tasks || !currentUser) return;

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
  }, [tasks, currentUser]);
};

export default useTaskNotifications;