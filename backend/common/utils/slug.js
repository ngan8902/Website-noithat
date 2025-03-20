const toSlug = (str) => {
    return str
        .toLowerCase()
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .normalize("NFD") // Tách dấu khỏi ký tự
        .replace(/[\u0300-\u036f]/g, "") // Xóa dấu tiếng Việt
        .replace(/\s+/g, "-") // Thay khoảng trắng bằng dấu '-'
        .replace(/[^a-z0-9-]/g, "") // Xóa ký tự đặc biệt (nếu có)
        .replace(/-+/g, "-") // Xóa dấu '-' thừa
        .trim();
};

module.exports = {
    toSlug
}