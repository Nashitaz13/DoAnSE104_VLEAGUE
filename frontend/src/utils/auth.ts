// 1. Lấy thông tin user hiện tại
export const getCurrentUser = () => {
  const userStr = localStorage.getItem("currentUser")
  if (!userStr) return null
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

// 2. Hàm Đăng nhập (Lưu vào localStorage)
export const loginUser = (username: string, role: string) => {
  const user = { username, role, full_name: username } // Tạo user giả lập
  localStorage.setItem("currentUser", JSON.stringify(user))
}

// 3. Hàm Đăng xuất
export const logoutUser = () => {
  localStorage.removeItem("currentUser")
  window.location.href = "/login"
}

// 4. Các hàm kiểm tra quyền (Dùng trực tiếp)
export const isLoggedIn = () => {
  return !!localStorage.getItem("access_token");
}

export const isBTC = () => {
  const user = getCurrentUser()
  return user?.role === "BTC" || user?.role === "admin" || user?.role === "btc"
}

export const isQuanLyDoi = () => {
  const user = getCurrentUser()
  return user?.role === "QuanLyDoi" || user?.role === "manager" || user?.role === "club"
}

export const isQuanChuc = () => {
  const user = getCurrentUser();
  return user?.role === "TrongTai" || user?.role === "official" || user?.role === "referee"
};