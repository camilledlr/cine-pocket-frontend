import React, { useEffect, useState } from "react";
import { useToast } from '../../context/ToastContext';
import Button from "./Button";
import { FaSave } from "react-icons/fa";
import "./Form.css";

const Form = ({ onSubmit, children }) => {
  const toast = useToast();
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

useEffect(() => {
  const handleViewportResize = () => {
    const vh = window.visualViewport?.height || window.innerHeight;
    const fullVh = window.innerHeight;
    const keyboardOpened = vh < fullVh * 0.75;
    setIsKeyboardOpen(keyboardOpened);
  };

  if ('visualViewport' in window) {
    window.visualViewport.addEventListener('resize', handleViewportResize);
  } else {
    // Fallback
    window.addEventListener('resize', handleViewportResize);
  }

  return () => {
    if ('visualViewport' in window) {
      window.visualViewport.removeEventListener('resize', handleViewportResize);
    } else {
      window.removeEventListener('resize', handleViewportResize);
    }
  };
}, []);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    for (const key in data) data[key] = data[key].trim();

    try {
      const result = await onSubmit(data);
      toast({
        message: result?.message || (result?.success ? "✅ Opération réussie !" : "❌ Une erreur est survenue."),
        type: result?.success ? "success" : "error",
      });
    } catch (error) {
      toast({ message: `🚨 Erreur : ${error.message}`, type: "error" });
    }
  };

  return (
    <form className="custom-form" onSubmit={handleSubmit}>
      {children}
      <div className={`form-button ${isKeyboardOpen ? "hidden" : ""}`}>
        <Button
          text="Enregistrer"
          type="submit"
          color="primary"
          size="large"
          variant="filled"
          icon={<FaSave />}
        />
      </div>
    </form>
  );
};

export default Form;
