import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

interface Product {
  ProductId: string;
  Name: string;
  Description: string;
  Price: number;
  Image: string; // URL
}

interface productData {
  name: string;
  description: string;
  price: number;
  image: string;
}

interface productStore {
    products: Product[];
    loading: boolean;
    createProduct: (data: productData) => Promise<void>;
    fetchAllProducts: () => Promise<void>;
    setProducts: (products: Product[]) => void;
}

export const useProductStore = create<productStore>((set) => ({
    products: [],
    loading: false,
  
    setProducts: (products: Product[]) => set({ products }),
  
    createProduct: async (data: productData) => {
      set({ loading: true });
      try {
        const response = await axios.post("api/products", data);
        set((prevState) => ({
          products: [...prevState.products, response.data.Product],
          loading: false,
        }));
        toast.success("Product added successfully!");
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while adding the product.");
        set({ loading: false });
      }
    },
  
    fetchAllProducts: async () => {
      set({ loading: true });
      try {
        const response = await axios.get("/api/products");
        set({ products: response.data.Products, loading: false });
      } catch (error) {
        set({ loading: false });
        console.error(error);
        toast.error("An error occurred while fetching products.");
      }
    },
  }));
  