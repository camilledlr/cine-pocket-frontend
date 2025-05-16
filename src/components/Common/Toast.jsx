import React, { useEffect } from 'react';
import './Toast.css';
import { LuCircleCheckBig } from "react-icons/lu";
import { ImInfo } from "react-icons/im";
import { MdErrorOutline } from "react-icons/md";



const Toast = ({message, actionLabel, onAction, onClose, type}) => {


  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <div className={`toast toast-${type}`}>
    <div className="toast-icon">
    {type==="success" && <LuCircleCheckBig  className="toast-icon-success"/>}
    {type==="info" && <ImInfo className="toast-icon-info"/>}
    {type==="error" && <MdErrorOutline className="toast-icon-error"/>}
    </div>
    <div>
    <span>{message}</span>
    {actionLabel && onAction && (
      <div className="toast-action" onClick={() => {
        onAction();
        onClose();
      }}>
        {actionLabel}
      </div>
    )}
    </div>
  </div>
);
};

export default Toast;
