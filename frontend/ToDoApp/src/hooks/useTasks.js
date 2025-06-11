import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTasks, createTask, updateTask, deleteTask } from '../services/api';
import { useAuth } from '../context/AuthContext';

const useTasks = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const token = await getToken();
      return getTasks(token);
    }
  });

  const createTaskMutation = useMutation({
    mutationFn: async (taskData) => {
      const token = await getToken();
      return createTask(taskData, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
    }
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, updates }) => {
      const token = await getToken();
      return updateTask(taskId, updates, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
    }
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId) => {
      const token = await getToken();
      return deleteTask(taskId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
    }
  });

  return {
    tasks,
    isLoading,
    error,
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    isCreating: createTaskMutation.isLoading,
    isUpdating: updateTaskMutation.isLoading,
    isDeleting: deleteTaskMutation.isLoading
  };
};

export default useTasks;