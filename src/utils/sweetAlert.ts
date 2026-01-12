import Swal from 'sweetalert2';

/**
 * Centralized SweetAlert2 configurations
 * Provides consistent styling and behavior across the application
 */

const defaultConfig = {
  allowOutsideClick: false,
  allowEscapeKey: false,
};

/**
 * Success Alert - Green checkmark
 */
export const showSuccess = (title: string, message?: string) => {
  return Swal.fire({
    ...defaultConfig,
    icon: 'success',
    title: title,
    text: message || '',
    confirmButtonColor: '#10b981',
    confirmButtonText: 'OK',
    timer: 2500,
  });
};

/**
 * Error Alert - Red X mark
 */
export const showError = (title: string, message?: string) => {
  return Swal.fire({
    ...defaultConfig,
    icon: 'error',
    title: title,
    text: message || '',
    confirmButtonColor: '#ef4444',
    confirmButtonText: 'OK',
  });
};

/**
 * Warning Alert - Yellow exclamation
 */
export const showWarning = (title: string, message?: string) => {
  return Swal.fire({
    ...defaultConfig,
    icon: 'warning',
    title: title,
    text: message || '',
    confirmButtonColor: '#f59e0b',
    confirmButtonText: 'Got it',
  });
};

/**
 * Info Alert - Blue info icon
 */
export const showInfo = (title: string, message?: string) => {
  return Swal.fire({
    ...defaultConfig,
    icon: 'info',
    title: title,
    text: message || '',
    confirmButtonColor: '#3b82f6',
    confirmButtonText: 'OK',
  });
};

/**
 * Confirmation Dialog - Returns boolean promise
 * Used for destructive actions (delete, etc.)
 */
export const showConfirm = (
  title: string,
  message?: string,
  confirmText: string = 'Yes, delete it!',
  cancelText: string = 'Cancel'
) => {
  return Swal.fire({
    ...defaultConfig,
    icon: 'warning',
    title: title,
    text: message || 'This action cannot be undone.',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
  }).then((result) => result.isConfirmed);
};

/**
 * Loading/Processing Alert
 * Shows a loader while an async operation completes
 */
export const showLoading = (title: string = 'Processing...') => {
  return Swal.fire({
    title: title,
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: async (modal) => {
      Swal.showLoading();
    },
  });
};

/**
 * Close the current alert
 */
export const closeAlert = () => {
  Swal.close();
};

/**
 * Update the title of the currently displayed alert
 */
export const updateTitle = (title: string) => {
  const titleElement = Swal.getHtmlContainer()?.querySelector('.swal2-title');
  if (titleElement) {
    titleElement.textContent = title;
  }
};

/**
 * Input Dialog - For getting user input
 */
export const showInput = (
  title: string,
  message?: string,
  inputType: 'text' | 'email' | 'password' | 'number' = 'text'
) => {
  return Swal.fire({
    ...defaultConfig,
    title: title,
    html: message || '',
    input: inputType,
    inputAttributes: {
      autocapitalize: 'off',
    },
    showCancelButton: true,
    confirmButtonColor: '#3b82f6',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Submit',
    cancelButtonText: 'Cancel',
  }).then((result) => (result.isConfirmed ? result.value : null));
};

/**
 * Custom Alert with HTML content
 */
export const showCustom = (config: any) => {
  return Swal.fire({
    ...defaultConfig,
    ...config,
  });
};

export default {
  showSuccess,
  showError,
  showWarning,
  showInfo,
  showConfirm,
  showLoading,
  closeAlert,
  updateTitle,
  showInput,
  showCustom,
};
