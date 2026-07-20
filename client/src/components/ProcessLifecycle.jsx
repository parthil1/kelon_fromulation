import { motion, useReducedMotion } from 'framer-motion';
import {
  Lightbulb,
  Factory,
  Microscope,
  Package,
  ShieldCheck,
  Pill,
  Boxes,
  Truck,
  ArrowRight,
} from 'lucide-react';
import { staggerContainer, fadeUp, viewportOnceEarly, EASE } from '../motion/variants';

const STEPS = [
  {
    num: '01',
    title: 'Research & Development',
    desc: 'Understanding needs and innovating better solutions.',
    icon: Lightbulb,
    color: '#2e7d32',
    img: '/hero-lab.png',
  },
  {
    num: '02',
    title: 'Production',
    desc: 'Advanced manufacturing with high-quality standards.',
    icon: Factory,
    color: '#00897b',
    img: '/hero-factory.png',
  },
  {
    num: '03',
    title: 'Quality Control',
    desc: 'Rigorous testing to ensure safety, purity & effectiveness.',
    icon: Microscope,
    color: '#1565c0',
    img: '/process-steps/step-03.png?v=5',
  },
  {
    num: '04',
    title: 'Packing',
    desc: 'Careful packing with hygiene and product protection.',
    icon: Package,
    color: '#6a1b9a',
    img: '/hero-products.png',
  },
  {
    num: '05',
    title: 'Quality Assurance',
    desc: 'Final verification to deliver nothing but the best.',
    icon: ShieldCheck,
    color: '#1b5e20',
    img: '/process-steps/step-05.png?v=5',
  },
  {
    num: '06',
    title: 'Finished Products',
    desc: 'Safe, effective & ready to make a positive impact.',
    icon: Pill,
    color: '#f9a825',
    img: '/cat-capsules.png',
  },
  {
    num: '07',
    title: 'Ready to Dispatch',
    desc: 'Prepared with care for timely and safe dispatch.',
    icon: Boxes,
    color: '#e65100',
    img: '/process-steps/step-07.png?v=5',
  },
  {
    num: '08',
    title: 'Delivery',
    desc: 'Delivered safely to your doorstep with trust and reliability.',
    icon: Truck,
    color: '#43a047',
    img: '/process-steps/step-08.png?v=5',
  },
];

const ProcessStep = ({ step, index, prefersReducedMotion, showArrow }) => {
  const Icon = step.icon;

  return (
    <motion.article
      className="process-step"
      variants={fadeUp}
      whileHover={prefersReducedMotion ? undefined : { y: -4 }}
      style={{ '--step-color': step.color }}
    >
      <div className="process-step-visual">
        <div className="process-step-ring">
          <span className="process-step-num">{step.num}</span>
          <div className="process-step-photo">
            <img src={step.img} alt="" loading="lazy" />
          </div>
          <span className="process-step-icon" aria-hidden="true">
            <Icon size={16} strokeWidth={2.25} />
          </span>
        </div>
      </div>

      <div className="process-step-copy">
        <h3>{step.title}</h3>
        <p>{step.desc}</p>
      </div>

      {showArrow && (
        <span className="process-step-arrow" aria-hidden="true">
          <ArrowRight size={18} />
        </span>
      )}
    </motion.article>
  );
};

const ProcessLifecycle = () => {
  const prefersReducedMotion = useReducedMotion();
  const row1 = STEPS.slice(0, 4);
  const row2 = STEPS.slice(4, 8);

  return (
    <motion.div
      className="process-lifecycle"
      variants={prefersReducedMotion ? undefined : staggerContainer(0.1, 0.1)}
      initial={prefersReducedMotion ? undefined : 'hidden'}
      whileInView={prefersReducedMotion ? undefined : 'show'}
      viewport={viewportOnceEarly}
    >
      <div className="process-lifecycle-track" aria-hidden="true">
        <motion.span
          className="process-lifecycle-line process-lifecycle-line--top"
          initial={prefersReducedMotion ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={viewportOnceEarly}
          transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}
        />
        <motion.span
          className="process-lifecycle-line process-lifecycle-line--bridge"
          initial={prefersReducedMotion ? false : { scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={viewportOnceEarly}
          transition={{ duration: 0.55, ease: EASE, delay: 0.7 }}
        />
        <motion.span
          className="process-lifecycle-line process-lifecycle-line--bottom"
          initial={prefersReducedMotion ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={viewportOnceEarly}
          transition={{ duration: 1.1, ease: EASE, delay: 0.85 }}
        />
      </div>

      <div className="process-lifecycle-row">
        {row1.map((step, i) => (
          <ProcessStep
            key={step.num}
            step={step}
            index={i}
            prefersReducedMotion={prefersReducedMotion}
            showArrow={i < row1.length - 1}
          />
        ))}
      </div>

      <div className="process-lifecycle-row">
        {row2.map((step, i) => (
          <ProcessStep
            key={step.num}
            step={step}
            index={i + 4}
            prefersReducedMotion={prefersReducedMotion}
            showArrow={i < row2.length - 1}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default ProcessLifecycle;
