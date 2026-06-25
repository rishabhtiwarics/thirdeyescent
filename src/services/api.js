const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Get user from localStorage
const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Set token and user in localStorage
const setAuth = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

// Clear auth from localStorage
const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const getResponseData = (response) => {
  return response?.data ?? response;
};

// Generic API request helper
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export { apiRequest, getResponseData };

// Auth API
export const authAPI = {
  register: async (userData) => {
    const response = await apiRequest('/user/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    response.user = response.user || response.data;
    
    if (response.token && response.user) {
      setAuth(response.token, response.user);
    }
    
    return response;
  },

  login: async (credentials) => {
    const response = await apiRequest('/user/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    response.user = response.user || response.data;
    
    if (response.token && response.user) {
      setAuth(response.token, response.user);
    }
    
    return response;
  },

  logout: () => {
    clearAuth();
  },

  getCurrentUser: () => {
    return getUser();
  },

  isAuthenticated: () => {
    return !!getToken();
  },

  isAdmin: () => {
    const user = getUser();
    return user && user.role === 'admin';
  },
};

// User API
export const userAPI = {
  getAddress: async () => {
    return getResponseData(await apiRequest('/user/address'));
  },

  setAddress: async (addressData) => {
    return getResponseData(await apiRequest('/user/address', {
      method: 'PUT',
      body: JSON.stringify(addressData),
    }));
  },

  getAllUsers: async () => {
    return getResponseData(await apiRequest('/user'));
  },

  updateUser: async (userId, userData) => {
    return getResponseData(await apiRequest(`/user/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    }));
  },

  deleteUser: async (userId) => {
    return apiRequest(`/user/${userId}`, {
      method: 'DELETE',
    });
  },
};

// Product API
export const productAPI = {
  getProducts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return getResponseData(await apiRequest(`/product${queryString ? `?${queryString}` : ''}`));
  },

  getProduct: async (productId) => {
    return getResponseData(await apiRequest(`/product/${productId}`));
  },

  createProduct: async (productData) => {
    return getResponseData(await apiRequest('/product', {
      method: 'POST',
      body: JSON.stringify(productData),
    }));
  },

  updateProduct: async (productId, productData) => {
    return getResponseData(await apiRequest(`/product/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    }));
  },

  deleteProduct: async (productId) => {
    return apiRequest(`/product/${productId}`, {
      method: 'DELETE',
    });
  },
};

// Category API
export const categoryAPI = {
  getCategories: async () => {
    return getResponseData(await apiRequest('/category'));
  },

  getCategory: async (categoryId) => {
    return getResponseData(await apiRequest(`/category/${categoryId}`));
  },

  createCategory: async (categoryData) => {
    return getResponseData(await apiRequest('/category', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    }));
  },

  updateCategory: async (categoryId, categoryData) => {
    return getResponseData(await apiRequest(`/category/${categoryId}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    }));
  },

  deleteCategory: async (categoryId) => {
    return apiRequest(`/category/${categoryId}`, {
      method: 'DELETE',
    });
  },
};

// Order API
export const orderAPI = {
  createOrder: async (orderData) => {
    return getResponseData(await apiRequest('/order', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }));
  },

  getMyOrders: async () => {
    return getResponseData(await apiRequest('/order/my-orders'));
  },

  getOrder: async (orderId) => {
    return getResponseData(await apiRequest(`/order/${orderId}`));
  },

  getAllOrders: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return getResponseData(await apiRequest(`/order${queryString ? `?${queryString}` : ''}`));
  },

  getOrderStats: async () => {
    return getResponseData(await apiRequest('/order/stats'));
  },

  updateOrderStatus: async (orderId, statusData) => {
    return getResponseData(await apiRequest(`/order/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    }));
  },

  payOrder: async (orderId) => {
    return getResponseData(await apiRequest(`/order/${orderId}/pay`, {
      method: 'PUT',
    }));
  },

  cancelOrder: async (orderId) => {
    return getResponseData(await apiRequest(`/order/${orderId}/cancel`, {
      method: 'PUT',
    }));
  },

  deleteOrder: async (orderId) => {
    return apiRequest(`/order/${orderId}`, {
      method: 'DELETE',
    });
  },

};

// Review API
export const reviewAPI = {
  getProductReviews: async (productId) => {
    return getResponseData(await apiRequest(`/review/product/${productId}`));
  },

  createReview: async (reviewData) => {
    return getResponseData(await apiRequest('/review', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    }));
  },

  updateReview: async (reviewId, reviewData) => {
    return getResponseData(await apiRequest(`/review/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify(reviewData),
    }));
  },

  deleteReview: async (reviewId) => {
    return apiRequest(`/review/${reviewId}`, {
      method: 'DELETE',
    });
  },
};

// Contact API
export const contactAPI = {
  submitContact: async (contactData) => {
    return getResponseData(await apiRequest('/contact', {
      method: 'POST',
      body: JSON.stringify(contactData),
    }));
  },

  getSubmissions: async () => {
    return getResponseData(await apiRequest('/contact'));
  },

  deleteSubmission: async (submissionId) => {
    return apiRequest(`/contact/${submissionId}`, {
      method: 'DELETE',
    });
  },
};

// Website content API
export const settingsAPI = {
  getSettings: async () => {
    return getResponseData(await apiRequest('/settings'));
  },

  updateSettings: async (settingsData) => {
    return getResponseData(await apiRequest('/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsData),
    }));
  },
};

export const bannerAPI = {
  getActiveBanners: async (position = 'homepage') => {
    return getResponseData(await apiRequest(`/banner/active/${position}`));
  },

  getBanners: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return getResponseData(await apiRequest(`/banner${queryString ? `?${queryString}` : ''}`));
  },

  createBanner: async (bannerData) => {
    return getResponseData(await apiRequest('/banner', {
      method: 'POST',
      body: JSON.stringify(bannerData),
    }));
  },

  updateBanner: async (bannerId, bannerData) => {
    return getResponseData(await apiRequest(`/banner/${bannerId}`, {
      method: 'PUT',
      body: JSON.stringify(bannerData),
    }));
  },

  deleteBanner: async (bannerId) => {
    return apiRequest(`/banner/${bannerId}`, { method: 'DELETE' });
  },
};

export const menuAPI = {
  getMenuByLocation: async (location) => {
    return getResponseData(await apiRequest(`/menu/location/${location}`));
  },

  getMenus: async () => {
    return getResponseData(await apiRequest('/menu'));
  },

  saveMenu: async (menuData) => {
    return getResponseData(await apiRequest('/menu', {
      method: 'POST',
      body: JSON.stringify(menuData),
    }));
  },

  deleteMenu: async (menuId) => {
    return apiRequest(`/menu/${menuId}`, { method: 'DELETE' });
  },
};

export const pageAPI = {
  getPublishedPage: async (slug) => {
    return getResponseData(await apiRequest(`/page/slug/${slug}`));
  },

  getPages: async () => {
    return getResponseData(await apiRequest('/page'));
  },

  createPage: async (pageData) => {
    return getResponseData(await apiRequest('/page', {
      method: 'POST',
      body: JSON.stringify(pageData),
    }));
  },

  updatePage: async (pageId, pageData) => {
    return getResponseData(await apiRequest(`/page/${pageId}`, {
      method: 'PUT',
      body: JSON.stringify(pageData),
    }));
  },

  deletePage: async (pageId) => {
    return apiRequest(`/page/${pageId}`, { method: 'DELETE' });
  },
};

export const couponAPI = {
  validateCoupon: async (couponData) => {
    return getResponseData(await apiRequest('/coupon/validate', {
      method: 'POST',
      body: JSON.stringify(couponData),
    }));
  },

  getCoupons: async () => {
    return getResponseData(await apiRequest('/coupon'));
  },

  createCoupon: async (couponData) => {
    return getResponseData(await apiRequest('/coupon', {
      method: 'POST',
      body: JSON.stringify(couponData),
    }));
  },

  updateCoupon: async (couponId, couponData) => {
    return getResponseData(await apiRequest(`/coupon/${couponId}`, {
      method: 'PUT',
      body: JSON.stringify(couponData),
    }));
  },

  deleteCoupon: async (couponId) => {
    return apiRequest(`/coupon/${couponId}`, { method: 'DELETE' });
  },
};

export const newsletterAPI = {
  subscribe: async (email) => {
    return getResponseData(await apiRequest('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }));
  },

  unsubscribe: async (email) => {
    return apiRequest(`/newsletter/unsubscribe/${encodeURIComponent(email)}`, { method: 'PUT' });
  },

  getSubscribers: async () => {
    return getResponseData(await apiRequest('/newsletter'));
  },

  updateSubscriber: async (subscriberId, subscriberData) => {
    return getResponseData(await apiRequest(`/newsletter/${subscriberId}`, {
      method: 'PUT',
      body: JSON.stringify(subscriberData),
    }));
  },

  deleteSubscriber: async (subscriberId) => {
    return apiRequest(`/newsletter/${subscriberId}`, { method: 'DELETE' });
  },
};

export const seoAPI = {
  getMeta: async (type, slug) => {
    const queryString = new URLSearchParams({ type, slug }).toString();
    return getResponseData(await apiRequest(`/seo/meta?${queryString}`));
  },

  getBulkMeta: async (slugs) => {
    return getResponseData(await apiRequest('/seo/bulk-meta', {
      method: 'POST',
      body: JSON.stringify({ slugs }),
    }));
  },
};

export default {
  auth: authAPI,
  user: userAPI,
  product: productAPI,
  category: categoryAPI,
  order: orderAPI,
  review: reviewAPI,
  contact: contactAPI,
  settings: settingsAPI,
  banner: bannerAPI,
  menu: menuAPI,
  page: pageAPI,
  coupon: couponAPI,
  newsletter: newsletterAPI,
  seo: seoAPI,
};
