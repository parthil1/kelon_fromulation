import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';

// Subtle 3D tilt-on-hover for cards — a handful of degrees, springed back
// to rest. Meant to read as "premium responsiveness", not a gimmick, so the
// rotation range stays small and is skipped for touch/reduced-motion.
const TiltCard = ({ children, className, style, max = 6, liftOnHover = true, ...rest }) => {
  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const mvX = useMotionValue(0.5);
  const mvY = useMotionValue(0.5);
  const springConfig = { stiffness: 200, damping: 22, mass: 0.6 };
  const rotateX = useSpring(useTransform(mvY, [0, 1], [max, -max]), springConfig);
  const rotateY = useSpring(useTransform(mvX, [0, 1], [-max, max]), springConfig);
  const lift = useSpring(0, springConfig);

  const handleMouseMove = (e) => {
    if (prefersReducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mvX.set((e.clientX - rect.left) / rect.width);
    mvY.set((e.clientY - rect.top) / rect.height);
  };

  const handleEnter = () => {
    if (liftOnHover && !prefersReducedMotion) lift.set(-6);
  };

  const handleLeave = () => {
    mvX.set(0.5);
    mvY.set(0.5);
    lift.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        rotateX: prefersReducedMotion ? 0 : rotateX,
        rotateY: prefersReducedMotion ? 0 : rotateY,
        y: lift,
        transformPerspective: 1000,
        ...style,
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export default TiltCard;
