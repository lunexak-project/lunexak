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

  getMyOrders: async (userId: string) => {
    const { data } = await api.get(`/orders/user/${userId}`);
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
  getMyOrders: async (userId: string) => {
    const { data } = await api.get(`/orders/user/${userId}`);
    return data;
  }
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

