import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit, LogOut, Package, MessageSquare, Phone, Mail, Eye } from 'lucide-react';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category_id: '',
    benefits: '',
    ingredients: '',
    flavours: '',
    packing_material: '',
    packing_size: '',
    shelf_life: '',
    moq: '',
    is_featured: false
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [inquiryPage, setInquiryPage] = useState(1);

  const [searchTerm, setSearchTerm] = useState('');
  const [tableCategory, setTableCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalInquiries, setTotalInquiries] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    if (isLoggedIn) {
      fetchCategories();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) fetchProducts();
  }, [isLoggedIn, currentPage, searchTerm, tableCategory]);

  useEffect(() => {
    if (isLoggedIn) fetchInquiries();
  }, [isLoggedIn, inquiryPage]);

  // Prevent background scroll when modals are open
  useEffect(() => {
    if (isModalOpen || selectedInquiry || isDeleteModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isModalOpen, selectedInquiry, isDeleteModalOpen]);

  const fetchProducts = async () => {
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        category_id: tableCategory
      };
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/products`, { params });
      setProducts(Array.isArray(res.data.data) ? res.data.data : []);
      setTotalProducts(res.data.total || 0);
    } catch (err) {
      console.error('Error fetching products', err);
      setProducts([]);
    }
  };

  const fetchInquiries = async () => {
    try {
      const params = { page: inquiryPage, limit: itemsPerPage };
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/inquiries`, { params });
      setInquiries(res.data.data || []);
      setTotalInquiries(res.data.total || 0);
    } catch (err) {
      console.error('Error fetching inquiries', err);
    }
  };

  const fetchCategories = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);
    setCategories(res.data);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { username, password });
      localStorage.setItem('token', res.data.token);
      setIsLoggedIn(true);
    } catch (err) {
      alert('Login failed');
    }
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(newProduct).forEach(key => formData.append(key, newProduct[key]));
    if (imageFile) formData.append('image', imageFile);

    try {
      if (editingProduct) {
        await axios.put(`${import.meta.env.VITE_API_URL}/products/${editingProduct.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/products`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      fetchProducts();
      closeModal();
    } catch (err) {
      alert('Error saving product');
    }
  };

  const handleDeleteProduct = async () => {
    if (productToDelete) {
      await axios.delete(`${import.meta.env.VITE_API_URL}/products/${productToDelete.id}`);
      fetchProducts();
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      category_id: product.category_id,
      benefits: product.benefits || '',
      ingredients: product.ingredients || '',
      flavours: product.flavours || '',
      packing_material: product.packing_material || '',
      packing_size: product.packing_size || '',
      shelf_life: product.shelf_life || '',
      moq: product.moq || '',
      is_featured: product.is_featured
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setNewProduct({
      name: '',
      description: '',
      category_id: categories.length > 0 ? categories[0].id : '',
      benefits: '',
      ingredients: '',
      flavours: '',
      packing_material: '',
      packing_size: '',
      shelf_life: '',
      moq: '',
      is_featured: false
    });
    setImageFile(null);
  };

  if (!isLoggedIn) {
    return (
      <div className="container" style={{ paddingTop: '8rem', maxWidth: '400px' }}>
        <div className="glass" style={{ padding: '2.5rem' }}>
          <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Admin Login</h2>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }}
              />
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', border: 'none', cursor: 'pointer' }}>Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '8rem', paddingBottom: '6rem' }}>
      <div className="glass" style={{ padding: '2rem', marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <h4 style={{ color: '#10B981', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '2px', marginBottom: '0.5rem' }}>Management Console</h4>
          <h1 style={{ fontSize: '2.5rem' }}>Admin Dashboard</h1>
        </div>
        <button onClick={() => { localStorage.removeItem('token'); setIsLoggedIn(false); }} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#EF4444', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, transition: '0.3s' }}>
          <LogOut size={18} /> Sign Out
        </button>
      </div>

      <div className="admin-tabs">
        <button
          onClick={() => setActiveTab('products')}
          className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`}
        >
          <Package size={20} /> Inventory
        </button>
        <button
          onClick={() => setActiveTab('inquiries')}
          className={`admin-tab ${activeTab === 'inquiries' ? 'active' : ''}`}
        >
          <MessageSquare size={20} /> Client Inquiries
        </button>
      </div>

      {activeTab === 'products' ? (
        <div className="glass" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.5rem' }}>Active Inventory</h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', width: '100%', maxWidth: '600px' }}>
              <input
                placeholder="Search products..."
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                style={{ padding: '0.6rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white', flex: 1, minWidth: '200px' }}
              />
              <select
                value={tableCategory}
                onChange={e => { setTableCategory(e.target.value); setCurrentPage(1); }}
                style={{
                  padding: '0.6rem 2.5rem 0.6rem 1rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 10px center',
                  minWidth: '150px',
                  flex: 1,
                  outline: 'none'
                }}
              >
                <option value="all" style={{ background: '#0f172a', color: 'white' }}>All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id} style={{ background: '#0f172a', color: 'white' }}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <button onClick={() => setIsModalOpen(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                <Plus size={20} /> Add Product
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)', color: '#10B981', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '1rem' }}>Name</th>
                  <th style={{ padding: '1rem' }}>Category</th>
                  <th style={{ padding: '1rem' }}>Shelf Life</th>
                  <th style={{ padding: '1rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1.2rem 1rem', fontWeight: 500 }}>{p.name}</td>
                    <td style={{ padding: '1.2rem 1rem', color: '#94A3B8' }}>{p.category_name}</td>
                    <td style={{ padding: '1.2rem 1rem' }}>
                      <span style={{ fontSize: '0.85rem', color: '#CBD5E1', fontWeight: 500 }}>{p.shelf_life || '24 Months'}</span>
                    </td>
                    <td style={{ padding: '1.2rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <Edit onClick={() => openEditModal(p)} size={16} style={{ cursor: 'pointer', color: '#94A3B8' }} />
                        <Trash2 onClick={() => openDeleteModal(p)} size={16} style={{ cursor: 'pointer', color: '#EF4444' }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
            {Array.from({ length: Math.ceil(totalProducts / itemsPerPage) }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                style={{
                  width: '35px',
                  height: '35px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  background: currentPage === i + 1 ? '#10B981' : 'transparent',
                  color: currentPage === i + 1 ? 'white' : '#94A3B8',
                  cursor: 'pointer',
                  transition: '0.3s'
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="glass" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Recent Client Inquiries</h3>
          {inquiries.length > 0 ? (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)', color: '#10B981', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '1rem' }}>Client</th>
                      <th style={{ padding: '1rem' }}>Product Interest</th>
                      <th style={{ padding: '1rem' }}>Message Snippet</th>
                      <th style={{ padding: '1rem' }}>Contact</th>
                      <th style={{ padding: '1rem' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.map(inq => (
                      <tr
                        key={inq.id}
                        onClick={() => setSelectedInquiry(inq)}
                        style={{
                          borderBottom: '1px solid var(--border)',
                          cursor: 'pointer',
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '1.2rem 1rem' }}>
                          <div style={{ fontWeight: 700 }}>{inq.name}</div>
                          <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{inq.email}</div>
                        </td>
                        <td style={{ padding: '1.2rem 1rem' }}>
                          <span style={{ padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', fontSize: '0.85rem' }}>
                            {inq.product_name || 'General Inquiry'}
                          </span>
                        </td>
                        <td
                          style={{ padding: '1.2rem 1rem', color: '#94A3B8', fontSize: '0.9rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                          title="View full message"
                        >
                          {inq.message}
                        </td>
                        <td style={{ padding: '1.2rem 1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                            <Phone size={14} color="#10B981" /> {inq.phone}
                          </div>
                        </td>
                        <td style={{ padding: '1.2rem 1rem' }}>
                          <Eye
                            size={18}
                            style={{ color: '#10B981', opacity: 0.8 }}
                            title="View Details"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Inquiries Pagination */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
                {Array.from({ length: Math.ceil(totalInquiries / itemsPerPage) }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={(e) => { e.stopPropagation(); setInquiryPage(i + 1); }}
                    style={{
                      width: '35px',
                      height: '35px',
                      borderRadius: '6px',
                      border: '1px solid var(--border)',
                      background: inquiryPage === i + 1 ? '#10B981' : 'transparent',
                      color: inquiryPage === i + 1 ? 'white' : '#94A3B8',
                      cursor: 'pointer',
                      transition: '0.3s'
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#94A3B8' }}>
              <MessageSquare size={48} opacity={0.1} style={{ marginBottom: '1rem' }} />
              <p>No client inquiries found at this time.</p>
            </div>
          )}
        </div>
      )}

      {/* Inquiry Details Modal */}
      {selectedInquiry && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 10000, overflowY: 'auto', padding: '4rem 1rem' }}>
          <div className="glass" style={{ width: '90%', maxWidth: '700px', padding: '3rem', margin: '0 auto', border: '1px solid rgba(16, 185, 129, 0.4)', boxShadow: '0 0 50px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Inquiry Details</h2>
              <button onClick={() => setSelectedInquiry(null)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plus size={24} style={{ transform: 'rotate(45deg)' }} />
              </button>
            </div>

            <div style={{ display: 'grid', gap: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                <div>
                  <h4 style={{ color: '#10B981', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '1px', marginBottom: '0.5rem' }}>Client Name</h4>
                  <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>{selectedInquiry.name}</p>
                </div>
                <div>
                  <h4 style={{ color: '#10B981', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '1px', marginBottom: '0.5rem' }}>Product of Interest</h4>
                  <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>{selectedInquiry.product_name || 'General Inquiry'}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                <div>
                  <h4 style={{ color: '#94A3B8', textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '1px', marginBottom: '0.3rem' }}>Email</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10B981', fontWeight: 600 }}>
                    <Mail size={14} /> {selectedInquiry.email}
                  </div>
                </div>
                <div>
                  <h4 style={{ color: '#94A3B8', textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '1px', marginBottom: '0.3rem' }}>Phone</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10B981', fontWeight: 600 }}>
                    <Phone size={14} /> {selectedInquiry.phone}
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ color: '#10B981', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '1px', marginBottom: '1rem' }}>Message Content</h4>
                <div style={{
                  padding: '1.5rem',
                  background: 'rgba(255,255,255,0.01)',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  lineHeight: '1.7',
                  color: '#CBD5E1',
                  overflowWrap: 'break-word',
                  wordBreak: 'break-word',
                  fontSize: '1rem',
                  maxHeight: '300px',
                  overflowY: 'auto'
                }}>
                  {selectedInquiry.message}
                </div>
              </div>

              <button
                onClick={() => setSelectedInquiry(null)}
                className="btn-primary"
                style={{ width: '100%', padding: '1.2rem', fontSize: '1rem', letterSpacing: '1px' }}
              >
                CLOSE VIEW
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'var(--bg)', zIndex: 10000, overflowY: 'auto' }}>
          <div className="container" style={{ padding: '6rem 1.5rem', maxWidth: '1000px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem', borderBottom: '1px solid var(--border)', paddingBottom: '2rem' }}>
              <div>
                <h4 style={{ color: '#10B981', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>Management Console</h4>
                <h2 style={{ fontSize: '2.8rem', fontWeight: 800 }}>{editingProduct ? 'Edit Formulation' : 'Create New Product'}</h2>
              </div>
            </div>

            <form onSubmit={handleSubmitProduct}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Product Name</label>
                  <input required value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="e.g. Premium Whey Protein" style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white', fontSize: '1rem' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Category</label>
                  <select
                    required
                    value={newProduct.category_id}
                    onChange={e => setNewProduct({ ...newProduct, category_id: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '1rem 2.5rem 1rem 1rem',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '1rem',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 15px center'
                    }}
                  >
                    <option value="" disabled style={{ background: '#081221' }}>Select Category</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id} style={{ background: '#081221' }}>{cat.name}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Full Description</label>
                <textarea required rows={3} value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} placeholder="Describe the product use and advantages..." style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white', fontSize: '1rem', resize: 'none' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Key Benefits</label>
                  <input value={newProduct.benefits} onChange={e => setNewProduct({ ...newProduct, benefits: e.target.value })} placeholder="Energy, Muscle Recovery, etc. (comma separated)" style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white', fontSize: '1rem' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Active Ingredients</label>
                  <input value={newProduct.ingredients} onChange={e => setNewProduct({ ...newProduct, ingredients: e.target.value })} placeholder="e.g. 500mg Glutathione, 40mg Vitamin C" style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white', fontSize: '1rem' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Flavours Available</label>
                  <input value={newProduct.flavours} onChange={e => setNewProduct({ ...newProduct, flavours: e.target.value })} placeholder="Vanilla, Chocolate, Mango..." style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white', fontSize: '1rem' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Packaging Material</label>
                  <input value={newProduct.packing_material} onChange={e => setNewProduct({ ...newProduct, packing_material: e.target.value })} placeholder="Jar, Pouch, Tube..." style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white', fontSize: '1rem' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Packing Size</label>
                  <input value={newProduct.packing_size} onChange={e => setNewProduct({ ...newProduct, packing_size: e.target.value })} placeholder="1kg, 2kg, 30 Tab..." style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white', fontSize: '1rem' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Shelf Life</label>
                  <input value={newProduct.shelf_life} onChange={e => setNewProduct({ ...newProduct, shelf_life: e.target.value })} placeholder="24 Months" style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white', fontSize: '1rem' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>MOQ</label>
                  <input value={newProduct.moq} onChange={e => setNewProduct({ ...newProduct, moq: e.target.value })} placeholder="500 Units" style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white', fontSize: '1rem' }} />
                </div>
              </div>

              <div style={{ marginBottom: '3rem' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', color: '#10B981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Product Imagery {editingProduct && '(Optional)'}</label>
                <div className="glass" style={{ padding: '2rem', borderStyle: 'dashed', textAlign: 'center', borderColor: imageFile ? 'var(--primary)' : 'var(--border)' }}>
                  <input type="file" id="file-upload" accept="image/*" onChange={e => setImageFile(e.target.files[0])} style={{ display: 'none' }} />
                  <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={32} color={imageFile ? '#10B981' : '#94A3B8'} />
                    <span style={{ color: imageFile ? '#10B981' : '#94A3B8', fontWeight: 600 }}>{imageFile ? imageFile.name : 'Upload Product Mockup'}</span>
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                <button type="submit" className="btn-primary" style={{ flex: 2, padding: '1.2rem', fontSize: '1.1rem', letterSpacing: '1px', minWidth: '200px' }}>
                  {editingProduct ? 'UPDATE FORMULATION' : 'CREATE NEW PRODUCT'}
                </button>
                <button type="button" onClick={closeModal} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white', cursor: 'pointer', fontWeight: 700, minWidth: '150px', padding: '1rem' }}>
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
          <div className="glass" style={{ width: '90%', maxWidth: '400px', padding: '2.5rem', textAlign: 'center' }}>
            <div style={{ color: '#EF4444', marginBottom: '1.5rem' }}>
              <Trash2 size={48} />
            </div>
            <h2 style={{ marginBottom: '1rem' }}>Delete Product?</h2>
            <p style={{ color: '#94A3B8', marginBottom: '2rem' }}>
              Are you sure you want to delete <strong>{productToDelete?.name || 'this product'}</strong>? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={handleDeleteProduct}
                style={{ flex: 1, background: '#EF4444', border: 'none', borderRadius: '8px', color: 'white', padding: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Delete
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white', padding: '0.8rem', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
