import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

interface Cart {
  CartId: number;
  Quantity: number;
  ProductId: number;
}

interface Product {
  ProductId: number;
  Name: string;
  Description: string;
  Price: number;
  Image: string; // URL
}

interface cartStore {
  cart: Cart[];
  product: Product[];
  loading: boolean;
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (ProductId: number) => Promise<void>;
}

export const useCartStore = create<cartStore>((set) => ({
  cart: [],
  product: [],
  loading: false,

  addToCart: async (product: Product) => {
    set({ loading: true });
    try {
      await axios.post("/api/cart", { ProductId: product.ProductId, Quantity: 1 });
      const newCartItem: Cart = {
        CartId: Math.floor(Math.random() * 1000), // Temporary ID until backend returns the actual ID
        Quantity: 1,
        ProductId: product.ProductId
      };
      set((state) => ({
        cart: [...state.cart, newCartItem],
        loading: false,
      }));
      toast.success("Product added to cart!");
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error("Failed to add product to cart.");
      set({ loading: false });
    }
  },

  removeFromCart: async (ProductId: number) => {
    set({ loading: true });
    try {
      await axios.delete(`/api/cart/${ProductId}`);
      set((state) => ({
        cart: state.cart.filter((item) => item.ProductId !== ProductId),
        loading: false,
      }));
      toast.success("Product removed from cart!");
    } catch (error) {
      console.error("Error removing product from cart:", error);
      toast.error("Failed to remove product from cart.");
      set({ loading: false });
    }
  },
}));
