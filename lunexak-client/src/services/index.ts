import api from "@/lib/api";

export const authService = {
  login: async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    return data;
  },

  register: async (name: string, email: string, password: string) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    return data;
  },

  googleLogin: async (token: string, isMock: boolean = false) => {
    const { data } = await api.post("/auth/google", { token, isMock });
    return data;
  },

  forgotPassword: async (email: string) => {
    const { data } = await api.post("/auth/forgot-password", { email });
    return data;
  },

  resetPassword: async (token: string, password: string) => {
    const { data } = await api.post("/auth/reset-password", { token, password });
    return data;
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // silent fail — local state is cleared by AuthContext
    }
  },
};

export const productService = {
  getAll: async (params?: Record<string, string>) => {
    const { data } = await api.get("/products", { params });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/products/${id}`);
    return data;
  },

  create: async (productData: any) => {
    const { data } = await api.post("/products", productData);
    return data;
  },

  update: async (id: string, productData: any) => {
    const { data } = await api.put(`/products/${id}`, productData);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete(`/products/${id}`);
    return data;
  },

  submit: async (id: string) => {
    const { data } = await api.post(`/products/${id}/submit`);
    return data;
  },

  approve: async (id: string) => {
    const { data } = await api.post(`/products/${id}/approve`);
    return data;
  },

  reject: async (id: string, comment: string) => {
    const { data } = await api.post(`/products/${id}/reject`, { comment });
    return data;
  },

  publish: async (id: string) => {
    const { data } = await api.post(`/products/${id}/publish`);
    return data;
  },
};

export const categoryService = {
  getAll: async () => {
    const { data } = await api.get("/categories");
    return data;
  },

  getBySlug: async (slug: string) => {
    const { data } = await api.get(`/categories/${slug}`);
    return data;
  },

  create: async (categoryData: any) => {
    const { data } = await api.post("/categories", categoryData);
    return data;
  },

  update: async (id: string, categoryData: any) => {
    const { data } = await api.put(`/categories/${id}`, categoryData);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete(`/categories/${id}`);
    return data;
  },

  updateStatus: async (id: string, isActive: boolean) => {
    const { data } = await api.patch(`/categories/${id}/status`, { isActive });
    return data;
  },

  updateFeatured: async (id: string, isFeatured: boolean) => {
    const { data } = await api.patch(`/categories/${id}/featured`, { isFeatured });
    return data;
  },
};

export const cartService = {
  get: async () => {
    const { data } = await api.get("/cart");
    return data;
  },

  addItem: async (productId: string, quantity: number = 1, variantId?: string) => {
    const { data } = await api.post("/cart/items", { productId, quantity, variantId });
    return data;
  },

  updateItem: async (itemId: string, quantity: number) => {
    const { data } = await api.put(`/cart/items/${itemId}`, { quantity });
    return data;
  },

  removeItem: async (itemId: string) => {
    const { data } = await api.delete(`/cart/items/${itemId}`);
    return data;
  },

  clear: async () => {
    const { data } = await api.delete("/cart");
    return data;
  },
};

export const orderService = {
  create: async (orderData: any) => {
    const { data } = await api.post("/orders", orderData);
    return data;
  },

  getMyOrders: async () => {
    const { data } = await api.get("/orders/my");
    return data;
  },

  getAll: async () => {
    const { data } = await api.get("/orders");
    return data;
  },

  updateStatus: async (id: string, status: string) => {
    const { data } = await api.put(`/orders/${id}`, { status });
    return data;
  },
};

export const searchService = {
  autocomplete: async (q: string) => {
    const { data } = await api.get("/search/autocomplete", { params: { q } });
    return data;
  },

  results: async (q: string, page = 1) => {
    const { data } = await api.get("/search/results", { params: { q, page } });
    return data;
  },
};

export const wishlistService = {
  get: async () => {
    const { data } = await api.get("/wishlist");
    return data;
  },

  add: async (productId: string) => {
    const { data } = await api.post("/wishlist", { productId });
    return data;
  },

  remove: async (id: string) => {
    const { data } = await api.delete(`/wishlist/${id}`);
    return data;
  },
};

export const dashboardService = {
  getStats: async () => {
    const { data } = await api.get("/dashboard");
    return data;
  },
};

export const notificationService = {
  getAll: async () => {
    const { data } = await api.get("/notifications");
    return data;
  },
  markAsRead: async (id: string) => {
    const { data } = await api.put(`/notifications/${id}/read`);
    return data;
  }
};

export const reviewService = {
  getProductReviews: async (productId: string) => {
    const { data } = await api.get(`/reviews/product/${productId}`);
    return data;
  },
  addReview: async (reviewData: { productId: string, rating: number, title: string, body: string }) => {
    const { data } = await api.post("/reviews", reviewData);
    return data;
  }
};

export const uploadService = {
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    const { data } = await api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  }
};

export const seoService = {
  getAll: async () => {
    const { data } = await api.get("/seo/pages");
    return data;
  },
  getByPageType: async (type: string, slug: string) => {
    const { data } = await api.get(`/seo/page/${type}/${slug}`);
    return data;
  },
  update: async (type: string, slug: string, seoData: any) => {
    const { data } = await api.put(`/seo/page/${type}/${slug}`, seoData);
    return data;
  },
  delete: async (id: string) => {
    const { data } = await api.delete(`/seo/page/${id}`);
    return data;
  },
  getRobotsTxt: async () => {
    const { data } = await api.get("/seo/robots.txt");
    return data;
  },
  updateRobotsTxt: async (content: string) => {
    const { data } = await api.put("/seo/robots", { content });
    return data;
  }
};

export const bannerService = {
  getAll: async () => {
    const { data } = await api.get("/banners/admin/all");
    return data;
  },
  getActive: async (position?: string) => {
    const { data } = await api.get("/banners", { params: { position } });
    return data;
  },
  create: async (bannerData: any) => {
    const { data } = await api.post("/banners", bannerData);
    return data;
  },
  update: async (id: string, bannerData: any) => {
    const { data } = await api.put(`/banners/${id}`, bannerData);
    return data;
  },
  delete: async (id: string) => {
    const { data } = await api.delete(`/banners/${id}`);
    return data;
  }
};

