import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

// Wraps a single interactive child (button/link) and nudges it a few
// pixels toward the cursor while hovered — a restrained "magnetic" feel
// rather than a large, gimmicky pull. Disabled entirely for touch/reduced
// motion so mobile taps stay crisp.
const Magnetic = ({ children, strength = 0.35, range = 60, className, style }) => {
  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 20, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 260, damping: 20, mass: 0.4 });

  const handleMouseMove = (e) => {
    if (prefersReducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    const dist = Math.hypot(relX, relY);
    if (dist > range) {
      x.set(0);
      y.set(0);
      return;
    }
    x.set(relX * strength);
    y.set(relY * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY, ...style }}
      className={`magnetic-wrap ${className || ''}`.trim()}
    >
      {children}
    </motion.div>
  );
};

export default Magnetic;
