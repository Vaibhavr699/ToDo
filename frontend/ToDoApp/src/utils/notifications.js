import { toast } from 'react-toastify';

/**
 * Shows a notification toast with the given message and type
 * @param {string} message - The message to display
 * @param {string} type - The type of notification ('success', 'error', 'info', 'warning')
 */
export const showNotification = (message, type = 'info') => {
  const options = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  };

  switch (type) {
    case 'success':
      toast.success(message, options);
      break;
    case 'error':
      toast.error(message, options);
      break;
    case 'warning':
      toast.warning(message, options);
      break;
    default:
      toast.info(message, options);
  }
};

/**
 * Shows a success notification
 * @param {string} message - The success message to display
 */
export const showSuccessNotification = (message) => {
  showNotification(message, 'success');
};

/**
 * Shows an error notification
 * @param {string} message - The error message to display
 */
export const showErrorNotification = (message) => {
  showNotification(message, 'error');
};

/**
 * Shows a warning notification
 * @param {string} message - The warning message to display
 */
export const showWarningNotification = (message) => {
  showNotification(message, 'warning');
};