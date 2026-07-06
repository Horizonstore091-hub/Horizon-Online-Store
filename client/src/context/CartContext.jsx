import { createContext, useContext, useReducer, useEffect, useRef } from 'react'
import { useAuth } from './AuthContext'

const CartContext = createContext()

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.product.id)
      if (existing) {
        return { ...state, items: state.items.map(i =>
          i.id === action.product.id ? { ...i, quantity: i.quantity + (action.quantity || 1) } : i
        )}
      }
      return { ...state, items: [...state.items, { ...action.product, quantity: action.quantity || 1 }] }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.id) }
    case 'UPDATE_QUANTITY':
      return { ...state, items: state.items.map(i =>
        i.id === action.id ? { ...i, quantity: action.quantity } : i
      )}
    case 'APPLY_COUPON':
      return { ...state, coupon: action.coupon, discount: action.discount }
    case 'REMOVE_COUPON':
      return { ...state, coupon: null, discount: 0 }
    case 'CLEAR_CART':
      return { ...state, items: [], coupon: null, discount: 0 }
    case 'LOAD_CART':
      return action.cart
    default:
      return state
  }
}

const defaultCart = { items: [], coupon: null, discount: 0 }

function getCartKey(userId) {
  return userId ? `horizon-cart-${userId}` : 'horizon-cart-guest'
}

function loadCart(key) {
  try {
    const saved = localStorage.getItem(key)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (parsed && Array.isArray(parsed.items)) return parsed
    }
  } catch {}
  return null
}

export function CartProvider({ children }) {
  const { user } = useAuth()
  const userId = user?.id
  const [state, dispatch] = useReducer(cartReducer, defaultCart)
  const prevUserId = useRef(userId)
  const initDone = useRef(false)

  useEffect(() => {
    const key = getCartKey(userId)
    const saved = loadCart(key)
    if (saved) {
      dispatch({ type: 'LOAD_CART', cart: saved })
    } else if (!initDone.current) {
      dispatch({ type: 'LOAD_CART', cart: defaultCart })
    }
    initDone.current = true
  }, [userId])

  useEffect(() => {
    const oldKey = getCartKey(prevUserId.current)
    const newKey = getCartKey(userId)

    if (prevUserId.current !== userId && prevUserId.current !== undefined) {
      localStorage.setItem(oldKey, '')
      const saved = loadCart(newKey)
      if (saved) {
        dispatch({ type: 'LOAD_CART', cart: saved })
      } else {
        dispatch({ type: 'LOAD_CART', cart: defaultCart })
      }
    }
    prevUserId.current = userId
  }, [userId])

  useEffect(() => {
    if (initDone.current) {
      const key = getCartKey(userId)
      localStorage.setItem(key, JSON.stringify(state))
    }
  }, [state, userId])

  const addItem = (product, quantity = 1) => dispatch({ type: 'ADD_ITEM', product, quantity })
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', id })
  const updateQuantity = (id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', id, quantity })
  const applyCoupon = (coupon, discount) => dispatch({ type: 'APPLY_COUPON', coupon, discount })
  const removeCoupon = () => dispatch({ type: 'REMOVE_COUPON' })
  const clearCart = () => dispatch({ type: 'CLEAR_CART' })

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{
      items: state.items, coupon: state.coupon, discount: state.discount,
      addItem, removeItem, updateQuantity, applyCoupon, removeCoupon, clearCart,
      itemCount, subtotal
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
