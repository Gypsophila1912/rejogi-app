import { create } from 'zustand';
import { type CartItem } from './cartStore';

export interface QueueOrder {
  id: string;
  queueNumber: number;
  items: CartItem[];
  createdAt: number;
}

interface QueueState {
  orders: QueueOrder[];
  addOrderToQueue: (items: CartItem[]) => number;
  removeOrder: (id: string) => void;
}

export const useQueueStore = create<QueueState>((set, get) => ({
  orders: [],
  addOrderToQueue: (items) => {
    const { orders } = get();
    // 現在使われている待機番号のリスト
    const activeNumbers = orders.map(o => o.queueNumber);
    
    // 最小の空き番号を探す
    let nextNumber = 1;
    while (activeNumbers.includes(nextNumber)) {
      nextNumber++;
    }
    
    const newId = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : Math.random().toString(36).substring(2, 15);
      
    const newOrder: QueueOrder = {
      id: newId,
      queueNumber: nextNumber,
      items,
      createdAt: Date.now()
    };
    
    set({ orders: [...orders, newOrder] });
    return nextNumber;
  },
  removeOrder: (id) => {
    set({ orders: get().orders.filter(o => o.id !== id) });
  }
}));
