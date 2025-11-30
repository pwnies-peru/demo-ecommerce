import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

type InitialState = {
  items: CartItem[];
  syncing: boolean;
};

type CartItem = {
  id: number;
  dbId?: string; // Database UUID for syncing
  title: string;
  price: number;
  discountedPrice: number;
  quantity: number;
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
  isNegotiated?: boolean; // Flag for negotiated items
  negotiatedDiscount?: number; // Discount percentage from negotiation
};

const initialState: InitialState = {
  items: [],
  syncing: false,
};

// Helper to load negotiated items from localStorage
function loadNegotiatedItems(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('negotiatedItems');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export const cart = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart: (state, action: PayloadAction<CartItem>) => {
      const { id, dbId, title, price, quantity, discountedPrice, imgs } =
        action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          id,
          dbId,
          title,
          price,
          quantity,
          discountedPrice,
          imgs,
        });
      }
    },
    removeItemFromCart: (state, action: PayloadAction<number>) => {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item.id !== itemId);
    },
    updateCartItemQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        existingItem.quantity = quantity;
      }
    },

    removeAllItemsFromCart: (state) => {
      state.items = [];
    },

    // New action: Load cart from database
    loadCartFromDB: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },

    // Set syncing state
    setSyncing: (state, action: PayloadAction<boolean>) => {
      state.syncing = action.payload;
    },
  },
});

export const selectCartItems = (state: RootState) => state.cartReducer.items;

// Select regular (non-negotiated) items
export const selectRegularItems = createSelector([selectCartItems], (items) => {
  return items.filter(item => !item.isNegotiated);
});

// Select negotiated items from localStorage
export const selectNegotiatedItems = () => {
  return loadNegotiatedItems();
};

export const selectTotalPrice = createSelector([selectCartItems], (items) => {
  // Add negotiated items from localStorage
  const negotiatedItems = loadNegotiatedItems();
  const allItems = [...items, ...negotiatedItems];

  const total = allItems.reduce((total, item) => {
    return total + item.discountedPrice * item.quantity;
  }, 0);
  // Round to 2 decimal places to avoid floating-point errors
  return Math.round(total * 100) / 100;
});

export const {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  removeAllItemsFromCart,
  loadCartFromDB,
  setSyncing,
} = cart.actions;
export default cart.reducer;
