import { useState, useEffect } from "react";
import { Add as AddIcon } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import TaskList from "../components/tasks/TaskList";
import TaskForm from "../components/tasks/TaskForm";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleTaskCreated = () => {
    setShowForm(false);
  };

  return (
    <div className="min-h-screen flex justify-center px-4 py-6">
      <div className="w-full max-w-5xl">
        {/* Welcome Banner */}
        <div
          className="w-full px-6 md:px-10 py-8 md:py-12 mb-8 rounded-2xl bg-purple-300 shadow-2xl bg-gradient-to-br from-purple-700 to-purple-900 relative overflow-hidden flex items-center justify-center"
          style={{
            backgroundImage:
              "radial-gradient(circle at top right, rgba(255,255,255,0.08) 0%, transparent 70%)",
          }}
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-center w-full">
            <div className="text-left flex-grow">
              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-2 text-black drop-shadow-md">
                Welcome back,{" "}
                <span className="text-purple-800">
                  {user?.name || user?.email}
                </span>
              </h1>
              <p className="text-xl max-w-lg px-0 text-black opacity-90">
              Organize your tasks and make every day count
              </p>
            </div>

            {/* Desktop Add Task Button */}
            {!isMobile && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-6 py-3 bg-purple-200 text-purple-900 font-semibold rounded-full shadow-lg hover:bg-purple-100 hover:shadow-xl transition-all duration-200 ease-in-out transform hover:-translate-y-1 flex items-center flex-shrink-0"
              >
                {showForm ? (
                  <>
                    <CloseIcon className="mr-2" /> Close Form
                  </>
                ) : (
                  <>
                    <AddIcon className="mr-2" /> Create New Task
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Task Creation Form */}
        <TaskForm
          open={showForm}
          onClose={() => setShowForm(false)}
          onTaskCreated={handleTaskCreated}
        />

        {/* Task List */}
        <TaskList onAddTask={() => setShowForm(true)} />
      </div>

      {/* Mobile Floating Action Button */}
      {isMobile && (
        <button
          onClick={() => setShowForm(true)}
          className="fixed bottom-4 right-4 bg-purple-700 hover:bg-purple-800 text-white p-4 rounded-full shadow-xl transition duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 z-50"
          aria-label="Add new task"
        >
          <AddIcon fontSize="large" />
        </button>
      )}
    </div>
  );
};

export default Dashboard;
