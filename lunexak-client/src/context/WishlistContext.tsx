"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type WishlistItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  category?: string;
};

type WishlistContextType = {
  wishlist: WishlistItem[];
  addToWishlist: (product: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  useEffect(() => {
    const storedWishlist = localStorage.getItem("wishlist");
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product: WishlistItem) => {
    setWishlist((prev) => {
      const exists = prev.some(
        (item) => item.id === product.id
      );

      if (exists) return prev;

      return [...prev, product];
    });
  };

  const removeFromWishlist = (id: string) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

  const isInWishlist = (id: string) => {
    return wishlist.some((item) => item.id === id);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
}
