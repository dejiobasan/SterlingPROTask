import { useEffect } from "react";
import { useProductStore } from "../Stores/useProductStore";

const Homepage = () => {
  const { fetchAllProducts, products } = useProductStore();

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <div className="relative z-10 max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1
          className="text-center text-5xl sm-text-6xl font-bold
         text-emerald-400 mb-4"
        >
          Welcome to my E-commerce Demo
        </h1>
        <p className="text-center text-xl text-gray-300 mb-12">
          We sell the best products in the market.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.ProductId}
              className="relative overflow-hidden h-96 w-full rounded-lg group"
            >
              <div className="w-full h-full cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-50 z-10">
                  <img
                    src={product.Image}
                    alt={product.Name}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                    <h3 className="text-black text-2xl font-bold mb-2">
                      {product.Name}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
