import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate, useLocation, NavLink } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform, MotionConfig } from 'framer-motion';
import { Menu, ShoppingBag, Phone, Mail, ChevronRight, ShieldCheck, Factory, Package, Plus, FlaskConical, Send, Flag, Eye, CheckCircle2, ArrowUpRight, Check } from 'lucide-react';
import axios from 'axios';
import Admin from './pages/Admin';
import { useSEO } from './hooks/useSEO';
import ScrollReveal from './motion/ScrollReveal';
import ProcessLifecycle from './components/ProcessLifecycle';
import { fadeUp, fadeLeft, staggerContainer, heroContainer, heroItem, viewportOnce, viewportOnceEarly, cardHoverLift, springSoft, springLayout, EASE } from './motion/variants';
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

const heroSlides = ['/hero-factory.png', '/hero-lab.png', '/hero-products.png'];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 70]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 7500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="hero-slider" ref={sectionRef}>
      <div className="slider-backgrounds">
        <AnimatePresence>
          <motion.div
            key={currentSlide}
            className="slide-bg active"
            style={{ backgroundImage: `linear-gradient(160deg, rgba(18, 26, 20, 0.88) 0%, rgba(21, 32, 24, 0.62) 55%, rgba(21, 32, 24, 0.4) 100%), url(${heroSlides[currentSlide]})` }}
            initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 1.02 }}
            animate={{ opacity: 1, scale: prefersReducedMotion ? 1 : 1.05 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 2.2, ease: 'easeInOut' },
              scale: { duration: 9, ease: 'linear' },
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
          className="hero-content hero-content--centered"
          variants={prefersReducedMotion ? undefined : heroContainer}
          initial={prefersReducedMotion ? undefined : 'hidden'}
          animate={prefersReducedMotion ? undefined : 'show'}
        >
          <motion.span className="hero-eyebrow" variants={prefersReducedMotion ? undefined : heroItem}>
            Third-Party Manufacturing Experts
          </motion.span>
          <motion.h1 variants={prefersReducedMotion ? undefined : heroItem}>
            The Future of{' '}
            <span className="hero-accent">Nutraceutical</span>
            {' '}Innovation
          </motion.h1>
          <motion.p variants={prefersReducedMotion ? undefined : heroItem}>
            Your premier partner for private-label supplements, advanced formulations, and end-to-end contract manufacturing.
          </motion.p>
          <motion.div className="hero-actions" variants={prefersReducedMotion ? undefined : heroItem}>
            <MotionLink
              to="/products"
              className="btn-primary btn-hero"
              whileHover={prefersReducedMotion ? undefined : { y: -2 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
            >
              Explore Catalog <ArrowUpRight size={20} />
            </MotionLink>
            <motion.a
              href="#contact"
              onClick={(e) => { e.preventDefault(); document.getElementById('contact').scrollIntoView({ behavior: 'smooth' }) }}
              className="btn-outline btn-hero"
              whileHover={prefersReducedMotion ? undefined : { y: -2 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
            >
              Request a Quote <ChevronRight size={20} />
            </motion.a>
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
        onClick={() => document.getElementById('capabilities')?.scrollIntoView({ behavior: 'smooth' })}
        aria-label="Scroll to explore"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
      >
        <span>Scroll</span>
        <motion.span
          className="hero-scroll-cue-line"
          animate={prefersReducedMotion ? undefined : { scaleY: [0.3, 1, 0.3] }}
          transition={prefersReducedMotion ? undefined : { duration: 2.2, repeat: Infinity, ease: EASE }}
        />
      </motion.button>
    </section>
  );
};

const Capabilities = () => (
  <section id="capabilities" className="section-soft section-pad capabilities-section">
    <div className="container">
      <ScrollReveal style={{ marginBottom: '3.5rem' }}>
        <h4 className="text-label" style={{ marginBottom: '1rem' }}>Manufacturing Capabilities</h4>
        <h2 className="responsive-section-title" style={{ maxWidth: '640px' }}>Four formats. One uncompromising standard.</h2>
      </ScrollReveal>
      <motion.div
        className="capability-grid"
        variants={staggerContainer(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
      >
        {[
          { name: 'Effervescent Tablets', desc: 'Industry-leading rapid-dissolve technology.', img: '/cat-effervescent.png' },
          { name: 'Capsules', desc: 'Secure and stable active delivery.', img: '/cat-capsules.png' },
          { name: 'Protein Powders', desc: 'High-purity, easy-mix formulations.', img: '/cat-powders.png' },
          { name: 'Standard Tablets', desc: 'Precise dosing and coating options.', img: '/cat-tablets.png' }
        ].map((cat, i) => (
          <motion.div key={i} variants={cardHoverLift} whileHover="hover">
            <Link to="/products" state={{ selectedCategory: cat.name }} className="capability-link">
              <div className="capability-image">
                <img src={cat.img} alt={cat.name} />
              </div>
              <div className="capability-info">
                <h3>{cat.name}</h3>
                <p>{cat.desc}</p>
                <span className="capability-cta">View Catalogue <ChevronRight size={16} /></span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

const Certificates = () => {
  const certifications = [
    { name: 'HACCP', img: '/cert-haccp.png' },
    { name: 'FSSAI', img: '/cert-fssai.png' },
    { name: 'ISO 9001:2015', img: '/cert-iso-9001.png' },
    { name: 'ISO 22000', img: '/cert-iso-22000.png' },
    { name: 'WHO-GMP', img: '/cert-who-gmp.png' },
  ];

  // Double the array for seamless scrolling
  const scrollItems = [...certifications, ...certifications];

  return (
    <section className="certificates-section">
      <div className="container">
        <ScrollReveal className="certificates-header">
          <h4 className="text-label">Certified &amp; Compliant</h4>
        </ScrollReveal>
      </div>
      <ScrollReveal className="certificates-container">
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

const About = () => {
  const infrastructure = ['Advanced R&D Lab', 'Strict Quality QC', 'Automated Packaging', 'Full Sterilization'];
  const pillars = [
    { icon: <Flag size={22} />, title: 'Mission', desc: 'To advance global wellness by delivering the best-quality, most affordable supplement formulations at scale.' },
    { icon: <Eye size={22} />, title: 'Vision', desc: 'To be the manufacturing partner of choice for brands that refuse to compromise on quality or innovation.' },
    { icon: <FlaskConical size={22} />, title: 'Approach', desc: 'Science-led formulation, rigorous multi-stage testing, and certified production from first batch to full scale.' },
  ];

  return (
    <section className="section-soft section-pad-lg about-section">
      <div className="container">
        <div className="about-intro">
          <ScrollReveal>
            <h4 className="text-label" style={{ marginBottom: '1.2rem' }}>Who We Are</h4>
            <h2 className="responsive-section-title" style={{ marginBottom: '1.5rem' }}>Science-first formulations, manufactured at scale</h2>
            <p className="lead-text" style={{ color: 'var(--text-muted)' }}>
              Kelon Formulation is a leading third-party nutraceutical manufacturer, bridging complex science and consumer wellness through certified, high-precision production. Every formulation is developed, tested, and produced under one roof — safe, effective, and built to the standard your brand demands.
            </p>
          </ScrollReveal>
        </div>

        <div className="about-divider" />

        <div className="about-grid">
          <ScrollReveal variants={fadeLeft} className="about-infra">
            <h3 className="subsection-title" style={{ marginBottom: '1.5rem' }}>World-class infrastructure</h3>
            <p className="lead-text" style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              Equipped with advanced machinery for effervescent, capsule, and powder production, operating in ISO-certified, temperature-controlled sterile environments for uncompromising product integrity.
            </p>
            <ul className="about-infra-list">
              {infrastructure.map((feat, i) => (
                <li key={i}><Check size={16} /> {feat}</li>
              ))}
            </ul>
          </ScrollReveal>

          <motion.div
            className="about-pillars"
            variants={staggerContainer(0.12)}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
          >
            {pillars.map((p, i) => (
              <motion.div key={i} className="about-pillar" variants={fadeUp}>
                <div className="about-pillar-icon">{p.icon}</div>
                <h4>{p.title}</h4>
                <p>{p.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

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
    <div className="section-alt section-pad-lg">
      <div className="container">
        <ScrollReveal className="page-header">
          <h4 className="text-label" style={{ marginBottom: '1.2rem' }}>Partnership Inquiry</h4>
          <h2 className="responsive-section-title" style={{ marginBottom: '1.5rem' }}>Start Your Project</h2>
          <p className="lead-text" style={{ color: 'var(--text-muted)', margin: '0 auto' }}>
            Ready to manufacture with the best? Fill out the form below or contact our headquarters for a detailed quote.
          </p>
        </ScrollReveal>

        <ScrollReveal variants={fadeUp} className="glass contact-panel">
          <div className="contact-panel-grid">
            <div className="contact-info-col">
              {[
                { icon: <Mail size={20} />, title: 'Email Us', val: 'info@kelonformulation.com', sub: 'Technical Queries' },
                { icon: <Phone size={20} />, title: 'Direct Line', val: '+91 9104882188', sub: '8 AM – 6 PM EST' },
                { icon: <Factory size={20} />, title: 'Facility', val: 'Shed no. 14, Nandanvan 04 Ind. Park, Bakrol Bujrang, Ahmedabad - 382430', sub: 'Main Operations' }
              ].map((item, i) => (
                <div key={i} className="contact-info-row">
                  <div className="contact-info-icon">{item.icon}</div>
                  <div>
                    <span className="contact-info-label">{item.title}</span>
                    <p className="contact-info-value">{item.val}</p>
                    <span className="contact-info-sub">{item.sub}</span>
                  </div>
                </div>
              ))}
            </div>

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
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

const ManufacturingProcess = () => (
  <section id="process" className="process-section">
    <div className="container">
      <ScrollReveal>
        <div className="process-header" style={{ marginBottom: '1.75rem', textAlign: 'center' }}>
          <h4 className="text-label" style={{ marginBottom: '0.5rem' }}>Workflow Excellence</h4>
          <h2 className="responsive-section-title">Science-driven production lifecycle</h2>
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
            <img src="/kelon-logo.svg" alt="Kelon Formulation" className="footer-logo" />
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

// Main Pages
const Home = () => {
  useSEO({
    title: 'Kelon Formulation - Third-Party Nutraceutical & Supplement Manufacturing',
    description: 'Premier B2B contract manufacturer for private label supplements, effervescent tablets, capsules, and protein powders. ISO-certified facilities.'
  });

  return (
    <>
      <HeroSlider />
      <Capabilities />
      <Certificates />
      <div id="about">
        <About />
      </div>
      <ManufacturingProcess />
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
  const [isFetching, setIsFetching] = useState(false);
  const hasLoadedOnce = useRef(false);

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
    let cancelled = false;
    const isFirstLoad = !hasLoadedOnce.current;

    if (isFirstLoad) {
      setLoading(true);
    } else {
      setIsFetching(true);
    }

    const url = activeCategory
      ? `${import.meta.env.VITE_API_URL}/products?category_id=${activeCategory}&limit=100`
      : `${import.meta.env.VITE_API_URL}/products?limit=100`;

    axios.get(url).then(res => {
      if (cancelled) return;
      setProducts(res.data.data || []);
      hasLoadedOnce.current = true;
      setLoading(false);
      setIsFetching(false);
    }).catch(err => {
      if (cancelled) return;
      console.error(err);
      setProducts([]);
      hasLoadedOnce.current = true;
      setLoading(false);
      setIsFetching(false);
    });

    return () => { cancelled = true; };
  }, [activeCategory]);

  return (
    <div className="container page-offset" style={{ paddingBottom: '6rem' }}>
      <div className="category-header-section">
        {activeCategory ? (
          <>
            <h4 className="text-label" style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>
              COLLECTION ({categories.find(c => c.id === activeCategory)?.products_count || products.length || 0})
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
            <h4 className="text-label" style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>
              FULL CATALOG ({categories.reduce((acc, cat) => acc + parseInt(cat.products_count || 0, 10), 0) || products.length})
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
          className="category-filter-link"
          data-active={activeCategory === null}
        >
          All
          {activeCategory === null && (
            <motion.span className="category-filter-underline" layoutId="categoryUnderline" transition={springLayout} />
          )}
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className="category-filter-link"
            data-active={activeCategory === cat.id}
          >
            {cat.name}
            {activeCategory === cat.id && (
              <motion.span className="category-filter-underline" layoutId="categoryUnderline" transition={springLayout} />
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loader-container">
          <div className="spinner"></div>
          <p>Synchronizing Catalog...</p>
        </div>
      ) : products.length > 0 ? (
        <motion.div
          className="product-grid"
          variants={staggerContainer(0.06)}
          initial={false}
          animate="show"
          style={{
            opacity: isFetching ? 0.55 : 1,
            transition: 'opacity 0.2s ease',
            pointerEvents: isFetching ? 'none' : 'auto',
          }}
        >
          {products.map(p => (
            <Link key={p.id} to={`/product/${p.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <motion.div className="product-card card-motion" variants={cardHoverLift} whileHover="hover">
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
      ) : (
        <motion.div
          className="empty-state"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <Package size={64} style={{ marginBottom: '2rem', color: 'var(--primary)', opacity: 0.4 }} />
          <h2 style={{ fontSize: '1.4rem', marginBottom: '1.25rem', fontWeight: 700 }}>Currently item is not available</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.7' }}>
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
      className="container page-offset product-detail-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Link to="/products" className="back-to-catalog"><ChevronRight style={{ transform: 'rotate(180deg)' }} size={20} /> Back to Catalog</Link>

      <div className="product-detail-grid">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
        >
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
        >
          <h4 className="text-label" style={{ fontSize: '0.75rem', marginBottom: '1rem' }}>{product.category_name} Formulation</h4>
          <h1 className="responsive-h1-large">{product.name}</h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.8' }}>{product.description}</p>

          {product.benefits && (
            <div className="benefits-box">
              <h3 className="text-label" style={{ fontSize: '1rem', marginBottom: '1.25rem' }}>Core Health Benefits</h3>
              <ul className="benefits-list">
                {product.benefits.split(',').map((b, i) => <li key={i}><div className="dot"></div>{b.trim()}</li>)}
              </ul>
            </div>
          )}

          <dl className="specs-table">
            <div className="specs-table-row">
              <dt className="spec-label">Ingredients</dt>
              <dd className="spec-val">{product.ingredients || 'Proprietary Blend'}</dd>
            </div>
            <div className="specs-table-row">
              <dt className="spec-label">Flavors</dt>
              <dd className="spec-val">{product.flavours || 'Customizable'}</dd>
            </div>
            <div className="specs-table-row">
              <dt className="spec-label">Shelf Life</dt>
              <dd className="spec-val">{product.shelf_life || '24 Months'}</dd>
            </div>
            <div className="specs-table-row">
              <dt className="spec-label">MOQ</dt>
              <dd className="spec-val">{product.moq || 'Contact Sales'}</dd>
            </div>
            <div className="specs-table-row">
              <dt className="spec-label">Packaging</dt>
              <dd className="spec-val">{product.packing_material || 'Advanced Pharma'}</dd>
            </div>
            <div className="specs-table-row">
              <dt className="spec-label">Certifications</dt>
              <dd className="spec-val">WHO-GMP, HACCP, FSSAI</dd>
            </div>
          </dl>

          {product.formulas && (
            <div className="formulas-section" style={{ marginTop: '2rem' }}>
              <h3 className="text-label" style={{ fontSize: '1rem', marginBottom: '0.8rem' }}>Available Formulations</h3>
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

      <ScrollReveal className="glass detail-inquiry-panel">
        <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', fontWeight: 700 }}>Quick Inquiry</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.75rem', fontSize: '0.95rem' }}>Ask about MOQ, lead times, or custom formulation for {product.name}.</p>
        <form onSubmit={handleInquirySubmit} className="detail-inquiry-form">
          <input required placeholder="Your Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="form-input" />
          <input required type="email" placeholder="Business Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="form-input" />
          <input required placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="form-input" />
          <textarea placeholder="Message" value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} rows={3} className="form-input" style={{ resize: 'none' }} />
          <motion.button type="submit" className="btn-primary" disabled={status === 'sending'} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
            {status === 'sending' ? 'SENDING...' : 'ENQUIRE NOW'}
          </motion.button>
          {status === 'success' && <p style={{ color: 'var(--primary)', fontSize: '0.85rem', textAlign: 'center' }}>Sent successfully!</p>}
          {status === 'error' && <p style={{ color: '#ef4444', fontSize: '0.85rem', textAlign: 'center' }}>Error sending message.</p>}
        </form>
      </ScrollReveal>
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
