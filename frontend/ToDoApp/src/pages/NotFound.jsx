import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, Typography, Button, Container } from '@mui/material';

const NotFound = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
          gap: 3
        }}
      >
        <Typography variant="h1" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          The page you are looking for doesn't exist or has been moved.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(currentUser ? '/dashboard' : '/login')}
          >
            {currentUser ? 'Go to Dashboard' : 'Sign In'}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate('/')}
          >
            Go Home
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default NotFound;
