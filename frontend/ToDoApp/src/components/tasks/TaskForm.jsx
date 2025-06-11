import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert
} from '@mui/material';
import { createTask } from '../../services/api';
import { toast } from 'react-toastify';

const TaskForm = ({ open, onClose, onTaskCreated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    dueDate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.title.trim()) throw new Error('Title is required');
      if (!formData.dueDate) throw new Error('Due date is required');

      const newTask = await createTask({
        ...formData,
        dueDate: new Date(formData.dueDate).toISOString()
      });

      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        dueDate: ''
      });

      onTaskCreated(newTask);
      onClose();
      toast.success('Task created successfully');
    } catch (err) {
      console.error('Error creating task:', err);
      setError(err.message || 'Failed to create task');
      toast.error(err.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        dueDate: ''
      });
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: '#F5F5F5', // light grey
          color: 'black',
          border: '1px solid #CCCCCC' // lighter grey border
        }
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 'bold', color: 'black' }}>
          Create New Task
        </DialogTitle>

        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2, bgcolor: '#EF9A9A', color: 'black' }}>
                {error}
              </Alert>
            )}

            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              fullWidth
              disabled={loading}
              error={error && !formData.title.trim()}
              helperText={error && !formData.title.trim() ? 'Title is required' : ''}
              InputLabelProps={{ sx: { color: 'rgba(0, 0, 0, 0.6)' } }}
              InputProps={{
                sx: {
                  color: 'black',
                  '& fieldset': { borderColor: '#9E9E9E' },
                }
              }}
            />

            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
              disabled={loading}
              InputLabelProps={{ sx: { color: 'rgba(0, 0, 0, 0.6)' } }}
              InputProps={{
                sx: {
                  color: 'black',
                  '& fieldset': { borderColor: '#9E9E9E' },
                }
              }}
            />

            <TextField
              label="Due Date"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              required
              fullWidth
              disabled={loading}
              error={error && !formData.dueDate}
              helperText={error && !formData.dueDate ? 'Due date is required' : ''}
              InputLabelProps={{ 
                shrink: true, 
                sx: { color: 'rgba(0, 0, 0, 0.6)' } 
              }}
              InputProps={{
                sx: {
                  color: 'black',
                  '& fieldset': { borderColor: '#9E9E9E' },
                }
              }}
            />

            <FormControl fullWidth disabled={loading}>
              <InputLabel sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>Priority</InputLabel>
              <Select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                label="Priority"
                sx={{
                  color: 'black',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#9E9E9E',
                  }
                }}
              >
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth disabled={loading}>
              <InputLabel sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                label="Status"
                sx={{
                  color: 'black',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#9E9E9E',
                  }
                }}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button 
            onClick={handleClose} 
            disabled={loading}
            sx={{ color: 'rgba(0, 0, 0, 0.6)' }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
            sx={{ 
              bgcolor: '#9E9E9E',
              color: 'black',
              '&:hover': {
                bgcolor: '#CCCCCC',
              }
            }}
          >
            {loading ? 'Creating...' : 'Create Task'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskForm;
