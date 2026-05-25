import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate, useLocation, NavLink } from 'react-router-dom';
import { Layout, Menu, ShoppingBag, Phone, Mail, ChevronRight, Activity, FlaskConical, ShieldCheck, Factory, User, MessageSquare, Package, Plus } from 'lucide-react';
import axios from 'axios';
import Admin from './pages/Admin';

// Animation Component
const ScrollReveal = ({ children, className, style }) => {
  const [active, setActive] = useState(false);
  const ref = React.useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={style} className={`${className || ''} reveal-on-scroll ${active ? 'active' : ''}`}>
      {children}
    </div>
  );
};

// Core Components
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-content">
        <Link to="/" onClick={(e) => handleNavClick(e, 'home')} className="logo-link" style={{ zIndex: 1000 }}>
          <div className="logo-icon-container">
            <FlaskConical size={24} className="logo-icon" />
          </div>
          <span className="logo-text">
            KELON <span className="logo-accent">FORMULATION</span>
          </span>
        </Link>

        <button className="mobile-menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)} style={{ zIndex: 2001 }}>
          {isMenuOpen ? <Plus size={32} style={{ transform: 'rotate(45deg)' }} /> : <Menu size={32} />}
        </button>

        <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <li><a href="#home" onClick={(e) => handleNavClick(e, 'home')} className={`nav-link ${activeClass('home')}`}>Home</a></li>
          <li><NavLink to="/products" onClick={() => setIsMenuOpen(false)} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Products</NavLink></li>
          <li><a href="#about" onClick={(e) => handleNavClick(e, 'about')} className={`nav-link ${activeClass('about')}`}>About Us</a></li>
          <li><a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className={`nav-link ${activeClass('contact')}`}>Contact</a></li>
          <li><NavLink to="/admin" onClick={() => setIsMenuOpen(false)} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><User size={16} /> Admin</NavLink></li>
        </ul>
      </div>
    </nav>
  );
};

const Hero = () => (
  <section id="home" className="hero">
    <div className="container">
      <div className="hero-content animate-fade">
        <h4 style={{ color: '#10B981', textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '1.5rem', fontWeight: 600 }}>Third-Party Manufacturing Experts</h4>
        <h1>The Future of <span style={{ color: '#10B981' }}>Nutraceutical</span> Innovation</h1>
        <p>Your premier partner for high-quality private label supplements, advanced formulations, and end-to-end manufacturing excellence. Scaling wellness brands since 2026.</p>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/products" className="btn-primary" style={{ padding: '1.2rem 2.5rem' }}>Explore Catalog</Link>
          <a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById('contact').scrollIntoView({ behavior: 'smooth' }) }} style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', fontWeight: 600, fontSize: '1.1rem' }}>
            Get a Quote <ChevronRight size={22} color="#10B981" />
          </a>
        </div>
      </div>
    </div>
  </section>
);

const FeatureStats = () => (
  <section style={{ padding: '4rem 0' }}>
    <div className="container grid-3">
      {[
        { icon: <Factory size={32} />, val: '1 Lac Sq.ft +', label: 'Infrastructure Hub' },
        { icon: <Activity size={32} />, val: '400+', label: 'Proven Formulations' },
        { icon: <ShieldCheck size={32} />, val: '11+ Years', label: 'Industry Excellence' }
      ].map((stat, i) => (
        <ScrollReveal key={i} className="glass" style={{ padding: '3rem 2rem', textAlign: 'center', transitionDelay: `${i * 0.1}s`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="animate-float" style={{ color: '#10B981', marginBottom: '1.2rem' }}>{stat.icon}</div>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '0.4rem', fontWeight: 800 }}>{stat.val}</h2>
          <p style={{ color: '#94A3B8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600 }}>{stat.label}</p>
        </ScrollReveal>
      ))}
    </div>
  </section>
);

const AboutSummary = () => (
  <section className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
    <ScrollReveal className="glass" style={{ padding: '3.5rem' }}>
      <div style={{ textAlign: 'left' }}>
        <h2 style={{ color: '#10B981', fontSize: '0.95rem', textTransform: 'uppercase', marginBottom: '1.2rem', letterSpacing: '2.5px', fontWeight: 700 }}>Your Manufacturing Partner</h2>
        <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', lineHeight: '1.1' }}>Science-First Formulations <br />at Scale</h1>
        <p style={{ color: '#94A3B8', fontSize: '1.2rem', maxWidth: '850px', marginBottom: '3rem', lineHeight: '1.7' }}>
          Kelon Formulation specializes in developing world-class nutritional solutions. We bridge the gap between complex science and consumer wellness through our advanced, certified manufacturing processes. Safe, effective, and sustainably developed—every time.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.8rem', paddingTop: '2.5rem', borderTop: '1px solid var(--border)' }}>
          {['WHO GMP CERTIFIED', 'HACCP COMPLIANT', 'ISO 22000:2018', 'FDA REGISTERED', 'FSSC 22000', 'cGMP 21 CFR'].map((cert, i) => (
            <div key={cert} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', color: '#64FFDA', transitionDelay: `${i * 0.05}s` }} className="animate-fade">
              <ShieldCheck size={18} /> <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.5px' }}>{cert}</span>
            </div>
          ))}
        </div>
      </div>
    </ScrollReveal>
  </section>
);

const LegacyAbout = () => (
  <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem', marginBottom: '2rem' }}>
    <ScrollReveal style={{ textAlign: 'center', marginBottom: '6rem' }}>
      <h4 style={{ color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '3.5px', marginBottom: '1.2rem', fontWeight: 700 }}>Our Legacy</h4>
      <h1 className="responsive-h1" style={{ fontSize: '3.8rem', marginBottom: '2rem', fontWeight: 800, lineHeight: '1.1' }}>State-of-the-Art <br /><span style={{ color: 'var(--primary)' }}>Industrial Prowess</span></h1>
      <p style={{ color: '#94A3B8', fontSize: '1.2rem', maxWidth: '850px', margin: '0 auto', lineHeight: '1.7' }}>
        Kelon Formulation Manufacturing is a leader in high-performance supplement production. Our mission is to accelerate wellness worldwide through uncompromising innovation in formulation and design.
      </p>
    </ScrollReveal>

    <div className="grid-2">
      <ScrollReveal style={{ textAlign: 'left' }}>
        <h2 style={{ fontSize: '2.8rem', marginBottom: '2rem', lineHeight: '1.2' }}>World-Class <br />Infrastructure</h2>
        <p style={{ color: '#94A3B8', fontSize: '1.15rem', marginBottom: '2.5rem', lineHeight: '1.8' }}>
          Equipped with advanced machinery for effervescent, capsules, and powder production. We operate in ISO-certified, temperate-controlled sterile environments to ensure ultimate product integrity.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.8rem' }}>
          {['Advanced R&D Lab', 'Strict Quality QC', 'Automated Packaging', 'Full Sterilization'].map((feat, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.04)', padding: '1.2rem', borderRadius: '15px' }}>
              <ShieldCheck size={22} color="#10B981" />
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{feat}</span>
            </div>
          ))}
        </div>
      </ScrollReveal>
      <ScrollReveal className="glass" style={{ height: '420px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: '2.5rem' }}>
        <Factory size={200} opacity={0.03} style={{ position: 'absolute' }} />
        <div style={{ textAlign: 'center', zIndex: 1 }}>
          <div className="animate-float" style={{ width: '90px', height: '90px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', boxShadow: '0 0 35px rgba(16, 185, 129, 0.4)' }}>
            <Activity color="white" size={40} />
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Reliability First</h3>
          <p style={{ color: '#94A3B8', marginTop: '0.8rem', fontWeight: 500 }}>Unrivaled Precision in Every Batch</p>
        </div>
      </ScrollReveal>
    </div>
  </div>
);

const Capabilities = () => (
  <section className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
    <ScrollReveal style={{ textAlign: 'center', marginBottom: '4rem' }}>
      <h2 style={{ fontSize: '3rem', marginBottom: '1.2rem', fontWeight: 800 }}>Manufacturing Capabilities</h2>
      <p style={{ color: '#94A3B8', maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem', lineHeight: '1.7' }}>We leverage cutting-edge pharmaceutical technology to deliver diverse delivery formats with maximum bioavailability and stability.</p>
    </ScrollReveal>
    <div className="product-grid">
      {[
        { name: 'Effervescent Tablets', desc: 'Industry-leading rapid-dissolve tech.', img: '/uploads/cat-effervescent.png' },
        { name: 'Capsules', desc: 'Secure and stable active delivery.', img: '/uploads/cat-capsules.png' },
        { name: 'Protein Powders', desc: 'High-purity, easy-mix formulations.', img: '/uploads/cat-powders.png' },
        { name: 'Standard Tablets', desc: 'Precise dosing and coating options.', img: '/uploads/cat-tablets.png' }
      ].map((cat, i) => (
        <ScrollReveal key={i} className="glass product-card" style={{ transitionDelay: `${i * 0.1}s`, padding: 0 }}>
          <Link to="/products" state={{ selectedCategory: cat.name }} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', padding: '2rem', height: '100%' }}>
            <div className="product-image" style={{ background: 'white', padding: '1.5rem', overflow: 'hidden', marginBottom: '2rem', borderRadius: '15px', height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {cat.img ? (
                <img src={`${import.meta.env.VITE_BASE_URL}${cat.img}`} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : (
                <ShoppingBag size={56} opacity={0.1} color="black" />
              )}
            </div>
            <div className="product-info" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.8rem', fontWeight: 700 }}>{cat.name}</h3>
              <p style={{ color: '#94A3B8', marginBottom: '2rem', lineHeight: '1.6', fontSize: '0.95rem' }}>{cat.desc}</p>
              <div style={{ marginTop: 'auto', color: 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
                Catalogue <ChevronRight size={18} />
              </div>
            </div>
          </Link>
        </ScrollReveal>
      ))}
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
    <div className="container" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
      <ScrollReveal style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h4 style={{ color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '1.2rem', fontWeight: 700 }}>Partnership Inquiry</h4>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>Start Your Project</h1>
        <p style={{ color: '#94A3B8', fontSize: '1.15rem', maxWidth: '650px', margin: '0 auto', lineHeight: '1.7' }}>
          Ready to manufacture with the best? Fill out the form below or contact our headquarters for a detailed quote.
        </p>
      </ScrollReveal>

      <div className="grid-contact">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {[
            { icon: <Mail size={24} />, title: 'Email Us', val: 'partners@kelon.com', sub: 'Technical Queries' },
            { icon: <Phone size={24} />, title: 'Direct Line', val: '+1 (555) 987-6543', sub: '9 AM - 6 PM EST' },
            { icon: <Factory size={24} />, title: 'Facility', val: 'Industrial Zone Block 5, Kelon Formulation HQ', sub: 'Main Operations' }
          ].map((item, i) => (
            <ScrollReveal key={i} className="glass" style={{ padding: '2.5rem 2rem', transitionDelay: `${i * 0.15}s` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.12)', padding: '1rem', borderRadius: '15px', color: 'var(--primary)', boxShadow: '0 0 20px rgba(16, 185, 129, 0.1)' }}>
                  {item.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.3rem', fontWeight: 700 }}>{item.title}</h3>
                  <p style={{ color: 'var(--primary)', fontSize: '1rem', fontWeight: 700, marginBottom: '0.3rem' }}>{item.val}</p>
                  <p style={{ color: '#64748B', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 600 }}>{item.sub}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="glass" style={{ padding: '3.5rem', border: '1px solid rgba(16, 185, 129, 0.3)', boxShadow: '0 30px 60px rgba(0, 0, 0, 0.4)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '2rem' }}>
            <div className="grid-form-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <label style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.8px' }}>Full Name</label>
                <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="John Doe" style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white', outline: 'none', fontSize: '1rem' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <label style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.8px' }}>Business Email</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="office@brand.com" style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white', outline: 'none', fontSize: '1rem' }} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <label style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.8px' }}>Contact Number</label>
              <input required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="+1 (000) 000-0000" style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white', outline: 'none', fontSize: '1rem' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <label style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.8px' }}>Project Details</label>
              <textarea required value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} placeholder="Format, Quantity, Timeline..." rows={5} style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white', outline: 'none', resize: 'none', fontSize: '1rem' }} />
            </div>
            <button type="submit" className="btn-primary" disabled={status === 'sending'} style={{ padding: '1.3rem', fontSize: '1.1rem', fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase' }}>
              {status === 'sending' ? 'TRANSMITTING...' : 'START YOUR PROJECT'}
            </button>
            {status === 'success' && <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1.2rem', borderRadius: '12px', color: '#10B981', textAlign: 'center', fontWeight: 600 }}>Message Received! We'll contact you shortly.</div>}
            {status === 'error' && <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1.2rem', borderRadius: '12px', color: '#ef4444', textAlign: 'center' }}>Error. Please try again.</div>}
          </form>
        </ScrollReveal>
      </div>
    </div>
  );
};

// Main Pages
const Home = () => (
  <>
    <Hero />
    <FeatureStats />
    <div id="about">
      <AboutSummary />
      <LegacyAbout />
    </div>
    <Capabilities />
    <div id="contact">
      <ContactSection />
    </div>
  </>
);

const Products = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);

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
    <div className="container" style={{ paddingTop: '8rem', paddingBottom: '6rem' }}>
      <ScrollReveal style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <h4 style={{ color: '#10B981', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '1.5rem', fontWeight: 700 }}>Manufacturing Catalog</h4>
        <h1 style={{ fontSize: '4.5rem', fontWeight: 800 }}>Explore Solutions</h1>
      </ScrollReveal>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '6rem', flexWrap: 'wrap' }}>
        <button onClick={() => setActiveCategory(null)} style={{ padding: '1rem 2.5rem', borderRadius: '50px', border: '2px solid #10B981', background: activeCategory === null ? '#10B981' : 'transparent', color: activeCategory === null ? 'white' : '#10B981', cursor: 'pointer', fontWeight: 800, transition: '0.3s', fontSize: '1rem' }}>All</button>
        {categories.map(cat => (
          <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{ padding: '1rem 2.5rem', borderRadius: '50px', border: '2px solid #10B981', background: activeCategory === cat.id ? '#10B981' : 'transparent', color: activeCategory === cat.id ? 'white' : '#10B981', cursor: 'pointer', fontWeight: 800, transition: '0.3s', fontSize: '1rem' }}>{cat.name}</button>
        ))}
      </div>

      {loading ? (
        <div className="loader-container">
          <div className="spinner"></div>
          <p>Synchronizing Catalog...</p>
        </div>
      ) : products.length > 0 ? (
        <div className="product-grid">
          {products.map(p => (
            <Link key={p.id} to={`/product/${p.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <ScrollReveal className="glass product-card" style={{ padding: '2rem' }}>
                <div className="product-image" style={{ background: 'white', borderRadius: '15px', overflow: 'hidden' }}>
                  {p.image_url ? (
                    <img 
                      src={`${import.meta.env.VITE_BASE_URL}${p.image_url}`} 
                      alt={p.name} 
                      style={{ width: '85%', height: '85%', objectFit: 'contain' }} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = ''; // Clear broken src
                        e.target.style.display = 'none'; // Hide image
                        e.target.parentElement.innerHTML = '<div style="opacity: 0.2"><svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg></div>';
                      }}
                    />
                  ) : <div style={{ opacity: 0.2 }}><ShoppingBag size={50} /></div>}
                </div>
                <div className="product-info">
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{p.name}</h3>
                  <p style={{ lineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden', color: '#94A3B8' }}>{p.description}</p>
                  <div style={{ marginTop: '1.5rem', color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Specs <ChevronRight size={18} /></div>
                </div>
              </ScrollReveal>
            </Link>
          ))}
        </div>
      ) : (
        <ScrollReveal className="glass" style={{ textAlign: 'center', padding: '8rem 2rem', border: '1px dashed var(--primary)', background: 'rgba(16, 185, 129, 0.03)' }}>
          <Package size={80} style={{ marginBottom: '2rem', color: 'var(--primary)', opacity: 0.5 }} />
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', fontWeight: 800 }}>Currently item is not available</h2>
          <p style={{ color: '#94A3B8', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.7' }}>
            We are currently optimizing our production lines for this category. Contact our team to discuss custom formulation requirements or check back soon for our updated catalog.
          </p>
        </ScrollReveal>
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
    <div className="container" style={{ paddingTop: '15rem', textAlign: 'center' }}>
      <div className="loader-container">
        <div className="spinner"></div>
        <p>Retrieving Specifications...</p>
      </div>
    </div>
  );
  if (!product) return <div className="container" style={{ paddingTop: '15rem', textAlign: 'center' }}><div className="glass" style={{ padding: '5rem', maxWidth: '600px', margin: '0 auto' }}><Package size={80} opacity={0.3} color="#ef4444" /><h1 style={{ marginTop: '2rem' }}>Entry Not Found</h1><Link to="/products" className="btn-primary" style={{ marginTop: '2rem' }}>Back to Catalog</Link></div></div>;

  return (
    <div className="container" style={{ paddingTop: '8rem', paddingBottom: '8rem' }}>
      <Link to="/products" style={{ color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '3rem', fontWeight: 700 }}><ChevronRight style={{ transform: 'rotate(180deg)' }} size={24} /> BACK TO CATALOG</Link>
      <div className="product-detail-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <ScrollReveal className="glass" style={{ padding: '2rem', height: 'fit-content' }}>
            <div className="detail-image-container">
              {product.image_url ? (
                <img 
                  src={`${import.meta.env.VITE_BASE_URL}${product.image_url}`} 
                  alt={product.name} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '';
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div style="opacity: 0.1"><svg width="140" height="140" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg></div>';
                  }}
                />
              ) : <ShoppingBag size={140} opacity={0.1} />}
            </div>
          </ScrollReveal>

          <ScrollReveal className="glass" style={{ padding: '2.5rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', fontWeight: 800 }}>Quick Inquiry</h3>
            <form onSubmit={handleInquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <input required placeholder="Your Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }} />
              <input required type="email" placeholder="Business Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }} />
              <input required placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }} />
              <textarea placeholder="Message" value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} rows={3} style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white', resize: 'none' }} />
              <button type="submit" className="btn-primary" disabled={status === 'sending'} style={{ padding: '0.8rem', width: '100%' }}>
                {status === 'sending' ? 'SENDING...' : 'ENQUIRE NOW'}
              </button>
              {status === 'success' && <p style={{ color: '#10B981', fontSize: '0.8rem', textAlign: 'center' }}>Sent successfully!</p>}
              {status === 'error' && <p style={{ color: '#ef4444', fontSize: '0.8rem', textAlign: 'center' }}>Error sending message.</p>}
            </form>
          </ScrollReveal>
        </div>

        <div>
          <h4 style={{ color: '#10B981', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '2.5px', marginBottom: '1rem' }}>{product.category_name} Formulation</h4>
          <h1 className="responsive-h1-large">{product.name}</h1>
          <p style={{ fontSize: '1.2rem', color: '#94A3B8', marginBottom: '2.5rem', lineHeight: '1.8' }}>{product.description}</p>
          <div className="benefits-box">
            <h3 style={{ fontSize: '1.1rem', color: '#10B981', textTransform: 'uppercase', marginBottom: '1.5rem', fontWeight: 800, letterSpacing: '1px' }}>Core Health Benefits</h3>
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
              <div><h5 className="spec-label">Certifications</h5><p className="spec-val">WHO-GMP, ISO 22000</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => (
  <Router>
    <Navbar />
    <div style={{ flex: 1 }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
    {/* <footer className="footer-main">
      <div className="container footer-content">
        <p className="footer-brand-text">
          KELON FORMULATION
        </p>
        <div className="footer-nav-links">
          <a href="#" className="footer-link">Privacy Policy</a>
          <a href="#" className="footer-link">Terms of Service</a>
        </div>
      </div>
    </footer> */}
  </Router>
);

export default App;
