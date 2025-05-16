import React from "react";
import "./Form.css";
import { useToast } from '../../context/ToastContext';
import Button from "./Button";
import { FaSave } from "react-icons/fa";


const Form = ({ onSubmit, children }) => {
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const data = {};
    
        for (let [key, value] of formData.entries()) {
          data[key] = value.trim();
        }
    
        try {
          const result = await onSubmit(data);
          console.log('result',result);
    
          if (result?.success) {
            toast({
              message: result.message || "✅ Opération réussie !",
              type: "success",
            });
          } else {
            toast({
              message: result?.message || "❌ Une erreur est survenue.",
              type: "error",
            });
          }
        } catch (error) {
          toast({
            message: `🚨 Erreur : ${error.message}`,
            type: "error",
          });
        }
      };

  return (
    <form className="custom-form" onSubmit={handleSubmit}>
      {children}
      <div className="form-button">
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
