import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getTasks, searchTasks, getTasksByStatus } from '../../services/api';
import TaskItem from './TaskItem';
import { toast } from 'react-toastify';
import { useDebounce } from '../../hooks/useDebounce';
import { useAuth } from '../../context/AuthContext';

// SVG Icons (simplified for now)
const SearchIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
  </svg>
);
const ClearIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
  </svg>
);
const SortIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h18M3 8h18M3 12h18M3 16h18M3 20h18"></path>
  </svg>
);
const FilterIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01.293.707L19 11.414V15a1 1 0 01-1 1h-1v4a1 1 0 01-1 1h-2a1 1 0 01-1-1v-4H7a1 1 0 01-1-1v-3.586a1 1 0 01.293-.707L4 6.586V4z"></path>
  </svg>
);

const TaskList = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [filterStatus, setFilterStatus] = useState('');
  const [searching, setSearching] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Memoize the sort function to prevent unnecessary re-renders
  const sortTasks = useCallback((tasksToSort) => {
    return [...tasksToSort].sort((a, b) => {
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
  }, [sortBy]);

  // Memoize the fetch function to prevent unnecessary re-renders
  const fetchTasks = useCallback(async (query = '', statusFilter = '') => {
    if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
      let response;
      
      if (query) {
        console.log('Searching tasks with query:', query);
        setSearching(true);
        response = await searchTasks(query);
        console.log('Search results:', response);
      } else if (statusFilter) {
        console.log('Fetching tasks by status:', statusFilter);
        response = await getTasksByStatus(statusFilter);
        console.log('Tasks by status:', response);
      } else {
        console.log('Fetching all tasks');
        response = await getTasks();
        console.log('All tasks:', response);
      }

      const sortedTasks = sortTasks(response);
      console.log('Setting tasks:', sortedTasks.length);
      setTasks(sortedTasks);
      } catch (err) {
        console.error('Error fetching tasks:', err);
      const errorMessage = query 
        ? 'Failed to search tasks. Please try again.'
        : statusFilter
          ? `Failed to load ${statusFilter} tasks. Please try again.`
          : 'Failed to load tasks. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      } finally {
        setLoading(false);
      setSearching(false);
      }
  }, [user, sortTasks]);

  // Effect for initial load and when dependencies change
  useEffect(() => {
    if (user) {
      fetchTasks(debouncedSearchQuery, filterStatus);
    }
  }, [user, fetchTasks, debouncedSearchQuery, filterStatus]);

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter(task => task._id !== taskId));
      toast.success('Task deleted successfully');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete task';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error deleting task:', err);
    }
  };

  const handleUpdateTask = async (taskId, updatedData) => {
    try {
      const response = await updateTask(taskId, updatedData);
      setTasks(tasks.map(task => 
        task._id === taskId ? response.data : task
      ));
      toast.success('Task updated successfully');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update task';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error updating task:', err);
    }
  };

  // Helper to get Tailwind color classes based on status (simplified)
  const getStatusColorClass = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper to get Tailwind color classes based on priority (simplified)
  const getPriorityColorClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Memoize handlers to prevent unnecessary re-renders
  const handleSearchChange = useCallback((event) => {
    setSearchQuery(event.target.value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const handleSortChange = useCallback((event) => {
    setSortBy(event.target.value);
  }, []);

  const handleFilterStatusChange = useCallback((event) => {
    setFilterStatus(event.target.value);
  }, []);

  // Memoize the task list to prevent unnecessary re-renders
  const taskList = useMemo(() => {
    if (loading && !searching) {
      return (
        <div className="flex flex-col justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-18 w-18 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-gray-600 text-lg">Loading tasks...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
          {error}
        </div>
      );
    }

    if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {searchQuery && !searching ? (
          <p>No tasks found matching your search.</p>
        ) : filterStatus ? (
          <p>No {filterStatus} tasks found.</p>
        ) : (
          <p>No tasks available. Create a new task to get started!</p>
        )}
      </div>
    );
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tasks.map(task => (
          <TaskItem 
            key={task._id} 
            task={task} 
            onDelete={handleDeleteTask}
            onUpdate={handleUpdateTask}
            getStatusColorClass={getStatusColorClass}
            getPriorityColorClass={getPriorityColorClass}
          />
        ))}
      </div>
    );
  }, [tasks, loading, error, searchQuery, searching, filterStatus, handleDeleteTask, handleUpdateTask, getStatusColorClass, getPriorityColorClass]);

  return (
    <div className="space-y-6">
  <div className="flex flex-col md:flex-row items-stretch gap-4 md:gap-6">
  {/* Search Input */}
  <div className="relative w-full md:w-[300px] mx-16">
  <input
    type="text"
    placeholder="Search tasks..."
    value={searchQuery}
    onChange={handleSearchChange}
    className="w-full pl-10 pr-10 py-2 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200 ease-in-out"
  />
  
  {/* Search icon on the left */}
  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
    <SearchIcon />
  </div>

  {/* Clear icon on the right */}
  {searchQuery && (
    <button
      onClick={handleClearSearch}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
    >
      <ClearIcon fontSize="small" />
    </button>
  )}
</div>



    {/* Filter by Status */}
    <div className="w-full md:w-auto flex-grow">
      <select
        value={filterStatus}
        onChange={handleFilterStatusChange}
        className="w-full pl-10 text-lg w-10 h-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200 ease-in-out"
      >
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
    </div>

    {/* Sort By */}
    <div className="w-full md:w-auto flex-grow">
      <select
        value={sortBy}
        onChange={handleSortChange}
        className="w-full pl-10 text-lg w-10 h-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200 ease-in-out"
      >
        <option value="createdAt">Newest First</option>
        <option value="dueDate">Due Date</option>
        <option value="priority">Priority</option>
      </select>
    </div>
  </div>

  {/* Loader */}
  {loading && searching && searchQuery && (
    <div className="flex flex-col justify-center items-center min-h-[100px]">
      <div className="animate-spin rounded-full h-18 w-18 border-b-2 border-purple-500 mb-2"></div>
      <p className="text-gray-500">Searching for tasks...</p>
    </div>
  )}

  {/* Tasks */}
  {!loading && taskList}
</div>

  );
};

export default TaskList;