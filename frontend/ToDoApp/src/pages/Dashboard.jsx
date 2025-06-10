import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const { currentUser } = useAuth();

  return (
    <Box className="dashboard-container">
      <Typography variant="h4" gutterBottom>
        Welcome, {currentUser?.displayName || currentUser?.email}
      </Typography>

      <Button
        variant="contained"
        onClick={() => setShowForm(!showForm)}
        sx={{ mb: 2 }}
      >
        {showForm ? 'Hide Form' : 'Create New Task'}
      </Button>

      {showForm && (
        <Box sx={{ mb: 4 }}>
          <TaskForm onSuccess={() => setShowForm(false)} />
        </Box>
      )}

      <TaskList />
    </Box>
  );
};

export default Dashboard;
