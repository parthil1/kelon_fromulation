import { motion, useReducedMotion } from 'framer-motion';
import { wordContainer, wordItem } from './variants';

// Splits a string into words, each animated in on mount/inView with a soft
// blur+rise stagger. Accepts JSX-safe plain strings only (used for hero /
// section headlines where the copy is static English text).
const SplitText = ({
  text,
  as = 'span',
  className,
  style,
  stagger = 0.045,
  delayChildren = 0,
  viewportTrigger = false,
  viewport,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const Component = motion[as] || motion.span;
  const words = text.split(' ');

  if (prefersReducedMotion) {
    const Static = as;
    return (
      <Static className={className} style={style}>
        {text}
      </Static>
    );
  }

  const triggerProps = viewportTrigger
    ? { initial: 'hidden', whileInView: 'show', viewport: viewport || { once: true, amount: 0.6 } }
    : { initial: 'hidden', animate: 'show' };

  return (
    <Component
      className={className}
      style={{ ...style, display: 'inline-block' }}
      variants={wordContainer(stagger, delayChildren)}
      {...triggerProps}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={wordItem}
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
        >
          {word}{i < words.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </Component>
  );
};

export default SplitText;
