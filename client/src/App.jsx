import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate, useLocation, NavLink } from 'react-router-dom';
import { Layout, Menu, ShoppingBag, Phone, Mail, ChevronRight, Activity, FlaskConical, ShieldCheck, Factory, User, MessageSquare, Package } from 'lucide-react';
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

// Global Components
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
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
        <Link to="/" onClick={(e) => handleNavClick(e, 'home')} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'white', textDecoration: 'none' }}>
          <FlaskConical color="#10B981" size={28} />
          <span style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'Outfit', letterSpacing: '1px' }}>NUTRACRAFT</span>
        </Link>
        <ul className="nav-links">
          <li><a href="#home" onClick={(e) => handleNavClick(e, 'home')} className={`nav-link ${activeClass('home')}`}>Home</a></li>
          <li><NavLink to="/products" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Products</NavLink></li>
          <li><a href="#about" onClick={(e) => handleNavClick(e, 'about')} className={`nav-link ${activeClass('about')}`}>About Us</a></li>
          <li><a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className={`nav-link ${activeClass('contact')}`}>Contact</a></li>
          <li><NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><User size={16} /> Admin</NavLink></li>
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
        <p>Your premier partner for high-quality private label supplements, advanced formulations, and end-to-end manufacturing excellence. Scaling wellness brands since 2012.</p>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/products" className="btn-primary" style={{ padding: '1.2rem 2.5rem' }}>Explore Catalog</Link>
          <a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById('contact').scrollIntoView({behavior: 'smooth'}) }} style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', fontWeight: 600, fontSize: '1.1rem' }}>
            Get a Quote <ChevronRight size={22} color="#10B981" />
          </a>
        </div>
      </div>
    </div>
  </section>
);

const FeatureStats = () => (
  <section style={{ padding: '4rem 0' }}>
    <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
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
  <section className="container" style={{ padding: '4rem 0' }}>
    <ScrollReveal className="glass" style={{ padding: '3.5rem' }}>
      <div style={{ textAlign: 'left' }}>
        <h2 style={{ color: '#10B981', fontSize: '0.95rem', textTransform: 'uppercase', marginBottom: '1.2rem', letterSpacing: '2.5px', fontWeight: 700 }}>Your Global Manufacturing Partner</h2>
        <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', lineHeight: '1.1' }}>Science-First Formulations <br />at Scale</h1>
        <p style={{ color: '#94A3B8', fontSize: '1.2rem', maxWidth: '850px', marginBottom: '3rem', lineHeight: '1.7' }}>
          NutraCraft specializes in developing world-class nutritional solutions. We bridge the gap between complex science and consumer wellness through our advanced, certified manufacturing processes. Safe, effective, and sustainably developed—every time.
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
  <div className="container" style={{ padding: '4rem 0', marginBottom: '2rem' }}>
    <ScrollReveal style={{ textAlign: 'center', marginBottom: '6rem' }}>
      <h4 style={{ color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '3.5px', marginBottom: '1.2rem', fontWeight: 700 }}>Our Legacy</h4>
      <h1 style={{ fontSize: '3.8rem', marginBottom: '2rem', fontWeight: 800, lineHeight: '1.1' }}>State-of-the-Art <br /><span style={{ color: 'var(--primary)' }}>Industrial Prowess</span></h1>
      <p style={{ color: '#94A3B8', fontSize: '1.2rem', maxWidth: '850px', margin: '0 auto', lineHeight: '1.7' }}>
        NutraCraft Manufacturing is a leader in high-performance supplement production. Our mission is to accelerate wellness worldwide through uncompromising innovation in formulation and design.
      </p>
    </ScrollReveal>

    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '6rem', alignItems: 'center' }}>
      <ScrollReveal style={{ textAlign: 'left' }}>
        <h2 style={{ fontSize: '2.8rem', marginBottom: '2rem', lineHeight: '1.2' }}>World-Class <br />Infrastructure</h2>
        <p style={{ color: '#94A3B8', fontSize: '1.15rem', marginBottom: '2.5rem', lineHeight: '1.8' }}>
          Equipped with advanced machinery for effervescent, capsules, and powder production. We operate in ISO-certified, temperate-controlled sterile environments to ensure ultimate product integrity.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.8rem' }}>
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
  <section className="container" style={{ padding: '4rem 0' }}>
    <ScrollReveal style={{ textAlign: 'center', marginBottom: '4rem' }}>
      <h2 style={{ fontSize: '3rem', marginBottom: '1.2rem', fontWeight: 800 }}>Manufacturing Capabilities</h2>
      <p style={{ color: '#94A3B8', maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem', lineHeight: '1.7' }}>We leverage cutting-edge pharmaceutical technology to deliver diverse delivery formats with maximum bioavailability and stability.</p>
    </ScrollReveal>
    <div className="product-grid">
      {[
        { name: 'Effervescent Tablets', desc: 'Industry-leading rapid-dissolve tech.', img: '/uploads/cat-effervescent.png' },
        { name: 'Hard Gel Capsules', desc: 'Secure and stable active delivery.', img: '/uploads/cat-capsules.png' },
        { name: 'Nutritional Powders', desc: 'High-purity, easy-mix formulations.', img: '/uploads/cat-powders.png' },
        { name: 'Standard Tablets', desc: 'Precise dosing and coating options.', img: '/uploads/cat-tablets.png' }
      ].map((cat, i) => (
        <ScrollReveal key={i} className="glass product-card" style={{ display: 'flex', flexDirection: 'column', transitionDelay: `${i * 0.1}s`, padding: '2rem' }}>
          <div className="product-image" style={{ background: 'white', padding: '1.5rem', overflow: 'hidden', marginBottom: '2rem', borderRadius: '15px' }}>
            {cat.img ? (
              <img src={`${import.meta.env.VITE_BASE_URL}${cat.img}`} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <ShoppingBag size={56} opacity={0.1} color="black" />
            )}
          </div>
          <div className="product-info" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.8rem', fontWeight: 700 }}>{cat.name}</h3>
            <p style={{ color: '#94A3B8', marginBottom: '2rem', lineHeight: '1.6', fontSize: '0.95rem' }}>{cat.desc}</p>
            <div style={{ marginTop: 'auto' }}>
              <Link to="/products" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Catalogue <ChevronRight size={18} />
              </Link>
            </div>
          </div>
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
    <div className="container" style={{ padding: '6rem 0' }}>
      <ScrollReveal style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h4 style={{ color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '1.2rem', fontWeight: 700 }}>Partnership Inquiry</h4>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>Start Your Project</h1>
        <p style={{ color: '#94A3B8', fontSize: '1.15rem', maxWidth: '650px', margin: '0 auto', lineHeight: '1.7' }}>
          Ready to manufacture with the best? Fill out the form below or contact our global headquarters for a detailed quote.
        </p>
      </ScrollReveal>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(380px, 1fr) 1.5fr', gap: '4rem', alignItems: 'stretch' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {[
            { icon: <Mail size={24} />, title: 'Email Us', val: 'partners@nutracraft.com', sub: 'Technical Queries' },
            { icon: <Phone size={24} />, title: 'Direct Line', val: '+1 (555) 987-6543', sub: '9 AM - 6 PM EST' },
            { icon: <Factory size={24} />, title: 'Facility', val: 'Industrial Zone Block 5, NutraCraft HQ', sub: 'Global Operations' }
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <label style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.8px' }}>Full Name</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="John Doe" style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white', outline: 'none', fontSize: '1rem' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <label style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.8px' }}>Business Email</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="office@brand.com" style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white', outline: 'none', fontSize: '1rem' }} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <label style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.8px' }}>Contact Number</label>
              <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+1 (000) 000-0000" style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white', outline: 'none', fontSize: '1rem' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <label style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.8px' }}>Project Details</label>
              <textarea required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} placeholder="Format, Quantity, Timeline..." rows={5} style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white', outline: 'none', resize: 'none', fontSize: '1rem' }} />
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
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/categories`).then(res => setCategories(res.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const url = activeCategory 
      ? `${import.meta.env.VITE_API_URL}/products?category_id=${activeCategory}`
      : `${import.meta.env.VITE_API_URL}/products`;
    axios.get(url).then(res => {
      setProducts(res.data);
      setLoading(false);
    });
  }, [activeCategory]);

  return (
    <div className="container" style={{ paddingTop: '10rem', paddingBottom: '6rem' }}>
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
        <div style={{ textAlign: 'center', padding: '6rem', fontSize: '1.5rem', color: '#10B981' }}>Synchronizing Catalog...</div>
      ) : (
        <div className="product-grid">
          {products.map(p => (
            <Link key={p.id} to={`/product/${p.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <ScrollReveal className="glass product-card" style={{ padding: '2rem' }}>
                <div className="product-image" style={{ background: 'white', borderRadius: '15px' }}>
                  {p.image_url ? <img src={`${import.meta.env.VITE_BASE_URL}${p.image_url}`} alt={p.name} style={{ width: '85%', height: '85%', objectFit: 'contain' }} /> : <ShoppingBag size={50} opacity={0.2} />}
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
      )}
    </div>
  );
};

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`${import.meta.env.VITE_API_URL}/products/${slug}`)
      .then(res => { setProduct(res.data); setLoading(false); })
      .catch(() => { setProduct(null); setLoading(false); });
  }, [slug]);

  if (loading) return <div className="container" style={{ paddingTop: '15rem', textAlign: 'center' }}><div className="animate-fade" style={{ color: 'var(--primary)', fontSize: '1.5rem', fontWeight: 700 }}>Retrieving Specifications...</div></div>;
  if (!product) return <div className="container" style={{ paddingTop: '15rem', textAlign: 'center' }}><div className="glass" style={{ padding: '5rem', maxWidth: '600px', margin: '0 auto' }}><Package size={80} opacity={0.3} color="#ef4444" /><h1 style={{ marginTop: '2rem' }}>Entry Not Found</h1><Link to="/products" className="btn-primary" style={{ marginTop: '2rem' }}>Back to Catalog</Link></div></div>;

  return (
    <div className="container" style={{ paddingTop: '10rem', paddingBottom: '8rem' }}>
      <Link to="/products" style={{ color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '3rem', fontWeight: 700 }}><ChevronRight style={{ transform: 'rotate(180deg)' }} size={24} /> BACK TO CATALOG</Link>
      <div className="product-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '6rem' }}>
        <ScrollReveal className="glass" style={{ padding: '3rem', height: 'fit-content' }}>
          <div style={{ aspectRatio: '1', background: 'white', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {product.image_url ? <img src={`${import.meta.env.VITE_BASE_URL}${product.image_url}`} alt={product.name} style={{ width: '90%', height: '90%', objectFit: 'contain' }} /> : <ShoppingBag size={140} opacity={0.1} />}
          </div>
        </ScrollReveal>
        <div>
          <h4 style={{ color: '#10B981', textTransform: 'uppercase', fontSize: '1rem', fontWeight: 700, letterSpacing: '2px', marginBottom: '1.5rem' }}>{product.category_name} Formulation</h4>
          <h1 style={{ fontSize: '4.5rem', marginBottom: '2rem', lineHeight: '1.1', fontWeight: 800 }}>{product.name}</h1>
          <p style={{ fontSize: '1.3rem', color: '#94A3B8', marginBottom: '2.5rem', lineHeight: '1.8' }}>{product.description}</p>
          <div style={{ marginBottom: '4rem', padding: '2.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#10B981', textTransform: 'uppercase', marginBottom: '1.5rem', fontWeight: 800, letterSpacing: '1px' }}>Core Health Benefits</h3>
            <ul style={{ color: '#94A3B8', listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {product.benefits?.split(',').map((b, i) => <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1.1rem' }}><div style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '50%' }}></div>{b.trim()}</li>)}
            </ul>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', background: 'rgba(255,255,255,0.03)', padding: '3rem', borderRadius: '25px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div><h5 style={{ color: '#10B981', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem' }}>Ingredients</h5><p style={{ fontWeight: 600 }}>{product.ingredients || 'Proprietary Blend'}</p></div>
              <div><h5 style={{ color: '#10B981', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem' }}>Flavors</h5><p style={{ fontWeight: 600 }}>{product.flavours || 'Customizable'}</p></div>
              <div><h5 style={{ color: '#10B981', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem' }}>Shelf Life</h5><p style={{ fontWeight: 600 }}>{product.shelf_life || '24 Months'}</p></div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div><h5 style={{ color: '#10B981', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem' }}>MOQ</h5><p style={{ fontWeight: 600 }}>{product.moq || 'Contact Sales'}</p></div>
              <div><h5 style={{ color: '#10B981', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem' }}>Packaging</h5><p style={{ fontWeight: 600 }}>{product.packing_material || 'Advanced Pharma'}</p></div>
              <div><h5 style={{ color: '#10B981', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem' }}>Certifications</h5><p style={{ fontWeight: 600 }}>WHO-GMP, ISO 22000</p></div>
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
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/product/:slug" element={<ProductDetail />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
    <footer style={{ padding: '6rem 0', borderTop: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ color: '#64748B', fontWeight: 600 }}>© 2026 NUTRACRAFT MANUFACTURING HUB. <br />ADVANCED B2B SOLUTIONS.</p>
        <div style={{ display: 'flex', gap: '3rem' }}>
          <a href="#" style={{ color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>Privacy Policy</a>
          <a href="#" style={{ color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>Terms of Service</a>
        </div>
      </div>
    </footer>
  </Router>
);

export default App;
