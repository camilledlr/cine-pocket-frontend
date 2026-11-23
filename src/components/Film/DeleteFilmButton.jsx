import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiTrash2 } from "react-icons/fi";
import Button from "../Common/Button";
import ConfirmModal from "../Common/ConfirmModal";
import { useDeleteFilm } from "../../hooks/useDeleteFilm";
import "./DeleteFilmButton.css";

const DeleteFilmButton = ({ slug, title }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const { removeFilm, deleting } = useDeleteFilm();

  const handleConfirm = async () => {
    const deleted = await removeFilm({ slug, title });
    // En cas d'erreur, le toast s'affiche et on ferme la confirmation
    if (!deleted) setShowConfirm(false);
  };

  return (
    <motion.div
      className="delete-film"
      // Fondu + léger glissement vers le haut quand le bouton entre dans l'écran
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Button
        text="Supprimer le film"
        variant="text"
        icon={<FiTrash2 />}
        action={() => setShowConfirm(true)}
      />

      <ConfirmModal
        isOpen={showConfirm}
        title={`Supprimer « ${title} » ?`}
        message="Le film sera retiré de toutes tes listes et sa note, sa review et ses recommandations seront perdues. Cette action est irréversible."
        confirmText={deleting ? "Suppression…" : "Supprimer définitivement"}
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirm(false)}
        loading={deleting}
      />
    </motion.div>
  );
};

export default DeleteFilmButton;
