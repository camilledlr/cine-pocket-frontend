import React, { createContext, useContext, useState } from 'react';
import Toast from '../components/Common/Toast';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toastData, setToastData] = useState(null);
  
    const showToast = ({ message, type, actionLabel, onAction }) => {
      setToastData({ message, type, actionLabel, onAction });
    };
  
    const hideToast = () => {
      setToastData(null);
    };
  
    return (
      <ToastContext.Provider value={showToast}>
        {children}
        {toastData && (
          <Toast
            message={toastData.message}
            type={toastData.type}
            actionLabel={toastData.actionLabel}
            onAction={toastData.onAction}
            onClose={hideToast}
          />
        )}
      </ToastContext.Provider>
    );
  };
  
  export const useToast = () => useContext(ToastContext);


