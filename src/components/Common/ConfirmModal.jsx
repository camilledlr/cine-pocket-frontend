import React from "react";
import { createPortal } from "react-dom";
import { TfiClose } from "react-icons/tfi";
import Button from "./Button";
import "./ConfirmModal.css";

const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  onConfirm,
  onCancel,
  loading = false,
}) => {
  if (!isOpen) return null;

  const handleCancel = () => {
    if (!loading) onCancel();
  };

  // Portail vers <body> : la modale n'est pas affectée par les transform
  // des parents (ex. motion.div des pages)
  return createPortal(
    // Clic sur le fond = annuler ; clic dans la boîte = rien
    <div className="confirm-overlay" onClick={handleCancel}>
      <div
        className="confirm-box"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="confirm-header">
          <div className="confirm-title">{title}</div>
          <TfiClose className="confirm-close" onClick={handleCancel} />
        </header>
        <p className="confirm-text">{message}</p>
        <div className="confirm-actions">
          <Button text={cancelText} variant="text" action={handleCancel} disabled={loading} />
          <Button text={confirmText} action={onConfirm} disabled={loading} />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmModal;
