import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Login as LoginIcon,
  AppRegistration as RegisterIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (
      !user &&
      !["/login", "/register", "/forgot-password"].includes(location.pathname)
    ) {
      navigate("/login");
    }
  }, [user, navigate, location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
    setDropdownOpen(false);
  };

  const menuItems = user
    ? [] // No menu items for logged-in user in header (removed Dashboard)
    : [
        { text: "Login", path: "/login", icon: <LoginIcon /> },
        { text: "Register", path: "/register", icon: <RegisterIcon /> },
      ];

  return (
    <header className="sticky top-0 z-50 bg-purple-800 shadow-md border-b border-purple-600">
      <div className="container mx-auto flex justify-between items-center py-4 px-4">
        {/* Logo */}
        <Link
          to={user ? "/dashboard" : "/login"}
          className="text-4xl font-extrabold text-white tracking-tight flex-shrink-0"
        >
          Todo<span className="font-light text-white">App</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4 ml-auto flex-shrink-0">
          {menuItems.map((item) => (
            <Link
              key={item.text}
              to={item.path}
              className={`flex items-center gap-2 px-3 h-10 rounded-lg text-white transition ${
                location.pathname === item.path
                  ? "bg-indigo-600"
                  : "hover:bg-purple-600"
              }`}
            >
              {item.icon}
              {item.text}
            </Link>
          ))}

          {user && (
            <div className="flex items-center gap-4">
              <button className="relative text-white hover:bg-purple-600 h-10 w-10 flex items-center justify-center rounded-full transition">
                <NotificationsIcon />
                <span className="absolute -top-1 -right-1 h-5 w-5 text-xs bg-red-500 text-white rounded-full flex items-center justify-center">
                  3
                </span>
              </button>

              <div className="relative px-10">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-10 h-10 rounded-full bg-purple-200 text-purple-900 font-bold flex items-center justify-center border-2 border-purple-600 hover:bg-purple-300"
                >
                  {user.email?.[0]?.toUpperCase()}
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-indigo-900 shadow-lg rounded-lg text-violet-100 border border-indigo-600 z-50">
                    <div className="px-4 py-2 text-sm truncate border-b border-indigo-700">
                      {user.email}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-indigo-800 flex items-center"
                    >
                      <LogoutIcon className="mr-2" fontSize="small" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white"
          >
            {menuOpen ? (
              <CloseIcon fontSize="large" />
            ) : (
              <MenuIcon fontSize="large" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-purple-900 px-4 py-4 space-y-3 border-t border-purple-700 text-white">
          {menuItems.map((item) => (
            <Link
              key={item.text}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className={`block py-2 px-3 rounded-md ${
                location.pathname === item.path
                  ? "bg-purple-700"
                  : "hover:bg-purple-700"
              }`}
            >
              <div className="flex items-center gap-2">
                {item.icon}
                {item.text}
              </div>
            </Link>
          ))}
          {user && (
            <>
              <button className="flex items-center w-full py-2 px-3 rounded-md hover:bg-purple-600 relative transition">
                <NotificationsIcon className="mr-2" />
                Notifications
                <span className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-xs bg-red-500 text-white rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              <div className="text-sm text-purple-200">{user.email}</div>
              <button
                onClick={handleLogout}
                className="flex items-center w-full py-2 px-3 rounded-md hover:bg-purple-700"
              >
                <LogoutIcon className="mr-2" />
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
