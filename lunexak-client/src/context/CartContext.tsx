"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "@/context/AuthContext";

type CartItem = {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  category?: string;
  image?: string;
  quantity: number;
  size?: string;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
};

const CartContext = createContext<CartContextType | undefined>(
  undefined

);


export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { user } = useAuth();
  
  const cartKey = user ? `cart_${user._id}` : "cart_guest";

  useEffect(() => {
    const storedCart = localStorage.getItem(cartKey);

    if (storedCart) {
      setCart(JSON.parse(storedCart));
    } else {
      setCart([]); // Clear cart if switching to a new user without a cart
    }
  }, [cartKey]);

  useEffect(() => {
    localStorage.setItem(
      cartKey,
      JSON.stringify(cart)
    );
  }, [cart, cartKey]);

  const addToCart = (product: CartItem) => {
    const existingProduct = cart.find(
      (item) => item.id === product.id
    );

    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: (item.quantity || 1) + 1,
              }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          ...product,
          quantity: 1,
        },
      ]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(
      cart.filter((item) => item.id !== id)
    );
  };

  const increaseQuantity = (id: string) => {
    setCart(
      cart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  const decreaseQuantity = (id: string) => {
    setCart(
      cart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        setCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used within CartProvider"
    );
  }

  return context;
}