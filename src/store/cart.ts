import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string // Format: productId-variantId
  productId: string
  name: string
  price: number
  variantName: string
  image: any
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'id' | 'quantity'> & { id?: string, quantity?: number }) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        // Generate a unique ID based on product and variant if not explicitly provided
        const cartItemId = item.id || `${item.productId}-${item.variantName}`
        const items = get().items
        const existingItem = items.find((i) => i.id === cartItemId)

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.id === cartItemId ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i
            ),
          })
        } else {
          set({ items: [...items, { ...item, id: cartItemId, quantity: item.quantity || 1 }] })
        }
      },
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        })),
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
    }),
    {
      name: 'flavourite-cart',
    }
  )
)
