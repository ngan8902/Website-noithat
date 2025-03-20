import { create } from "zustand";

const useChatStore = create((set) => ({
  customers: [
    { id: 1, name: "Khánh Thành" },
    { id: 2, name: "Bích Ngân" },
    { id: 3, name: "A B C"},
  ],
  setCustomers: (newCustomers) => set({ customers: newCustomers }),
}));

export default useChatStore;
