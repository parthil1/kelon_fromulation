import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit, LogOut, Package, MessageSquare } from 'lucide-react';

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
    category_id: 1,
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

  const [searchTerm, setSearchTerm] = useState('');
  const [tableCategory, setTableCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
      fetchCategories();
    }
  }, [isLoggedIn]);

  const fetchData = async () => {
    try {
      const prodRes = await axios.get(`${import.meta.env.VITE_API_URL}/products`);
      const inqRes = await axios.get(`${import.meta.env.VITE_API_URL}/inquiries`);
      setProducts(prodRes.data);
      setInquiries(inqRes.data);
    } catch (err) {
      console.error('Error fetching data', err);
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
      fetchData();
      closeModal();
    } catch (err) {
      alert('Error saving product');
    }
  };

  const handleDeleteProduct = async () => {
    if (productToDelete) {
      await axios.delete(`${import.meta.env.VITE_API_URL}/products/${productToDelete.id}`);
      fetchData();
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
      category_id: 1, 
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
      <div className="container" style={{ paddingTop: '10rem', maxWidth: '400px' }}>
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
    <div className="container" style={{ paddingTop: '8rem' }}>
      <div className="glass" style={{ padding: '2rem', marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
           <h4 style={{ color: '#10B981', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '2px', marginBottom: '0.5rem' }}>Management Console</h4>
           <h1 style={{ fontSize: '2.5rem' }}>Admin Dashboard</h1>
        </div>
        <button onClick={() => { localStorage.removeItem('token'); setIsLoggedIn(false); }} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#EF4444', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, transition: '0.3s' }}>
          <LogOut size={18} /> Sign Out
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
        <button 
          onClick={() => setActiveTab('products')} 
          style={{ 
            padding: '1rem 2rem', 
            borderRadius: '12px',
            border: '1px solid var(--border)',
            background: activeTab === 'products' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.02)',
            color: activeTab === 'products' ? '#10B981' : '#94A3B8',
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.8rem',
            fontWeight: 600,
            transition: 'all 0.3s'
          }}
        >
          <Package size={20} /> Inventory
        </button>
        <button 
          onClick={() => setActiveTab('inquiries')} 
          style={{ 
            padding: '1rem 2rem', 
            borderRadius: '12px',
            border: '1px solid var(--border)',
            background: activeTab === 'inquiries' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.02)',
            color: activeTab === 'inquiries' ? '#10B981' : '#94A3B8',
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.8rem',
            fontWeight: 600,
            transition: 'all 0.3s'
          }}
        >
          <MessageSquare size={20} /> Client Inquiries
        </button>
      </div>

      {activeTab === 'products' ? (
        <div className="glass" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem' }}>Active Inventory</h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
               <input 
                 placeholder="Search products..." 
                 value={searchTerm}
                 onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                 style={{ padding: '0.6rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white', width: '250px' }}
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
                   minWidth: '180px',
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
               <button onClick={() => setIsModalOpen(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none', cursor: 'pointer' }}>
                  <Plus size={20} /> Add Product
               </button>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)', color: '#10B981', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '1rem' }}>Name</th>
                <th style={{ padding: '1rem' }}>Category</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products
                .filter(p => {
                  const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesCategory = tableCategory === 'all' || p.category_id === parseInt(tableCategory);
                  return matchesSearch && matchesCategory;
                })
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1.2rem 1rem', fontWeight: 500 }}>{p.name}</td>
                  <td style={{ padding: '1.2rem 1rem', color: '#94A3B8' }}>{p.category_name}</td>
                  <td style={{ padding: '1.2rem 1rem' }}>
                    <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>Active</span>
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

          {/* Pagination Controls */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
            {Array.from({ length: Math.ceil(products.filter(p => {
              const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
              const matchesCategory = tableCategory === 'all' || p.category_id === parseInt(tableCategory);
              return matchesSearch && matchesCategory;
            }).length / itemsPerPage) }, (_, i) => (
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
          <h3 style={{ marginBottom: '1.5rem' }}>Recent Inquiries</h3>
          {inquiries.map(inq => (
            <div key={inq.id} className="glass" style={{ padding: '1.5rem', marginBottom: '1rem', border: 'none', background: 'rgba(255,255,255,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong style={{ fontSize: '1.1rem' }}>{inq.name}</strong>
                <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>{inq.status}</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#94A3B8' }}>{inq.message}</p>
              <div style={{ marginTop: '0.8rem', fontSize: '0.8rem', color: '#94A3B8', display: 'flex', gap: '1.5rem' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Mail size={14} /> {inq.email}</div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Phone size={14} /> {inq.phone}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
          <div className="glass" style={{ width: '90%', maxWidth: '700px', padding: '2.5rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: '2rem' }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmitProduct}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.5rem' }}>Product Name</label>
                  <input value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.5rem' }}>Category</label>
                  <select 
                    value={newProduct.category_id} 
                    onChange={e => setNewProduct({...newProduct, category_id: e.target.value})}
                    style={{ 
                      width: '100%', 
                      padding: '0.8rem 2.5rem 0.8rem 1rem', 
                      background: 'rgba(255,255,255,0.05)', 
                      border: '1px solid var(--border)', 
                      borderRadius: '8px', 
                      color: 'white', 
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 15px center'
                    }}
                  >
                    {categories.map(cat => <option key={cat.id} value={cat.id} style={{ background: '#081221' }}>{cat.name}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.5rem' }}>Full Description</label>
                <textarea rows={3} value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.5rem' }}>Key Benefits (comma separated)</label>
                  <input value={newProduct.benefits} onChange={e => setNewProduct({...newProduct, benefits: e.target.value})} placeholder="e.g. Energy, Immunity, Health" style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.5rem' }}>Active Ingredients</label>
                  <input value={newProduct.ingredients} onChange={e => setNewProduct({...newProduct, ingredients: e.target.value})} placeholder="e.g. Vitamin C, Zinc, Biotin" style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.5rem' }}>Flavours Available</label>
                  <input value={newProduct.flavours} onChange={e => setNewProduct({...newProduct, flavours: e.target.value})} placeholder="e.g. Orange, Lemon, Strawberry" style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.5rem' }}>Packing Material</label>
                  <input value={newProduct.packing_material} onChange={e => setNewProduct({...newProduct, packing_material: e.target.value})} placeholder="e.g. Tube pack, HDPE Bottle" style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.5rem' }}>Packing Size</label>
                  <input value={newProduct.packing_size} onChange={e => setNewProduct({...newProduct, packing_size: e.target.value})} placeholder="e.g. 10 Tab, 20 Tab" style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.5rem' }}>Shelf Life</label>
                  <input value={newProduct.shelf_life} onChange={e => setNewProduct({...newProduct, shelf_life: e.target.value})} placeholder="e.g. 18 Months" style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.5rem' }}>Min Order Qty (MOQ)</label>
                  <input value={newProduct.moq} onChange={e => setNewProduct({...newProduct, moq: e.target.value})} placeholder="e.g. 2000 Units" style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }} />
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.5rem' }}>Product Mockup Image {editingProduct && '(Optional)'}</label>
                <div className="glass" style={{ padding: '1rem', borderStyle: 'dashed' }}>
                  <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} style={{ color: '#94A3B8' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, border: 'none', cursor: 'pointer' }}>{editingProduct ? 'Save Changes' : 'Create Product'}</button>
                <button type="button" onClick={closeModal} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>Cancel</button>
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
