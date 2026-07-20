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
export const viewportOnceTight = { once: true, amount: 0.4 };

// Spring presets — reused so every "premium" hover/press feels like it
// belongs to the same physical object.
export const springSnappy = { type: 'spring', stiffness: 420, damping: 30, mass: 0.7 };
export const springSoft = { type: 'spring', stiffness: 220, damping: 26, mass: 0.9 };
export const springLayout = { type: 'spring', stiffness: 380, damping: 32 };

// Line-draw variant for connective SVG/CSS scale lines (ProcessLifecycle etc).
export const drawX = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 1.1, ease: EASE } },
};

export const drawY = {
  hidden: { scaleY: 0 },
  show: { scaleY: 1, transition: { duration: 0.6, ease: EASE } },
};

// Headline word/letter stagger — split text into words in the component and
// wrap each in a motion.span using wordItem, wrapped by wordContainer.
export const wordContainer = (staggerAmount = 0.05, delayChildren = 0) => ({
  hidden: {},
  show: {
    transition: { staggerChildren: staggerAmount, delayChildren },
  },
});

export const wordItem = {
  hidden: { opacity: 0, y: '0.6em', filter: 'blur(4px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: EASE },
  },
};

// Gentle card lift — used instead of ad-hoc whileHover={{ y: -N }} so every
// card in the site lifts by the same amount with the same spring.
export const cardLift = {
  rest: { y: 0, transition: springSoft },
  hover: { y: -8, transition: springSoft },
};

// Combined scroll-entrance + hover-lift for cards: pair with
// initial="hidden" whileInView="show" whileHover="hover".
export const cardHoverLift = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
  hover: { y: -10, transition: springSoft },
};

export const cardHoverLiftScale = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: EASE } },
  hover: { y: -10, scale: 1.015, transition: springSoft },
};
