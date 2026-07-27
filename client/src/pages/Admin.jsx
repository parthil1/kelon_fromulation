import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit, LogOut, Package, MessageSquare, Phone, Mail, Eye, X, ArrowLeft, Loader2, Tags } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import './Admin.css';

// Add Authorization header to all requests if token exists in localStorage
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
    is_featured: false,
    formulas: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [inquiryPage, setInquiryPage] = useState(1);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [copiedField, setCopiedField] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', slug: '' });
  const [categoryImageFile, setCategoryImageFile] = useState(null);
  const [categoryPreviewUrl, setCategoryPreviewUrl] = useState(null);
  const [isCompressingCategory, setIsCompressingCategory] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isCategoryDeleteModalOpen, setIsCategoryDeleteModalOpen] = useState(false);
  const [isSavingCategory, setIsSavingCategory] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [tableCategory, setTableCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalInquiries, setTotalInquiries] = useState(0);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingInquiries, setIsLoadingInquiries] = useState(false);
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
    if (isModalOpen || selectedInquiry || isDeleteModalOpen || isCategoryModalOpen || isCategoryDeleteModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isModalOpen, selectedInquiry, isDeleteModalOpen, isCategoryModalOpen, isCategoryDeleteModalOpen]);

  const fetchProducts = async () => {
    setIsLoadingProducts(true);
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
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const fetchInquiries = async () => {
    setIsLoadingInquiries(true);
    try {
      const params = { page: inquiryPage, limit: itemsPerPage };
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/inquiries`, { params });
      setInquiries(res.data.data || []);
      setTotalInquiries(res.data.total || 0);
    } catch (err) {
      console.error('Error fetching inquiries', err);
    } finally {
      setIsLoadingInquiries(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching categories', err);
      setCategories([]);
    }
  };

  const closeCategoryModal = () => {
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
    setCategoryForm({ name: '', description: '', slug: '' });
    setCategoryImageFile(null);
    if (categoryPreviewUrl && categoryPreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(categoryPreviewUrl);
    }
    setCategoryPreviewUrl(null);
  };

  const openCreateCategoryModal = () => {
    setEditingCategory(null);
    setCategoryForm({ name: '', description: '', slug: '' });
    setCategoryImageFile(null);
    if (categoryPreviewUrl && categoryPreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(categoryPreviewUrl);
    }
    setCategoryPreviewUrl(null);
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name || '',
      description: category.description || '',
      slug: category.slug || '',
    });
    setCategoryImageFile(null);
    if (categoryPreviewUrl && categoryPreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(categoryPreviewUrl);
    }
    setCategoryPreviewUrl(
      category.image_url ? `${import.meta.env.VITE_BASE_URL}${category.image_url}` : null
    );
    setIsCategoryModalOpen(true);
  };

  const handleCategoryImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (categoryPreviewUrl && categoryPreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(categoryPreviewUrl);
    }

    setIsCompressingCategory(true);
    try {
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      });
      setCategoryImageFile(compressedFile);
      setCategoryPreviewUrl(URL.createObjectURL(compressedFile));
    } catch (error) {
      console.error('Compression error:', error);
      setCategoryImageFile(file);
      setCategoryPreviewUrl(URL.createObjectURL(file));
    } finally {
      setIsCompressingCategory(false);
    }
  };

  const handleRemoveCategoryImage = () => {
    if (categoryPreviewUrl && categoryPreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(categoryPreviewUrl);
    }
    setCategoryImageFile(null);
    setCategoryPreviewUrl(null);
  };

  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    setIsSavingCategory(true);
    const formData = new FormData();
    formData.append('name', categoryForm.name);
    formData.append('description', categoryForm.description || '');
    if (categoryForm.slug.trim()) {
      formData.append('slug', categoryForm.slug.trim());
    }
    if (categoryImageFile) {
      formData.append('image', categoryImageFile);
    }

    try {
      if (editingCategory) {
        formData.append('_method', 'PUT');
        await axios.post(`${import.meta.env.VITE_API_URL}/categories/${editingCategory.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/categories`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      await fetchCategories();
      closeCategoryModal();
    } catch (err) {
      const message = err.response?.data?.message
        || (err.response?.data?.errors && Object.values(err.response.data.errors).flat().join('\n'))
        || 'Error saving category';
      alert(message);
    } finally {
      setIsSavingCategory(false);
    }
  };

  const openDeleteCategoryModal = (category) => {
    setCategoryToDelete(category);
    setIsCategoryDeleteModalOpen(true);
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/categories/${categoryToDelete.id}`);
      await fetchCategories();
      if (String(tableCategory) === String(categoryToDelete.id)) {
        setTableCategory('all');
        setCurrentPage(1);
      }
      setIsCategoryDeleteModalOpen(false);
      setCategoryToDelete(null);
    } catch (err) {
      const message = err.response?.data?.message || 'Error deleting category';
      alert(message);
    }
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
    if (imageFile) {
      formData.append('image', imageFile);
    } else if (!previewUrl) {
      formData.append('image_url', '');
    }

    try {
      if (editingProduct) {
        formData.append('_method', 'PUT');
        await axios.post(`${import.meta.env.VITE_API_URL}/products/${editingProduct.id}`, formData, {
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
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/products/${productToDelete.id}`);
        fetchProducts();
        setIsDeleteModalOpen(false);
        setProductToDelete(null);
      } catch (err) {
        alert('Error deleting product');
      }
    }
  };

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }

      setIsCompressing(true);

      const options = {
        maxSizeMB: 1,           // Max size 1MB
        maxWidthOrHeight: 1200, // Max dimensions 1200px
        useWebWorker: true,
      };

      try {
        const compressedFile = await imageCompression(file, options);
        setImageFile(compressedFile);
        const url = URL.createObjectURL(compressedFile);
        setPreviewUrl(url);
      } catch (error) {
        console.error('Compression error:', error);
        // Fallback to original file
        setImageFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleRemoveImage = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setImageFile(null);
    setPreviewUrl(null);
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
      is_featured: product.is_featured,
      formulas: product.formulas || ''
    });
    if (product.image_url) {
      setPreviewUrl(`${import.meta.env.VITE_BASE_URL}${product.image_url}`);
    } else {
      setPreviewUrl(null);
    }
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
      is_featured: false,
      formulas: ''
    });
    setImageFile(null);
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
  };

  if (!isLoggedIn) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-card">
          <span className="admin-login-brand">Kelon Formulation</span>
          <h1>Admin Console</h1>
          <p>Sign in to manage inventory, categories, and client inquiries.</p>
          <form onSubmit={handleLogin}>
            <div className="admin-field">
              <label htmlFor="admin-username">Username</label>
              <input
                id="admin-username"
                className="admin-input"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
            <div className="admin-field">
              <label htmlFor="admin-password">Password</label>
              <input
                id="admin-password"
                className="admin-input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            <button type="submit" className="btn-primary admin-login-submit">Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-shell">
        <header className="admin-header">
          <div className="admin-header-copy">
            <span className="admin-kicker">Management Console</span>
            <h1>Admin Dashboard</h1>
          </div>
          <div className="admin-header-actions">
            <button
              type="button"
              className="admin-signout"
              onClick={() => { localStorage.removeItem('token'); setIsLoggedIn(false); }}
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </header>

        <div className="admin-stats">
          <div className="admin-stat">
            <span className="admin-stat-value">{totalProducts}</span>
            <span className="admin-stat-label">Products</span>
          </div>
          <div className="admin-stat">
            <span className="admin-stat-value">{categories.length}</span>
            <span className="admin-stat-label">Categories</span>
          </div>
          <div className="admin-stat">
            <span className="admin-stat-value">{totalInquiries}</span>
            <span className="admin-stat-label">Inquiries</span>
          </div>
        </div>

        <nav className="admin-tabs" aria-label="Admin sections">
          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`}
          >
            <Package size={18} /> Inventory
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={`admin-tab ${activeTab === 'categories' ? 'active' : ''}`}
          >
            <Tags size={18} /> Categories
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('inquiries')}
            className={`admin-tab ${activeTab === 'inquiries' ? 'active' : ''}`}
          >
            <MessageSquare size={18} /> Inquiries
          </button>
        </nav>

      {activeTab === 'products' && (
        <div className="admin-panel">
          <div className="admin-toolbar">
            <h3>Active Inventory</h3>
            <div className="admin-toolbar-actions">
              <input
                className="admin-input"
                placeholder="Search products..."
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
              <select
                className="admin-select"
                value={tableCategory}
                onChange={e => { setTableCategory(e.target.value); setCurrentPage(1); }}
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <button type="button" onClick={() => setIsModalOpen(true)} className="btn-primary admin-btn-row">
                <Plus size={18} /> Add Product
              </button>
            </div>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Shelf Life</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingProducts ? (
                  <tr>
                    <td colSpan="5">
                      <div className="admin-loading">
                        <Loader2 className="animate-spin" size={28} color="var(--cta)" />
                        <span>Fetching inventory…</span>
                      </div>
                    </td>
                  </tr>
                ) : products.length > 0 ? (
                  products.map(p => (
                    <tr key={p.id}>
                      <td>
                        {p.image_url ? (
                          <div className="admin-thumb">
                            <img
                              src={`${import.meta.env.VITE_BASE_URL}${p.image_url}`}
                              alt={p.name}
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          </div>
                        ) : (
                          <div className="admin-thumb">
                            <Package size={18} color="var(--text-muted)" opacity={0.35} />
                          </div>
                        )}
                      </td>
                      <td className="admin-cell-strong">{p.name}</td>
                      <td className="admin-cell-muted">{p.category_name}</td>
                      <td>{p.shelf_life || '24 Months'}</td>
                      <td>
                        <div className="admin-actions">
                          <button type="button" className="admin-icon-btn" onClick={() => openEditModal(p)} title="Edit">
                            <Edit size={15} />
                          </button>
                          <button type="button" className="admin-icon-btn admin-icon-btn--danger" onClick={() => openDeleteModal(p)} title="Delete">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">
                      <div className="admin-empty">No formulations found in this category.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="admin-pagination">
            {Array.from({ length: Math.ceil(totalProducts / itemsPerPage) }, (_, i) => (
              <button
                key={i + 1}
                type="button"
                onClick={() => setCurrentPage(i + 1)}
                className={`admin-page-btn ${currentPage === i + 1 ? 'is-active' : ''}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="admin-panel">
          <div className="admin-toolbar">
            <h3>Product Categories</h3>
            <button type="button" onClick={openCreateCategoryModal} className="btn-primary admin-btn-row">
              <Plus size={18} /> Add Category
            </button>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Products</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length > 0 ? (
                  categories.map(cat => (
                    <tr key={cat.id}>
                      <td>
                        {cat.image_url ? (
                          <div className="admin-thumb">
                            <img
                              src={`${import.meta.env.VITE_BASE_URL}${cat.image_url}`}
                              alt={cat.name}
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          </div>
                        ) : (
                          <div className="admin-thumb">
                            <Tags size={18} color="var(--text-muted)" opacity={0.35} />
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="admin-cell-strong">{cat.name}</div>
                        {cat.description && <div className="admin-cell-sub">{cat.description}</div>}
                      </td>
                      <td className="admin-slug">{cat.slug}</td>
                      <td className="admin-cell-strong">{cat.products_count ?? 0}</td>
                      <td>
                        <div className="admin-actions">
                          <button type="button" className="admin-icon-btn" onClick={() => openEditCategoryModal(cat)} title="Edit">
                            <Edit size={15} />
                          </button>
                          <button type="button" className="admin-icon-btn admin-icon-btn--danger" onClick={() => openDeleteCategoryModal(cat)} title="Delete">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">
                      <div className="admin-empty">No categories yet. Create your first category to organize products.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'inquiries' && (
        <div className="admin-panel">
          <div className="admin-toolbar">
            <h3>Client Inquiries</h3>
          </div>
          {isLoadingInquiries ? (
            <div className="admin-loading-block">
              <Loader2 className="animate-spin" size={36} color="var(--cta)" />
              <h4>Loading communications</h4>
              <p>Retrieving latest client inquiries…</p>
            </div>
          ) : inquiries.length > 0 ? (
            <>
              <div className="admin-table-wrap">
                <table className="admin-table" style={{ minWidth: 800 }}>
                  <thead>
                    <tr>
                      <th>Client</th>
                      <th>Interest</th>
                      <th>Message</th>
                      <th>Contact</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.map(inq => (
                      <tr
                        key={inq.id}
                        className="is-clickable"
                        onClick={() => setSelectedInquiry(inq)}
                      >
                        <td>
                          <div className="admin-cell-strong">{inq.name}</div>
                          <div className="admin-cell-sub">{inq.email}</div>
                        </td>
                        <td>
                          <span className="admin-chip">{inq.product_name || 'General Inquiry'}</span>
                        </td>
                        <td className="admin-cell-muted" style={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title="View full message">
                          {inq.message}
                        </td>
                        <td>
                          <span className="admin-contact-line">
                            <Phone size={14} color="var(--cta)" /> {inq.phone}
                          </span>
                        </td>
                        <td>
                          <button type="button" className="admin-icon-btn admin-icon-btn--view" title="View details" onClick={(e) => { e.stopPropagation(); setSelectedInquiry(inq); }}>
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="admin-pagination">
                {Array.from({ length: Math.ceil(totalInquiries / itemsPerPage) }, (_, i) => (
                  <button
                    key={i + 1}
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setInquiryPage(i + 1); }}
                    className={`admin-page-btn ${inquiryPage === i + 1 ? 'is-active' : ''}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="admin-empty">
              <MessageSquare size={48} />
              <p>No client inquiries found at this time.</p>
            </div>
          )}
        </div>
      )}

      {/* Inquiry Details Modal */}
      {selectedInquiry && (
        <div className="admin-modal-backdrop">
          <div className="inq-modal-panel">
            <div className="inq-header">
              <div className="inq-title-group">
                <h4>Inquiry Insight</h4>
                <h2>Communication Hub</h2>
              </div>
              <button type="button" onClick={() => setSelectedInquiry(null)} className="inq-close-btn" title="Close Details">
                <X size={22} />
              </button>
            </div>

            <div className="inq-content-grid">
              <div className="inq-cards-row">
                <div className="inq-info-card card-sender">
                  <h4 className="inq-label">Sender Identity</h4>
                  <p className="sender-name">{selectedInquiry.name}</p>

                  <div className="contact-row" onClick={() => handleCopy(selectedInquiry.email, 'email')}>
                    <div className="contact-icon"><Mail size={18} /></div>
                    <div className="contact-info">
                      <span className="contact-label">Primary Email</span>
                      <span className="contact-value">{selectedInquiry.email}</span>
                    </div>
                    {copiedField === 'email' && <span className="admin-chip">COPIED</span>}
                  </div>

                  <div className="contact-row" onClick={() => handleCopy(selectedInquiry.phone, 'phone')}>
                    <div className="contact-icon"><Phone size={18} /></div>
                    <div className="contact-info">
                      <span className="contact-label">Mobile Contact</span>
                      <span className="contact-value">{selectedInquiry.phone}</span>
                    </div>
                    {copiedField === 'phone' && <span className="admin-chip">COPIED</span>}
                  </div>
                </div>

                <div className="inq-info-card card-interest">
                  <h4 className="inq-label">Project Interest</h4>
                  <div className="interest-content">
                    <div className="interest-icon-box">
                      <Package size={42} color="var(--cta)" />
                    </div>
                    <div className="interest-text">
                      <h3>{selectedInquiry.product_name || 'General Inquiry'}</h3>
                      <p>Catalogue Spec Formulation</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="message-section">
                <div className="message-section-title">
                  <h4>Detailed Conversation</h4>
                </div>
                <div className="inq-message-box">
                  {selectedInquiry.message}
                </div>
              </div>

              <div className="inq-modal-footer">
                <button
                  type="button"
                  onClick={() => setSelectedInquiry(null)}
                  className="btn-premium-close"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="admin-editor">
          <div className="admin-editor-inner">
            <button type="button" onClick={closeModal} className="admin-back">
              <ArrowLeft size={18} /> Back to inventory
            </button>
            <div className="admin-editor-header">
              <span className="admin-kicker">Management Console</span>
              <h2>{editingProduct ? 'Edit Formulation' : 'Create New Product'}</h2>
            </div>

            <form onSubmit={handleSubmitProduct}>
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label>Product Name</label>
                  <input required value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="e.g. Premium Whey Protein" />
                </div>
                <div className="admin-field">
                  <label>Category</label>
                  <select
                    required
                    value={newProduct.category_id}
                    onChange={e => setNewProduct({ ...newProduct, category_id: e.target.value })}
                  >
                    <option value="" disabled>Select Category</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="admin-field">
                <label>Full Description</label>
                <textarea required rows={3} value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} placeholder="Describe the product use and advantages..." />
              </div>

              <div className="admin-form-grid">
                <div className="admin-field">
                  <label>Key Benefits</label>
                  <input value={newProduct.benefits} onChange={e => setNewProduct({ ...newProduct, benefits: e.target.value })} placeholder="Energy, Muscle Recovery, etc. (comma separated)" />
                </div>
                <div className="admin-field">
                  <label>Active Ingredients</label>
                  <input value={newProduct.ingredients} onChange={e => setNewProduct({ ...newProduct, ingredients: e.target.value })} placeholder="e.g. 500mg Glutathione, 40mg Vitamin C" />
                </div>
              </div>

              <div className="admin-form-grid">
                <div className="admin-field">
                  <label>Flavours Available</label>
                  <input value={newProduct.flavours} onChange={e => setNewProduct({ ...newProduct, flavours: e.target.value })} placeholder="Vanilla, Chocolate, Mango..." />
                </div>
                <div className="admin-field">
                  <label>Packaging Material</label>
                  <input value={newProduct.packing_material} onChange={e => setNewProduct({ ...newProduct, packing_material: e.target.value })} placeholder="Jar, Pouch, Tube..." />
                </div>
              </div>

              <div className="admin-form-grid">
                <div className="admin-field">
                  <label>Packing Size</label>
                  <input value={newProduct.packing_size} onChange={e => setNewProduct({ ...newProduct, packing_size: e.target.value })} placeholder="1kg, 2kg, 30 Tab..." />
                </div>
                <div className="admin-field">
                  <label>Shelf Life</label>
                  <input value={newProduct.shelf_life} onChange={e => setNewProduct({ ...newProduct, shelf_life: e.target.value })} placeholder="24 Months" />
                </div>
                <div className="admin-field admin-form-span">
                  <label>MOQ</label>
                  <input value={newProduct.moq} onChange={e => setNewProduct({ ...newProduct, moq: e.target.value })} placeholder="500 Units" />
                </div>
              </div>

              <div className="admin-field">
                <label>Product Formulas (One per line)</label>
                <textarea
                  rows={5}
                  value={newProduct.formulas}
                  onChange={e => setNewProduct({ ...newProduct, formulas: e.target.value })}
                  placeholder={"Glutathione 500 mg + Astaxanthin 4 mg + ...\nGrape Seed Extract 10 mg + Aloe Vera Extract 10 mg + ..."}
                />
                <p className="admin-cell-sub" style={{ whiteSpace: 'normal', maxWidth: 'none' }}>Enter each formula on a new line to display them as a list on the product page.</p>
              </div>

              <div className="admin-field">
                <label>Product Imagery {editingProduct && '(Optional)'}</label>
                <label className="admin-upload">
                  <input type="file" accept="image/*" onChange={handleImageChange} />
                  {isCompressing ? (
                    <div className="admin-upload-placeholder">
                      <Loader2 size={28} className="animate-spin" color="var(--cta)" />
                      <span>Optimizing image…</span>
                    </div>
                  ) : previewUrl ? (
                    <div className="admin-upload-preview">
                      <img src={previewUrl} alt="Preview" />
                      <button
                        type="button"
                        className="admin-upload-remove"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRemoveImage(); }}
                        title="Remove Image"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="admin-upload-placeholder">
                      <Plus size={28} />
                      <span>Upload product mockup</span>
                    </div>
                  )}
                </label>
              </div>

              <div className="admin-form-actions">
                <button type="submit" className="btn-primary">
                  {editingProduct ? 'Update Formulation' : 'Create Product'}
                </button>
                <button type="button" onClick={closeModal} className="admin-btn-ghost">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="admin-modal-backdrop">
          <div className="admin-confirm">
            <div className="admin-confirm-icon">
              <Trash2 size={40} />
            </div>
            <h2>Delete Product?</h2>
            <p>
              Are you sure you want to delete <strong>{productToDelete?.name || 'this product'}</strong>? This action cannot be undone.
            </p>
            <div className="admin-confirm-actions">
              <button type="button" onClick={handleDeleteProduct} className="admin-btn-danger">
                Delete
              </button>
              <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="admin-btn-ghost">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Category Modal */}
      {isCategoryModalOpen && (
        <div className="admin-editor">
          <div className="admin-editor-inner admin-editor-inner--narrow">
            <button type="button" onClick={closeCategoryModal} className="admin-back">
              <ArrowLeft size={18} /> Back to categories
            </button>
            <div className="admin-editor-header">
              <span className="admin-kicker">Management Console</span>
              <h2>{editingCategory ? 'Edit Category' : 'Create Category'}</h2>
            </div>

            <form onSubmit={handleSubmitCategory}>
              <div className="admin-field">
                <label>Category Name</label>
                <input
                  required
                  value={categoryForm.name}
                  onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="e.g. Effervescent Tablets"
                />
              </div>

              <div className="admin-field">
                <label>Slug (optional)</label>
                <input
                  value={categoryForm.slug}
                  onChange={e => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                  placeholder="Auto-generated from name if left blank"
                />
              </div>

              <div className="admin-field">
                <label>Description</label>
                <textarea
                  rows={4}
                  value={categoryForm.description}
                  onChange={e => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  placeholder="Short description shown on the catalog..."
                />
              </div>

              <div className="admin-field">
                <label>Category Image</label>
                <label className="admin-upload">
                  <input type="file" accept="image/*" onChange={handleCategoryImageChange} />
                  {isCompressingCategory ? (
                    <div className="admin-upload-placeholder">
                      <Loader2 size={28} className="animate-spin" color="var(--cta)" />
                      <span>Optimizing image…</span>
                    </div>
                  ) : categoryPreviewUrl ? (
                    <div className="admin-upload-preview">
                      <img src={categoryPreviewUrl} alt="Category preview" />
                      <button
                        type="button"
                        className="admin-upload-remove"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRemoveCategoryImage(); }}
                        title="Remove Image"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="admin-upload-placeholder">
                      <Plus size={28} />
                      <span>Upload category image</span>
                    </div>
                  )}
                </label>
              </div>

              <div className="admin-form-actions">
                <button type="submit" className="btn-primary" disabled={isSavingCategory} style={{ opacity: isSavingCategory ? 0.7 : 1 }}>
                  {isSavingCategory ? 'Saving…' : (editingCategory ? 'Update Category' : 'Create Category')}
                </button>
                <button type="button" onClick={closeCategoryModal} className="admin-btn-ghost">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Category Confirmation */}
      {isCategoryDeleteModalOpen && (
        <div className="admin-modal-backdrop">
          <div className="admin-confirm">
            <div className="admin-confirm-icon">
              <Trash2 size={40} />
            </div>
            <h2>Delete Category?</h2>
            <p>
              Are you sure you want to delete <strong>{categoryToDelete?.name || 'this category'}</strong>?
              {(categoryToDelete?.products_count ?? 0) > 0
                ? ' Categories with products cannot be deleted until those products are moved or removed.'
                : ' This action cannot be undone.'}
            </p>
            <div className="admin-confirm-actions">
              <button type="button" onClick={handleDeleteCategory} className="admin-btn-danger">
                Delete
              </button>
              <button type="button" onClick={() => { setIsCategoryDeleteModalOpen(false); setCategoryToDelete(null); }} className="admin-btn-ghost">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Admin;
