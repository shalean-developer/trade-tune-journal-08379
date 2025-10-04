import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BookingState, BookingSummary } from '@/types/booking';

interface BookingStore extends BookingState {
  setService: (service: BookingState['service']) => void;
  setBedrooms: (count: number) => void;
  setBathrooms: (count: number) => void;
  toggleExtra: (extra: BookingState['extras'][0]['extra']) => void;
  setSpecialInstructions: (instructions: string) => void;
  setDate: (date: Date | null) => void;
  setTime: (time: string) => void;
  setFrequency: (frequency: BookingState['frequency']) => void;
  setCleaner: (cleaner: BookingState['cleaner']) => void;
  setCustomerInfo: (name: string, email: string, phone: string) => void;
  getSummary: () => BookingSummary;
  reset: () => void;
}

const initialState: BookingState = {
  service: null,
  bedrooms: 2,
  bathrooms: 1,
  extras: [],
  specialInstructions: '',
  date: null,
  time: '',
  frequency: 'once-off',
  cleaner: null,
  customerName: '',
  customerEmail: '',
  customerPhone: '',
};

export const useBookingState = create<BookingStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setService: (service) => set({ service }),
      setBedrooms: (count) => set({ bedrooms: Math.max(1, count) }),
      setBathrooms: (count) => set({ bathrooms: Math.max(1, count) }),
      
      toggleExtra: (extra) => set((state) => {
        const existingIndex = state.extras.findIndex(e => e.extra.id === extra.id);
        if (existingIndex >= 0) {
          return {
            extras: state.extras.filter(e => e.extra.id !== extra.id)
          };
        }
        return {
          extras: [...state.extras, { extra, quantity: 1 }]
        };
      }),

      setSpecialInstructions: (instructions) => set({ specialInstructions: instructions }),
      setDate: (date) => set({ date }),
      setTime: (time) => set({ time }),
      setFrequency: (frequency) => set({ frequency }),
      setCleaner: (cleaner) => set({ cleaner }),
      setCustomerInfo: (name, email, phone) => set({
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
      }),

      getSummary: () => {
        const state = get();
        if (!state.service) {
          return { subtotal: 0, discount: 0, serviceFee: 0, total: 0 };
        }

        // Calculate base costs
        const basePrice = state.service.base_price;
        const bedroomCost = state.bedrooms * state.service.bedroom_price;
        const bathroomCost = state.bathrooms * state.service.bathroom_price;
        const extrasCost = state.extras.reduce((sum, { extra, quantity }) => {
          return sum + (extra.price * quantity);
        }, 0);

        const subtotal = basePrice + bedroomCost + bathroomCost + extrasCost;

        // Calculate frequency discount
        let discountPercent = 0;
        switch (state.frequency) {
          case 'weekly':
            discountPercent = 15;
            break;
          case 'bi-weekly':
            discountPercent = 10;
            break;
          case 'monthly':
            discountPercent = 5;
            break;
        }

        const discount = (subtotal * discountPercent) / 100;
        const serviceFee = 0; // Can be configured if needed
        const total = subtotal - discount + serviceFee;

        return { subtotal, discount, serviceFee, total };
      },

      reset: () => set(initialState),
    }),
    {
      name: 'booking-state',
    }
  )
);
