import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion, animate } from 'framer-motion';

// Animates a numeric prefix within an arbitrary label string, e.g. "400+",
// "1 Lac Sq.ft +", "11+ Years" — extracts the leading number, counts it up
// on view, and re-assembles the original string around it.
const CountUp = ({ value, duration = 1.6, className, style }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const prefersReducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(null);

  const match = String(value).match(/[\d,.]+/);
  const numeric = match ? parseFloat(match[0].replace(/,/g, '')) : null;
  const prefix = match ? String(value).slice(0, match.index) : '';
  const suffix = match ? String(value).slice(match.index + match[0].length) : '';
  const decimals = match && match[0].includes('.') ? match[0].split('.')[1].length : 0;

  useEffect(() => {
    if (!isInView || numeric === null) return;
    if (prefersReducedMotion) {
      setDisplay(numeric);
      return;
    }
    const controls = animate(0, numeric, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [isInView, numeric, duration, prefersReducedMotion]);

  if (numeric === null) {
    return (
      <span ref={ref} className={className} style={style}>
        {value}
      </span>
    );
  }

  const formatted = display === null
    ? '0'
    : decimals
      ? display.toFixed(decimals)
      : Math.round(display).toLocaleString('en-US');

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}{formatted}{suffix}
    </span>
  );
};

export default CountUp;
