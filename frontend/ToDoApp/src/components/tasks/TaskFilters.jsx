import { TextField, MenuItem, Box } from '@mui/material';

const TaskFilters = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <Box className="filters-container">
      <TextField
        select
        label="Status"
        name="status"
        value={filters.status}
        onChange={handleChange}
        variant="outlined"
        size="small"
      >
        <MenuItem value="">All</MenuItem>
        <MenuItem value="pending">Pending</MenuItem>
        <MenuItem value="in-progress">In Progress</MenuItem>
        <MenuItem value="completed">Completed</MenuItem>
      </TextField>

      <TextField
        select
        label="Sort By"
        name="sort"
        value={filters.sort}
        onChange={handleChange}
        variant="outlined"
        size="small"
      >
        <MenuItem value="-createdAt">Newest First</MenuItem>
        <MenuItem value="createdAt">Oldest First</MenuItem>
        <MenuItem value="dueDate">Due Date (Asc)</MenuItem>
        <MenuItem value="-dueDate">Due Date (Desc)</MenuItem>
        <MenuItem value="priority">Priority (Low to High)</MenuItem>
        <MenuItem value="-priority">Priority (High to Low)</MenuItem>
      </TextField>

      <TextField
        label="Search"
        name="search"
        value={filters.search}
        onChange={handleChange}
        variant="outlined"
        size="small"
        placeholder="Search tasks..."
      />
    </Box>
  );
};

export default TaskFilters;