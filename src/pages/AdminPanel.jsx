import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { categoryAPI, contactAPI, orderAPI, productAPI, userAPI } from '../services/api'
import { uploadToCloudinary } from '../utils/uploadToCloudinary'

const emptyProductForm = {
  id: '',
  name: '',
  price: '',
  category: '',
  desc: '',
  imgPrimary: '',
  imgHover: '',
}

const tabs = [
  { id: 'overview', label: 'Overview', icon: 'fa-chart-line' },
  { id: 'products', label: 'Products', icon: 'fa-spray-can-sparkles' },
  { id: 'orders', label: 'Orders', icon: 'fa-receipt' },
  { id: 'users', label: 'Clients', icon: 'fa-users' },
  { id: 'categories', label: 'Categories', icon: 'fa-layer-group' },
  { id: 'inquiries', label: 'Inquiries', icon: 'fa-envelope-open-text' },
]

const statusOptions = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString()}`
const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : 'N/A')
const getProductImage = (product) => product?.imgPrimary || product?.imgHover || ''
const getOrderStatus = (order) => order?.orderStatus || order?.status || 'pending'
const getOrderItems = (order) => order?.items || order?.orderItems || []
const getUserName = (user) => {
  if (!user) return 'N/A'
  return user.name || [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email || 'N/A'
}

function cx(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function AdminPanel() {
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState(null)
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [categories, setCategories] = useState([])
  const [inquiries, setInquiries] = useState([])
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [productModalOpen, setProductModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [productForm, setProductForm] = useState(emptyProductForm)
  const [savingProduct, setSavingProduct] = useState(false)
  const [uploadingField, setUploadingField] = useState('')
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [categoryName, setCategoryName] = useState('')

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      loadAdminData()
    }
  }, [isAuthenticated, user])

  const loadAdminData = async () => {
    setLoading(true)
    setError('')
    try {
      const [statsData, productsData, ordersData, usersData, categoriesData, inquiriesData] = await Promise.all([
        orderAPI.getOrderStats(),
        productAPI.getProducts({ limit: 100 }),
        orderAPI.getAllOrders({ limit: 100 }),
        userAPI.getAllUsers(),
        categoryAPI.getCategories(),
        contactAPI.getSubmissions(),
      ])

      setStats(statsData)
      setProducts(Array.isArray(productsData) ? productsData : [])
      setOrders(Array.isArray(ordersData) ? ordersData : [])
      setUsers(Array.isArray(usersData) ? usersData : [])
      setCategories(Array.isArray(categoriesData) ? categoriesData : [])
      setInquiries(Array.isArray(inquiriesData) ? inquiriesData : [])
    } catch (adminError) {
      setError(adminError.message || 'Unable to load admin data')
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = useMemo(() => {
    const normalized = query.toLowerCase()
    return products.filter((product) => {
      return (
        product.name?.toLowerCase().includes(normalized) ||
        product.desc?.toLowerCase().includes(normalized) ||
        String(product.id).includes(normalized)
      )
    })
  }, [products, query])

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus = statusFilter === 'all' || getOrderStatus(order) === statusFilter
      const normalized = query.toLowerCase()
      const matchesQuery =
        order._id?.toLowerCase().includes(normalized) ||
        getUserName(order.user).toLowerCase().includes(normalized) ||
        order.user?.email?.toLowerCase().includes(normalized)
      return matchesStatus && matchesQuery
    })
  }, [orders, query, statusFilter])

  const filteredUsers = useMemo(() => {
    const normalized = query.toLowerCase()
    return users.filter((client) => {
      return getUserName(client).toLowerCase().includes(normalized) || client.email?.toLowerCase().includes(normalized)
    })
  }, [users, query])

  const filteredInquiries = useMemo(() => {
    const normalized = query.toLowerCase()
    return inquiries.filter((item) => {
      return (
        item.name?.toLowerCase().includes(normalized) ||
        item.email?.toLowerCase().includes(normalized) ||
        item.service?.toLowerCase().includes(normalized)
      )
    })
  }, [inquiries, query])

  const openNewProduct = () => {
    setEditingProduct(null)
    setProductForm({
      ...emptyProductForm,
      id: products.length ? String(Math.max(...products.map((item) => Number(item.id) || 0)) + 1) : '1',
    })
    setProductModalOpen(true)
  }

  const openEditProduct = (product) => {
    setEditingProduct(product)
    setProductForm({
      id: product.id || '',
      name: product.name || '',
      price: product.price || '',
      category: product.category?._id || product.category || '',
      desc: product.desc || '',
      imgPrimary: product.imgPrimary || '',
      imgHover: product.imgHover || product.imgPrimary || '',
    })
    setProductModalOpen(true)
  }

  const closeProductModal = () => {
    setProductModalOpen(false)
    setEditingProduct(null)
    setProductForm(emptyProductForm)
    setUploadingField('')
  }

  const handleProductImageUpload = async (event, field) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadingField(field)
    try {
      const upload = await uploadToCloudinary(file, 'thirdeye/admin/products')
      setProductForm((current) => ({ ...current, [field]: upload.url }))
    } catch (uploadError) {
      alert(uploadError.message || 'Image upload failed')
    } finally {
      setUploadingField('')
      event.target.value = ''
    }
  }

  const saveProduct = async (event) => {
    event.preventDefault()
    setSavingProduct(true)
    try {
      const payload = {
        ...productForm,
        id: Number(productForm.id),
        category: productForm.category || undefined,
        imgHover: productForm.imgHover || productForm.imgPrimary,
      }

      if (editingProduct) {
        await productAPI.updateProduct(editingProduct.id, payload)
      } else {
        await productAPI.createProduct(payload)
      }

      closeProductModal()
      await loadAdminData()
    } catch (saveError) {
      alert(saveError.message || 'Failed to save product')
    } finally {
      setSavingProduct(false)
    }
  }

  const deleteProduct = async (product) => {
    if (!window.confirm(`Delete ${product.name}?`)) return
    try {
      await productAPI.deleteProduct(product.id)
      await loadAdminData()
    } catch (deleteError) {
      alert(deleteError.message || 'Failed to delete product')
    }
  }

  const updateOrderStatus = async (orderId, orderStatus) => {
    try {
      await orderAPI.updateOrderStatus(orderId, { orderStatus })
      await loadAdminData()
    } catch (statusError) {
      alert(statusError.message || 'Failed to update order status')
    }
  }

  const deleteOrder = async (order) => {
    if (!window.confirm(`Delete order ${order._id?.slice(-8)}?`)) return
    try {
      await orderAPI.deleteOrder(order._id)
      await loadAdminData()
      setSelectedOrder(null)
    } catch (deleteError) {
      alert(deleteError.message || 'Failed to delete order')
    }
  }

  const deleteUser = async (client) => {
    if (!window.confirm(`Delete ${getUserName(client)}?`)) return
    try {
      await userAPI.deleteUser(client._id)
      await loadAdminData()
    } catch (deleteError) {
      alert(deleteError.message || 'Failed to delete user')
    }
  }

  const openCategoryModal = (category = null) => {
    setEditingCategory(category)
    setCategoryName(category?.name || '')
    setCategoryModalOpen(true)
  }

  const saveCategory = async (event) => {
    event.preventDefault()
    try {
      if (editingCategory) {
        await categoryAPI.updateCategory(editingCategory._id, { name: categoryName })
      } else {
        await categoryAPI.createCategory({ name: categoryName })
      }
      setCategoryModalOpen(false)
      setEditingCategory(null)
      setCategoryName('')
      await loadAdminData()
    } catch (categoryError) {
      alert(categoryError.message || 'Failed to save category')
    }
  }

  const deleteCategory = async (category) => {
    if (!window.confirm(`Delete category ${category.name}?`)) return
    try {
      await categoryAPI.deleteCategory(category._id)
      await loadAdminData()
    } catch (deleteError) {
      alert(deleteError.message || 'Failed to delete category')
    }
  }

  const deleteInquiry = async (inquiry) => {
    if (!window.confirm(`Delete inquiry from ${inquiry.name}?`)) return
    try {
      await contactAPI.deleteSubmission(inquiry._id)
      await loadAdminData()
    } catch (deleteError) {
      alert(deleteError.message || 'Failed to delete inquiry')
    }
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090806] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border border-[#d4af37]/20 border-t-[#d4af37] mx-auto mb-5 animate-spin" />
          <p className="font-montserrat text-[10px] tracking-[.3em] uppercase text-[#d4af37]">Preparing atelier console</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0b0a08] text-white font-montserrat">
      <aside className="fixed left-0 top-0 hidden h-screen w-[280px] border-r border-[#d4af37]/15 bg-[#11100d] xl:flex xl:flex-col">
        <div className="px-8 py-8 border-b border-[#d4af37]/10">
          <p className="text-[10px] tracking-[.35em] uppercase text-[#a39282]">Third Eye Scent</p>
          <h1 className="font-cormorant text-[34px] leading-none text-[#d4af37] mt-3">Atelier Admin</h1>
        </div>
        <nav className="p-4 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cx(
                'w-full flex items-center gap-3 px-4 py-3 text-left text-[11px] tracking-[.16em] uppercase transition-all border',
                activeTab === tab.id
                  ? 'bg-[#d4af37] text-[#11100d] border-[#d4af37]'
                  : 'text-[#b9aa98] border-transparent hover:border-[#d4af37]/20 hover:text-white hover:bg-white/[.03]',
              )}
            >
              <i className={`fa-solid ${tab.icon} w-4`} />
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="mt-auto p-6 border-t border-[#d4af37]/10">
          <p className="text-[10px] tracking-[.18em] uppercase text-[#a39282]">Signed in as</p>
          <p className="font-cormorant text-xl text-white mt-1">{getUserName(user)}</p>
          <p className="text-[11px] text-[#d4af37] mt-1">{user?.email}</p>
        </div>
      </aside>

      <main className="xl:pl-[280px]">
        <header className="sticky top-0 z-30 border-b border-[#d4af37]/10 bg-[#0b0a08]/95 backdrop-blur px-4 md:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <p className="text-[10px] tracking-[.32em] uppercase text-[#a39282]">Operations Console</p>
              <h2 className="font-cormorant text-[34px] md:text-[42px] text-white leading-none mt-1">
                {tabs.find((tab) => tab.id === activeTab)?.label}
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <div className="relative min-w-[260px]">
                <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-[#a39282]" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search console..."
                  className="w-full bg-[#15130f] border border-[#d4af37]/15 text-white pl-9 pr-4 py-3 text-xs outline-none focus:border-[#d4af37]/70"
                />
              </div>
              <button
                onClick={loadAdminData}
                className="inline-flex items-center justify-center gap-2 bg-[#d4af37] text-[#11100d] px-5 py-3 text-[10px] font-semibold tracking-[.2em] uppercase"
              >
                <i className="fa-solid fa-rotate" />
                Refresh
              </button>
            </div>
          </div>
          <div className="xl:hidden flex gap-2 overflow-x-auto pt-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cx(
                  'shrink-0 px-4 py-2 text-[10px] tracking-[.15em] uppercase border',
                  activeTab === tab.id ? 'bg-[#d4af37] text-[#11100d] border-[#d4af37]' : 'border-[#d4af37]/15 text-[#b9aa98]',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </header>

        <div className="px-4 md:px-8 py-8">
          {error && (
            <div className="mb-6 border border-[#e35f5f]/35 bg-[#e35f5f]/10 text-[#ffb0b0] px-4 py-3 text-xs">
              {error}
            </div>
          )}

          {activeTab === 'overview' && (
            <Overview stats={stats} products={products} orders={orders} users={users} inquiries={inquiries} />
          )}

          {activeTab === 'products' && (
            <ProductsView products={filteredProducts} onAdd={openNewProduct} onEdit={openEditProduct} onDelete={deleteProduct} />
          )}

          {activeTab === 'orders' && (
            <OrdersView
              orders={filteredOrders}
              statusFilter={statusFilter}
              onStatusFilter={setStatusFilter}
              onStatusUpdate={updateOrderStatus}
              onView={setSelectedOrder}
              onDelete={deleteOrder}
            />
          )}

          {activeTab === 'users' && <UsersView users={filteredUsers} onDelete={deleteUser} />}

          {activeTab === 'categories' && (
            <CategoriesView categories={categories} onAdd={() => openCategoryModal()} onEdit={openCategoryModal} onDelete={deleteCategory} />
          )}

          {activeTab === 'inquiries' && <InquiriesView inquiries={filteredInquiries} onDelete={deleteInquiry} />}
        </div>
      </main>

      {productModalOpen && (
        <ProductModal
          form={productForm}
          setForm={setProductForm}
          categories={categories}
          editingProduct={editingProduct}
          saving={savingProduct}
          uploadingField={uploadingField}
          onUpload={handleProductImageUpload}
          onSave={saveProduct}
          onClose={closeProductModal}
        />
      )}

      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={saveCategory} className="w-full max-w-md bg-[#11100d] border border-[#d4af37]/20 p-6">
            <h3 className="font-cormorant text-3xl text-[#d4af37] mb-5">
              {editingCategory ? 'Edit Category' : 'New Category'}
            </h3>
            <Field label="Category Name">
              <input
                value={categoryName}
                onChange={(event) => setCategoryName(event.target.value)}
                className="admin-input"
                required
              />
            </Field>
            <div className="flex gap-3 mt-6">
              <button type="submit" className="admin-primary-btn flex-1">
                Save
              </button>
              <button type="button" onClick={() => setCategoryModalOpen(false)} className="admin-secondary-btn flex-1">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {selectedOrder && (
        <OrderDrawer order={selectedOrder} onClose={() => setSelectedOrder(null)} onDelete={deleteOrder} />
      )}
    </div>
  )
}

function Overview({ stats, products, orders, users, inquiries }) {
  const revenue = stats?.totalRevenue || orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0)
  const recentOrders = orders.slice(0, 5)
  const pendingOrders = orders.filter((order) => getOrderStatus(order) === 'pending').length

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <Metric icon="fa-indian-rupee-sign" label="Revenue" value={formatCurrency(revenue)} />
        <Metric icon="fa-receipt" label="Orders" value={orders.length} accent={`${pendingOrders} pending`} />
        <Metric icon="fa-spray-can-sparkles" label="Products" value={products.length} />
        <Metric icon="fa-users" label="Clients" value={users.length} />
        <Metric icon="fa-envelope" label="Inquiries" value={inquiries.length} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.4fr)_minmax(280px,.8fr)] gap-6">
        <section className="admin-panel min-w-0 overflow-hidden">
          <div className="admin-section-head">
            <div>
              <p className="admin-kicker">Live Commerce</p>
              <h3 className="admin-title">Recent Orders</h3>
            </div>
          </div>
          <Table className="admin-table-scroll">
            <thead>
              <tr>
                <Th>Order</Th>
                <Th>Client</Th>
                <Th>Status</Th>
                <Th>Total</Th>
                <Th>Date</Th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order._id} className="admin-row">
                  <Td>#{order._id?.slice(-8)}</Td>
                  <Td>{getUserName(order.user)}</Td>
                  <Td>
                    <StatusBadge status={getOrderStatus(order)} />
                  </Td>
                  <Td>{formatCurrency(order.totalAmount)}</Td>
                  <Td>{formatDate(order.createdAt)}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </section>

        <section className="admin-panel min-w-0 overflow-hidden">
          <p className="admin-kicker">Inventory Story</p>
          <h3 className="admin-title mb-5 break-words">Product Highlights</h3>
          <div className="space-y-4">
            {products.slice(0, 4).map((product) => (
              <div key={product._id || product.id} className="flex min-w-0 gap-4 items-center border border-[#d4af37]/10 bg-white/[.025] p-3 overflow-hidden">
                <img src={getProductImage(product)} alt={product.name} className="w-14 h-16 shrink-0 object-cover bg-[#0b0a08]" />
                <div className="min-w-0 flex-1 overflow-hidden">
                  <p className="font-cormorant text-lg text-white truncate">{product.name}</p>
                  <p className="text-[11px] text-[#d4af37] truncate">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

function ProductsView({ products, onAdd, onEdit, onDelete }) {
  return (
    <section className="admin-panel">
      <div className="admin-section-head">
        <div>
          <p className="admin-kicker">Catalog Atelier</p>
          <h3 className="admin-title">Products</h3>
        </div>
        <button onClick={onAdd} className="admin-primary-btn">
          <i className="fa-solid fa-plus" />
          Add Product
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
        {products.map((product) => (
          <article key={product._id || product.id} className="border border-[#d4af37]/12 bg-[#0d0c09]">
            <div className="aspect-[4/3] bg-[#15130f] overflow-hidden">
              <img src={getProductImage(product)} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] tracking-[.22em] uppercase text-[#a39282]">ID {product.id}</p>
                  <h4 className="font-cormorant text-2xl text-white mt-1">{product.name}</h4>
                </div>
                <p className="text-[#d4af37] text-sm font-semibold">{product.price}</p>
              </div>
              <p className="text-xs leading-6 text-[#b9aa98] mt-4 line-clamp-3">{product.desc}</p>
              <div className="flex gap-2 mt-5">
                <button onClick={() => onEdit(product)} className="admin-secondary-btn flex-1">
                  <i className="fa-solid fa-pen" />
                  Edit
                </button>
                <button onClick={() => onDelete(product)} className="admin-danger-btn">
                  <i className="fa-solid fa-trash" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function OrdersView({ orders, statusFilter, onStatusFilter, onStatusUpdate, onView, onDelete }) {
  return (
    <section className="admin-panel">
      <div className="admin-section-head">
        <div>
          <p className="admin-kicker">Fulfillment Desk</p>
          <h3 className="admin-title">Orders</h3>
        </div>
        <select value={statusFilter} onChange={(event) => onStatusFilter(event.target.value)} className="admin-input max-w-[220px]">
          <option value="all">All Statuses</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
      <Table>
        <thead>
          <tr>
            <Th>Order</Th>
            <Th>Client</Th>
            <Th>Items</Th>
            <Th>Total</Th>
            <Th>Status</Th>
            <Th>Date</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="admin-row">
              <Td>#{order._id?.slice(-8)}</Td>
              <Td>{getUserName(order.user)}</Td>
              <Td>{getOrderItems(order).length}</Td>
              <Td>{formatCurrency(order.totalAmount)}</Td>
              <Td>
                <select
                  value={getOrderStatus(order)}
                  onChange={(event) => onStatusUpdate(order._id, event.target.value)}
                  className="bg-[#0b0a08] border border-[#d4af37]/20 text-white px-3 py-2 text-[11px] outline-none"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </Td>
              <Td>{formatDate(order.createdAt)}</Td>
              <Td>
                <div className="flex gap-2">
                  <button onClick={() => onView(order)} className="admin-icon-btn">
                    <i className="fa-solid fa-eye" />
                  </button>
                  <button onClick={() => onDelete(order)} className="admin-icon-btn text-[#ff8c8c]">
                    <i className="fa-solid fa-trash" />
                  </button>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </section>
  )
}

function UsersView({ users, onDelete }) {
  return (
    <section className="admin-panel">
      <div className="admin-section-head">
        <div>
          <p className="admin-kicker">Client Registry</p>
          <h3 className="admin-title">Clients</h3>
        </div>
      </div>
      <Table>
        <thead>
          <tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Phone</Th>
            <Th>Role</Th>
            <Th>Joined</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {users.map((client) => (
            <tr key={client._id} className="admin-row">
              <Td>{getUserName(client)}</Td>
              <Td>{client.email}</Td>
              <Td>{client.phone || 'N/A'}</Td>
              <Td>
                <span className={cx('px-3 py-1 text-[10px] tracking-[.15em] uppercase', client.role === 'admin' ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'bg-white/5 text-[#b9aa98]')}>
                  {client.role}
                </span>
              </Td>
              <Td>{formatDate(client.createdAt)}</Td>
              <Td>
                {client.role !== 'admin' && (
                  <button onClick={() => onDelete(client)} className="admin-icon-btn text-[#ff8c8c]">
                    <i className="fa-solid fa-trash" />
                  </button>
                )}
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </section>
  )
}

function CategoriesView({ categories, onAdd, onEdit, onDelete }) {
  return (
    <section className="admin-panel">
      <div className="admin-section-head">
        <div>
          <p className="admin-kicker">Collection Taxonomy</p>
          <h3 className="admin-title">Categories</h3>
        </div>
        <button onClick={onAdd} className="admin-primary-btn">
          <i className="fa-solid fa-plus" />
          Add Category
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {categories.map((category) => (
          <article key={category._id} className="border border-[#d4af37]/15 bg-[#0d0c09] p-5">
            <p className="text-[10px] tracking-[.2em] uppercase text-[#a39282]">Category</p>
            <h4 className="font-cormorant text-2xl text-white mt-2">{category.name}</h4>
            <p className="text-xs text-[#b9aa98] mt-2">Created {formatDate(category.createdAt)}</p>
            <div className="flex gap-2 mt-5">
              <button onClick={() => onEdit(category)} className="admin-secondary-btn flex-1">
                Edit
              </button>
              <button onClick={() => onDelete(category)} className="admin-danger-btn">
                <i className="fa-solid fa-trash" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function InquiriesView({ inquiries, onDelete }) {
  return (
    <section className="admin-panel">
      <div className="admin-section-head">
        <div>
          <p className="admin-kicker">Concierge Inbox</p>
          <h3 className="admin-title">Contact Submissions</h3>
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {inquiries.map((inquiry) => (
          <article key={inquiry._id} className="border border-[#d4af37]/15 bg-[#0d0c09] p-5">
            <div className="flex justify-between gap-4">
              <div>
                <p className="font-cormorant text-2xl text-white">{inquiry.name}</p>
                <p className="text-[11px] text-[#d4af37] mt-1">{inquiry.service}</p>
              </div>
              <button onClick={() => onDelete(inquiry)} className="admin-icon-btn text-[#ff8c8c]">
                <i className="fa-solid fa-trash" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-xs text-[#b9aa98]">
              <p>{inquiry.email}</p>
              <p>{inquiry.phone}</p>
            </div>
            <p className="text-sm leading-7 text-white/80 mt-4">{inquiry.message}</p>
            <p className="text-[10px] tracking-[.15em] uppercase text-[#a39282] mt-4">{formatDate(inquiry.createdAt)}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function ProductModal({ form, setForm, categories, editingProduct, saving, uploadingField, onUpload, onSave, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <form onSubmit={onSave} className="w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-[#11100d] border border-[#d4af37]/20">
        <div className="sticky top-0 z-10 bg-[#11100d] border-b border-[#d4af37]/10 px-6 py-5 flex items-center justify-between">
          <div>
            <p className="admin-kicker">Product Studio</p>
            <h3 className="font-cormorant text-3xl text-[#d4af37]">{editingProduct ? 'Edit Product' : 'Create Product'}</h3>
          </div>
          <button type="button" onClick={onClose} className="admin-icon-btn">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_.8fr] gap-6 p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-[.35fr_1fr] gap-4">
              <Field label="Product ID">
                <input value={form.id} onChange={(event) => setForm({ ...form, id: event.target.value })} className="admin-input" required />
              </Field>
              <Field label="Product Name">
                <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="admin-input" required />
              </Field>
            </div>
            <Field label="Price">
              <input value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} className="admin-input" placeholder="4800 or ₹4,800" required />
            </Field>
            <Field label="Category">
              <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="admin-input">
                <option value="">Uncategorized</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Description">
              <textarea value={form.desc} onChange={(event) => setForm({ ...form, desc: event.target.value })} className="admin-input min-h-[180px]" required />
            </Field>
            <ImageUploadField
              label="Primary Image"
              field="imgPrimary"
              value={form.imgPrimary}
              uploadingField={uploadingField}
              onTextChange={(value) => setForm({ ...form, imgPrimary: value })}
              onUpload={onUpload}
            />
            <ImageUploadField
              label="Hover Image"
              field="imgHover"
              value={form.imgHover}
              uploadingField={uploadingField}
              onTextChange={(value) => setForm({ ...form, imgHover: value })}
              onUpload={onUpload}
            />
          </div>

          <div className="border border-[#d4af37]/12 bg-[#0b0a08] p-5 h-fit">
            <p className="admin-kicker">Preview</p>
            <div className="mt-4 aspect-[4/5] bg-[#15130f] overflow-hidden">
              {form.imgPrimary ? (
                <img src={form.imgPrimary} alt={form.name || 'Product preview'} className="w-full h-full object-cover" />
              ) : (
                <div className="h-full flex items-center justify-center text-[#a39282] text-xs tracking-[.2em] uppercase">
                  Awaiting Image
                </div>
              )}
            </div>
            <h4 className="font-cormorant text-3xl text-white mt-5">{form.name || 'Untitled Scent'}</h4>
            <p className="text-[#d4af37] text-sm mt-1">{form.price || 'Price pending'}</p>
            <p className="text-sm leading-7 text-[#b9aa98] mt-4">{form.desc || 'Product description will appear here.'}</p>
          </div>
        </div>

        <div className="border-t border-[#d4af37]/10 px-6 py-5 flex flex-col sm:flex-row gap-3 justify-end">
          <button type="button" onClick={onClose} className="admin-secondary-btn">
            Cancel
          </button>
          <button type="submit" disabled={saving || Boolean(uploadingField)} className="admin-primary-btn disabled:opacity-50">
            {saving ? 'Saving...' : editingProduct ? 'Update Product' : 'Publish Product'}
          </button>
        </div>
      </form>
    </div>
  )
}

function ImageUploadField({ label, field, value, uploadingField, onTextChange, onUpload }) {
  const isUploading = uploadingField === field

  return (
    <Field label={label}>
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
        <input value={value} onChange={(event) => onTextChange(event.target.value)} className="admin-input" placeholder="Upload or paste image URL" required={field === 'imgPrimary'} />
        <label className="admin-secondary-btn cursor-pointer justify-center">
          <input type="file" accept="image/*" onChange={(event) => onUpload(event, field)} className="hidden" />
          <i className={cx('fa-solid', isUploading ? 'fa-spinner animate-spin' : 'fa-cloud-arrow-up')} />
          {isUploading ? 'Uploading' : 'Upload'}
        </label>
      </div>
    </Field>
  )
}

function OrderDrawer({ order, onClose, onDelete }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex justify-end">
      <aside className="w-full max-w-xl h-full overflow-y-auto bg-[#11100d] border-l border-[#d4af37]/20 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="admin-kicker">Order Detail</p>
            <h3 className="font-cormorant text-3xl text-[#d4af37]">#{order._id?.slice(-8)}</h3>
          </div>
          <button onClick={onClose} className="admin-icon-btn">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <Detail label="Client" value={getUserName(order.user)} />
          <Detail label="Status" value={getOrderStatus(order)} />
          <Detail label="Payment" value={order.paymentStatus || 'pending'} />
          <Detail label="Total" value={formatCurrency(order.totalAmount)} />
        </div>

        <div className="mt-6">
          <p className="admin-kicker mb-3">Items</p>
          <div className="space-y-3">
            {getOrderItems(order).map((item, index) => (
              <div key={`${item.name}-${index}`} className="flex justify-between gap-4 border border-[#d4af37]/10 bg-white/[.025] p-3">
                <div>
                  <p className="text-sm text-white">{item.name}</p>
                  <p className="text-[11px] text-[#a39282]">Qty {item.quantity}</p>
                </div>
                <p className="text-[#d4af37] text-sm">{formatCurrency(item.price)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="admin-kicker mb-3">Shipping</p>
          <div className="border border-[#d4af37]/10 bg-white/[.025] p-4 text-sm leading-7 text-[#b9aa98]">
            <p className="text-white">{order.shippingAddress?.name || getUserName(order.user)}</p>
            <p>{order.shippingAddress?.addressLine1 || order.shippingAddress?.address}</p>
            <p>
              {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pinCode}
            </p>
            <p>{order.shippingAddress?.country}</p>
          </div>
        </div>

        <button onClick={() => onDelete(order)} className="admin-danger-btn w-full justify-center mt-6">
          <i className="fa-solid fa-trash" />
          Delete Order
        </button>
      </aside>
    </div>
  )
}

function Metric({ icon, label, value, accent }) {
  return (
    <div className="border border-[#d4af37]/15 bg-[#11100d] p-5">
      <div className="flex items-center justify-between">
        <i className={`fa-solid ${icon} text-[#d4af37]`} />
        {accent && <span className="text-[10px] text-[#a39282]">{accent}</span>}
      </div>
      <p className="text-[10px] tracking-[.2em] uppercase text-[#a39282] mt-5">{label}</p>
      <p className="font-cormorant text-3xl text-white mt-1">{value}</p>
    </div>
  )
}

function StatusBadge({ status }) {
  const tone = {
    delivered: 'bg-emerald-500/15 text-emerald-300',
    pending: 'bg-yellow-500/15 text-yellow-300',
    cancelled: 'bg-red-500/15 text-red-300',
    shipped: 'bg-blue-500/15 text-blue-300',
    processing: 'bg-indigo-500/15 text-indigo-300',
    confirmed: 'bg-[#d4af37]/15 text-[#d4af37]',
  }
  return <span className={cx('px-3 py-1 text-[10px] tracking-[.14em] uppercase', tone[status] || tone.pending)}>{status}</span>
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-[10px] tracking-[.2em] uppercase text-[#a39282] mb-2">{label}</span>
      {children}
    </label>
  )
}

function Detail({ label, value }) {
  return (
    <div className="border border-[#d4af37]/10 bg-white/[.025] p-4">
      <p className="text-[10px] tracking-[.2em] uppercase text-[#a39282]">{label}</p>
      <p className="text-sm text-white mt-2 capitalize">{value || 'N/A'}</p>
    </div>
  )
}

function Table({ children, className = '' }) {
  return <div className={cx('overflow-x-auto', className)}><table className="w-full min-w-[760px]">{children}</table></div>
}

function Th({ children }) {
  return <th className="text-left text-[10px] tracking-[.18em] uppercase text-[#a39282] font-medium py-3 px-4 border-b border-[#d4af37]/10">{children}</th>
}

function Td({ children }) {
  return <td className="py-4 px-4 text-sm text-[#e8dfd2] border-b border-[#d4af37]/8">{children}</td>
}
