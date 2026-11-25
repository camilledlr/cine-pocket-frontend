import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RiMovie2Fill } from "react-icons/ri";
import { useSlowRequests } from "../../api";
import "./ServerWakeBanner.css";

// Bandeau affiché quand une requête dure plus de 3 s : le back sort de veille.
// Évite qu'un long chargement ressemble à une app plantée.
const ServerWakeBanner = () => {
  const slow = useSlowRequests();

  return (
    <AnimatePresence>
      {slow && (
        <motion.div
          className="server-wake-banner"
          role="status"
          aria-live="polite"
          initial={{ y: "150%", x: "-50%" }}
          animate={{ y: 0, x: "-50%" }}
          exit={{ y: "150%", x: "-50%" }}
          transition={{ type: "spring", damping: 26, stiffness: 260 }}
        >
          <RiMovie2Fill className="server-wake-icon" aria-hidden="true" />
          <span>
            <strong>Le serveur se réveille…</strong>
            <br />
            Ça peut prendre jusqu'à une minute.
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ServerWakeBanner;
