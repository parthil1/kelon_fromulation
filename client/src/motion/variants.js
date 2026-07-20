// Shared framer-motion primitives for a restrained, premium motion language.
// Keep easing/duration choices consistent across the site rather than
// hand-tuning transitions per section.

export const EASE = [0.16, 1, 0.3, 1];
export const EASE_SOFT = [0.22, 0.61, 0.36, 1];

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8, ease: EASE } },
};

export const fadeLeft = {
  hidden: { opacity: 0, x: -32 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } },
};

export const fadeRight = {
  hidden: { opacity: 0, x: 32 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: EASE } },
};

// Stagger container — pair with fadeUp/fadeIn on children.
export const staggerContainer = (staggerAmount = 0.12, delayChildren = 0.05) => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: staggerAmount,
      delayChildren,
    },
  },
});

export const heroContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.15,
    },
  },
};

export const heroItem = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
};

export const viewportOnce = { once: true, amount: 0.2 };
export const viewportOnceEarly = { once: true, amount: 0.05 };
