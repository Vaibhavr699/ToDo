import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Alert,
  Grid,
  Paper
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { taskApi } from '../../services/api';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import TaskFilter from './TaskFilter';
import { toast } from 'react-toastify';

const TaskList = () => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');

  useEffect(() => {
    const fetchTasks = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        let fetchedTasks;
        
        if (filter === 'all') {
          fetchedTasks = await taskApi.getTasks();
        } else if (['pending', 'in-progress', 'completed'].includes(filter)) {
          fetchedTasks = await taskApi.getTasksByStatus(filter);
        } else if (['low', 'medium', 'high'].includes(filter)) {
          fetchedTasks = await taskApi.getTasksByPriority(filter);
        }
        
        setTasks(fetchedTasks);
        setError(null);
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to fetch tasks';
        setError(errorMessage);
        toast.error(errorMessage);
        console.error('Error fetching tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [currentUser, filter]);

  const handleDeleteTask = async (taskId) => {
    try {
      await taskApi.deleteTask(taskId);
      setTasks(tasks.filter(task => task._id !== taskId));
      toast.success('Task deleted successfully');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete task';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error deleting task:', err);
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      const updatedTask = await taskApi.updateTask(taskId, updates);
      setTasks(tasks.map(task => 
        task._id === taskId ? updatedTask : task
      ));
      toast.success('Task updated successfully');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update task';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error updating task:', err);
    }
  };

  const handleAddTask = async (newTask) => {
    try {
      const createdTask = await taskApi.createTask(newTask);
      setTasks([createdTask, ...tasks]);
      toast.success('Task created successfully');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create task';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error creating task:', err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <TaskFilter 
        currentFilter={filter} 
        onFilterChange={setFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
      
      <Grid container spacing={2}>
        {tasks.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography color="textSecondary">
                No tasks found. Create a new task to get started!
              </Typography>
            </Paper>
          </Grid>
        ) : (
          tasks.map(task => (
            <Grid item xs={12} key={task._id}>
              <TaskItem
                task={task}
                onDelete={handleDeleteTask}
                onUpdate={handleUpdateTask}
              />
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default TaskList;