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
    return user?.role === "btc" || user?.role === "admin"  // Support both 'btc' and 'admin'
}

export const isQuanLyDoi = () => {
    const user = getCurrentUser()
    // CLB role = quản lý đội bóng
    return user?.role === "manager" || user?.role === "clb"
}

export const isQuanChuc = () => {
    const user = getCurrentUser()
    return user?.role === "official" || user?.role === "trongtai"
}

// Mapping username -> club ID patterns (sync với backend USERNAME_CLUB_MAPPING)
const USERNAME_CLUB_MAPPING: Record<string, string[]> = {
    "hanoi": ["hanoi", "hn", "clb_hanoi", "ha_noi"],
    "viettel": ["viettel", "thecong", "clb_viettel"],
    "hcmc": ["tphcm", "hcm", "hcmc", "clb_tphcm", "clb_hcmc"],
    "binhdinh": ["binhdinh", "binh_dinh", "clb_binhdinh", "clb_binh_dinh"],
    "slna": ["slna", "songlamnghe", "clb_slna"],
    "hagl": ["hagl", "gialai", "gia_lai", "clb_hagl"],
    "namdinh": ["namdinh", "nam_dinh", "clb_namdinh"],
    "haiphong": ["haiphong", "hai_phong", "clb_haiphong"],
    "thanhhoa": ["thanhhoa", "thanh_hoa", "clb_thanhhoa"],
    "quangninh": ["quangninh", "quang_ninh", "clb_quangninh"],
    "binhduong": ["binhduong", "binh_duong", "clb_binhduong"],
}

/**
 * Kiểm tra user hiện tại có quyền edit CLB này không
 * - BTC/admin: edit được tất cả CLB
 * - CLB (quản lý đội bóng): chỉ edit được CLB của mình (dựa trên username mapping)
 */
export const canEditClub = (clubId: string): boolean => {
    const user = getCurrentUser()
    if (!user) return false
    
    // BTC/admin có quyền edit tất cả
    if (user.role === "btc" || user.role === "admin") return true
    
    // CLB role (quản lý đội bóng) chỉ edit được CLB của mình
    if (user.role === "clb" || user.role === "manager") {
        const username = (user.tendangnhap || user.username || "").toLowerCase().trim()
        const clubIdLower = clubId.toLowerCase().trim()
        
        // Direct match: username xuất hiện trong clubId
        // VD: username="hanoi", clubId="CLB_HANOI" -> true
        if (clubIdLower.includes(username)) return true
        
        // Reverse: clubId chứa phần của username
        // VD: username="hanoi_manager", clubId="hanoi" -> true
        const clubNormalized = clubIdLower.replace(/^clb[_-]?/i, "").replace(/[_-]/g, "")
        if (username.includes(clubNormalized)) return true
        
        // Check mapping patterns
        const patterns = USERNAME_CLUB_MAPPING[username]
        if (patterns) {
            for (const pattern of patterns) {
                if (clubIdLower.includes(pattern) || pattern.includes(clubNormalized)) return true
            }
        }
        
        // Fallback: Lấy phần tên từ clubId và so với username
        // VD: clubId="CLB_HANOI" -> extract "hanoi" -> compare với username
        if (clubNormalized === username || username.includes(clubNormalized) || clubNormalized.includes(username)) {
            return true
        }
        
        return false
    }
    
    return false
}