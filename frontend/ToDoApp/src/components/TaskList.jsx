import { useState } from 'react';
import api from '../services/api';

const TaskList = ({ tasks, onTaskChange }) => {
  const [loading, setLoading] = useState({});
  const [error, setError] = useState('');

  const updateTaskStatus = async (id, currentStatus) => {
    try {
      setLoading(prev => ({ ...prev, [id]: true }));
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
      await api.patch(`/tasks/${id}`, { status: newStatus });
      onTaskChange();
    } catch (err) {
      setError('Failed to update task status');
    } finally {
      setLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const deleteTask = async (id) => {
    try {
      setLoading(prev => ({ ...prev, [id]: true }));
      await api.delete(`/tasks/${id}`);
      onTaskChange();
    } catch (err) {
      setError('Failed to delete task');
    } finally {
      setLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No tasks yet. Add one above!
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}
      <ul className="divide-y divide-gray-200">
        {tasks.map(task => (
          <li key={task._id} className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center min-w-0 flex-1">
                <button
                  onClick={() => updateTaskStatus(task._id, task.status)}
                  disabled={loading[task._id]}
                  className={`flex-shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                    task.status === 'completed'
                      ? 'bg-indigo-600 border-indigo-600'
                      : 'border-gray-300'
                  }`}
                >
                  {task.status === 'completed' && (
                    <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
                <div className={`min-w-0 flex-1 ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {task.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="ml-4 flex-shrink-0">
                <button
                  onClick={() => deleteTask(task._id)}
                  disabled={loading[task._id]}
                  className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading[task._id] ? (
                    <svg className="animate-spin h-4 w-4 text-red-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
