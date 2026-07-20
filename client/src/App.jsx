import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate, useLocation, NavLink } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform, MotionConfig } from 'framer-motion';
import { Menu, ShoppingBag, Phone, Mail, ChevronRight, Activity, FlaskConical, ShieldCheck, Factory, Package, Plus, Boxes, Zap, Lightbulb, Settings, Send, Clock, Truck, Flag, Eye, Trophy, CheckCircle2, ArrowUpRight } from 'lucide-react';
import axios from 'axios';
import Admin from './pages/Admin';
import { useSEO } from './hooks/useSEO';
import ScrollReveal from './motion/ScrollReveal';
import CountUp from './motion/CountUp';
import Magnetic from './motion/Magnetic';
import TiltCard from './motion/TiltCard';
import SplitText from './motion/SplitText';
import ProcessLifecycle from './components/ProcessLifecycle';
import { fadeUp, fadeIn, fadeLeft, fadeRight, scaleIn, staggerContainer, heroContainer, heroItem, viewportOnce, viewportOnceEarly, cardHoverLift, cardHoverLiftScale, springSoft, springLayout, EASE } from './motion/variants';
import './App.css';
import './responsive.css';

const MotionLink = motion.create(Link);

// Core Components
const NavUnderline = ({ prefersReducedMotion }) => (
  <motion.span
    className="nav-underline"
    layoutId="nav-underline"
    transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 32 }}
  />
);

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      if (location.pathname === '/') {
        const sections = ['home', 'about', 'contact'];
        const scrollPosition = window.scrollY + 250;
        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const { offsetTop, offsetHeight } = element;
            if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
              setActiveSection(section);
              break;
            }
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      setActiveSection(id);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location.hash]);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    setIsMenuOpen(false);
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
      window.history.pushState(null, '', `/#${id}`);
    }
  };

  const activeClass = (id) => location.pathname === '/' && activeSection === id ? 'active' : '';

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-content">
          <Link to="/" onClick={(e) => handleNavClick(e, 'home')} className="logo-link" style={{ zIndex: 2002 }}>
            <img src="/kelon-logo.svg" alt="Kelon Formulation" className="nav-logo-image" />
          </Link>

          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            style={{ zIndex: 2002 }}
          >
            <motion.span
              animate={{ rotate: isMenuOpen ? 45 : 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              style={{ display: 'inline-flex' }}
            >
              {isMenuOpen ? <Plus size={28} /> : <Menu size={28} />}
            </motion.span>
          </button>

          <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            <li>
              <a href="#home" onClick={(e) => handleNavClick(e, 'home')} className={`nav-link ${activeClass('home')}`}>
                Home
                {activeClass('home') && <NavUnderline prefersReducedMotion={prefersReducedMotion} />}
              </a>
            </li>
            <li>
              <NavLink to="/products" onClick={() => setIsMenuOpen(false)} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                {({ isActive }) => (
                  <>
                    Products
                    {isActive && <NavUnderline prefersReducedMotion={prefersReducedMotion} />}
                  </>
                )}
              </NavLink>
            </li>
            <li>
              <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className={`nav-link ${activeClass('about')}`}>
                About Us
                {activeClass('about') && <NavUnderline prefersReducedMotion={prefersReducedMotion} />}
              </a>
            </li>
            <li>
              <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className={`nav-link ${activeClass('contact')}`}>
                Contact
                {activeClass('contact') && <NavUnderline prefersReducedMotion={prefersReducedMotion} />}
              </a>
            </li>
            <li className="nav-cta-item">
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, 'contact')}
                className="nav-cta-btn"
              >
                Get a Quote
              </a>
            </li>
          </ul>
        </div>
      </nav>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.button
            type="button"
            className="nav-overlay active"
            aria-label="Close menu"
            onClick={() => setIsMenuOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

const heroSlides = [
  { img: '/hero-factory.png', tag: 'Certified Production Lines' },
  { img: '/hero-lab.png', tag: 'Advanced R&D Science' },
  { img: '/hero-products.png', tag: 'Global-Ready Private Label' },
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 90]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="hero-slider" ref={sectionRef}>
      <div className="slider-backgrounds">
        <AnimatePresence>
          <motion.div
            key={currentSlide}
            className="slide-bg active"
            style={{ backgroundImage: `linear-gradient(135deg, rgba(15, 38, 15, 0.88) 0%, rgba(27, 61, 26, 0.55) 55%, rgba(0, 60, 30, 0.35) 100%), url(${heroSlides[currentSlide].img})` }}
            initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 1.02 }}
            animate={{ opacity: 1, scale: prefersReducedMotion ? 1 : 1.09 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1.4, ease: 'easeInOut' },
              scale: { duration: 6.5, ease: 'linear' },
            }}
          />
        </AnimatePresence>
        <div className="hero-vignette" />
      </div>

      <motion.div
        className="container"
        style={prefersReducedMotion ? { position: 'relative', zIndex: 5 } : { position: 'relative', zIndex: 5, opacity: contentOpacity, y: contentY }}
      >
        <motion.div
          className="hero-content"
          variants={prefersReducedMotion ? undefined : heroContainer}
          initial={prefersReducedMotion ? undefined : 'hidden'}
          animate={prefersReducedMotion ? undefined : 'show'}
        >
          <motion.div className="hero-eyebrow-row" variants={prefersReducedMotion ? undefined : heroItem}>
            <span className="text-label hero-eyebrow">Third-Party Manufacturing Experts</span>
            <span className="hero-tag-divider" aria-hidden="true" />
            <AnimatePresence mode="wait">
              <motion.span
                key={currentSlide}
                className="hero-slide-tag"
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                {heroSlides[currentSlide].tag}
              </motion.span>
            </AnimatePresence>
          </motion.div>
          <motion.h1 variants={prefersReducedMotion ? undefined : heroItem}>
            Precision Nutraceutical <span>Manufacturing</span>, Delivered at Scale
          </motion.h1>
          <motion.p variants={prefersReducedMotion ? undefined : heroItem}>
            Your trusted partner for private label supplements — formulated with scientific rigor, produced in certified facilities, and built for brands who won't compromise on quality.
          </motion.p>
          <motion.div className="hero-actions" variants={prefersReducedMotion ? undefined : heroItem}>
            <Magnetic strength={0.25} range={70}>
              <MotionLink
                to="/products"
                className="btn-primary btn-hero"
                whileHover={prefersReducedMotion ? undefined : { y: -3 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
              >
                Explore Catalog <ArrowUpRight size={20} />
              </MotionLink>
            </Magnetic>
            <Magnetic strength={0.25} range={70}>
              <motion.a
                href="#contact"
                onClick={(e) => { e.preventDefault(); document.getElementById('contact').scrollIntoView({ behavior: 'smooth' }) }}
                className="btn-outline btn-hero"
                whileHover={prefersReducedMotion ? undefined : { y: -3 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
              >
                Get a Quote <ChevronRight size={20} />
              </motion.a>
            </Magnetic>
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="slider-dots">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`dot ${i === currentSlide ? 'active' : ''}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      <motion.button
        type="button"
        className="hero-scroll-cue"
        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
        aria-label="Scroll to explore"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <span>Scroll</span>
        <motion.span
          className="hero-scroll-cue-line"
          animate={prefersReducedMotion ? undefined : { scaleY: [0.3, 1, 0.3] }}
          transition={prefersReducedMotion ? undefined : { duration: 1.8, repeat: Infinity, ease: EASE }}
        />
      </motion.button>
    </section>
  );
};

const FeatureStats = () => (
  <section className="section-alt section-pad feature-stats" style={{ position: 'relative', zIndex: 2 }}>
    <motion.div
      className="container grid-3"
      variants={staggerContainer(0.15)}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
    >
      {[
        { icon: <Factory size={32} />, val: '1 Lac Sq.ft +', label: 'Infrastructure Hub' },
        { icon: <Activity size={32} />, val: '400+', label: 'Proven Formulations' },
        { icon: <ShieldCheck size={32} />, val: '11+ Years', label: 'Industry Excellence' }
      ].map((stat, i) => (
        <motion.div key={i} variants={scaleIn}>
          <TiltCard max={5} className={`stat-card stat-card--${i + 1}`} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="animate-float stat-card-icon" style={{ marginBottom: '1.2rem' }}>{stat.icon}</div>
            <h2 className="stat-value"><CountUp value={stat.val} /></h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600 }}>{stat.label}</p>
          </TiltCard>
        </motion.div>
      ))}
    </motion.div>
  </section>
);

const AboutSummary = () => (
  <section className="section-soft section-pad">
    <div className="container">
      <ScrollReveal>
        <div style={{ textAlign: 'left' }}>
          <div style={{ maxWidth: '820px' }}>
            <h2 className="text-label" style={{ fontSize: '0.95rem', marginBottom: '1.2rem', letterSpacing: '2.5px' }}>Your Manufacturing Partner</h2>
            <h2 className="responsive-section-title" style={{ marginBottom: '1.5rem', lineHeight: '1.1' }}>Science-First Formulations <br />at Scale</h2>
            <p className="lead-text" style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>
              Kelon Formulation specializes in developing world-class nutritional solutions. We bridge the gap between complex science and consumer wellness through our advanced, certified manufacturing processes. Safe, effective, and sustainably developed—every time.
            </p>
          </div>
          <motion.div
            className="about-features-grid"
            variants={staggerContainer(0.12)}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
          >
            {[
              { icon: <FlaskConical size={32} />, title: 'Advanced R&D', desc: 'Cutting-edge laboratory for custom formulations and stability testing.' },
              { icon: <ShieldCheck size={32} />, title: 'Quality Assurance', desc: 'Rigorous multi-stage testing ensuring 100% compliance with global standards.' },
              { icon: <Zap size={32} />, title: 'Rapid Production', desc: 'High-speed automated lines for effervescent, capsules, and powders.' }
            ].map((feature, i) => (
              <motion.div key={i} className="about-feature-card" variants={cardHoverLift} whileHover="hover">
                <div className="about-feature-icon">{feature.icon}</div>
                <div className="about-feature-info">
                  <h3>{feature.title}</h3>
                  <p>{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </ScrollReveal>
    </div>
  </section>
);

const LegacyAbout = () => (
  <div className="section-alt section-pad">
    <div className="container">
      <ScrollReveal className="legacy-intro" style={{ textAlign: 'center' }}>
        <h4 className="text-label" style={{ letterSpacing: '3.5px', marginBottom: '1.2rem' }}>Our Legacy</h4>
        <h2 className="responsive-section-title" style={{ marginBottom: '2rem', fontWeight: 800, lineHeight: '1.1' }}>State-of-the-Art <br /><span className="text-gradient">Industrial Prowess</span></h2>
        <p className="lead-text" style={{ color: 'var(--text-muted)', margin: '0 auto' }}>
          Kelon Formulation Manufacturing is a leader in high-performance supplement production. Our mission is to accelerate wellness worldwide through uncompromising innovation in formulation and design.
        </p>
      </ScrollReveal>

      <div className="grid-2">
        <ScrollReveal variants={fadeLeft} style={{ textAlign: 'left' }}>
          <h2 className="subsection-title" style={{ marginBottom: '2rem' }}>World-Class <br />Infrastructure</h2>
          <p className="lead-text" style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
            Equipped with advanced machinery for effervescent, capsules, and powder production. We operate in ISO-certified, temperate-controlled sterile environments to ensure ultimate product integrity.
          </p>
          <motion.div
            className="feature-grid"
            variants={staggerContainer(0.08)}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
          >
            {['Advanced R&D Lab', 'Strict Quality QC', 'Automated Packaging', 'Full Sterilization'].map((feat, i) => (
              <motion.div key={i} variants={fadeUp} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--accent-mint-bg)', padding: '1.2rem', borderRadius: '15px', border: '1px solid var(--border)' }}>
                <ShieldCheck size={22} color="var(--primary-cta)" />
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{feat}</span>
              </motion.div>
            ))}
          </motion.div>
        </ScrollReveal>
        <ScrollReveal variants={fadeRight} className="glass-highlight feature-card-tall" style={{ background: 'linear-gradient(145deg, #2a4528, #3c5d39, #4a7c47)' }}>
          <Factory size={200} color="rgba(255,255,255,0.06)" style={{ position: 'absolute' }} />
          <div style={{ textAlign: 'center', zIndex: 1 }}>
            <div className="animate-float" style={{ width: '90px', height: '90px', background: 'linear-gradient(135deg, var(--accent-lime), var(--primary-cta))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', boxShadow: '0 0 40px rgba(197, 232, 108, 0.5)' }}>
              <Activity color="white" size={40} />
            </div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>Reliability First</h3>
            <p style={{ color: 'rgba(245,255,245,0.9)', marginTop: '0.8rem', fontWeight: 500 }}>Unrivaled Precision in Every Batch</p>
          </div>
        </ScrollReveal>
      </div>
    </div>
  </div>
);

const Capabilities = () => (
  <section className="section-deep section-pad">
    <div className="container">
      <ScrollReveal style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <SplitText
          as="h2"
          className="responsive-section-title"
          style={{ marginBottom: '1.2rem' }}
          text="Manufacturing Capabilities"
          viewportTrigger
        />
        <p style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem', lineHeight: '1.7', opacity: 0.9 }}>We leverage cutting-edge pharmaceutical technology to deliver diverse delivery formats with maximum bioavailability and stability.</p>
      </ScrollReveal>
      <motion.div
        className="product-grid"
        variants={staggerContainer(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
      >
        {[
          { name: 'Effervescent Tablets', desc: 'Industry-leading rapid-dissolve tech.', img: '/cat-effervescent.png' },
          { name: 'Capsules', desc: 'Secure and stable active delivery.', img: '/cat-capsules.png' },
          { name: 'Protein Powders', desc: 'High-purity, easy-mix formulations.', img: '/cat-powders.png' },
          { name: 'Standard Tablets', desc: 'Precise dosing and coating options.', img: '/cat-tablets.png' }
        ].map((cat, i) => (
          <motion.div key={i} className="glass card-motion product-card capability-card" variants={cardHoverLift} whileHover="hover" style={{ padding: 0, background: 'linear-gradient(180deg, #fff 0%, #e8f5e9 100%)' }}>
            <Link to="/products" state={{ selectedCategory: cat.name }} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', padding: '2rem', height: '100%' }}>
              <div className="product-image capability-card-image" style={{ background: 'white', padding: '1.5rem', overflow: 'hidden', marginBottom: '2rem', borderRadius: '15px', height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {cat.img ? (
                  <img src={cat.img} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                  <ShoppingBag size={56} opacity={0.1} color="black" />
                )}
              </div>
              <div className="product-info" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ color: 'var(--text-muted)', fontSize: '1.5rem', marginBottom: '0.8rem', fontWeight: 700 }}>{cat.name}</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.6', fontSize: '0.95rem' }}>{cat.desc}</p>
                <div style={{ marginTop: 'auto', color: 'var(--primary-cta)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
                  Catalogue <ChevronRight size={18} />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/inquiries`, formData);
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="section-soft section-pad-lg">
      <div className="container">
        <ScrollReveal className="page-header">
          <h4 className="text-label" style={{ letterSpacing: '3px', marginBottom: '1.2rem' }}>Partnership Inquiry</h4>
          <h2 className="responsive-section-title" style={{ marginBottom: '1.5rem' }}>Start Your Project</h2>
          <p className="lead-text" style={{ color: 'var(--text-muted)', margin: '0 auto' }}>
            Ready to manufacture with the best? Fill out the form below or contact our headquarters for a detailed quote.
          </p>
        </ScrollReveal>

        <div className="grid-contact">
          <div className="contact-info-col" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {[
              { icon: <Mail size={24} />, title: 'Email Us', val: 'info@kelonformulation.com', sub: 'Technical Queries' },
              { icon: <Phone size={24} />, title: 'Direct Line', val: '+91 9104882188', sub: '8 AM - 6 PM EST' },
              { icon: <Factory size={24} />, title: 'Facility', val: 'Shed no. 14, Nandanvan 04 Ind. Park, Bakrol Bujrang, Ahmedabad - 382430', sub: 'Main Operations' }
            ].map((item, i) => (
              <ScrollReveal key={i} className="glass" delay={i * 0.1} style={{ padding: '2.5rem 2rem' }}>
                <div className="contact-card-row">
                  <div style={{ background: 'var(--accent-mint-bg)', padding: '1rem', borderRadius: '15px', color: 'var(--primary-cta)', border: '1px solid var(--border)' }}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.3rem', fontWeight: 700, color: 'var(--text-main)' }}>{item.title}</h3>
                    <p style={{ color: 'var(--primary-dark)', fontSize: '1rem', fontWeight: 700, marginBottom: '0.3rem' }}>{item.val}</p>
                    <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 600 }}>{item.sub}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal variants={fadeRight} className="glass contact-form-panel">
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="grid-form-2">
                <div className="form-field">
                  <label>Full Name</label>
                  <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="John Doe" className="form-input" />
                </div>
                <div className="form-field">
                  <label>Business Email</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="office@brand.com" className="form-input" />
                </div>
              </div>
              <div className="form-field">
                <label>Contact Number</label>
                <input required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="+1 (000) 000-0000" className="form-input" />
              </div>
              <div className="form-field">
                <label>Project Details</label>
                <textarea required value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} placeholder="Format, Quantity, Timeline..." rows={5} className="form-input" style={{ resize: 'none' }} />
              </div>
              <motion.button
                type="submit"
                className="btn-primary btn-form-submit"
                disabled={status === 'sending'}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {status === 'sending' ? 'Transmitting…' : <>Start Your Project <Send size={18} /></>}
              </motion.button>
              <AnimatePresence mode="wait">
                {status === 'success' && (
                  <motion.div
                    className="form-status form-status--success"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <motion.span
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={springSoft}
                    >
                      <CheckCircle2 size={22} />
                    </motion.span>
                    Message received! We'll contact you shortly.
                  </motion.div>
                )}
                {status === 'error' && (
                  <motion.div
                    className="form-status form-status--error"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    Something went wrong. Please try again.
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
};

const ManufacturingProcess = () => (
  <section id="process" className="process-section">
    <div className="container">
      <ScrollReveal>
        <div className="process-header" style={{ marginBottom: '1.75rem', textAlign: 'center' }}>
          <h4 className="text-label" style={{ marginBottom: '0.5rem', letterSpacing: '3px' }}>Workflow Excellence</h4>
          <h2 className="responsive-section-title">
            Science-Driven <br />
            <span className="text-gradient">Production Lifecycle</span>
          </h2>
        </div>
      </ScrollReveal>
      <ProcessLifecycle />
    </div>
  </section>
);

const Footer = () => (
  <motion.footer
    className="footer-premium"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={viewportOnceEarly}
    transition={{ duration: 0.9, ease: EASE }}
  >
    <div className="container">
      <div className="footer-grid">
        <div className="footer-brand-group">
          <Link
            to="/"
            className="footer-logo-link"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            <span className="footer-logo-badge">
              <img src="/kelon-logo.svg" alt="Kelon Formulation" className="footer-logo" />
            </span>
          </Link>
          <p className="footer-tagline">
            Precision nutraceutical manufacturing for brands that refuse to compromise on quality.
          </p>
          <span className="footer-certification"><ShieldCheck size={15} /> WHO-GMP Certified</span>
        </div>

        <div className="footer-links-group">
          <h4 className="footer-title">Explorer</h4>
          <ul className="footer-links-list">
            <li><a href="#home" onClick={(e) => { e.preventDefault(); document.getElementById('home').scrollIntoView({ behavior: 'smooth' }) }}>Home</a></li>
            <li><Link to="/products">Products</Link></li>
            <li><a href="#about" onClick={(e) => { e.preventDefault(); document.getElementById('about').scrollIntoView({ behavior: 'smooth' }) }}>About Us</a></li>
            <li><a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById('contact').scrollIntoView({ behavior: 'smooth' }) }}>Contact</a></li>
          </ul>
        </div>

        <div className="footer-contact-group">
          <h4 className="footer-title">Get in Touch</h4>
          <div className="footer-contact-item">
            <div className="footer-icon-box"><Mail size={18} /></div>
            <div>
              <span className="footer-contact-label">Email</span>
              <a href="mailto:info@kelonformulation.com" className="footer-contact-value">info@kelonformulation.com</a>
            </div>
          </div>
          <div className="footer-contact-item">
            <div className="footer-icon-box"><Phone size={18} /></div>
            <div>
              <span className="footer-contact-label">Direct Line</span>
              <a href="tel:+919104882188" className="footer-contact-value">+91 9104882188</a>
            </div>
          </div>
        </div>

        <div className="footer-address-group">
          <h4 className="footer-title">Headquarters</h4>
          <div className="footer-address-item">
            <div className="footer-icon-box"><Factory size={18} /></div>
            <p className="footer-address-text">
              Shed no. 14, Nandanvan 04 Ind. Park, <br />
              Bakrol Bujrang, Ahmedabad - 382430
            </p>
          </div>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <p className="copyright-text">© 2026 Kelon Formulation. All Rights Reserved.</p>
        <div className="footer-legal">
          <a href="#">Privacy Policy</a>
          <span className="separator"></span>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </div>
  </motion.footer>
);

const ServiceFeatures = () => {
  const features = [
    { icon: <Settings size={28} />, title: 'Contract Manufacturing', desc: 'Equipped With Modern, Comprehensive And Specialized Manufacturing Equipment Services, We Offer Third Party Manufacturing, Private Labeling, And Customized Packaging.' },
    { icon: <Lightbulb size={28} />, title: 'Formulation & Development', desc: 'Our Team Is Equipped With The Expertise And Facilities To Turn Your Idea In Reality.' },
    { icon: <Boxes size={28} />, title: 'Customised Packing', desc: 'We Offer A Broad Packaging Portfolio And Have The Expertise In Supporting You With Design, Labeling And Packaging Solution.' },
    { icon: <Send size={28} />, title: 'Regulatory Support', desc: 'Product Registrations For Overseas Markets, Dossier Collation And Preparation, Product Specification, Claim Substantiation, Label Compliance.' },
    { icon: <Clock size={28} />, title: 'NABL Quality Assurance', desc: 'The Assessment Of Precision And Trueness Of Measurement Methods, Quality Control, Assigning Values To Materials, Calibration And The Establishment Of Conventional Scales.' },
    { icon: <Truck size={28} />, title: 'Supply Chain Management', desc: 'A Proven Track Record In Delivering Goods On Time Ensures Our Brands Is Synonymous With Reliability.' },
  ];

  return (
    <section className="section-pad" style={{ background: '#ffffff', padding: '6rem 0' }}>
      <div className="container">
        <ScrollReveal style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <SplitText
            as="h2"
            className="responsive-section-title"
            style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 900, fontSize: '2.2rem' }}
            text="Leading Nutraceutical & Dietary Supplement Manufacturer"
            viewportTrigger
            stagger={0.02}
          />
        </ScrollReveal>
        <motion.div
          className="features-grid"
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          {features.map((f, i) => (
            <motion.div key={i} className="feature-item" variants={fadeUp}>
              <div className="feature-icon-circle">
                {f.icon}
              </div>
              <div className="feature-text">
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const MissionVision = () => {
  const sectionRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  const cards = [
    { icon: <Flag size={36} />, title: 'MISSION', desc: 'Our Mission is to have a strong and Health world and to achieve the mission we provide our consumers with the best quality drug range at the most affordable rates. So they are easily consuming them and have a healthier version of themselves.' },
    { icon: <Eye size={36} />, title: 'VISION', desc: 'Our vision is to become the First choice of every consumer when it comes to quality treatment. Our vision is to be a top player in the pharmaceutical company by providing high-quality, affordable, and innovative solutions in the market.' },
    { icon: <Trophy size={36} />, title: 'OUR VALUES', desc: 'No company can run their business alone, they all need a strong backup and here in our company, our team of professional\'s experts and workers are the back of our company. They offer us our unbeatable services.' },
  ];

  return (
    <section className="mission-vision-section" ref={sectionRef}>
      <div className="mission-vision-bg-wrap">
        <motion.div
          className="mission-vision-bg"
          style={{ backgroundImage: `url('/hero-lab.png')`, y: prefersReducedMotion ? 0 : bgY }}
        />
        <div className="mission-vision-overlay" />
      </div>
      <div className="container">
        <ScrollReveal style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h4 className="text-label" style={{ fontWeight: 800, letterSpacing: '2px', marginBottom: '1rem', fontSize: '0.9rem' }}>Who We Are</h4>
          <h2 className="responsive-section-title" style={{ maxWidth: '750px', margin: '0 auto', lineHeight: '1.2', fontSize: '2rem' }}>A Helping Hand to Manufacture Your Pharmaceutical Products</h2>
        </ScrollReveal>
        <motion.div
          className="mission-grid"
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          {cards.map((card, i) => (
            <motion.div key={i} className="mission-card" variants={cardHoverLiftScale} whileHover="hover">
              <div className="mission-icon-box">
                {card.icon}
              </div>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const Certificates = () => {
  const certifications = [
    { name: 'HACCP', img: '/cert-haccp.png' },
    { name: 'FSSAI', img: '/cert-fssai.png' },
    { name: 'ISO 9001:2015', img: '/cert-iso-9001.png' },
    { name: 'ISO 22000', img: '/cert-iso-22000.png' },
    { name: 'WHO-GMP', img: '/cert-who-gmp.png' },
    // { name: 'HALAL', img: '/cert-halal.jpg' },
    // { name: 'FIEO', img: '/cert-fieo.png' },
    // { name: 'KOSHER', img: '/cert-kosher.png' },
    // { name: 'ISO 17025', img: '/cert-iso-17025.png' },
  ];

  // Double the array for seamless scrolling
  const scrollItems = [...certifications, ...certifications];

  return (
    <section className="certificates-section">
      <div className="container">
        <ScrollReveal className="certificates-header">
          <h4 className="text-label" style={{ marginBottom: '1rem', textAlign: 'center', fontSize: '0.85rem' }}>Global Standards</h4>
          <h2>CERTIFICATIONS</h2>
        </ScrollReveal>
      </div>
      <ScrollReveal variants={fadeIn} className="certificates-container">
        <div className="certificates-track">
          {scrollItems.map((cert, i) => (
            <div key={i} className="certificate-item">
              <div className="cert-badge">
                <img src={cert.img} alt={cert.name} className="cert-logo-img" />
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
};

// Main Pages
const Home = () => {
  useSEO({
    title: 'Kelon Formulation - Third-Party Nutraceutical & Supplement Manufacturing',
    description: 'Premier B2B contract manufacturer for private label supplements, effervescent tablets, capsules, and protein powders. ISO-certified facilities.'
  });

  return (
    <>
      <HeroSlider />
      <FeatureStats />
      <ServiceFeatures />
      <div id="about">
        <AboutSummary />
        <MissionVision />
        <LegacyAbout />
      </div>
      <Certificates />
      <ManufacturingProcess />
      <Capabilities />
      <div id="contact">
        <ContactSection />
      </div>
    </>
  );
};

const Products = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const activeCategoryObj = categories.find(c => c.id === activeCategory);
  const pageTitle = activeCategoryObj
    ? `${activeCategoryObj.name} Manufacturing - Kelon Formulation`
    : 'Nutraceutical Product Catalog - Kelon Formulation';
  const pageDesc = activeCategoryObj
    ? activeCategoryObj.description || `High-quality ${activeCategoryObj.name.toLowerCase()} contract manufacturing and custom formulation.`
    : 'Browse our complete catalog of certified effervescent tablets, capsules, protein powders, and customized supplement formulations.';

  useSEO({ title: pageTitle, description: pageDesc });

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/categories`).then(res => {
      setCategories(res.data);
      if (location.state?.selectedCategory) {
        // Use exact match for more reliability now that names are synchronized
        const cat = res.data.find(c => c.name.toLowerCase() === location.state.selectedCategory.toLowerCase());
        if (cat) {
          setActiveCategory(cat.id);
          // Clear state after picking it up to avoid sticking to this category on refresh
          window.history.replaceState({}, document.title);
        }
      }
    });
  }, [location.state]);

  useEffect(() => {
    setLoading(true);
    const url = activeCategory
      ? `${import.meta.env.VITE_API_URL}/products?category_id=${activeCategory}&limit=100`
      : `${import.meta.env.VITE_API_URL}/products?limit=100`;
    axios.get(url).then(res => {
      setProducts(res.data.data || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setProducts([]);
      setLoading(false);
    });
  }, [activeCategory]);

  return (
    <div className="container page-offset" style={{ paddingBottom: '6rem' }}>
      <div className="category-header-section">
        {activeCategory ? (
          <>
            <h4 className="text-label" style={{ fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '1rem' }}>
              COLLECTION ({categories.find(c => c.id === activeCategory)?.product_count || 0})
            </h4>
            <h1 className="category-header-title">
              {categories.find(c => c.id === activeCategory)?.name} – Advanced Solutions
            </h1>
            <p className="category-header-desc">
              {categories.find(c => c.id === activeCategory)?.description ||
                `Our ${categories.find(c => c.id === activeCategory)?.name.toLowerCase()} are engineered for maximum efficacy and stability. Each batch undergoes rigorous quality control in our WHO-GMP certified facility, ensuring premium delivery of active nutritional components with market-leading bioavailability.`}
            </p>
          </>
        ) : (
          <>
            <h4 className="text-label" style={{ fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '1rem' }}>
              FULL CATALOG ({categories.reduce((acc, cat) => acc + parseInt(cat.product_count || 0), 0)})
            </h4>
            <h1 className="category-header-title">Manufacturing Excellence – Complete Selection</h1>
            <p className="category-header-desc">
              Discover our world-class manufacturing capabilities across various delivery formats. From rapid-dissolve effervescent technology to high-precision capsule filling, we offer the most diverse and scientifically-backed catalog in the nutraceutical industry.
            </p>
          </>
        )}
      </div>

      <div className="category-bar">
        <button
          onClick={() => setActiveCategory(null)}
          className="category-pill"
          data-active={activeCategory === null}
        >
          {activeCategory === null && (
            <motion.span className="category-pill-bg" layoutId="categoryPillBg" transition={springLayout} />
          )}
          <span className="category-pill-label">All</span>
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className="category-pill"
            data-active={activeCategory === cat.id}
          >
            {activeCategory === cat.id && (
              <motion.span className="category-pill-bg" layoutId="categoryPillBg" transition={springLayout} />
            )}
            <span className="category-pill-label">{cat.name}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loader-container">
          <div className="spinner"></div>
          <p>Synchronizing Catalog...</p>
        </div>
      ) : products.length > 0 ? (
        <AnimatePresence mode="wait">
          <motion.div
            className="product-grid"
            key={activeCategory ?? 'all'}
            variants={staggerContainer(0.06)}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            {products.map(p => (
              <Link key={p.id} to={`/product/${p.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <motion.div className="glass card-motion product-card" variants={cardHoverLift} whileHover="hover">
                  <div className="product-image">
                    {p.image_url ? (
                      <img
                        src={`${import.meta.env.VITE_BASE_URL}${p.image_url}`}
                        alt={p.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z'/%3E%3Cpath d='M3 6h18'/%3E%3Cpath d='M16 10a4 4 0 0 1-8 0'/%3E%3C/svg%3E";
                          e.target.style.opacity = '0.2';
                        }}
                      />
                    ) : <div style={{ opacity: 0.2 }}><ShoppingBag size={50} /></div>}
                  </div>
                  <div className="product-info">
                    <h3>{p.name}</h3>
                    <p>{p.description}</p>
                    <div className="product-link">Specs <ChevronRight size={18} /></div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </AnimatePresence>
      ) : (
        <motion.div
          className="glass"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ textAlign: 'center', padding: '8rem 2rem', border: '1px dashed var(--primary)', background: 'var(--primary-soft)' }}
        >
          <Package size={80} style={{ marginBottom: '2rem', color: 'var(--primary)', opacity: 0.5 }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 800 }}>Currently item is not available</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.7' }}>
            We are currently optimizing our production lines for this category. Contact our team to discuss custom formulation requirements or check back soon for our updated catalog.
          </p>
        </motion.div>
      )}
    </div>
  );
};

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('');

  useSEO({
    title: product ? `${product.name} - Contract Manufacturing Specs | Kelon` : 'Retrieving Specifications - Kelon Formulation',
    description: product ? product.description : 'Technical specifications and custom formulation options for Kelon nutraceutical products.'
  });

  useEffect(() => {
    setLoading(true);
    axios.get(`${import.meta.env.VITE_API_URL}/products/${slug}`)
      .then(res => { setProduct(res.data); setLoading(false); })
      .catch(() => { setProduct(null); setLoading(false); });
  }, [slug]);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/inquiries`, {
        ...formData,
        product_id: product.id,
        message: `Inquiry for ${product.name}: ${formData.message}`
      });
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  if (loading) return (
    <div className="container page-offset" style={{ textAlign: 'center' }}>
      <div className="loader-container">
        <div className="spinner"></div>
        <p>Retrieving Specifications...</p>
      </div>
    </div>
  );
  if (!product) return <div className="container page-offset" style={{ textAlign: 'center' }}><div className="glass" style={{ padding: '5rem', maxWidth: '600px', margin: '0 auto' }}><Package size={80} opacity={0.3} color="#ef4444" /><h1 style={{ marginTop: '2rem' }}>Entry Not Found</h1><Link to="/products" className="btn-primary" style={{ marginTop: '2rem' }}>Back to Catalog</Link></div></div>;

  return (
    <motion.div
      className="container page-offset"
      style={{ paddingBottom: '8rem' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Link to="/products" style={{ color: 'var(--primary-cta)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '3rem', fontWeight: 700 }}><ChevronRight style={{ transform: 'rotate(180deg)' }} size={24} /> BACK TO CATALOG</Link>
      <div className="product-detail-grid">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
        >
          <div className="glass" style={{ padding: '2rem', height: 'fit-content' }}>
            <div className="detail-image-container">
              {product.image_url ? (
                <img
                  src={`${import.meta.env.VITE_BASE_URL}${product.image_url}`}
                  alt={product.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z'/%3E%3Cpath d='M3 6h18'/%3E%3Cpath d='M16 10a4 4 0 0 1-8 0'/%3E%3C/svg%3E";
                    e.target.style.opacity = '0.1';
                  }}
                />
              ) : <ShoppingBag size={140} opacity={0.1} />}
            </div>
          </div>

          <div className="glass" style={{ padding: '2.5rem', border: '1px solid var(--border-strong)' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', fontWeight: 800 }}>Quick Inquiry</h3>
            <form onSubmit={handleInquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <input required placeholder="Your Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="form-input" />
              <input required type="email" placeholder="Business Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="form-input" />
              <input required placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="form-input" />
              <textarea placeholder="Message" value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} rows={3} className="form-input" style={{ resize: 'none' }} />
              <motion.button type="submit" className="btn-primary" disabled={status === 'sending'} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} style={{ padding: '0.8rem', width: '100%' }}>
                {status === 'sending' ? 'SENDING...' : 'ENQUIRE NOW'}
              </motion.button>
              {status === 'success' && <p style={{ color: 'var(--primary)', fontSize: '0.8rem', textAlign: 'center' }}>Sent successfully!</p>}
              {status === 'error' && <p style={{ color: '#ef4444', fontSize: '0.8rem', textAlign: 'center' }}>Error sending message.</p>}
            </form>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
        >
          <h4 className="text-label" style={{ fontSize: '0.75rem', letterSpacing: '2.5px', marginBottom: '1rem' }}>{product.category_name} Formulation</h4>
          <h1 className="responsive-h1-large">{product.name}</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: '1.8' }}>{product.description}</p>
          <div className="benefits-box">
            <h3 className="text-label" style={{ fontSize: '1.1rem', marginBottom: '1.5rem', letterSpacing: '1px' }}>Core Health Benefits</h3>
            <ul className="benefits-list">
              {product.benefits?.split(',').map((b, i) => <li key={i}><div className="dot"></div>{b.trim()}</li>)}
            </ul>
          </div>
          <div className="specs-grid">
            <div className="specs-col">
              <div><h5 className="spec-label">Ingredients</h5><p className="spec-val">{product.ingredients || 'Proprietary Blend'}</p></div>
              <div><h5 className="spec-label">Flavors</h5><p className="spec-val">{product.flavours || 'Customizable'}</p></div>
              <div><h5 className="spec-label">Shelf Life</h5><p className="spec-val">{product.shelf_life || '24 Months'}</p></div>
            </div>
            <div className="specs-col">
              <div><h5 className="spec-label">MOQ</h5><p className="spec-val">{product.moq || 'Contact Sales'}</p></div>
              <div><h5 className="spec-label">Packaging</h5><p className="spec-val">{product.packing_material || 'Advanced Pharma'}</p></div>
              <div><h5 className="spec-label">Certifications</h5><p className="spec-val">WHO-GMP, HACCP, FSSAI</p></div>
            </div>
          </div>

          {product.formulas && (
            <div className="formulas-section" style={{ marginTop: '2rem' }}>
              <h3 className="text-label" style={{ fontSize: '1.1rem', marginBottom: '0.8rem', letterSpacing: '1px' }}>Available Formulations</h3>
              <div className="formulas-list">
                {product.formulas.split('\n').filter(f => f.trim()).map((formula, i) => (
                  <ScrollReveal key={i} className="formula-card" delay={i * 0.08}>
                    <div className="formula-content">
                      {formula.split('+').map((ingredient, j) => (
                        <span key={j} className="formula-ingredient">
                          {ingredient.trim()}
                          {j < formula.split('+').length - 1 && <span className="formula-plus">+</span>}
                        </span>
                      ))}
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

const FooterWrapper = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  if (isAdmin) return null;
  return <Footer />;
};

const App = () => (
  <MotionConfig reducedMotion="user">
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/admin/*" element={<Admin />} />
          </Routes>
        </div>
        <FooterWrapper />
      </div>
    </Router>
  </MotionConfig>
);

export default App;
