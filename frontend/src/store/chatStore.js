import { create } from "zustand";

const useChatStore = create((set, get) => ({
  customers: [],

  // Lưu danh sách khách hàng vào store và localStorage
  setCustomers: (customers) => {
    set({ customers });
    // Kiểm tra nếu customers là mảng hợp lệ trước khi lưu vào localStorage
    if (Array.isArray(customers)) {
      localStorage.setItem("customers", JSON.stringify(customers));
    }
  },

  // Cập nhật trạng thái đã đọc của tin nhắn
  updateMessageStatus: (customerId, isRead) =>
    set((state) => {
      const updatedCustomers = Array.isArray(state.customers)
        ? state.customers.map((customer) =>
          customer.id === customerId ? { ...customer, isRead } : customer
        )
        : []; // Đảm bảo `customers` là mảng
      // Kiểm tra nếu updatedCustomers là mảng hợp lệ trước khi lưu vào localStorage
      if (Array.isArray(updatedCustomers)) {
        localStorage.setItem("customers", JSON.stringify(updatedCustomers));
      }
      return { customers: updatedCustomers };
    }),

  // Lấy số lượng tin nhắn chưa đọc
  getUnreadCount: () =>
    Array.isArray(get().customers)
      ? get().customers.filter((customer) => !customer.isRead).length
      : 0, // Đảm bảo `customers` là mảng

  // Khôi phục danh sách customers từ localStorage khi khởi tạo store
  initializeCustomers: () => {
    const savedCustomers = localStorage.getItem("customers");
    // Kiểm tra xem có dữ liệu và dữ liệu hợp lệ hay không
    if (savedCustomers) {
      try {
        const parsedCustomers = JSON.parse(savedCustomers);
        if (Array.isArray(parsedCustomers)) {
          set({ customers: parsedCustomers });
        }
      } catch (error) {
        console.error("Lỗi khi phân tích cú pháp dữ liệu khách hàng từ localStorage:", error);
      }
    }
  },
}));

export const selectUnreadCount = (state) =>
  Array.isArray(state.customers)
    ? state.customers.filter((c) => !c.isRead).length
    : 0;

export default useChatStore;
