import {createSlice} from '@reduxjs/toolkit';

const getStoredUserId = () => {
    const storedUser = localStorage.getItem('userInfo');
    if (!storedUser) {
        return null;
    }

    try {
        const parsedUser = JSON.parse(storedUser);
        return parsedUser?._id || parsedUser?.id || null;
    } catch (error) {
        return null;
    }
};

const getCartStorageKey = (userId) => (userId ? `cartItems_${userId}` : 'cartItems_guest');

const loadCartItems = (userId) => {
    const storedItems = localStorage.getItem(getCartStorageKey(userId));
    if (!storedItems) {
        return [];
    }

    try {
        const parsedItems = JSON.parse(storedItems);
        return Array.isArray(parsedItems) ? parsedItems.map(normalizeCartItem) : [];
    } catch (error) {
        return [];
    }
};

const normalizeCartItem = (item) => ({
    ...item,
    id: item.id || item.productId,
    qty: item.qty || item.quantity || 1,
    imageUrl: item.imageUrl || item.image || item.productImage || item.thumbnail || "",
});

const initialUserId = getStoredUserId();

const initialState = {
    currentUserId: initialUserId,
    cartItems: loadCartItems(initialUserId),
};

const persistCartItems = (state) => {
    localStorage.setItem(getCartStorageKey(state.currentUserId), JSON.stringify(state.cartItems));
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        syncCartForUser: (state, action) => {
            const userId = action.payload || null;
            state.currentUserId = userId;
            state.cartItems = loadCartItems(userId);
        },
        addToCart: (state, action) => {
            if (!state.currentUserId) {
                return;
            }

            const item = normalizeCartItem(action.payload);
            const existingItem = state.cartItems.find(x => x.id === item.id);
            if (existingItem) {
               state.cartItems = state.cartItems.map(x => x.id === existingItem.id ? { ...x, ...item } : x);
            } else {
                state.cartItems = [...state.cartItems, item];
            }
            persistCartItems(state);
        },
        removeFromCart: (state, action) => {
            if (!state.currentUserId) {
                return;
            }

            const itemId = typeof action.payload === 'object' ? action.payload.id || action.payload.productId : action.payload;
            state.cartItems = state.cartItems.filter(x => x.id !== itemId);
            persistCartItems(state);
        },
        clearCart: (state) => {
            state.cartItems = [];
            persistCartItems(state);
        },
    },
});

export const {syncCartForUser, addToCart, removeFromCart, clearCart} = cartSlice.actions;
export default cartSlice.reducer;