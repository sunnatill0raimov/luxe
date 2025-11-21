import React, { createContext, useContext, useReducer, useEffect } from 'react';
import useProductService from '../server/server';

const initialState = {
  products: [],
  isLoading: true,
};

const productReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return {
        ...state,
        products: action.payload,
        isLoading: false,
      };
    case 'ADD_PRODUCT':
      return {
        ...state,
        products: [...state.products, action.payload],
      };
    case 'UPDATE_PRODUCT':
      const updatedProducts = state.products.map((p) =>
        p.id === action.payload.id ? action.payload : p
      );
      return {
        ...state,
        products: updatedProducts,
      };
    case 'DELETE_PRODUCT':
      const filteredProducts = state.products.filter((p) => p.id !== action.payload);
      return {
        ...state,
        products: filteredProducts,
      };
    default:
      return state;
  }
};

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);
  const { getAllProducts, postProduct, putProduct, deleteProduct } = useProductService();

  useEffect(() => {
    const loadProducts = async () => {
      dispatch({ type: 'SET_PRODUCTS', payload: [] });

      const backendProducts = await getAllProducts();

      if (backendProducts.length === 0) {
        // Fallback to static if backend empty
        try {
          const defaultProducts = await import('../data/products');
          const allStaticProducts = [
            ...defaultProducts.newCollectionProducts,
            ...defaultProducts.bestsellerProducts,
          ];
          dispatch({ type: 'SET_PRODUCTS', payload: allStaticProducts });
        } catch (error) {
          dispatch({ type: 'SET_PRODUCTS', payload: [] });
        }
      } else {
        dispatch({ type: 'SET_PRODUCTS', payload: backendProducts });
      }
    };

    loadProducts();
  }, []);

  const getProducts = () => state.products;

  const getNewCollectionProducts = () =>
    state.products
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 4);

  const getBestsellerProducts = () =>
    state.products
      .sort((a, b) => a.price - b.price)
      .slice(0, 4);

  const getProduct = (id) => state.products.find((p) => p.id === id);

  const addProduct = async (productData) => {
    const newProduct = await postProduct(productData);
    if (newProduct) {
      dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
    }
    return newProduct;
  };

  const updateProduct = async (id, productData) => {
    const updated = await putProduct(id, productData);
    if (updated) {
      dispatch({ type: 'UPDATE_PRODUCT', payload: updated });
    }
    return updated;
  };

  const removeProduct = async (id) => {
    const success = await deleteProduct(id);
    if (success) {
      dispatch({ type: 'DELETE_PRODUCT', payload: id });
    }
    return success;
  };

  return (
    <ProductContext.Provider
      value={{
        products: state.products,
        isLoading: state.isLoading,
        getProducts,
        getNewCollectionProducts,
        getBestsellerProducts,
        getProduct,
        addProduct,
        updateProduct,
        removeProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
