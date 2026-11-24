import { useEffect, useRef, useState } from "react";

// Distingue un tap d'un appui prolongé (souris et tactile).
// - onLongPress : appelé quand le doigt reste appuyé `delay` ms
// - onTap : appelé si on relâche avant (optionnel)
// Si le doigt bouge de plus de `moveTolerance` px (scroll), rien n'est déclenché.
export const useLongPress = ({
  onLongPress,
  onTap,
  delay = 600,
  moveTolerance = 10,
  disabled = false,
}) => {
  const [pressing, setPressing] = useState(false);
  const timerRef = useRef(null);
  const startRef = useRef(null);
  // Toujours appeler la dernière version des callbacks (pas de closure périmée dans le timer)
  const callbacksRef = useRef({ onLongPress, onTap });
  callbacksRef.current = { onLongPress, onTap };

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const reset = () => {
    clearTimeout(timerRef.current);
    timerRef.current = null;
    startRef.current = null;
    setPressing(false);
  };

  const onPointerDown = (e) => {
    if (disabled || e.button > 0) return;
    startRef.current = { x: e.clientX, y: e.clientY };
    setPressing(true);
    timerRef.current = setTimeout(() => {
      reset();
      if (navigator.vibrate) navigator.vibrate(15);
      callbacksRef.current.onLongPress?.();
    }, delay);
  };

  const onPointerMove = (e) => {
    const start = startRef.current;
    if (!start) return;
    if (
      Math.abs(e.clientX - start.x) > moveTolerance ||
      Math.abs(e.clientY - start.y) > moveTolerance
    ) {
      reset();
    }
  };

  const onPointerUp = () => {
    // Le timer tourne encore : c'était un tap
    const wasTap = timerRef.current !== null;
    reset();
    if (wasTap) callbacksRef.current.onTap?.();
  };

  return {
    pressing,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerLeave: reset,
      onPointerCancel: reset,
      // Pas de menu contextuel natif (iOS / clic droit long) pendant l'appui
      onContextMenu: (e) => !disabled && e.preventDefault(),
    },
  };
};
