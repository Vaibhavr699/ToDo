import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem as SelectMenuItem
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Flag as FlagIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { updateTask, deleteTask } from '../../services/api';
import { toast } from 'react-toastify';

const TaskItem = ({ task, onTaskUpdate, onTaskDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  const [loading, setLoading] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    setEditedTask(task);
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setLoading(true);
      const updatedTask = await updateTask(task._id, { ...task, status: newStatus });
      onTaskUpdate(updatedTask);
      toast.success(`Task marked as ${newStatus}`);
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    try {
      setLoading(true);
      const updatedTask = await updateTask(task._id, editedTask);
      onTaskUpdate(updatedTask);
      setEditDialogOpen(false);
      toast.success('Task updated successfully');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      await deleteTask(task._id);
      onTaskDelete(task._id);
      setDeleteDialogOpen(false);
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error'; /* Red for high priority */
      case 'medium':
        return 'warning'; /* Orange for medium priority */
      case 'low':
        return 'success'; /* Green for low priority */
      default:
        return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success'; /* Green for completed */
      case 'in-progress':
        return 'info'; /* Blue for in-progress */
      case 'pending':
        return 'warning'; /* Yellow/Orange for pending */
      default:
        return 'default';
    }
  };

  return (
    <>
      <Card 
        sx={{ 
          mb: 4,
          position: 'relative',
          border: '2px solid',
          borderColor: 'grey.200',
          borderRadius: 2,
          '&:hover': {
            boxShadow: 6,
            transform: 'translateY(-2px)',
            transition: 'all 0.3s ease-in-out',
          }
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                {task.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
                {task.description}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  icon={<ScheduleIcon />}
                  label={format(new Date(task.dueDate), 'MMM d, yyyy')}
                  size="small"
                  color={new Date(task.dueDate) < new Date() ? 'error' : 'default'}
                  variant="outlined"
                />
                <Chip
                  icon={<FlagIcon />}
                  label={task.priority}
                  size="small"
                  color={getPriorityColor(task.priority)}
                  variant="outlined"
                />
                <Chip
                  label={task.status}
                  size="small"
                  color={getStatusColor(task.status)}
                  variant="outlined"
                />
              </Box>
            </Box>
            <IconButton onClick={handleMenuOpen} size="small">
              <MoreVertIcon />
            </IconButton>
          </Box>
        </CardContent>
      </Card>

      {/* Task Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 180,
            borderRadius: 2
          }
        }}
      >
        {task.status !== 'completed' && (
          <MenuItem 
            onClick={() => handleStatusChange('completed')}
            disabled={loading}
          >
            <CheckCircleIcon sx={{ mr: 1 }} />
            Mark as Completed
          </MenuItem>
        )}
        <MenuItem onClick={handleEditClick} disabled={loading}>
          <EditIcon sx={{ mr: 1 }} />
          Edit Task
        </MenuItem>
        <MenuItem 
          onClick={handleDeleteClick}
          disabled={loading}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon sx={{ mr: 1 }} />
          Delete Task
        </MenuItem>
      </Menu>

      {/* Edit Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => !loading && setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#f5f5f5', /* Light grey background */
            color: '#333', /* Darker text color */
            borderRadius: 2,
            border: '1px solid #ddd', /* Subtle border */
          },
        }}
      >
        <DialogTitle sx={{ color: '#333', fontWeight: 'bold' }}>Edit Task</DialogTitle>
        <DialogContent sx={{ color: '#555' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Title"
              value={editedTask.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              fullWidth
              disabled={loading}
              sx={{
                '& .MuiInputBase-input': { color: '#333' }, // Input text color
                '& .MuiInputLabel-root': { color: '#555' }, // Label color
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#bbb' }, // Default border
                  '&:hover fieldset': { borderColor: '#999' }, // Hover border
                  '&.Mui-focused fieldset': { borderColor: '#673ab7' }, // Focused border (purple)
                },
              }}
            />
            <TextField
              label="Description"
              value={editedTask.description}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              multiline
              rows={3}
              fullWidth
              disabled={loading}
              sx={{
                '& .MuiInputBase-input': { color: '#333' },
                '& .MuiInputLabel-root': { color: '#555' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#bbb' },
                  '&:hover fieldset': { borderColor: '#999' },
                  '&.Mui-focused fieldset': { borderColor: '#673ab7' },
                },
              }}
            />
            <TextField
              label="Due Date"
              type="date"
              value={format(new Date(editedTask.dueDate), "yyyy-MM-dd")}
              onChange={(e) => setEditedTask({ ...editedTask, dueDate: new Date(e.target.value) })}
              fullWidth
              disabled={loading}
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiInputBase-input': { color: '#333' },
                '& .MuiInputLabel-root': { color: '#555' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#bbb' },
                  '&:hover fieldset': { borderColor: '#999' },
                  '&.Mui-focused fieldset': { borderColor: '#673ab7' },
                },
              }}
            />
            <FormControl fullWidth disabled={loading} sx={{
              '& .MuiInputLabel-root': { color: '#555' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#bbb' },
                '&:hover fieldset': { borderColor: '#999' },
                '&.Mui-focused fieldset': { borderColor: '#673ab7' },
              },
            }}>
              <InputLabel>Priority</InputLabel>
              <Select
                value={editedTask.priority}
                label="Priority"
                onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
                sx={{ '& .MuiInputBase-input': { color: '#333' } }}
              >
                <SelectMenuItem value="high">High</SelectMenuItem>
                <SelectMenuItem value="medium">Medium</SelectMenuItem>
                <SelectMenuItem value="low">Low</SelectMenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth disabled={loading} sx={{
              '& .MuiInputLabel-root': { color: '#555' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#bbb' },
                '&:hover fieldset': { borderColor: '#999' },
                '&.Mui-focused fieldset': { borderColor: '#673ab7' },
              },
            }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={editedTask.status}
                label="Status"
                onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value })}
                sx={{ '& .MuiInputBase-input': { color: '#333' } }}
              >
                <SelectMenuItem value="pending">Pending</SelectMenuItem>
                <SelectMenuItem value="in-progress">In Progress</SelectMenuItem>
                <SelectMenuItem value="completed">Completed</SelectMenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <Button 
            onClick={() => setEditDialogOpen(false)} 
            disabled={loading}
            sx={{ color: '#555', '&:hover': { backgroundColor: '#e0e0e0' } }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleEditSubmit} 
            variant="contained" 
            disabled={loading}
            sx={{ 
              backgroundColor: '#673ab7', // Purple
              '&:hover': { backgroundColor: '#5e35b1' }, // Darker purple on hover
            }}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !loading && setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: '#f5f5f5', /* Light grey background */
            color: '#333', /* Darker text color */
            borderRadius: 2,
            border: '1px solid #ddd', /* Subtle border */
          },
        }}
      >
        <DialogTitle sx={{ color: '#333', fontWeight: 'bold' }}>Delete Task</DialogTitle>
        <DialogContent sx={{ color: '#555' }}>
          <Typography>
            Are you sure you want to delete this task? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)} 
            disabled={loading}
            sx={{ color: '#555', '&:hover': { backgroundColor: '#e0e0e0' } }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TaskItem;