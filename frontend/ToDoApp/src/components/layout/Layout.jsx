import { Outlet } from 'react-router-dom';
import Header from './Header';
import useTaskNotifications from '../../hooks/useTaskNotifications';
import '../../styles/layout.css';

const Layout = () => {
  useTaskNotifications();
  
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Todo App</p>
      </footer>
    </div>
  );
};

export default Layout;