import { motion, useReducedMotion } from 'framer-motion';
import { fadeUp, viewportOnce } from './variants';

// Drop-in replacement for the old IntersectionObserver-based ScrollReveal.
// Same prop surface (children, className, style) plus optional `variants`,
// `delay` and `as` so existing call sites keep working untouched while new
// ones can opt into richer motion.
const ScrollReveal = ({
  children,
  className,
  style,
  variants = fadeUp,
  delay = 0,
  as = 'div',
  viewport = viewportOnce,
  ...rest
}) => {
  const prefersReducedMotion = useReducedMotion();
  const Component = motion[as] || motion.div;

  if (prefersReducedMotion) {
    const Static = as;
    return (
      <Static className={className} style={style} {...rest}>
        {children}
      </Static>
    );
  }

  const effectiveVariants = delay
    ? { hidden: variants.hidden, show: { ...variants.show, transition: { ...variants.show.transition, delay } } }
    : variants;

  return (
    <Component
      className={className}
      style={style}
      variants={effectiveVariants}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default ScrollReveal;
