export const getCurrentUser = () => {
  const userStr = localStorage.getItem("currentUser")
  if (userStr) return JSON.parse(userStr)
  return null
}

export const isLoggedIn = () => {
  return !!localStorage.getItem("access_token")
}

export const logoutUser = () => {
  localStorage.removeItem("access_token")
  localStorage.removeItem("currentUser")
  window.location.href = "/login"
}

export const isBTC = () => {
  const user = getCurrentUser()
  return user?.role === "btc"
}

export const isQuanLyDoi = () => {
  const user = getCurrentUser()
  return user?.role === "manager"
}

export const isQuanChuc = () => {
  const user = getCurrentUser()
  return user?.role === "official"
}
