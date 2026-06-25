import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import {
  bannerAPI,
  categoryAPI,
  contactAPI,
  couponAPI,
  menuAPI,
  newsletterAPI,
  orderAPI,
  pageAPI,
  productAPI,
  settingsAPI,
  userAPI,
} from '../services/api'
import { uploadToCloudinary } from '../utils/uploadToCloudinary'

const tabs = [
  { id: 'overview', label: 'Overview', eyebrow: 'Command center', icon: 'fa-grid-2' },
  { id: 'products', label: 'Products', eyebrow: 'Commerce', icon: 'fa-spray-can-sparkles' },
  { id: 'orders', label: 'Orders', eyebrow: 'Commerce', icon: 'fa-bag-shopping' },
  { id: 'categories', label: 'Categories', eyebrow: 'Commerce', icon: 'fa-layer-group' },
  { id: 'banners', label: 'Banners', eyebrow: 'Website', icon: 'fa-panorama' },
  { id: 'pages', label: 'Pages & SEO', eyebrow: 'Website', icon: 'fa-file-lines' },
  { id: 'menus', label: 'Navigation', eyebrow: 'Website', icon: 'fa-bars-staggered' },
  { id: 'settings', label: 'Site Settings', eyebrow: 'Website', icon: 'fa-sliders' },
  { id: 'coupons', label: 'Coupons', eyebrow: 'Marketing', icon: 'fa-ticket' },
  { id: 'subscribers', label: 'Newsletter', eyebrow: 'Marketing', icon: 'fa-paper-plane' },
  { id: 'users', label: 'Customers', eyebrow: 'People', icon: 'fa-users' },
  { id: 'inquiries', label: 'Inquiries', eyebrow: 'People', icon: 'fa-inbox' },
]

const initialData = {
  products: [],
  orders: [],
  categories: [],
  banners: [],
  pages: [],
  menus: [],
  coupons: [],
  subscribers: [],
  users: [],
  inquiries: [],
  settings: null,
  stats: null,
}

const emptyForms = {
  product: { id: '', name: '', price: '', desc: '', category: '', imgPrimary: '', imgHover: '' },
  category: { name: '' },
  banner: { title: '', subtitle: '', image: '', buttonText: '', buttonLink: '', position: 'homepage', order: 0, status: 'active' },
  page: { title: '', slug: '', excerpt: '', content: '', featuredImage: '', status: 'draft', seoTitle: '', seoDescription: '', seoKeywords: '' },
  coupon: { code: '', description: '', type: 'percentage', value: '', minOrderAmount: '', maxDiscount: '', usageLimit: '', startDate: '', expiryDate: '', status: 'active' },
  menu: { name: '', location: 'header', items: [{ label: 'Home', url: '/', order: 0, target: '_self' }] },
}

const apiLoaders = {
  stats: () => orderAPI.getOrderStats(),
  products: () => productAPI.getProducts({ limit: 250 }),
  orders: () => orderAPI.getAllOrders({ limit: 250 }),
  categories: () => categoryAPI.getCategories(),
  banners: () => bannerAPI.getBanners(),
  pages: () => pageAPI.getPages(),
  menus: () => menuAPI.getMenus(),
  coupons: () => couponAPI.getCoupons(),
  subscribers: () => newsletterAPI.getSubscribers(),
  users: () => userAPI.getAllUsers(),
  inquiries: () => contactAPI.getSubmissions(),
  settings: () => settingsAPI.getSettings(),
}

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`
const formatDate = (value) => (value ? new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—')
const getName = (user) => [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.name || user?.email || 'Unknown'
const cx = (...classes) => classes.filter(Boolean).join(' ')
const slugify = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export default function AdminPanelV2() {
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const [activeTab, setActiveTab] = useState('overview')
  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [query, setQuery] = useState('')
  const [editor, setEditor] = useState(null)
  const [uploading, setUploading] = useState('')
  const [saving, setSaving] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const loadAdminData = async (quiet = false) => {
    quiet ? setRefreshing(true) : setLoading(true)
    setError('')
    const entries = Object.entries(apiLoaders)
    const results = await Promise.allSettled(entries.map(([, loader]) => loader()))
    const next = { ...initialData }
    const failed = []

    results.forEach((result, index) => {
      const key = entries[index][0]
      if (result.status === 'fulfilled') {
        next[key] = key === 'settings' || key === 'stats'
          ? result.value
          : Array.isArray(result.value) ? result.value : []
      } else {
        failed.push(key)
      }
    })

    setData(next)
    if (failed.length) setError(`Some modules could not be loaded: ${failed.join(', ')}.`)
    setLoading(false)
    setRefreshing(false)
  }

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') loadAdminData()
  }, [isAuthenticated, user])

  useEffect(() => {
    if (!notice) return
    const timer = setTimeout(() => setNotice(''), 3200)
    return () => clearTimeout(timer)
  }, [notice])

  const activeMeta = tabs.find((tab) => tab.id === activeTab)
  const searchableItems = data[activeTab]
  const filteredItems = useMemo(() => {
    if (!Array.isArray(searchableItems) || !query.trim()) return searchableItems || []
    const term = query.toLowerCase()
    return searchableItems.filter((item) => JSON.stringify(item).toLowerCase().includes(term))
  }, [searchableItems, query])

  const openEditor = (type, item = null) => {
    let form = item ? structuredClone(item) : structuredClone(emptyForms[type])
    if (type === 'product' && item) form.category = item.category?._id || item.category || ''
    if (type === 'page' && item) form.seoKeywords = (item.seoKeywords || []).join(', ')
    if (type === 'coupon' && item) {
      form.startDate = item.startDate?.slice(0, 10) || ''
      form.expiryDate = item.expiryDate?.slice(0, 10) || ''
    }
    setEditor({ type, item, form })
  }

  const setEditorForm = (changes) => setEditor((current) => ({ ...current, form: { ...current.form, ...changes } }))

  const uploadImage = async (event, field, folder) => {
    const file = event.target.files?.[0]
    if (!file) return
    setUploading(field)
    try {
      const uploaded = await uploadToCloudinary(file, `thirdeye/admin/${folder}`)
      if (editor) setEditorForm({ [field]: uploaded.url })
      setNotice('Image uploaded to Cloudinary.')
    } catch (uploadError) {
      setError(uploadError.message || 'Image upload failed.')
    } finally {
      setUploading('')
      event.target.value = ''
    }
  }

  const saveEditor = async (event) => {
    event.preventDefault()
    const { type, item, form } = editor
    setSaving(true)
    setError('')
    try {
      if (type === 'product') {
        const payload = { ...form, id: Number(form.id), imgHover: form.imgHover || form.imgPrimary, category: form.category || undefined }
        item ? await productAPI.updateProduct(item.id, payload) : await productAPI.createProduct(payload)
      }
      if (type === 'category') item ? await categoryAPI.updateCategory(item._id, form) : await categoryAPI.createCategory(form)
      if (type === 'banner') {
        const payload = { ...form, order: Number(form.order || 0) }
        item ? await bannerAPI.updateBanner(item._id, payload) : await bannerAPI.createBanner(payload)
      }
      if (type === 'page') {
        const payload = { ...form, slug: slugify(form.slug || form.title), seoKeywords: form.seoKeywords.split(',').map((word) => word.trim()).filter(Boolean) }
        item ? await pageAPI.updatePage(item._id, payload) : await pageAPI.createPage(payload)
      }
      if (type === 'coupon') {
        const payload = {
          ...form,
          value: Number(form.value),
          minOrderAmount: form.minOrderAmount === '' ? undefined : Number(form.minOrderAmount),
          maxDiscount: form.maxDiscount === '' ? undefined : Number(form.maxDiscount),
          usageLimit: form.usageLimit === '' ? undefined : Number(form.usageLimit),
          startDate: form.startDate || undefined,
          expiryDate: form.expiryDate || undefined,
        }
        item ? await couponAPI.updateCoupon(item._id, payload) : await couponAPI.createCoupon(payload)
      }
      if (type === 'menu') {
        await menuAPI.saveMenu({
          ...form,
          items: form.items.map((menuItem, index) => ({ ...menuItem, order: Number(menuItem.order ?? index) })),
        })
      }
      setEditor(null)
      setNotice(`${type[0].toUpperCase()}${type.slice(1)} saved successfully.`)
      await loadAdminData(true)
    } catch (saveError) {
      setError(saveError.message || `Unable to save ${type}.`)
    } finally {
      setSaving(false)
    }
  }

  const removeItem = async (type, item) => {
    const label = item.name || item.title || item.code || item.email || item._id
    if (!window.confirm(`Delete ${label}? This cannot be undone.`)) return
    const actions = {
      product: () => productAPI.deleteProduct(item.id),
      category: () => categoryAPI.deleteCategory(item._id),
      banner: () => bannerAPI.deleteBanner(item._id),
      page: () => pageAPI.deletePage(item._id),
      menu: () => menuAPI.deleteMenu(item._id),
      coupon: () => couponAPI.deleteCoupon(item._id),
      subscriber: () => newsletterAPI.deleteSubscriber(item._id),
      user: () => userAPI.deleteUser(item._id),
      inquiry: () => contactAPI.deleteSubmission(item._id),
      order: () => orderAPI.deleteOrder(item._id),
    }
    try {
      await actions[type]()
      setNotice('Deleted successfully.')
      setSelectedOrder(null)
      await loadAdminData(true)
    } catch (deleteError) {
      setError(deleteError.message || 'Delete failed.')
    }
  }

  const updateOrderStatus = async (orderId, orderStatus) => {
    try {
      await orderAPI.updateOrderStatus(orderId, { orderStatus })
      setNotice('Order status updated.')
      await loadAdminData(true)
    } catch (statusError) {
      setError(statusError.message || 'Unable to update order.')
    }
  }

  const updateSubscriber = async (subscriber) => {
    try {
      const status = subscriber.status === 'active' ? 'unsubscribed' : 'active'
      await newsletterAPI.updateSubscriber(subscriber._id, { status })
      setNotice(`Subscriber marked ${status}.`)
      await loadAdminData(true)
    } catch (subscriberError) {
      setError(subscriberError.message || 'Unable to update subscriber.')
    }
  }

  if (!isAuthenticated || user?.role !== 'admin') return <Navigate to="/login" replace />

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090a08] text-white grid place-items-center">
        <div className="text-center">
          <div className="h-16 w-16 rounded-full border border-[#d8bd76]/20 border-t-[#d8bd76] animate-spin mx-auto" />
          <p className="mt-6 text-[10px] tracking-[.34em] uppercase text-[#d8bd76]">Opening the control room</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#090a08] text-[#f5efe5] font-montserrat selection:bg-[#d8bd76] selection:text-[#11120f]">
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_80%_5%,rgba(216,189,118,.12),transparent_28%),radial-gradient(circle_at_15%_80%,rgba(92,110,76,.09),transparent_32%)]" />

      <aside className={cx(
        'fixed inset-y-0 left-0 z-50 w-[292px] border-r border-white/[.07] bg-[#10110e]/95 backdrop-blur-2xl transition-transform xl:translate-x-0',
        mobileNavOpen ? 'translate-x-0' : '-translate-x-full',
      )}>
        <div className="h-full flex flex-col">
          <div className="px-7 py-7 border-b border-white/[.06] flex items-start justify-between">
            <div>
              <p className="text-[9px] tracking-[.36em] uppercase text-[#8e9186]">Third Eye Scent</p>
              <h1 className="font-cormorant text-[34px] leading-none text-[#e7cc83] mt-2">Maison Console</h1>
            </div>
            <button className="xl:hidden text-white/60" onClick={() => setMobileNavOpen(false)}><i className="fa-solid fa-xmark" /></button>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-5 admin-table-scroll">
            {['Command center', 'Commerce', 'Website', 'Marketing', 'People'].map((group) => (
              <div key={group} className="mb-5">
                <p className="px-3 mb-2 text-[8px] tracking-[.28em] uppercase text-[#666b61]">{group}</p>
                <div className="space-y-1">
                  {tabs.filter((tab) => tab.eyebrow === group).map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => { setActiveTab(tab.id); setQuery(''); setMobileNavOpen(false) }}
                      className={cx(
                        'w-full flex items-center gap-3 rounded-xl px-3.5 py-3 text-left text-[11px] tracking-[.08em] transition-all',
                        activeTab === tab.id
                          ? 'bg-[#d8bd76] text-[#12130f] shadow-[0_14px_35px_rgba(216,189,118,.12)]'
                          : 'text-[#aeb1a7] hover:bg-white/[.045] hover:text-white',
                      )}
                    >
                      <span className={cx('grid h-8 w-8 place-items-center rounded-lg', activeTab === tab.id ? 'bg-black/10' : 'bg-white/[.04]')}>
                        <i className={`fa-solid ${tab.icon}`} />
                      </span>
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div className="m-4 rounded-2xl border border-white/[.07] bg-white/[.025] p-4">
            <p className="text-[8px] tracking-[.25em] uppercase text-[#73786e]">Administrator</p>
            <p className="font-cormorant text-xl text-white mt-1">{getName(user)}</p>
            <p className="text-[10px] text-[#d8bd76] truncate mt-0.5">{user.email}</p>
          </div>
        </div>
      </aside>

      <main className="relative xl:pl-[292px]">
        <header className="sticky top-0 z-40 border-b border-white/[.06] bg-[#090a08]/85 backdrop-blur-2xl">
          <div className="px-4 md:px-8 py-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setMobileNavOpen(true)} className="xl:hidden h-11 w-11 rounded-xl border border-white/10 text-[#d8bd76]">
                <i className="fa-solid fa-bars" />
              </button>
              <div>
                <p className="text-[9px] tracking-[.3em] uppercase text-[#777c72]">{activeMeta?.eyebrow}</p>
                <h2 className="font-cormorant text-3xl md:text-[42px] leading-none text-white mt-1">{activeMeta?.label}</h2>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              {Array.isArray(data[activeTab]) && (
                <div className="relative hidden md:block">
                  <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-[10px] text-white/35" />
                  <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${activeMeta?.label.toLowerCase()}...`} className="w-[260px] rounded-xl border border-white/[.08] bg-white/[.035] py-3 pl-10 pr-4 text-xs outline-none focus:border-[#d8bd76]/55" />
                </div>
              )}
              <button onClick={() => loadAdminData(true)} disabled={refreshing} className="h-11 px-4 rounded-xl border border-white/10 text-[#d8bd76] hover:bg-white/[.04] transition">
                <i className={cx('fa-solid fa-rotate', refreshing && 'animate-spin')} />
                <span className="hidden md:inline ml-2 text-[9px] tracking-[.18em] uppercase">Sync</span>
              </button>
            </div>
          </div>
        </header>

        <div className="px-4 md:px-8 py-7 md:py-9">
          {error && <Alert tone="error" onClose={() => setError('')}>{error}</Alert>}
          {notice && <Alert tone="success" onClose={() => setNotice('')}>{notice}</Alert>}

          {activeTab === 'overview' && <Overview data={data} setActiveTab={setActiveTab} />}
          {activeTab === 'products' && <Products items={filteredItems} onAdd={() => openEditor('product')} onEdit={(item) => openEditor('product', item)} onDelete={(item) => removeItem('product', item)} />}
          {activeTab === 'orders' && <Orders items={filteredItems} onStatus={updateOrderStatus} onView={setSelectedOrder} onDelete={(item) => removeItem('order', item)} />}
          {activeTab === 'categories' && <SimpleCards title="Collection taxonomy" items={filteredItems} getTitle={(item) => item.name} getMeta={(item) => `Created ${formatDate(item.createdAt)}`} onAdd={() => openEditor('category')} onEdit={(item) => openEditor('category', item)} onDelete={(item) => removeItem('category', item)} />}
          {activeTab === 'banners' && <Banners items={filteredItems} onAdd={() => openEditor('banner')} onEdit={(item) => openEditor('banner', item)} onDelete={(item) => removeItem('banner', item)} />}
          {activeTab === 'pages' && <Pages items={filteredItems} onAdd={() => openEditor('page')} onEdit={(item) => openEditor('page', item)} onDelete={(item) => removeItem('page', item)} />}
          {activeTab === 'menus' && <Menus items={filteredItems} onAdd={() => openEditor('menu')} onEdit={(item) => openEditor('menu', item)} onDelete={(item) => removeItem('menu', item)} />}
          {activeTab === 'settings' && <SettingsEditor settings={data.settings} setError={setError} setNotice={setNotice} onReload={() => loadAdminData(true)} />}
          {activeTab === 'coupons' && <Coupons items={filteredItems} onAdd={() => openEditor('coupon')} onEdit={(item) => openEditor('coupon', item)} onDelete={(item) => removeItem('coupon', item)} />}
          {activeTab === 'subscribers' && <Subscribers items={filteredItems} onToggle={updateSubscriber} onDelete={(item) => removeItem('subscriber', item)} />}
          {activeTab === 'users' && <Users items={filteredItems} onDelete={(item) => removeItem('user', item)} />}
          {activeTab === 'inquiries' && <Inquiries items={filteredItems} onDelete={(item) => removeItem('inquiry', item)} />}
        </div>
      </main>

      {editor && (
        <EditorModal
          editor={editor}
          categories={data.categories}
          setForm={setEditorForm}
          onSave={saveEditor}
          onClose={() => setEditor(null)}
          onUpload={uploadImage}
          uploading={uploading}
          saving={saving}
        />
      )}
      {selectedOrder && <OrderDrawer order={selectedOrder} onClose={() => setSelectedOrder(null)} onDelete={() => removeItem('order', selectedOrder)} />}
    </div>
  )
}

function Overview({ data, setActiveTab }) {
  const stats = data.stats || {}
  const pending = data.orders.filter((order) => order.orderStatus === 'pending').length
  const publishedPages = data.pages.filter((page) => page.status === 'published').length
  const activeBanners = data.banners.filter((banner) => banner.status === 'active').length
  const metrics = [
    { label: 'Revenue', value: formatCurrency(stats.totalRevenue), note: 'Paid & delivered', icon: 'fa-indian-rupee-sign', tab: 'orders' },
    { label: 'Orders', value: stats.totalOrders ?? data.orders.length, note: `${pending} pending`, icon: 'fa-bag-shopping', tab: 'orders' },
    { label: 'Products', value: stats.totalProducts ?? data.products.length, note: `${data.categories.length} collections`, icon: 'fa-spray-can-sparkles', tab: 'products' },
    { label: 'Customers', value: stats.totalUsers ?? data.users.length, note: `${data.subscribers.length} subscribers`, icon: 'fa-users', tab: 'users' },
  ]

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-white/[.07] bg-gradient-to-br from-[#171812] to-[#10110e] p-6 md:p-8 overflow-hidden relative">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#d8bd76]/10 blur-3xl" />
        <div className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <p className="text-[9px] tracking-[.34em] uppercase text-[#d8bd76]">Good to see you</p>
            <h3 className="font-cormorant text-4xl md:text-6xl text-white mt-3 max-w-3xl leading-[.95]">Your digital maison, in one beautifully controlled place.</h3>
            <p className="text-xs md:text-sm leading-7 text-[#9da095] mt-5 max-w-2xl">Manage commerce, campaigns, editorial pages, navigation and brand settings without touching the codebase.</p>
          </div>
          <button onClick={() => setActiveTab('settings')} className="admin-primary-btn rounded-xl shrink-0"><i className="fa-solid fa-wand-magic-sparkles" /> Customize website</button>
        </div>
      </section>

      <div className="grid sm:grid-cols-2 2xl:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <button key={metric.label} onClick={() => setActiveTab(metric.tab)} className="text-left rounded-2xl border border-white/[.07] bg-white/[.025] p-5 hover:border-[#d8bd76]/35 hover:-translate-y-0.5 transition">
            <div className="flex justify-between items-center"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#d8bd76]/10 text-[#d8bd76]"><i className={`fa-solid ${metric.icon}`} /></span><i className="fa-solid fa-arrow-up-right text-white/20" /></div>
            <p className="font-cormorant text-4xl text-white mt-6">{metric.value}</p>
            <div className="flex justify-between gap-3 mt-1"><p className="text-[9px] tracking-[.2em] uppercase text-[#777c72]">{metric.label}</p><p className="text-[10px] text-[#d8bd76]">{metric.note}</p></div>
          </button>
        ))}
      </div>

      <div className="grid xl:grid-cols-[1.4fr_.8fr] gap-6">
        <Panel title="Recent orders" eyebrow="Live commerce">
          <Table>
            <thead><tr><Th>Order</Th><Th>Customer</Th><Th>Status</Th><Th>Total</Th><Th>Date</Th></tr></thead>
            <tbody>{data.orders.slice(0, 6).map((order) => <tr key={order._id} className="admin-row"><Td>#{order._id.slice(-8)}</Td><Td>{getName(order.user)}</Td><Td><Badge value={order.orderStatus} /></Td><Td>{formatCurrency(order.totalAmount)}</Td><Td>{formatDate(order.createdAt)}</Td></tr>)}</tbody>
          </Table>
        </Panel>
        <Panel title="Website pulse" eyebrow="Published content">
          <div className="space-y-3">
            <Pulse label="Active banners" value={activeBanners} icon="fa-panorama" onClick={() => setActiveTab('banners')} />
            <Pulse label="Published pages" value={publishedPages} icon="fa-file-lines" onClick={() => setActiveTab('pages')} />
            <Pulse label="Navigation menus" value={data.menus.length} icon="fa-bars-staggered" onClick={() => setActiveTab('menus')} />
            <Pulse label="Open inquiries" value={data.inquiries.length} icon="fa-inbox" onClick={() => setActiveTab('inquiries')} />
          </div>
        </Panel>
      </div>
    </div>
  )
}

function Products({ items, onAdd, onEdit, onDelete }) {
  return (
    <Panel title="Product atelier" eyebrow={`${items.length} fragrances`} action={<AddButton onClick={onAdd}>New product</AddButton>}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
        {items.map((product) => (
          <article key={product._id || product.id} className="group rounded-2xl border border-white/[.07] bg-[#0d0e0b] overflow-hidden">
            <div className="aspect-[4/3] overflow-hidden bg-white/[.03]"><img src={product.imgPrimary} alt={product.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /></div>
            <div className="p-5">
              <div className="flex justify-between gap-3"><div><p className="text-[8px] tracking-[.24em] uppercase text-[#777c72]">ID {product.id} · {product.category?.name || 'Uncategorized'}</p><h3 className="font-cormorant text-2xl text-white mt-1">{product.name}</h3></div><p className="text-[#d8bd76] text-sm">{product.price}</p></div>
              <p className="text-[11px] leading-5 text-[#888c82] mt-3 line-clamp-2">{product.desc}</p>
              <RowActions onEdit={() => onEdit(product)} onDelete={() => onDelete(product)} />
            </div>
          </article>
        ))}
      </div>
      {!items.length && <EmptyState label="No products match this view." />}
    </Panel>
  )
}

function Orders({ items, onStatus, onView, onDelete }) {
  return (
    <Panel title="Order desk" eyebrow={`${items.length} orders`}>
      <Table>
        <thead><tr><Th>Order</Th><Th>Customer</Th><Th>Payment</Th><Th>Status</Th><Th>Total</Th><Th>Date</Th><Th /></tr></thead>
        <tbody>{items.map((order) => (
          <tr key={order._id} className="admin-row">
            <Td><button className="text-[#d8bd76]" onClick={() => onView(order)}>#{order._id.slice(-8)}</button></Td>
            <Td><p className="text-white">{getName(order.user)}</p><p className="text-[10px] text-white/35">{order.user?.email}</p></Td>
            <Td><Badge value={order.paymentStatus} /></Td>
            <Td><select value={order.orderStatus} onChange={(event) => onStatus(order._id, event.target.value)} className="rounded-lg border border-white/10 bg-[#11120f] px-3 py-2 text-[10px] text-white outline-none">{['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => <option key={status}>{status}</option>)}</select></Td>
            <Td>{formatCurrency(order.totalAmount)}</Td><Td>{formatDate(order.createdAt)}</Td>
            <Td><div className="flex gap-2"><IconButton icon="fa-eye" onClick={() => onView(order)} /><IconButton danger icon="fa-trash" onClick={() => onDelete(order)} /></div></Td>
          </tr>
        ))}</tbody>
      </Table>
    </Panel>
  )
}

function Banners({ items, onAdd, onEdit, onDelete }) {
  return (
    <Panel title="Campaign banners" eyebrow="Visual merchandising" action={<AddButton onClick={onAdd}>New banner</AddButton>}>
      <div className="grid md:grid-cols-2 2xl:grid-cols-3 gap-4">
        {items.map((banner) => (
          <article key={banner._id} className="rounded-2xl border border-white/[.07] overflow-hidden bg-[#0d0e0b]">
            <div className="relative aspect-[16/8]"><img src={banner.image} alt={banner.title} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-transparent" /><div className="absolute inset-x-5 bottom-4"><div className="flex justify-between items-end gap-3"><div><p className="text-[8px] tracking-[.24em] uppercase text-[#d8bd76]">{banner.position} · order {banner.order}</p><h3 className="font-cormorant text-2xl text-white">{banner.title}</h3></div><Badge value={banner.status} /></div></div></div>
            <div className="px-5 pb-5"><p className="text-[11px] text-[#888c82] py-3">{banner.subtitle || 'No supporting copy'}</p><RowActions onEdit={() => onEdit(banner)} onDelete={() => onDelete(banner)} /></div>
          </article>
        ))}
      </div>
    </Panel>
  )
}

function Pages({ items, onAdd, onEdit, onDelete }) {
  return (
    <Panel title="Editorial pages" eyebrow="Content & search presence" action={<AddButton onClick={onAdd}>New page</AddButton>}>
      <div className="grid lg:grid-cols-2 gap-4">
        {items.map((page) => (
          <article key={page._id} className="rounded-2xl border border-white/[.07] bg-white/[.025] p-5 flex gap-5">
            <div className="h-24 w-24 rounded-xl overflow-hidden bg-white/[.04] shrink-0">{page.featuredImage ? <img src={page.featuredImage} alt="" className="w-full h-full object-cover" /> : <div className="h-full grid place-items-center text-white/15"><i className="fa-solid fa-file-lines text-2xl" /></div>}</div>
            <div className="min-w-0 flex-1"><div className="flex justify-between gap-3"><div><p className="text-[8px] tracking-[.22em] uppercase text-[#777c72]">/{page.slug}</p><h3 className="font-cormorant text-2xl text-white truncate">{page.title}</h3></div><Badge value={page.status} /></div><p className="text-[11px] text-[#888c82] mt-2 line-clamp-2">{page.excerpt || page.seoDescription || 'No excerpt added yet.'}</p><RowActions onEdit={() => onEdit(page)} onDelete={() => onDelete(page)} /></div>
          </article>
        ))}
      </div>
    </Panel>
  )
}

function Menus({ items, onAdd, onEdit, onDelete }) {
  return (
    <Panel title="Navigation builder" eyebrow="Header, footer & mobile" action={<AddButton onClick={onAdd}>Configure menu</AddButton>}>
      <div className="grid lg:grid-cols-3 gap-4">
        {items.map((menu) => (
          <article key={menu._id} className="rounded-2xl border border-white/[.07] bg-white/[.025] p-5">
            <div className="flex justify-between"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#d8bd76]/10 text-[#d8bd76]"><i className="fa-solid fa-bars-staggered" /></span><span className="text-[8px] tracking-[.24em] uppercase text-[#777c72]">{menu.location}</span></div>
            <h3 className="font-cormorant text-3xl text-white mt-5">{menu.name}</h3>
            <div className="mt-4 space-y-2">{menu.items?.slice().sort((a, b) => a.order - b.order).map((item) => <div key={`${item.label}-${item.url}`} className="flex justify-between rounded-lg bg-black/20 px-3 py-2 text-[10px]"><span>{item.label}</span><span className="text-white/35">{item.url}</span></div>)}</div>
            <RowActions onEdit={() => onEdit(menu)} onDelete={() => onDelete(menu)} />
          </article>
        ))}
      </div>
      {!items.length && <EmptyState label="No menus yet. Create one for header, footer or mobile." />}
    </Panel>
  )
}

function Coupons({ items, onAdd, onEdit, onDelete }) {
  return (
    <Panel title="Offer library" eyebrow="Promotions" action={<AddButton onClick={onAdd}>New coupon</AddButton>}>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map((coupon) => (
          <article key={coupon._id} className="rounded-2xl border border-dashed border-[#d8bd76]/25 bg-[#d8bd76]/[.045] p-5">
            <div className="flex justify-between gap-3"><div><p className="text-[8px] tracking-[.24em] uppercase text-[#777c72]">Coupon code</p><h3 className="font-cormorant text-3xl text-[#e7cc83] mt-1">{coupon.code}</h3></div><Badge value={coupon.status} /></div>
            <p className="text-2xl text-white mt-5">{coupon.type === 'percentage' ? `${coupon.value}% off` : formatCurrency(coupon.value)}</p>
            <p className="text-[11px] leading-5 text-[#888c82] mt-2">{coupon.description || `Minimum order ${formatCurrency(coupon.minOrderAmount)}`}</p>
            <div className="mt-4 flex justify-between text-[9px] text-white/35"><span>Used {coupon.usedCount || 0}{coupon.usageLimit ? ` / ${coupon.usageLimit}` : ''}</span><span>{coupon.expiryDate ? `Ends ${formatDate(coupon.expiryDate)}` : 'No expiry'}</span></div>
            <RowActions onEdit={() => onEdit(coupon)} onDelete={() => onDelete(coupon)} />
          </article>
        ))}
      </div>
    </Panel>
  )
}

function Subscribers({ items, onToggle, onDelete }) {
  return (
    <Panel title="Newsletter audience" eyebrow={`${items.filter((item) => item.status === 'active').length} active subscribers`}>
      <Table><thead><tr><Th>Email</Th><Th>Status</Th><Th>Joined</Th><Th>Actions</Th></tr></thead><tbody>{items.map((item) => <tr key={item._id} className="admin-row"><Td>{item.email}</Td><Td><Badge value={item.status} /></Td><Td>{formatDate(item.createdAt)}</Td><Td><div className="flex gap-2"><button onClick={() => onToggle(item)} className="admin-secondary-btn rounded-lg">{item.status === 'active' ? 'Unsubscribe' : 'Reactivate'}</button><IconButton danger icon="fa-trash" onClick={() => onDelete(item)} /></div></Td></tr>)}</tbody></Table>
    </Panel>
  )
}

function Users({ items, onDelete }) {
  return (
    <Panel title="Customer directory" eyebrow={`${items.length} accounts`}>
      <Table><thead><tr><Th>Customer</Th><Th>Phone</Th><Th>Role</Th><Th>Status</Th><Th>Joined</Th><Th /></tr></thead><tbody>{items.map((item) => <tr key={item._id} className="admin-row"><Td><p className="text-white">{getName(item)}</p><p className="text-[10px] text-white/35">{item.email}</p></Td><Td>{item.phone || '—'}</Td><Td><Badge value={item.role} /></Td><Td><Badge value={item.isBlocked ? 'blocked' : 'active'} /></Td><Td>{formatDate(item.createdAt)}</Td><Td>{item.role !== 'admin' && <IconButton danger icon="fa-trash" onClick={() => onDelete(item)} />}</Td></tr>)}</tbody></Table>
    </Panel>
  )
}

function Inquiries({ items, onDelete }) {
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      {items.map((item) => <article key={item._id} className="rounded-2xl border border-white/[.07] bg-white/[.025] p-5"><div className="flex justify-between gap-4"><div><p className="text-[8px] tracking-[.24em] uppercase text-[#d8bd76]">{item.service}</p><h3 className="font-cormorant text-2xl text-white mt-1">{item.name}</h3></div><IconButton danger icon="fa-trash" onClick={() => onDelete(item)} /></div><div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-[10px] text-white/40"><span>{item.email}</span><span>{item.phone}</span><span>{formatDate(item.createdAt)}</span></div><p className="text-xs leading-6 text-[#a4a79d] mt-4">{item.message}</p></article>)}
      {!items.length && <EmptyState label="The concierge inbox is clear." />}
    </div>
  )
}

function SimpleCards({ title, items, getTitle, getMeta, onAdd, onEdit, onDelete }) {
  return <Panel title={title} eyebrow={`${items.length} entries`} action={<AddButton onClick={onAdd}>Add new</AddButton>}><div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">{items.map((item) => <article key={item._id} className="rounded-2xl border border-white/[.07] bg-white/[.025] p-5"><div className="h-11 w-11 rounded-xl bg-[#d8bd76]/10 text-[#d8bd76] grid place-items-center"><i className="fa-solid fa-layer-group" /></div><h3 className="font-cormorant text-2xl text-white mt-5">{getTitle(item)}</h3><p className="text-[10px] text-[#777c72] mt-1">{getMeta(item)}</p><RowActions onEdit={() => onEdit(item)} onDelete={() => onDelete(item)} /></article>)}</div></Panel>
}

function SettingsEditor({ settings, setError, setNotice, onReload }) {
  const [form, setForm] = useState({
    siteName: '', siteDescription: '', logo: '', favicon: '', contactEmail: '', contactPhone: '', address: '',
    announcementItems: [''],
    socialLinks: { facebook: '', instagram: '', twitter: '', linkedin: '', youtube: '' },
  })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState('')

  useEffect(() => {
    if (settings) setForm({
      siteName: settings.siteName || '',
      siteDescription: settings.siteDescription || '',
      logo: settings.logo || '',
      favicon: settings.favicon || '',
      contactEmail: settings.contactEmail || '',
      contactPhone: settings.contactPhone || '',
      address: settings.address || '',
      announcementItems: settings.announcementItems?.length ? settings.announcementItems : [''],
      socialLinks: { facebook: '', instagram: '', twitter: '', linkedin: '', youtube: '', ...(settings.socialLinks || {}) },
    })
  }, [settings])

  const upload = async (event, field) => {
    const file = event.target.files?.[0]
    if (!file) return
    setUploading(field)
    try {
      const result = await uploadToCloudinary(file, 'thirdeye/admin/brand')
      setForm((current) => ({ ...current, [field]: result.url }))
      setNotice('Brand asset uploaded.')
    } catch (error) {
      setError(error.message || 'Upload failed.')
    } finally {
      setUploading('')
    }
  }

  const save = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      await settingsAPI.updateSettings({ ...form, announcementItems: form.announcementItems.filter((item) => item.trim()) })
      setNotice('Website settings published.')
      await onReload()
    } catch (error) {
      setError(error.message || 'Unable to save settings.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={save} className="grid xl:grid-cols-[1.2fr_.8fr] gap-6">
      <Panel title="Brand & contact" eyebrow="Global website identity">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Site name"><Input value={form.siteName} onChange={(value) => setForm({ ...form, siteName: value })} /></Field>
          <Field label="Contact email"><Input type="email" value={form.contactEmail} onChange={(value) => setForm({ ...form, contactEmail: value })} /></Field>
          <Field label="Contact phone"><Input value={form.contactPhone} onChange={(value) => setForm({ ...form, contactPhone: value })} /></Field>
          <Field label="Address"><Input value={form.address} onChange={(value) => setForm({ ...form, address: value })} /></Field>
        </div>
        <Field label="Brand description"><Textarea value={form.siteDescription} onChange={(value) => setForm({ ...form, siteDescription: value })} rows={5} /></Field>
        <div className="grid md:grid-cols-2 gap-4">
          <ImageField label="Logo" value={form.logo} field="logo" uploading={uploading} onChange={(value) => setForm({ ...form, logo: value })} onUpload={upload} />
          <ImageField label="Favicon" value={form.favicon} field="favicon" uploading={uploading} onChange={(value) => setForm({ ...form, favicon: value })} onUpload={upload} />
        </div>
      </Panel>
      <div className="space-y-6">
        <Panel title="Announcement bar" eyebrow="Short rotating messages">
          <Repeater
            items={form.announcementItems}
            onChange={(items) => setForm({ ...form, announcementItems: items })}
            createItem={() => ''}
            renderItem={(item, index, update) => <Input value={item} onChange={(value) => update(index, value)} placeholder="Complimentary shipping..." />}
          />
        </Panel>
        <Panel title="Social presence" eyebrow="Profile links">
          <div className="space-y-3">{Object.keys(form.socialLinks).map((network) => <Field key={network} label={network}><Input value={form.socialLinks[network]} onChange={(value) => setForm({ ...form, socialLinks: { ...form.socialLinks, [network]: value } })} placeholder={`https://${network}.com/...`} /></Field>)}</div>
        </Panel>
        <button type="submit" disabled={saving || Boolean(uploading)} className="admin-primary-btn rounded-xl w-full py-4">{saving ? 'Publishing...' : 'Publish website settings'}</button>
      </div>
    </form>
  )
}

function EditorModal({ editor, categories, setForm, onSave, onClose, onUpload, uploading, saving }) {
  const { type, item, form } = editor
  const title = `${item ? 'Edit' : 'Create'} ${type}`
  return (
    <div className="fixed inset-0 z-[80] bg-black/75 backdrop-blur-md p-3 md:p-6 grid place-items-center">
      <form onSubmit={onSave} className="w-full max-w-5xl max-h-[94vh] overflow-y-auto rounded-[26px] border border-white/10 bg-[#11120f] shadow-2xl admin-table-scroll">
        <div className="sticky top-0 z-10 flex justify-between items-center border-b border-white/[.07] bg-[#11120f]/95 backdrop-blur px-5 md:px-7 py-5">
          <div><p className="text-[8px] tracking-[.28em] uppercase text-[#d8bd76]">Content studio</p><h3 className="font-cormorant text-3xl text-white mt-1 capitalize">{title}</h3></div>
          <button type="button" onClick={onClose} className="h-10 w-10 rounded-xl border border-white/10 text-white/60"><i className="fa-solid fa-xmark" /></button>
        </div>
        <div className="p-5 md:p-7">
          {type === 'product' && <ProductForm form={form} setForm={setForm} categories={categories} onUpload={onUpload} uploading={uploading} />}
          {type === 'category' && <Field label="Category name"><Input required value={form.name} onChange={(value) => setForm({ name: value })} /></Field>}
          {type === 'banner' && <BannerForm form={form} setForm={setForm} onUpload={onUpload} uploading={uploading} />}
          {type === 'page' && <PageForm form={form} setForm={setForm} onUpload={onUpload} uploading={uploading} />}
          {type === 'coupon' && <CouponForm form={form} setForm={setForm} />}
          {type === 'menu' && <MenuForm form={form} setForm={setForm} />}
        </div>
        <div className="sticky bottom-0 flex justify-end gap-3 border-t border-white/[.07] bg-[#11120f]/95 backdrop-blur px-5 md:px-7 py-5">
          <button type="button" onClick={onClose} className="admin-secondary-btn rounded-xl">Cancel</button>
          <button type="submit" disabled={saving || Boolean(uploading)} className="admin-primary-btn rounded-xl">{saving ? 'Saving...' : 'Save changes'}</button>
        </div>
      </form>
    </div>
  )
}

function ProductForm({ form, setForm, categories, onUpload, uploading }) {
  return <div className="grid lg:grid-cols-[1fr_.72fr] gap-6"><div className="space-y-4"><div className="grid sm:grid-cols-[.3fr_1fr] gap-4"><Field label="Product ID"><Input required type="number" value={form.id} onChange={(value) => setForm({ id: value })} /></Field><Field label="Name"><Input required value={form.name} onChange={(value) => setForm({ name: value })} /></Field></div><div className="grid sm:grid-cols-2 gap-4"><Field label="Display price"><Input required value={form.price} onChange={(value) => setForm({ price: value })} placeholder="₹4,800" /></Field><Field label="Category"><Select value={form.category} onChange={(value) => setForm({ category: value })}><option value="">Uncategorized</option>{categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}</Select></Field></div><Field label="Description"><Textarea required rows={7} value={form.desc} onChange={(value) => setForm({ desc: value })} /></Field><ImageField label="Primary image" required value={form.imgPrimary} field="imgPrimary" uploading={uploading} onChange={(value) => setForm({ imgPrimary: value })} onUpload={(event, field) => onUpload(event, field, 'products')} /><ImageField label="Hover image" value={form.imgHover} field="imgHover" uploading={uploading} onChange={(value) => setForm({ imgHover: value })} onUpload={(event, field) => onUpload(event, field, 'products')} /></div><PreviewCard image={form.imgPrimary} title={form.name} subtitle={form.price} description={form.desc} /></div>
}

function BannerForm({ form, setForm, onUpload, uploading }) {
  return <div className="grid lg:grid-cols-[1fr_.72fr] gap-6"><div className="space-y-4"><Field label="Campaign title"><Input required value={form.title} onChange={(value) => setForm({ title: value })} /></Field><Field label="Supporting copy"><Textarea rows={3} value={form.subtitle} onChange={(value) => setForm({ subtitle: value })} /></Field><div className="grid sm:grid-cols-2 gap-4"><Field label="Button text"><Input value={form.buttonText} onChange={(value) => setForm({ buttonText: value })} /></Field><Field label="Button link"><Input value={form.buttonLink} onChange={(value) => setForm({ buttonLink: value })} placeholder="/shop" /></Field><Field label="Placement"><Select value={form.position} onChange={(value) => setForm({ position: value })}>{['homepage', 'category', 'sidebar', 'popup'].map((value) => <option key={value}>{value}</option>)}</Select></Field><Field label="Status"><Select value={form.status} onChange={(value) => setForm({ status: value })}><option>active</option><option>inactive</option></Select></Field><Field label="Display order"><Input type="number" value={form.order} onChange={(value) => setForm({ order: value })} /></Field></div><ImageField label="Campaign image" required value={form.image} field="image" uploading={uploading} onChange={(value) => setForm({ image: value })} onUpload={(event, field) => onUpload(event, field, 'banners')} /></div><PreviewCard wide image={form.image} title={form.title} subtitle={form.buttonText} description={form.subtitle} /></div>
}

function PageForm({ form, setForm, onUpload, uploading }) {
  return <div className="space-y-5"><div className="grid md:grid-cols-2 gap-4"><Field label="Page title"><Input required value={form.title} onChange={(value) => setForm({ title: value, ...(!form.slug ? { slug: slugify(value) } : {}) })} /></Field><Field label="URL slug"><Input required value={form.slug} onChange={(value) => setForm({ slug: slugify(value) })} /></Field></div><Field label="Excerpt"><Textarea rows={3} value={form.excerpt} onChange={(value) => setForm({ excerpt: value })} /></Field><Field label="Page content"><Textarea required rows={12} value={form.content} onChange={(value) => setForm({ content: value })} placeholder="Write the page content. Basic HTML is supported by the API." /></Field><ImageField label="Featured image" value={form.featuredImage} field="featuredImage" uploading={uploading} onChange={(value) => setForm({ featuredImage: value })} onUpload={(event, field) => onUpload(event, field, 'pages')} /><div className="rounded-2xl border border-white/[.07] bg-white/[.025] p-5"><p className="text-[8px] tracking-[.26em] uppercase text-[#d8bd76] mb-4">Search engine preview</p><div className="grid md:grid-cols-2 gap-4"><Field label="SEO title"><Input value={form.seoTitle} onChange={(value) => setForm({ seoTitle: value })} /></Field><Field label="Publishing status"><Select value={form.status} onChange={(value) => setForm({ status: value })}><option>draft</option><option>published</option></Select></Field></div><Field label="SEO description"><Textarea rows={3} value={form.seoDescription} onChange={(value) => setForm({ seoDescription: value })} /></Field><Field label="SEO keywords (comma separated)"><Input value={form.seoKeywords} onChange={(value) => setForm({ seoKeywords: value })} /></Field></div></div>
}

function CouponForm({ form, setForm }) {
  return <div className="grid md:grid-cols-2 gap-4"><Field label="Code"><Input required value={form.code} onChange={(value) => setForm({ code: value.toUpperCase() })} /></Field><Field label="Status"><Select value={form.status} onChange={(value) => setForm({ status: value })}><option>active</option><option>inactive</option></Select></Field><Field label="Discount type"><Select value={form.type} onChange={(value) => setForm({ type: value })}><option value="percentage">Percentage</option><option value="fixed">Fixed amount</option></Select></Field><Field label="Discount value"><Input required type="number" value={form.value} onChange={(value) => setForm({ value })} /></Field><Field label="Minimum order"><Input type="number" value={form.minOrderAmount} onChange={(value) => setForm({ minOrderAmount: value })} /></Field><Field label="Maximum discount"><Input type="number" value={form.maxDiscount} onChange={(value) => setForm({ maxDiscount: value })} /></Field><Field label="Usage limit"><Input type="number" value={form.usageLimit} onChange={(value) => setForm({ usageLimit: value })} /></Field><Field label="Start date"><Input type="date" value={form.startDate} onChange={(value) => setForm({ startDate: value })} /></Field><Field label="Expiry date"><Input type="date" value={form.expiryDate} onChange={(value) => setForm({ expiryDate: value })} /></Field><div className="md:col-span-2"><Field label="Description"><Textarea rows={4} value={form.description} onChange={(value) => setForm({ description: value })} /></Field></div></div>
}

function MenuForm({ form, setForm }) {
  return <div className="space-y-5"><div className="grid md:grid-cols-2 gap-4"><Field label="Menu name"><Input required value={form.name} onChange={(value) => setForm({ name: value })} /></Field><Field label="Location"><Select value={form.location} onChange={(value) => setForm({ location: value })}><option>header</option><option>footer</option><option>mobile</option></Select></Field></div><div><div className="flex justify-between items-center mb-3"><p className="text-[8px] tracking-[.25em] uppercase text-[#d8bd76]">Menu items</p><button type="button" onClick={() => setForm({ items: [...(form.items || []), { label: '', url: '/', order: form.items?.length || 0, target: '_self' }] })} className="admin-secondary-btn rounded-lg"><i className="fa-solid fa-plus" /> Add item</button></div><div className="space-y-3">{form.items?.map((menuItem, index) => <div key={index} className="grid md:grid-cols-[1fr_1.4fr_.35fr_.45fr_auto] gap-3 rounded-xl border border-white/[.07] bg-white/[.025] p-3"><Input value={menuItem.label} onChange={(value) => setForm({ items: form.items.map((item, itemIndex) => itemIndex === index ? { ...item, label: value } : item) })} placeholder="Label" /><Input value={menuItem.url} onChange={(value) => setForm({ items: form.items.map((item, itemIndex) => itemIndex === index ? { ...item, url: value } : item) })} placeholder="/shop" /><Input type="number" value={menuItem.order} onChange={(value) => setForm({ items: form.items.map((item, itemIndex) => itemIndex === index ? { ...item, order: value } : item) })} /><Select value={menuItem.target} onChange={(value) => setForm({ items: form.items.map((item, itemIndex) => itemIndex === index ? { ...item, target: value } : item) })}><option>_self</option><option>_blank</option></Select><IconButton danger icon="fa-trash" onClick={() => setForm({ items: form.items.filter((_, itemIndex) => itemIndex !== index) })} /></div>)}</div></div></div>
}

function OrderDrawer({ order, onClose, onDelete }) {
  return <div className="fixed inset-0 z-[90] bg-black/70 flex justify-end"><aside className="h-full w-full max-w-xl overflow-y-auto bg-[#11120f] border-l border-white/10 p-6 md:p-8 admin-table-scroll"><div className="flex justify-between"><div><p className="text-[8px] tracking-[.28em] uppercase text-[#d8bd76]">Order detail</p><h3 className="font-cormorant text-4xl text-white mt-1">#{order._id.slice(-8)}</h3></div><IconButton icon="fa-xmark" onClick={onClose} /></div><div className="grid grid-cols-2 gap-3 mt-7"><Detail label="Customer" value={getName(order.user)} /><Detail label="Total" value={formatCurrency(order.totalAmount)} /><Detail label="Status" value={order.orderStatus} /><Detail label="Payment" value={order.paymentStatus} /></div><p className="text-[8px] tracking-[.25em] uppercase text-[#d8bd76] mt-8 mb-3">Items</p><div className="space-y-3">{order.items?.map((item, index) => <div key={`${item.name}-${index}`} className="flex items-center gap-4 rounded-xl border border-white/[.07] p-3">{item.image && <img src={item.image} alt="" className="h-14 w-12 rounded-lg object-cover" />}<div className="flex-1"><p className="text-sm text-white">{item.name}</p><p className="text-[10px] text-white/35">Qty {item.quantity}</p></div><p className="text-[#d8bd76]">{formatCurrency(item.price)}</p></div>)}</div><p className="text-[8px] tracking-[.25em] uppercase text-[#d8bd76] mt-8 mb-3">Delivery</p><div className="rounded-xl border border-white/[.07] bg-white/[.025] p-4 text-xs leading-6 text-[#a5a89f]"><p className="text-white">{order.shippingAddress?.name}</p><p>{order.shippingAddress?.addressLine1}</p><p>{order.shippingAddress?.addressLine2}</p><p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pinCode}</p><p>{order.shippingAddress?.phone} · {order.shippingAddress?.email}</p></div><button onClick={onDelete} className="admin-danger-btn rounded-xl w-full mt-8"><i className="fa-solid fa-trash" /> Delete order</button></aside></div>
}

function Panel({ title, eyebrow, action, children }) {
  return <section className="min-w-0 rounded-[22px] border border-white/[.07] bg-[#10110e]/80 p-4 md:p-6"><div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"><div><p className="text-[8px] tracking-[.28em] uppercase text-[#777c72]">{eyebrow}</p><h3 className="font-cormorant text-3xl text-white mt-1">{title}</h3></div>{action}</div>{children}</section>
}
function AddButton({ onClick, children }) { return <button onClick={onClick} className="admin-primary-btn rounded-xl"><i className="fa-solid fa-plus" />{children}</button> }
function RowActions({ onEdit, onDelete }) { return <div className="flex gap-2 mt-5"><button onClick={onEdit} className="admin-secondary-btn rounded-lg flex-1"><i className="fa-solid fa-pen" /> Edit</button><IconButton danger icon="fa-trash" onClick={onDelete} /></div> }
function IconButton({ icon, onClick, danger = false }) { return <button type="button" onClick={onClick} className={cx('grid h-10 w-10 shrink-0 place-items-center rounded-lg border transition', danger ? 'border-red-400/20 text-red-300 hover:bg-red-400/10' : 'border-white/10 text-[#d8bd76] hover:bg-white/[.04]')}><i className={`fa-solid ${icon}`} /></button> }
function Pulse({ label, value, icon, onClick }) { return <button onClick={onClick} className="w-full flex items-center gap-4 rounded-xl border border-white/[.06] bg-white/[.025] p-3.5 text-left hover:border-[#d8bd76]/30 transition"><span className="h-10 w-10 rounded-xl bg-[#d8bd76]/10 text-[#d8bd76] grid place-items-center"><i className={`fa-solid ${icon}`} /></span><span className="flex-1 text-xs text-[#aeb1a7]">{label}</span><span className="font-cormorant text-2xl text-white">{value}</span></button> }
function Badge({ value = '' }) { const positive = ['active', 'published', 'paid', 'delivered', 'admin']; const negative = ['inactive', 'unsubscribed', 'cancelled', 'failed', 'blocked']; return <span className={cx('inline-flex rounded-full px-2.5 py-1 text-[8px] tracking-[.16em] uppercase', positive.includes(value) ? 'bg-emerald-400/10 text-emerald-300' : negative.includes(value) ? 'bg-red-400/10 text-red-300' : 'bg-[#d8bd76]/10 text-[#d8bd76]')}>{value || '—'}</span> }
function Alert({ tone, onClose, children }) { return <div className={cx('mb-5 flex items-center justify-between gap-4 rounded-xl border px-4 py-3 text-xs', tone === 'error' ? 'border-red-400/20 bg-red-400/10 text-red-200' : 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200')}><span>{children}</span><button onClick={onClose}><i className="fa-solid fa-xmark" /></button></div> }
function EmptyState({ label }) { return <div className="min-h-52 grid place-items-center text-center text-white/30"><div><i className="fa-regular fa-folder-open text-3xl" /><p className="text-xs mt-3">{label}</p></div></div> }
function PreviewCard({ image, title, subtitle, description, wide }) { return <div className="rounded-2xl border border-white/[.07] bg-black/20 p-4 h-fit"><p className="text-[8px] tracking-[.25em] uppercase text-[#777c72] mb-3">Live preview</p><div className={cx('overflow-hidden rounded-xl bg-white/[.04]', wide ? 'aspect-video' : 'aspect-[4/5]')}>{image ? <img src={image} alt="" className="h-full w-full object-cover" /> : <div className="h-full grid place-items-center text-white/20"><i className="fa-regular fa-image text-3xl" /></div>}</div><h4 className="font-cormorant text-3xl text-white mt-4">{title || 'Untitled'}</h4><p className="text-[#d8bd76] text-xs mt-1">{subtitle || 'Supporting detail'}</p><p className="text-[11px] leading-5 text-[#888c82] mt-3 line-clamp-4">{description || 'Your content preview will appear here.'}</p></div> }
function Field({ label, children }) { return <label className="block mb-4"><span className="block text-[8px] tracking-[.23em] uppercase text-[#777c72] mb-2">{label}</span>{children}</label> }
function Input({ value, onChange, type = 'text', ...props }) { return <input {...props} type={type} value={value ?? ''} onChange={(event) => onChange(event.target.value)} className="admin-input rounded-xl" /> }
function Textarea({ value, onChange, rows = 4, ...props }) { return <textarea {...props} rows={rows} value={value ?? ''} onChange={(event) => onChange(event.target.value)} className="admin-input rounded-xl resize-y" /> }
function Select({ value, onChange, children }) { return <select value={value ?? ''} onChange={(event) => onChange(event.target.value)} className="admin-input rounded-xl">{children}</select> }
function ImageField({ label, value, field, uploading, onChange, onUpload, required }) { const busy = uploading === field; return <Field label={label}><div className="grid sm:grid-cols-[1fr_auto] gap-2"><Input required={required} value={value} onChange={onChange} placeholder="Upload or paste an image URL" /><label className="admin-secondary-btn rounded-xl cursor-pointer"><input type="file" accept="image/*" className="hidden" onChange={(event) => onUpload(event, field)} /><i className={cx('fa-solid', busy ? 'fa-spinner animate-spin' : 'fa-cloud-arrow-up')} />{busy ? 'Uploading' : 'Cloudinary'}</label></div>{value && <img src={value} alt="" className="mt-3 h-20 w-20 rounded-xl object-cover border border-white/10" />}</Field> }
function Repeater({ items, onChange, createItem, renderItem }) { const update = (index, value) => onChange(items.map((item, itemIndex) => itemIndex === index ? value : item)); return <div className="space-y-2">{items.map((item, index) => <div key={index} className="flex gap-2">{renderItem(item, index, update)}<IconButton danger icon="fa-xmark" onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))} /></div>)}<button type="button" onClick={() => onChange([...items, createItem()])} className="admin-secondary-btn rounded-lg mt-2"><i className="fa-solid fa-plus" /> Add message</button></div> }
function Detail({ label, value }) { return <div className="rounded-xl border border-white/[.07] bg-white/[.025] p-4"><p className="text-[8px] tracking-[.2em] uppercase text-[#777c72]">{label}</p><p className="text-sm text-white mt-2 capitalize">{value || '—'}</p></div> }
function Table({ children }) { return <div className="overflow-x-auto admin-table-scroll"><table className="w-full min-w-[780px]">{children}</table></div> }
function Th({ children }) { return <th className="border-b border-white/[.07] px-4 py-3 text-left text-[8px] font-medium tracking-[.22em] uppercase text-[#777c72]">{children}</th> }
function Td({ children }) { return <td className="border-b border-white/[.05] px-4 py-4 text-xs text-[#b9bcb2]">{children}</td> }
