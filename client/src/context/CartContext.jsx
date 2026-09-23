import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getCart as apiGetCart,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateItem,
  removeCartItem as apiRemoveItem,
  clearCart as apiClearCart,
  mergeCart as apiMergeCart,
} from '../services/cartService';

const CartContext = createContext(null);

// ─── localStorage guest cart ──────────────────────────────────────────────
const GUEST_KEY = 'guest_cart';

const loadGuestCart = () => {
  try {
    const raw = localStorage.getItem(GUEST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

const saveGuestCart = (items) => {
  localStorage.setItem(GUEST_KEY, JSON.stringify(items));
};

const clearGuestCart = () => localStorage.removeItem(GUEST_KEY);

// ─── Provider ─────────────────────────────────────────────────────────────
export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);       // cart line items
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Detect user login state by checking localStorage token
  const checkLogin = useCallback(() => {
    return !!localStorage.getItem('user_token');
  }, []);

  // ── Load cart on mount ──────────────────────────────────────────────────
  useEffect(() => {
    const loggedIn = checkLogin();
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      fetchDbCart();
    } else {
      setItems(loadGuestCart());
    }
  }, []);

  // ── Fetch cart from DB (logged-in users) ─────────────────────────────
  const fetchDbCart = async () => {
    try {
      setLoading(true);
      const res = await apiGetCart();
      setItems(res.data.cart.items);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // ── Called when user logs in — merge guest cart then load DB cart ─────
  const onUserLogin = useCallback(async () => {
    setIsLoggedIn(true);
    const guestItems = loadGuestCart();
    try {
      if (guestItems.length > 0) {
        const guestPayload = guestItems.map((i) => ({
          productId: i.product,
          quantity: i.quantity,
          packSize: i.packSize || '',
          name: i.name,
          imageUrl: i.imageUrl,
        }));
        const res = await apiMergeCart(guestPayload);
        setItems(res.data.cart.items);
      } else {
        await fetchDbCart();
      }
      clearGuestCart();
    } catch {
      await fetchDbCart();
    }
  }, []);

  // ── Called when user logs out ─────────────────────────────────────────
  const onUserLogout = useCallback(() => {
    setIsLoggedIn(false);
    setItems([]);
    clearGuestCart();
  }, []);

  // ── Add to cart ───────────────────────────────────────────────────────
  const addItem = useCallback(async (product, quantity = 1, packSize = '') => {
    const loggedIn = checkLogin();

    if (loggedIn) {
      try {
        const res = await apiAddToCart(product._id || product.id, quantity, packSize, product.name, product.imageUrl || '');
        setItems(res.data.cart.items);
        return { success: true };
      } catch (err) {
        return { success: false, message: err.response?.data?.message || 'Failed to add.' };
      }
    } else {
      // Guest cart (localStorage)
      const current = loadGuestCart();
      const prodId = product._id || product.id;
      const idx = current.findIndex(
        (i) => i.product === prodId && i.packSize === packSize
      );
      if (idx >= 0) {
        current[idx].quantity += quantity;
      } else {
        current.push({
          _id: `guest-${Date.now()}`,
          product: prodId,
          name: product.name,
          imageUrl: product.imageUrl || '',
          packSize,
          quantity,
        });
      }
      saveGuestCart(current);
      setItems(current);
      return { success: true };
    }
  }, [checkLogin]);

  // ── Update quantity ───────────────────────────────────────────────────
  const updateItem = useCallback(async (itemId, quantity) => {
    const loggedIn = checkLogin();

    if (loggedIn) {
      try {
        const res = await apiUpdateItem(itemId, quantity);
        setItems(res.data.cart.items);
      } catch { /* ignore */ }
    } else {
      const current = loadGuestCart().map((i) =>
        i._id === itemId ? { ...i, quantity } : i
      );
      saveGuestCart(current);
      setItems(current);
    }
  }, [checkLogin]);

  // ── Remove item ───────────────────────────────────────────────────────
  const removeItem = useCallback(async (itemId) => {
    const loggedIn = checkLogin();

    if (loggedIn) {
      try {
        const res = await apiRemoveItem(itemId);
        setItems(res.data.cart.items);
      } catch { /* ignore */ }
    } else {
      const current = loadGuestCart().filter((i) => i._id !== itemId);
      saveGuestCart(current);
      setItems(current);
    }
  }, [checkLogin]);

  // ── Clear cart ────────────────────────────────────────────────────────
  const clearItems = useCallback(async () => {
    const loggedIn = checkLogin();

    if (loggedIn) {
      try {
        await apiClearCart();
      } catch { /* ignore */ }
    }
    clearGuestCart();
    setItems([]);
  }, [checkLogin]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const [cartOpen, setCartOpen] = useState(false);

  return (
    <CartContext.Provider value={{
      items,
      totalItems,
      loading,
      isLoggedIn,
      addItem,
      updateItem,
      removeItem,
      clearItems,
      onUserLogin,
      onUserLogout,
      refreshCart: fetchDbCart,
      cartOpen,
      setCartOpen,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
